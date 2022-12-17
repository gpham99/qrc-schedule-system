from Database import *
import time
from flask import Flask, request, session, redirect, url_for, jsonify
from cas import CASClient
from flask_cors import CORS
import ast
import os
from models import read_roster, User, prepare_excel_file
from werkzeug.utils import secure_filename
from utility import display, sanitize 
from flask_jwt import JWT, jwt_required, current_identity
#from security import authenticate, identity
from security import identity
import json

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
    print('username' in session)
    if 'username' in session:
        username = session['username']
    email = username + "@coloradocollege.edu"
    in_system, group = check_user(username+"@coloradocollege.edu")
    if in_system:
        tutor_entry = get_single_tutor_info(email)
        return User(email, tutor_entry[1], group, tutor_entry[2], tutor_entry[3], tutor_entry[4], tutor_entry[5], tutor_entry[6],
        tutor_entry[7])
jwt = JWT(application, authenticate, identity)

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
            return redirect('http://52.12.35.11:80/'+group)
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
        return redirect('http://52.12.35.11:80/'+group)

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
@application.route('/api/tutor/<username>')
def get_tutor_schedule(username):
    email = username + "@coloradocollege.edu"
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
                tutor_schedule[shift_num] = disciplines[index]
            else:
                tutor_schedule[shift_num] = None
            shift_num += 1
    return tutor_schedule


@application.route('/api/get_tutor_info')
@jwt_required()
def tutor_info():
    result = {}
    result['username'] = current_identity.id
    result['name'] = current_identity.name
    result['disciplines'] = current_identity.disciplines
    result['shift_capacity'] = current_identity.shift_capacity
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
    discipline_name = req['name']
    discipline_abbreviation = req["abv"]
    add_discipline(sanitize(discipline_name), sanitize(discipline_abbreviation), [])
    return "Things should be added"

@application.route('/api/remove_discipline', methods=['POST'])
def remove_discipline():
    discipline_name = request.get_json()
    #discipline_name = req['name']
    delete_discipline(sanitize(discipline_name))
    return "Discipline deleted"

@application.route('/api/get_admins')
def get_email_admins():
    email_admin = get_admin_roster()
    discipline_schedule_with_email = []
    for email, admin in email_admin:
        sanitized_email = sanitize(email)
        sanitized_admin = sanitize(admin)
        discipline_schedule_with_email.append([sanitized_admin, sanitized_email])

    return discipline_schedule_with_email

@application.route('/api/add_admin', methods=['POST'])
def add_new_admin():
    admin_data = request.get_json()
    admin_name = admin_data["name"]
    admin_email = admin_data["email"]
    add_admin(admin_name, admin_email)



@application.route('/api/remove_admin', methods=['POST'])
def remove_admin():
    admin_name = request.get_json()
    delete_admins(admin_name)


@application.route('/api/get_username', methods=['GET'])
def get_username():
    application.logger.debug("session: %s", session)
  #  if 'username' in session:
   #     application.logger.debug('username is  %s', session['username'])
    #    return "Success"
   # else:
    #    application.logger.debug('username is not in session')
     #   return "Cannot get username"
    if 'username' in session:
        # response = flask.jsonify({'username': session['username']})
        # response.headers.add('Access-Control-Allow-Origin', '*')
        # return response
        return {
                'statusCode': 200,
                'headers': {
                    'Access-Control-Allow-Origin': 'http://52.12.35.11',
                    'Access-Control-Allow-Methods': 'OPTIONS, POST, GET'
                },
                'body': json.dumps(session["username"])
        }
    else:
        return {
                'statusCode': 200,
                'headers': {
                    'Access-Control-Allow-Origin': 'http://52.12.35.11',
                    'Access-Control-Allow-Methods': 'OPTIONS, POST, GET'
                },
                'body': json.dumps("username not in session")
        }
         
       # response = flask.jsonify({'username': 'Oh well you run into else statement, meaning username is not in session'})
        # response.headers.add('Access-Control-Allow-Origin', '*')
        # return response
    in_system, group = check_login()
    if in_system:
        return session['username']


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
    new_block = time_data['new_block']
    current_block = get_current_block()
    if new_block:
        current_block = (current_block+1)%8
        update_current_block(current_block)
    add_time_window(current_block, start_time, end_time)
    



# # run the app.
# if __name__ == "__main__":
#     # Setting debug to True enables debug output. This line should be
#     # removed before deploying a production app.
#     application.debug = True
#     application.run()
