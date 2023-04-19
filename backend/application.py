#custom database functions
from Database import *
import time
#Flask
from flask import Flask, request, session, redirect, url_for
from flask_cors import CORS
#authentication
from cas import CASClient
#for parsing lists
import ast
#for file IO
import os
#custom data functions
from models import read_roster, User, prepare_excel_file
from werkzeug.utils import secure_filename
#for database IO
from utility import display, sanitize 
#JSON Web Tokens
from flask_jwt import JWT, jwt_required, current_identity
import jwt as pyjwt
import json
from security import authenticate, identity
#for setting JWT expiration
from datetime import timedelta
#for parsing time window
from dateutil import parser
#for the scheduling algorithm
from copy import deepcopy
from statistics import stdev
from random import sample, choice
#for saving uploaded roster files
import pandas as pd

#roster path variables for the list of tutors
UPLOAD_FOLDER = '.'
ALLOWED_EXTENSIONS = {'xls', 'xlsx', 'xlsm', 'xlsb', 'odf', 'ods', 'odt'}
ROSTER_PATH = 'roster.csv'

#total shifts
SHIFT_SLOTS = 20
#everyone in the system has a CC email
EMAIL_SUFFIX = '@coloradocollege.edu'

#link to display on the page if a student logs in but is not in the system
logout_link = '<p><a href="/cas_logout">Log out of CAS</a></p>'

#set up Flask app
application = Flask(__name__)
CORS(application)
application.secret_key = ';sufhiagr3yugfjcnkdlmsx0-w9u4fhbuewiejfigehbjrs'
application.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

#set up CAS
cas_client = CASClient(
    version=3,    
    service_url='http://44.230.115.148:8080/',
    server_url='https://cas.coloradocollege.edu/cas/'
)

#set up JWT
jwt = JWT(application, authenticate, identity)
application.config["JWT_EXPIRATION_DELTA"] = timedelta(seconds=86400)

#check if an uploaded file is the correct format
def allowed_file(filename):
    return '.' in filename and \
            filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def check_login():
    if 'username' in session:
        try:
            application.logger.debug("try")
            in_system, group = check_user(session['username']+EMAIL_SUFFIX)
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

    user = user.lower()
    application.logger.debug(
        'CAS verify ticket response: user: %s, attributes: %s, pgtiou: %s', user, attributes, pgtiou)

    if not user:
        return 'Failed to verify ticket. <a href="/login">Login</a>'
    else:  # Login successfully, redirect according `next` query parameter.
        session['username'] = user
        session['email'] = attributes['email']
        in_system, group = check_login()
        payload_data = {
                'username': user
                }
        my_secret = application.secret_key
        token = pyjwt.encode(
            payload=payload_data,
            key=my_secret
        )
        if not next:
            return redirect('http://44.230.115.148:80/'+group+'?username='+session['username']+'&token='+str(token))
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
    #    return redirect('http://44.230.115.148:80/'+group+'?username='+session['username'])
    #THIS LINE IS WHAT NEEDS TO BE FIXED, THIS IS WHERE WE GET REDIRECTED    
    #return redirect('http://44.230.115.148:80/'+group+'?username='+session['username']+'&token='+token)
        payload_data = {
            'username': 'j_hannebert@coloradocollege.edu'
            }
        my_secret = application.secret_key
        token = pyjwt.encode(
            payload=payload_data,
            key=my_secret
        )
        return redirect('http://44.230.115.148:80/'+group+'?username='+session['username']+'&token='+str(token))
        #return redirect('http://44.230.115.148:80/'+'?token='+str(token))

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
    payload_data = {
        'username': 'j_hannebert@coloradocollege.edu'
        }
    my_secret = application.secret_key
    token = pyjwt.encode(
        payload=payload_data,
        key=my_secret
    )
    return redirect('http://44.230.115.148:80/'+'?token='+str(token))
    return {'time': time.time()}

@application.route('/api/login_status')
def get_login_status():
    print("session: ", session)
    if 'username' in session:
        return {"login_status": "1"}
    else:
        return {"login_status": "0"}

@application.route('/api/master_schedule')
@jwt_required()
def get_master_schedule():
    disciplines = get_disciplines()
    abbreviations = get_abbreviations()
    for i in range(len(abbreviations)):
        abbreviations[i] = display(abbreviations[i])
    roster = get_roster()
    master_schedule = []
    master_schedule_with_disciplines = {}
    for i in range(SHIFT_SLOTS):
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
                                    "firstname": find_from_username(email),
                                    "email": email,
                                    "discipline": abbreviations[d],
                                    "other_disciplines": "/".join(discipline_list)}
                            shift_list.append(output_dict)
                    if not tutor_found:
                        print("Warning: One tutor (", email, ") not found in database. Omitting corresponding shift.")
                        output_dict = {"tutor": None,
                                "firstname": None,
                                "email": None,
                                "discipline": abbreviations[d],
                                "other_disciplines": None}
                        shift_list.append(output_dict)
                else: #if email == None, implying no tutor signed up
                    output_dict = {"tutor": None,
                            "firstname": None,
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
    for i in range(SHIFT_SLOTS):
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
        result['this_block_unavailable'] = True if current_identity.this_block_unavailable == 1 else False
        result['this_block_la'] = True if current_identity.this_block_la == 1 else False
        return result

    
    
@application.route('/api/upload_roster', methods=['PUT','POST'])
@jwt_required()
def upload_roster():
    # check if the post request has the file part
    print("request.files: ", request.files)
    if 'file' not in request.files:
        print('No file part')
        return {"msg": "No file part"}
        #return redirect(request.url)
    file = request.files['file']
    # If the user does not select a file, the browser submits an
    # empty file without a filename.
    if file.filename == '':
        print('No selected file')
        return {"msg": "No selected file"}
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        result, data = read_roster(file)
        if type(data) == pd.DataFrame:
            for existing_file in os.listdir(UPLOAD_FOLDER):
                if existing_file.startswith('roster'):
                    os.remove(existing_file)
            data.to_csv(os.path.join(application.config['UPLOAD_FOLDER'], ROSTER_PATH), index = False)
        print(result)
        return {"msg": result}
    return {"msg": "File format not accepted"}

@application.route('/unauthorized_login')
def unauthorized_login():
    return "You have successfully logged in to Colorado College, but your account is not part of the QRC database. \n Please contact QRC administrators if you believe this is an error. " + logout_link


@application.route('/protected')
@jwt_required()
def protected():
    return '%s' % current_identity


@application.route('/api/fetch_disciplines')
@jwt_required()
def fetch_disciplines():
    disciplines = get_disciplines()
    discipline_schedule_with_abv = []
    for i in range(len(disciplines)):
        abbreviation = get_discipline_abbreviation(disciplines[i])
        abbreviation = display(abbreviation)
        disciplines[i] = display(disciplines[i])
        discipline_schedule_with_abv.append([disciplines[i], abbreviation])

    return discipline_schedule_with_abv


@application.route('/api/update_master_schedule', methods=['POST'])
@jwt_required()
def update_tutors_in_master_schedule():
    disciplines = get_disciplines()
    abbreviations = get_abbreviations()
    for i in range(len(abbreviations)):
        abbreviations[i] = display(abbreviations[i])
    #JSON post format:
    #{3,"M" : "j_hannebert"
    # 5,"CH/MB" : "m_padilla"}
    result = request.get_json()
    output = []
    for key in result.keys():
        shift_index, discipline_abbreviation = key.split(',')
        new_tutor_firstname = result[key]
        if new_tutor_firstname == "":
            update_master_schedule_single_discipline(shift_index, disciplines[abbreviations.index(discipline_abbreviation)], None)
            #output += "Shift removed successfully\n"
        else:
            user = find_first_name(new_tutor_firstname)
            if user != None:
                user = authenticate(user[0], "")
            if user != None:
                #print(user.id, shift_index, discipline_abbreviation)
                discipline_to_change = disciplines[abbreviations.index(discipline_abbreviation)]
                if discipline_to_change in user.disciplines:
                    update_master_schedule_single_discipline(shift_index, discipline_to_change, user.id)
                    #output += "Shift for " + user.id + " added successfully\n"
                else:
                    output.append("Error: Tutor " + user.id + " is not eligible to tutor " + display(discipline_to_change) + "\n")
            else:
                output.append("Error: " + new_tutor_firstname + " not found in database, please check your spelling\n")
    return list(set(output))
    
@application.route('/api/add_discipline', methods=['POST'])
@jwt_required()
def add_new_discipline():
    req = request.get_json()
    print(req)
    discipline_name = req['name']
    discipline_abbreviation = req["abv"]
    print("Adding discipline: " + discipline_name)
    add_discipline(sanitize(discipline_name), sanitize(discipline_abbreviation), [])
    return {"msg": "Success"}

@application.route('/api/remove_discipline', methods=['POST'])
@jwt_required()
def remove_discipline():
    req = request.get_json()
    discipline_name = req['disciplineName']
    delete_discipline(sanitize(discipline_name))
    return {"msg": "Removed successfully"}

@application.route('/api/get_admins')
@jwt_required()
def get_admins():
    admin_info = get_admin_roster()
    admin_display_lst = []
    for email, name in admin_info:
        display_email = email
        display_name = display(name)
        admin_display_lst.append([display_name, display_email])
    return admin_display_lst

@application.route('/api/add_admin', methods=['POST'])
@jwt_required()
def add_new_admin():
    req = request.get_json()
    admin_name = sanitize(req["name"])
    admin_email = sanitize(req["email"])
    add_admin(admin_name, admin_email)
    return {"msg": "Added successfully"}

@application.route('/api/remove_admin', methods=['POST'])
@jwt_required()
def remove_admin():
    req = request.get_json()
    admin_email = req['email']
    delete_admins(admin_email)
    return {"msg": "Removed successfully"}



@application.route('/api/last_excel_file')
def last_excel_file():
    #find the last file
    for file in os.listdir(UPLOAD_FOLDER):
        if file.startswith('roster'):
            output = prepare_excel_file(file)
            return output
    else:
        return None


@application.route('/api/set_time_window', methods=['POST'])
@jwt_required()
def set_time_window():
    time_data = request.get_json()
    start_time = time.mktime(parser.parse(time_data['start_time']).timetuple())
    end_time = time.mktime(parser.parse(time_data['end_time']).timetuple())
    new_block = time_data['new_block']
    current_block = get_block_number()
    if new_block:
        current_block = (current_block+1)%8
        add_block(current_block)
        add_time_window(current_block, start_time, end_time)
    else:
        update_time_window(current_block, start_time, end_time)
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
    ret = []
    disciplines = sorted(get_disciplines())
    shifts_offered = []
    abbreviations = [display(get_discipline_abbreviation(discipline)) for discipline in disciplines]
    for i in range(len(disciplines)):
        shifts_offered.append(ast.literal_eval(get_discipline_shifts_offered(disciplines[i])))
    for i in range(SHIFT_SLOTS):
        discipline_list = []
        for d in range(len(disciplines)):
            if i in shifts_offered[d]:
                discipline_list.append(abbreviations[d]+",True")
            else:
                discipline_list.append(abbreviations[d]+",False")
        ret.append(discipline_list)
    return ret

@application.route('/api/set_schedule_skeleton', methods = ['POST'])
@jwt_required()
def set_schedule_skeleton():
    data = request.get_json()
    disciplines = sorted(get_disciplines())
    abbreviations = [display(get_discipline_abbreviation(discipline)) for discipline in disciplines]
    skeleton_list = []
    for i in range(len(disciplines)):
        skeleton_list.append([])
    for i in range(SHIFT_SLOTS):
        for d in range(len(disciplines)):
            if data[str(i)][d].split(',')[1] == 'True':
                skeleton_list[d].append(i)
    for d in range(len(disciplines)):
        shift_list = skeleton_list[d]
        update_discipline_shift_availability(disciplines[d], shift_list)
    return {"msg": "Schedule skeleton updated"}

@application.route('/api/tutor/get_availability', methods = ['GET'])
@jwt_required()
def get_availability():
    ret = {}
    tutoring_disciplines = current_identity.disciplines
    for i in range(SHIFT_SLOTS):
        all_possible_disciplines = []
        picked = ""
        favorited = False
        shift_dict = {}
        for discipline in tutoring_disciplines:
            shifts_offered = ast.literal_eval(get_discipline_shifts_offered(discipline))
            if i in shifts_offered:
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
    for i in range(SHIFT_SLOTS):
        for discipline in all_disciplines:
            available_tutors = get_discipline_shift(discipline, i)
            if available_tutors is not None:
                available_tutors = ast.literal_eval(available_tutors)
            else:
                available_tutors = []
            #remove tutor from any shift they had previously selected (give them a "clean slate")
            if current_identity.id  in available_tutors:
                available_tutors.remove(current_identity.id)
                add_shifts(discipline, i, available_tutors)
        #add tutor to shifts they did pick
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
        this_block_unavailable = True if tutor[2] == 1 else False
        absence = True if tutor[9] == 1 else False
        tutor_dict = {'name': name, 'this_block_la': this_block_la, 'this_block_unavailable': this_block_unavailable,
                      'absence': absence}
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
        this_block_la = True if tutor[5] == 1 else False
        this_block_unavailable = True if tutor[2] == 1 else False
        tutor_dict = data[email]
        absence = True if tutor[9] == 1 else False
        if tutor_dict['this_block_la'] != this_block_la:
            update_this_block_la(email)
        if tutor_dict['this_block_unavailable'] != this_block_unavailable:
            update_status(email)
        if tutor_dict['absence'] != absence:
            update_absence(email)
    return {'msg': 'Updates complete'}

@application.route('/api/get_block', methods = ['GET'])
@jwt_required()
def get_block():
    block_number = int(get_block_number())
    return {'block': block_number}

@application.route('/api/is_within_window', methods = ['GET'])
def is_within_window():
    now = time.time()
    start_time, end_time = get_time_window(get_block_number())
    print(start_time, now, end_time)
    return str(now > start_time and now < end_time)

#Wipe the master schedule in preparation to make a new one 
def wipe_master_schedule():
    clear_table('master_schedule')
    

#wipe tutors' choices out of the database to prepare for a new block
def wipe_all_choices():
    pass

def write_master_schedule():
    # make a dictionary with the tutors name being the keys,
    # and their max capacity being the value
    
    roster = get_roster()
    tutor_dict = {tutor[0]: tutor[3] for tutor in roster}
    print(tutor_dict)
    disciplines = get_disciplines()
    for i in sample(range(SHIFT_SLOTS), SHIFT_SLOTS):
        assignments = ["" for _ in range(len(disciplines))] # n strings, w n being no of disciplines
        for discipline in sample(disciplines, len(disciplines)):
            available_tutors = get_discipline_shift(discipline, i) 
            if available_tutors != None:
                available_tutors = ast.literal_eval(available_tutors)
                choice_index = choice(range(len(available_tutors)))
                chosen_tutor = available_tutors[choice_index]
                j = 0
                while tutor_dict[chosen_tutor] == 0 and j < len(available_tutors):
                    choice_index = choice(range(len(available_tutors)))
                    chosen_tutor = available_tutors[choice_index]
                    j += 1
                if tutor_dict[chosen_tutor] != 0:
                    # add to assignments
                    assignments[disciplines.index(discipline)] = chosen_tutor
                    tutor_dict[chosen_tutor] -= 1
        add_to_master_schedule(i, disciplines, assignments)


@application.route('/api/time_window', methods = ['GET'])
@jwt_required()
def time_window():
    start_date, end_date = get_time_window(get_block_number())
    return {'start_date':start_date, 'end_date':end_date}


# #take in the tutors' chosen shifts and use them to create the master schedule
# def write_master_schedule():
#     #Get the list of all disciplines
#     disciplines = get_disciplines()
#     tutors = []
#     open_shifts = []
#     avail_tables = []
#     #open_shifts: The schedule skeleton / list of shifts per discipline that could be taken
#     for i in range(len(disciplines)):
#         open_shifts.append(ast.literal_eval(get_discipline_shifts_offered(disciplines[i])))

#     for i in range(len(disciplines)):
#         dictionary = {}
#         for j in range(len(open_shifts[i])):
#             dictionary[open_shifts[i][j]] = []
#         avail_tables.append(dictionary)

#     low_priority = []
#     mid_priority = []
#     high_priority = []
#     avail_tables = []
#     for tutor in get_roster():
#         if tutor[9] == 1: #"absence" is True - tutor has unexcused absences
#             low_priority.append(User(tutor[0], tutor[1], 'tutor', tutor[2], tutor[3], tutor[4], tutor[5], tutor[6], tutor[7], tutor[8], tutor[9]))
#         elif tutor[5] == 1: #"tutor_this_block" is True - tutor is an LA this block
#             mid_priority.append(User(tutor[0], tutor[1], 'tutor', tutor[2], tutor[3], tutor[4], tutor[5], tutor[6], tutor[7], tutor[8], tutor[9]))
#         else:
#             high_priority.append(User(tutor[0], tutor[1], 'tutor', tutor[2], tutor[3], tutor[4], tutor[5], tutor[6], tutor[7], tutor[8], tutor[9]))
#         tutors = [high_priority, mid_priority, low_priority]
#     for i in range(len(disciplines)):
#         for shift in range(SHIFT_SLOTS):
#             #determine which group a tutor falls into
#             avail_tables[i][shift] = get_discipline_shift(disciplines[i], shift)
#             if avail_tables[i][shift] == None:
#                 avail_tables[i][shift] = []

#     favorites = []
#     possible_solutions = algorithm(200, tutors, avail_tables, open_shifts, favorites)


# #greedy algorithm to determine a possible allocation of schedule shifts
# #tutors: [] list of User objects representing all tutors in the roster
# #avail_tables: [] data structure representing tutor availability, in the format (and in order of tutor priority):
# #[[{1: [Moises, Jessica], #this dictionary is for the first discipline returned by get_disciplines
# #  3: [Pralad]},
# #  {1: [Moises, Jessica, Giang], #this dictionary is for the second discipline
# #  5: [Moises]}]],
# #[[{1: [Dan, Anusha], #this dictionary is for the first discipline returned by get_disciplines
# #  3: [John]},
# #  {1: [Dan, Anusha, Leo], #this dictionary is for the second discipline
# #  5: [Dan]}]],
# #[[{1: [Josh, Lucy], #this dictionary is for the first discipline returned by get_disciplines
# #  3: [Tyler]},
# #  {1: [Josh, Lucy, Emily], #this dictionary is for the second discipline
# #  5: [Josh]}]],
# #open_shifts: The schedule skeleton / list of shifts per discipline that could be taken
# #in the format:
# # [[1,2,3],[3,4,6],[1,2,4]] #where the lists are lists per discipline in the order returned by get_disciplines
# #priorities: {} dictionary enumerating each tutor's preferences for shifts, in the format:
# #{ 'j_hannebert': [[1,5],[2],[3]],
# #  'p_mishra': [[2],[],[3]]} #where the lists go [[high],[medium],[low]]
# def greedy(tutors, avail_tables, open_shifts):
#     attempts = 0
#     assigned = 0
#     disciplines = get_disciplines()
#     total_shifts = sum([len(shift_list) for shift_list in open_shifts])
#     capacities = [tutor.shift_capacity for tutor in tutors]
#     emails = [tutor.id for tutor in tutors]
#     sum_capacities = sum(capacities)
#     avail_copy = deepcopy(avail_tables) #delete tutors from this one; master schedule will contain only finalized changes
#     master_schedule = []
#     for i in range(len(disciplines)):
#         dictionary = {}
#         for j in range(len(open_shifts[i])):
#             dictionary[open_shifts[i][j]] = ""
#         master_schedule.append(dictionary)
#     while(assigned < total_shifts and assigned < sum_capacities and attempts < 100):
#         for d in sample(list(range(len(disciplines))), len(disciplines)): #go through disciplines in random order
#             shift = sample(open_shifts[d], 1) #select a random shift to fill
#             #let's fill it!
#             if len(avail_copy[d][shift]) > 0:
#                 assigned_bool = False
#                 for tutor in sample(avail_copy[d][shift],len(avail_copy[d][shift])):
#                     if capacities[emails.index(tutor)] > 0:
#                         master_schedule[d][shift] = tutor
#                         avail_copy[d][shift] = []
#                         capacities[emails.index(tutor)] -= 1
#                         assigned += 1
#                         assigned_bool = True
#                         break
#                 if not assigned_bool:
#                     avail_copy[d][shift] = []
#         attempts += 1
#     if assigned == total_shifts:
#         print("Greedy algorithm stopped: all shifts filled")
#     if assigned == sum_capacities:
#         print("Greedy algorithm stopped: tutors maxed out")
#     if attempts >= 100:
#         print("Greedy algorithm stopped: algorithm gave up")
#     #for d in sample(range(len(disciplines)), len(disciplines)):
#     #    for shift in sample(open_shifts[d], len(open_shifts[d])):
#     #        if len(avail_copy[d][shift]) > 0:
#     #            master_schedule[d][shift] = ""
#     return master_schedule, assigned
            
# #calculate how unfair the schedule is for tutors, favoring higher priority tutors
# def tutor_unfairness(schedule, high_priority, mid_priority, low_priority, open_shifts):
#     unfairness_score = 0 #lower is better
#     for tutor in high_priority:
#         #count number of shifts they have been assigned
#         assigned = 0
#         for i in range(len(schedule)):
#             for j in open_shifts[i]:
#                 if schedule[i][j] == tutor.name:
#                    assigned += 1
#         score_component = (tutor.shift_capacity - assigned + 1) / (tutor.shift_capacity + 1)
#         unfairness_score += 3 * score_component
#     for tutor in mid_priority:
#         #count number of shifts they have been assigned
#         assigned = 0
#         for i in range(len(schedule)):
#             for j in open_shifts[i]:
#                 if schedule[i][j] == tutor.name:
#                    assigned += 1
#         score_component = (tutor.shift_capacity - assigned + 1) / (tutor.shift_capacity + 1)
#         unfairness_score += 2 * score_component
#     for tutor in low_priority:
#         #count number of shifts they have been assigned
#         assigned = 0
#         for i in range(len(schedule)):
#             for j in open_shifts[i]:
#                 if schedule[i][j] == tutor.name:
#                    assigned += 1
#         score_component = (tutor.shift_capacity - assigned + 1) / (tutor.shift_capacity + 1)
#         unfairness_score += score_component
#     return unfairness_score

# def discipline_evenness(schedule, open_shifts):
#     shift_counts = []
#     for i in range(len(schedule)):
#         shift_count = 0
#         for j in open_shifts[i]:
#             if schedule[i][j] != '':
#                 shift_count += 1
#         shift_counts.append(shift_count)
#     deviation = stdev(shift_counts)
#     return deviation

# def algorithm(totaltries, tutors, avail_tables, open_shifts, favorites):
#     high_priority = tutors[0]
#     mid_priority = tutors[1]
#     low_priority = tutors[2]
#     tutors = []
#     tutors.extend(high_priority)
#     tutors.extend(mid_priority)
#     tutors.extend(low_priority)
#     possible_solutions = []
#     for i in range(totaltries):
#         soln, assigned = greedy(tutors, avail_tables, open_shifts)
#         unfairness = tutor_unfairness(soln, high_priority, mid_priority, low_priority, open_shifts)
#         evenness = discipline_evenness(soln, open_shifts)
#         possible_solutions.append((soln, assigned, unfairness, evenness))
#     assigned_amounts = [soln[1] for soln in possible_solutions]
#     maximum = max(assigned_amounts)
#     i = 0
#     while i < len(possible_solutions):
#         soln = possible_solutions[i]
#         if soln[1] != maximum:
#             possible_solutions.remove(soln)
#         else:
#             i+=1
#     unfairness_amounts = [soln[2] for soln in possible_solutions]
#     minimum = min(unfairness_amounts)
#     i = 0
#     while i < len(possible_solutions):
#         soln = possible_solutions[i]
#         if soln[2] != minimum:
#             possible_solutions.remove(soln)
#         else:
#             i+=1
#     evenness_amounts = [soln[3] for soln in possible_solutions]
#     maximum = max(evenness_amounts)
#     i = 0
#     while i < len(possible_solutions):
#         soln = possible_solutions[i]
#         if soln[3] != maximum:
#             possible_solutions.remove(soln)
#         else:
#             i+=1

#     # for soln in possible_solutions:
#     #     print(soln[1], soln[2], soln[3])   
#     #     for line in soln[0]:
#     #         print(line)

#     return possible_solutions

# write_master_schedule()

# # #     # Setting debug to True enables debug output. This line should be
# # #     # removed before deploying a production app.
# # #     application.debug = True
# # #     application.run()
