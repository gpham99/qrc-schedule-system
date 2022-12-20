from Database import *
import time
from flask import Flask, request, session, redirect, url_for
from cas import CASClient
from flask_cors import CORS
import ast
import os
from models import read_roster, User, prepare_excel_file
from werkzeug.utils import secure_filename
from utility import display, sanitize 
from flask_jwt import JWT, jwt_required, current_identity
#from security import authenticate, identity
import json
from datetime import timedelta

UPLOAD_FOLDER = '.'
ALLOWED_EXTENSIONS = {'xls', 'xlsx', 'xlsm', 'xlsb', 'odf', 'ods', 'odt'}

# print a nice greeting.
def say_hello(username = "Team"):
    return '<p>Hello %s!</p>\n' % username

# some bits of text for the page.
header_text = '''
    <html>\n<head> <title>EB Flask Test</title> </head>\n<body>'''
home_link = '<p><a href="/">Back</a></p>\n'
footer_text = '</body>\n</html>'
sso_link = '<p><a href="/login">Log in using SSO</a></p>'
logout_link = '<p><a href="/cas_logout">Log out of CAS</a></p>'

# EB looks for an 'application' callable by default.
application = Flask(__name__)
CORS(application)
application.secret_key = ';sufhiagr3yugfjcnkdlmsx0-w9u4fhbuewiejfigehbjrs'
application.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

cas_client = CASClient(
    version=3,    
    service_url='http://52.12.35.11:8080/',
    server_url='https://cas.coloradocollege.edu/cas/'
)

def authenticate(username, password):
    print("In authenticate: " + username)
    if not username.endswith("@coloradocollege.edu"):
        username += "@coloradocollege.edu"
    if 'username' not in session:
        session['username'] = username
    in_system, group = check_user(username)
    print("in_system, group: ", in_system, group)
    if in_system:
        tutor_entry = get_single_tutor_info(username)
        return User(username, tutor_entry[1], group, tutor_entry[2], tutor_entry[3], tutor_entry[4], tutor_entry[5], tutor_entry[6],
        tutor_entry[7], tutor_entry[8])

def identity(payload):
    email = payload['identity']
    return authenticate(email, "")

jwt = JWT(application, authenticate, identity)
application.config["JWT_EXPIRATION_DELTA"] = timedelta(seconds=86400)

def allowed_file(filename):
    return '.' in filename and \
            filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def check_login():
    if 'username' in session:
        try:
            application.logger.debug("try")
            in_system, group = check_user(session['username']+"@coloradocollege.edu")
        except:
            print(session['username'] + " not in system")
            return False, "Logged out"
    else:
        application.logger.debug("else")
        in_system, group = False, "Logged out"
    return in_system, group

# add a rule for the index page
@application.route('/')
def index():
    in_system, group = check_login()
    if in_system:
        return 'You are logged in as part of the ' + group + ' ! <a href="/logout">Exit</a>'
    #if 'username' in session:
        # Already logged in
    #    return 'You are logged in. Here you are going to see your schedule. <a href="/logout">Exit</a>'
    elif group == "None":
        return 'You are not authorized to access this site. <a href="/logout">Exit</a>'
    next = request.args.get('next')
    ticket = request.args.get('ticket')

    if not ticket:
        return header_text + say_hello() + footer_text + sso_link
    
    application.logger.debug('ticket: %s', ticket)
    application.logger.debug('next: %s', next)
    user, attributes, pgtiou = cas_client.verify_ticket(ticket)

    application.logger.debug(
        'CAS verify ticket response: user: %s, attributes: %s, pgtiou: %s', user, attributes, pgtiou)

    if not user:
        return 'Failed to verify ticket. <a href="/login">Login</a>'
    else:  # Login successfully, redirect according `next` query parameter.
        session['username'] = user
        session['email'] = attributes['email']
        in_system, group = check_login()
        if not next:
            return redirect('http://52.12.35.11:80/'+group+'?username='+session['username'])
        return redirect(next)

@application.route('/profile')
def profile(method=['GET']):
    application.logger.debug('session when you hit profile: %s', session)
    in_system, group = check_login()
    if in_system:
        return 'Logged in as {}. Your email address is {}. <a href="/logout">Exit</a>'.format(session['username'], session['email'])
    elif group == "None":
        return 'You are not authorized to access this site. <a href="/logout">Exit</a>'
    return 'Login required. <a href="/login">Login</a>', 403

@application.route('/login')
def login():
    application.logger.debug('session when you hit login: %s', session)

    if 'username' in session:
        in_system, group = check_login()

        # Already logged in
        return redirect('http://52.12.35.11:80/'+group+'?username='+session['username'])

    next = request.args.get('next')
    ticket = request.args.get('ticket')

    if not ticket:
        # No ticket, the request come from end user, send to CAS login
        cas_login_url = cas_client.get_login_url()
        application.logger.debug('CAS login URL: %s', cas_login_url)
        return redirect(cas_login_url) # the return of this is /ticket?=...

@application.route('/cas_logout')
def logout():
    redirect_url = url_for('logout_callback', _external=True)
    application.logger.debug('Redirect logout URL %s', redirect_url)
    cas_logout_url = cas_client.get_logout_url(redirect_url)
    application.logger.debug('CAS logout URL: %s', cas_logout_url)
    session.clear()

    return redirect(cas_logout_url)

@application.route('/logout')
def logout_callback():
    session.clear()
    return redirect("https://www.coloradocollege.edu/")
    
@application.route('/api/time')
def get_current_time():
    return {'time': time.time()}

@application.route('/api/login_status')
def get_login_status():
    print("session: ", session)
    if 'username' in session:
        return {"login_status": "1"}
    else:
        return {"login_status": "0"}



@application.route('/api/master_schedule')
def get_master_schedule():
    disciplines = get_disciplines()
    abbreviations = get_abbreviations()
    for i in range(len(abbreviations)):
        abbreviations[i] = display(abbreviations[i])
    roster = get_roster()
    master_schedule = []
    master_schedule_with_disciplines = {}
    for i in range(20): #TODO: MAGIC CONSTANT
        master_schedule.append(get_master_schedule_info(i))
    shift_num = 0
    for line in master_schedule:
        if line != None:
            shift_list = []
            for d in range(len(line)):
                email = line[d]
                if email != None:
                    tutor_found = False
                    for tutor_entry in roster:
                        if tutor_entry[0] == email: #find the tutor in the roster
                            tutor_found = True
                            discipline_list = ast.literal_eval(tutor_entry[4])
                            try:
                                discipline_list.remove(disciplines[d]) #ensure there is no redundant information
                            except:
                                print("ERROR: Discipline " + disciplines[d] + " not in tutorable disciplines for tutor " + email)
                            #get abbreviations for each discipline
                            for i in range(len(discipline_list)):
                                discipline_list[i] = abbreviations[disciplines.index(discipline_list[i])]
                            #output_str = "/".join(discipline_list) + ": " + str(tutor_entry[1])
                            output_dict = {"tutor": tutor_entry[1],
                                    "email": email,
                                    "discipline": abbreviations[d],
                                    "other_disciplines": "/".join(discipline_list)}
                            shift_list.append(output_dict)
                    if not tutor_found:
                        print("Warning: One tutor (", email, ") not found in database. Omitting corresponding shift.")
                        output_dict = {"tutor": None,
                                "email": None,
                                "discipline": abbreviations[d],
                                "other_disciplines": None}
                        shift_list.append(output_dict)
                else: #if email == None, implying no tutor signed up
                    output_dict = {"tutor": None,
                            "email": None,
                            "discipline": abbreviations[d],
                            "other_disciplines": None}
                    shift_list.append(output_dict)
            master_schedule_with_disciplines[shift_num] = shift_list
        shift_num += 1
    return master_schedule_with_disciplines

#Page where any individual tutor's schedule is stored: shift number and discipline they signed up for
@application.route('/api/tutor/get_schedule')
@jwt_required()
def get_tutor_schedule():
    email = current_identity.id
    print(email)
    disciplines = get_disciplines()
    master_schedule = []
    tutor_schedule = {}
    for i in range(20): #TODO: MAGIC CONSTANT
        master_schedule.append(get_master_schedule_info(i))
    shift_num = 0
    for line in master_schedule:
        if line != None:
            if email in line:
                index = line.index(email)
                tutor_schedule[shift_num] = display(disciplines[index])
            else:
                tutor_schedule[shift_num] = None
            shift_num += 1
    return tutor_schedule

@application.route('/api/tutor/update_info', methods = ['POST'])
@jwt_required()
def update_tutor_info():
    ret = {}
    req = request.get_json()
    new_shift_capacity = int(req['shift_capacity'])
    new_disciplines = req['disciplines']
    if new_shift_capacity >= 0:
        update_shift_capacity(current_identity.id, new_shift_capacity)
        ret['msg'] = 'Tutor info updated'
    else:
        update_shift_capacity(current_identity.id, 0)
        ret['msg'] = 'Invalid shift capacity'
    disciplines = []
    for discipline, discipline_bool in new_disciplines.values():
        if discipline_bool == True:
            disciplines.append(sanitize(discipline))
    update_tutoring_disciplines(current_identity.id, disciplines)
    return ret


@application.route('/api/tutor/get_info', methods = ['GET'])
@jwt_required()
def tutor_info():
        result = {}
        result['username'] = current_identity.id
        result['name'] = current_identity.name
        all_disciplines = get_disciplines()
        all_disciplines = sorted(all_disciplines)
        disciplines = []
        for discipline in all_disciplines:
            if discipline in current_identity.disciplines:
                disciplines.append((display(discipline), True))
            else:
                disciplines.append((display(discipline), False))
        result['disciplines'] = disciplines
        result['shift_capacity'] = current_identity.shift_capacity
        result['status'] = True if current_identity.status == 1 else False
        result['this_block_la'] = True if current_identity.this_block_la == 1 else False
        return result

    
    
@application.route('/api/upload_roster', methods=['POST'])
def upload_roster():
    # check if the post request has the file part
    if 'filename' not in request.files:
        print('No file part')
        return redirect(request.url)
    file = request.files['filename']
    # If the user does not select a file, the browser submits an
    # empty file without a filename.
    if file.filename == '':
        print('No selected file')
        return "No selected file"
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        if 'ROSTER' in application.config:
            os.remove(application.config['ROSTER'])
        file.save(os.path.join(application.config['UPLOAD_FOLDER'], filename))
        application.config['ROSTER'] = filename
        result = read_roster(filename)
        print(result)
        return result
    return "File format not accepted"

@application.route('/unauthorized_login')
def unauthorized_login():
    return "You have successfully logged in to Colorado College, but your account is not part of the QRC database. \n Please contact QRC administrators if you believe this is an error. " + logout_link


@application.route('/protected')
@jwt_required()
def protected():
    return '%s' % current_identity


@application.route('/api/add_remove_disciplines')
def get_disciplines_abbreviations():
    disciplines = get_disciplines()
    discipline_schedule_with_abv = []
    for i in range(len(disciplines)):
        abbreviation = get_discipline_abbreviation(disciplines[i])
        abbreviation = display(abbreviation)
        disciplines[i] = display(disciplines[i])
        discipline_schedule_with_abv.append([disciplines[i], abbreviation])

    return discipline_schedule_with_abv


@application.route('/api/update_master_schedule', methods=['POST'])
def update_tutors_in_master_schedule():
    disciplines = get_disciplines()
    abbreviations = get_abbreviations()
    for i in range(len(abbreviations)):
        abbreviations[i] = display(abbreviations[i])
    result = request.get_json()
    output = []
    for key in result.keys():
        shift_index, discipline_abbreviation = key.split(',')
        new_tutor_username = result[key]
        if new_tutor_username == "":
            update_master_schedule_single_discipline(shift_index, disciplines[abbreviations.index(discipline_abbreviation)], None)
            #output += "Shift removed successfully\n"
        else:
            user = authenticate(new_tutor_username, "")
            if user != None:
                #print(user.id, shift_index, discipline_abbreviation)
                discipline_to_change = disciplines[abbreviations.index(discipline_abbreviation)]
                if discipline_to_change in user.disciplines:
                    update_master_schedule_single_discipline(shift_index, discipline_to_change, user.id)
                    #output += "Shift for " + user.id + " added successfully\n"
                else:
                    output.append("Error: Tutor " + user.id + " is not eligible to tutor " + display(discipline_to_change) + "\n")
            else:
                output.append("Error: " + user.id + " not found in database, please check your spelling\n")
    return output
    
@application.route('/api/add_discipline', methods=['POST'])
def add_new_discipline():
    req = request.get_json()
    print(req)
    discipline_name = req['name']
    discipline_abbreviation = req["abv"]
    print("Adding discipline: " + discipline_name)
    add_discipline(sanitize(discipline_name), sanitize(discipline_abbreviation), [])
    return {"msg": "Success"}

@application.route('/api/remove_discipline', methods=['POST'])
def remove_discipline():
    req = request.get_json()
    discipline_name = req['disciplineName']
    delete_discipline(sanitize(discipline_name))
    return {"msg": "Removed successfully"}

@application.route('/api/get_admins')
def get_admins():
    admin_info = get_admin_roster()
    admin_display_lst = []
    for email, name in admin_info:
        display_email = email
        display_name = display(name)
        admin_display_lst.append([display_name, display_email])
    return admin_display_lst

@application.route('/api/add_admin', methods=['POST'])
def add_new_admin():
    req = request.get_json()
    admin_name = sanitize(req["name"])
    admin_email = sanitize(req["email"])
    add_admin(admin_name, admin_email)
    return {"msg": "Added successfully"}

@application.route('/api/remove_admin', methods=['POST'])
def remove_admin():
    req = request.get_json()
    admin_email = req['email']
    delete_admins(admin_email)
    return {"msg": "Removed successfully"}



@application.route('/api/last_excel_file')
def last_excel_file():
    if 'ROSTER' in application.config:
        filepath = application.config['ROSTER']
        return prepare_excel_file(filepath)
    else:
        return None


@application.route('/api/set_time_window', methods=['POST'])
def set_time_window():
    time_data = request.get_json()
    start_time = time_data['start_time']
    end_time = time_data['end_time']
    print(start_time, end_time)
    new_block = time_data['new_block']
    current_block = get_block_number()
    if new_block:
        current_block = (current_block+1)%8
        add_block(current_block)
    add_time_window(current_block, start_time, end_time)
    return {"msg": "Time window successfully set"}
    

@application.route('/api/get_disciplines')
def get_discipline_list():
    sanitized_disciplines = []
    fetched_disciplines =  get_disciplines() 
    for discipline in fetched_disciplines:
        discipline = display(discipline)
        sanitized_disciplines.append(discipline)

    return sanitized_disciplines

@application.route('/api/get_schedule_skeleton')
@jwt_required()
def get_schedule_skeleton():
    ret = {}
    disciplines = get_disciplines()
    for discipline in disciplines:
        shifts_offered = get_discipline_shifts_offered(discipline)
        ret[discipline] = shifts_offered
    return ret


@application.route('/api/set_schedule_skeleton')
def set_schedule_skeleton():
    data = request.get_json()
    disciplines = get_disciplines()
    for discipline in disciplines:
        shift_list = data[display(discipline)]
        update_discipline_shift_availability(discipline, shift_list)
    return "Schedule skeleton updated"

@application.route('/api/tutor/get_availability', methods = ['GET'])
@jwt_required()
def get_availability():
    ret = {}
    tutoring_disciplines = current_identity.disciplines
    for i in range(20):
        all_possible_disciplines = []
        picked = ""
        favorited = False
        shift_dict = {}
        for discipline in tutoring_disciplines:
            shifts_offered = get_discipline_shifts_offered(discipline)
            if str(i) in shifts_offered:
                all_possible_disciplines.append(display(get_discipline_abbreviation(discipline)))
                available_tutors_string_form = get_discipline_shift(discipline, i)
                if available_tutors_string_form is not None:
                    available_tutors = ast.literal_eval(available_tutors_string_form)
                    if current_identity.id in available_tutors:
                        picked = display(get_discipline_abbreviation(discipline))
                        if i in current_identity.favorited_shifts:
                            favorited = True
        shift_dict['all_possible_disciplines'] = all_possible_disciplines
        shift_dict['picked'] = picked
        shift_dict['favorited'] = favorited
        ret[i] = shift_dict
    return ret

@application.route('/api/tutor/set_availability', methods = ['POST'])
@jwt_required()
def set_availability():
    req = request.get_json()
    abbreviations = get_abbreviations()
    for i in range(len(abbreviations)):
        abbreviations[i] = display(abbreviations[i])
    all_disciplines = get_disciplines()
    favorited_list = []
    for i in range(20):
        picked = req[str(i)]['picked']
        if picked == '':
            continue
        discipline = sanitize(all_disciplines[abbreviations.index(picked)])
        favorited = req[str(i)]['favorited']
        available_tutors = get_discipline_shift(discipline, i)
        if available_tutors is not None:
            available_tutors = ast.literal_eval(available_tutors)
        else:
            available_tutors = []
        if current_identity.id not in available_tutors:
            available_tutors.append(current_identity.id)
        add_shifts(discipline, i, available_tutors)
        
        if picked != None and favorited:
            favorited_list.append(i)

    update_favorite_shifts(current_identity.id, favorited_list)
    return {'msg': 'Changes saved'}

@application.route('/api/get_tutors_information', methods = ['GET'])
@jwt_required()
def get_tutors_information():
    ret = {}
    roster = get_roster()
    for tutor in roster:
        email = tutor[0]
        name = tutor[1]
        this_block_la = True if tutor[5] == 1 else False
        status = True if tutor[2] == 1 else False
        tutor_dict = {'name': name, 'this_block_la': this_block_la, 'status': status}
        ret[email] = tutor_dict
    ret = {key: val for key, val in sorted(ret.items(), key = lambda ele: ele[0])}
    return ret

@application.route('/api/set_tutors_information', methods = ['POST'])
@jwt_required()
def set_tutors_information():
    data = request.get_json()
    roster = get_roster()
    for tutor in roster:
        email = tutor[0]
        name = tutor[1]
        this_block_la = True if tutor[5] == 1 else False
        status = True if tutor[2] == 1 else False
        tutor_dict = data[email]
        if tutor_dict['this_block_la'] != this_block_la:
            update_this_block_la(email)
        if tutor_dict['status'] != status:
            update_status(email)
    return {'msg': 'Updates complete'}

def wipe_master_schedule():
    pass
#wipe tutor’s personal schedule and choices for the block

def write_master_schedule():
    pass



# # run the app.
# if __name__ == "__main__":
#     # Setting debug to True enables debug output. This line should be
#     # removed before deploying a production app.
#     application.debug = True
#     application.run()
