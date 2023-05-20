#custom database functions
from Database import *
#TimeWindow operation
import time, sched
#Flask
from flask import Flask, request, session, redirect, url_for, Response
from flask_cors import CORS
#authentication
from cas import CASClient
#for parsing lists
import ast
#for file IO
import os
#custom data functions
from models import read_roster, User, read_from_file, write_to_file
#for database IO
from utility import display, sanitize 
#parsing request data
import json
#for the scheduling algorithm
from copy import deepcopy
from statistics import stdev
from random import sample, choice
#for saving uploaded roster files
import pandas as pd

from flask_jwt import JWT, jwt_required, current_identity
from datetime import timedelta
from security import identity, authenticate_2

#CONSTANTS
#roster path variables for the list of tutors
UPLOAD_FOLDER = '.'
ALLOWED_EXTENSIONS = {'xls', 'xlsx', 'xlsm', 'xlsb', 'odf', 'ods', 'odt'}
ROSTER_PATH = 'roster.csv'

#total shifts
SHIFT_SLOTS = 20
#everyone in the system has a CC email
EMAIL_SUFFIX = '@coloradocollege.edu'
#URL for the project
URL = 'http://44.230.115.148/'

#set up Flask app
application = Flask(__name__)
CORS(application)
application.secret_key = ';sufhiagr3yugfjcnkdlmsx0-w9u4fhbuewiejfigehbjrs'
application.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

#set up CAS
cas_client = CASClient(
    version=3,    
    service_url=URL+'api' if URL.endswith('/') else '/api',
    server_url='https://cas.coloradocollege.edu/cas/'
)

#helper function: check if an uploaded roster is in the correct format
def allowed_file(filename):
    return '.' in filename and \
            filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

#security function: verify user authentication. Relies on Flask sessions, transmitted back and forth
def authenticate():
    if 'username' in session:
        username = session['username'] + EMAIL_SUFFIX
        try:
            #use the check_user function in the Database file to try to find the user in the database
            in_system, group = check_user(username)
            if in_system:
                if group == 'tutor':
                    tutor_entry = get_single_tutor_info(username)
                    return User(username, tutor_entry[1], group, tutor_entry[2], tutor_entry[3], tutor_entry[4], tutor_entry[5], tutor_entry[6],
                    tutor_entry[7], tutor_entry[8])
                elif group == 'admin':
                    admin_entry = get_admin_info(username)
                    return User(username, admin_entry[1], group)
                elif group == 'superuser':
                    superuser_entry = get_superuser_info(username)
                    return User(username, superuser_entry[1], group)
            else:
                application.logger.debug(session['username'] + " not in system")
                return None
        except:
            application.logger.debug(session['username'] + " not in system")
            return None
    return None


#set up JWT
jwt = JWT(application, authenticate_2, identity)
application.config["JWT_EXPIRATION_DELTA"] = timedelta(seconds=86400)

# add a rule for the index page
@application.route('/')
def index():
    next = request.args.get('next')
    ticket = request.args.get('ticket')

    if not ticket:
        # No ticket, the request come from end user, send to CAS login
        cas_login_url = cas_client.get_login_url()
        application.logger.debug('CAS login URL: %s', cas_login_url)
        return redirect(cas_login_url) # the return of this is /ticket?=...
    
    user, attributes, pgtiou = cas_client.verify_ticket(ticket)
    
    if not user:
        return 'Failed to verify ticket'
    user = user.lower()
    session['username'] = user
    session['email'] = attributes['email']
    in_system, group = check_user(session['username']+EMAIL_SUFFIX)
    if not in_system:
        return Response(response="Unauthorized", status=401)
    if not next:
        return redirect(URL+group+("/profile" if group == "tutor" else ""))
    return redirect(next)

@application.route('/login')
def login():
    if 'username' in session:
        in_system, group = check_user(session['username'] + EMAIL_SUFFIX)

        return redirect(URL+group+("/profile" if group == "tutor" else ""))

    ticket = request.args.get('ticket')
    next = request.args.get('next')

    if not ticket:
        # No ticket, the request come from end user, send to CAS login
        cas_login_url = cas_client.get_login_url()
        application.logger.debug('CAS login URL: %s', cas_login_url)
        return redirect(cas_login_url) # the return of this is /ticket?=...
    #same code as in '/', just in case, although almost every login request goes into the "if not ticket" part above
    user, attributes, pgtiou = cas_client.verify_ticket(ticket)
    
    if not user:
        return 'Failed to verify ticket'
    user = user.lower()
    session['username'] = user
    session['email'] = attributes['email']
    in_system, group = check_user(session['username']+EMAIL_SUFFIX)
    if not in_system:
        return Response(response="Unauthorized", status=401)
    if not next:
        return redirect(URL+group+("/profile" if group == "tutor" else ""))
    return redirect(next)

@application.route('/cas_logout')
def logout():
    redirect_url = url_for('logout_callback', _external=True)
    cas_logout_url = cas_client.get_logout_url(redirect_url)
    session.clear()

    return redirect(cas_logout_url)

@application.route('/logout')
def logout_callback():
    session.clear()
    return redirect("https://www.coloradocollege.edu/")

#return master schedule in an easily displayable format
@application.route('/master_schedule')
def get_master_schedule():
    #only admins may see the whole schedule
    identity = authenticate()
    if identity is None or identity.group == "tutor":
        return Response(response="Unauthorized", status=401)
    #auth successful, fetch data
    disciplines = get_disciplines()
    abbreviations = get_abbreviations()
    #add non-SQL-safe characters back into the abbreviations (e.g. / in CH/MB)
    for i in range(len(abbreviations)):
        abbreviations[i] = display(abbreviations[i])
    roster = get_roster()
    master_schedule = []
    master_schedule_with_disciplines = {}
    #create a simple master schedule structure which we will add more information to
    for i in range(SHIFT_SLOTS):
        master_schedule.append(get_master_schedule_info(i))
    shift_num = 0
    #By now we know which tutor signed up for which shift, but not which additional disciplines they can tutor
    #Time to add that info in! The finalized data structure will be master_schedule_with_disciplines
    for line in master_schedule:
        if line != None:
            shift_list = []
            for index in range(len(line)):
                email = line[index]
                if email != None and email != "":
                    tutor_found = False
                    for tutor_entry in roster:
                        if tutor_entry[0] == email: #find the tutor in the roster
                            tutor_found = True
                            discipline_list = ast.literal_eval(tutor_entry[4])
                            try:
                                discipline_list.remove(disciplines[index]) #ensure there is no redundant information
                            except:
                                print("ERROR: Discipline " + disciplines[index] + " not in tutorable disciplines for tutor " + email)
                            #get abbreviations for each discipline
                            for i in range(len(discipline_list)):
                                discipline_list[i] = abbreviations[disciplines.index(discipline_list[i])]
                            #output_str = "/".join(discipline_list) + ": " + str(tutor_entry[1])
                            output_dict = {"tutor": tutor_entry[1],
                                    "firstname": find_from_username(email),
                                    "email": email,
                                    "discipline": abbreviations[index],
                                    "other_disciplines": "/".join(discipline_list)}
                            shift_list.append(output_dict)
                    if not tutor_found:
                        print("Warning: Tutor", email, " not found in database. Omitting corresponding shift.")
                        output_dict = {"tutor": None,
                                "firstname": None,
                                "email": None,
                                "discipline": abbreviations[index],
                                "other_disciplines": None}
                        shift_list.append(output_dict)
                else: #if email == None, implying no tutor was signed up
                    output_dict = {"tutor": None,
                            "firstname": None,
                            "email": None,
                            "discipline": abbreviations[index],
                            "other_disciplines": None}
                    shift_list.append(output_dict)
            master_schedule_with_disciplines[shift_num] = shift_list
        shift_num += 1
    return master_schedule_with_disciplines

#Page where any individual tutor's schedule is stored: shift number and discipline they signed up for
@application.route('/tutor/get_schedule')
def get_tutor_schedule():
    #you must be in the database to be able to see a schedule
    identity = authenticate()
    if identity is None:
        return Response(response="Unauthorized", status=401)
    email = identity.id
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

#update a tutor's editable information: disciplines and shift capacity
@application.route('/tutor/update_info', methods = ['POST'])
def update_tutor_info():
    #you must be in the database to be able to update tutor info
    identity = authenticate()
    if identity is None:
        return Response(response="Unauthorized", status=401)
    ret = {}
    req = request.get_json()
    new_shift_capacity = int(req['shift_capacity'])
    new_disciplines = req['disciplines']
    if new_shift_capacity >= 0:
        update_shift_capacity(identity.id, new_shift_capacity)
        ret['msg'] = 'Tutor info updated'
    else:
        update_shift_capacity(identity.id, 0)
        ret['msg'] = 'Invalid shift capacity'
    disciplines = []
    for discipline, discipline_bool in new_disciplines.values():
        if discipline_bool == True:
            disciplines.append(sanitize(discipline))
    update_tutoring_disciplines(identity.id, disciplines)
    return ret

#Get tutor profile information to fill in their profile page
@application.route('/tutor/get_info', methods = ['GET'])
def tutor_info():
    #you must be in the database to be able to get tutor info
    identity = authenticate()
    if identity is None:
        return Response(response="Unauthorized", status=401)
    result = {}
    result['username'] = session['username'] + EMAIL_SUFFIX
    result['name'] = identity.name
    all_disciplines = get_disciplines()
    all_disciplines = sorted(all_disciplines)
    disciplines = []
    #return a list of all disciplines with booleans indicating whether the tutor can tutor in them
    for discipline in all_disciplines:
        if discipline in identity.disciplines:
            disciplines.append((display(discipline), True))
        else:
            disciplines.append((display(discipline), False))
    result['disciplines'] = disciplines
    result['shift_capacity'] = identity.shift_capacity
    result['this_block_unavailable'] = True if identity.this_block_unavailable == 1 else False
    result['this_block_la'] = True if identity.this_block_la == 1 else False
    return result

#Here is where admins can upload the list of active QRC tutors.
#Expected file format: a spreadsheet (essentially .xls or .xlsx)
@application.route('/upload_roster', methods=['PUT','POST'])
def upload_roster():
    #only admins may upload a roster
    identity = authenticate()
    if identity is None or identity.group == "tutor":
        return Response(response="Unauthorized", status=401)
    # check if the post request has the file part
    print("request.files: ", request.files)
    if 'file' not in request.files:
        return {"msg": "No file part"}
        #return redirect(request.url)
    file = request.files['file']
    # If the user does not select a file, the browser submits an
    # empty file without a filename.
    if file.filename == '':
        return {"msg": "No selected file"}
    if file and allowed_file(file.filename):
        result, data = read_roster(file)
        if type(data) == pd.DataFrame:
            for existing_file in os.listdir(UPLOAD_FOLDER):
                if existing_file.startswith('roster'):
                    os.remove(existing_file)
            data.to_csv(os.path.join(application.config['UPLOAD_FOLDER'], ROSTER_PATH), index = False)
        return {"msg": result}
    return {"msg": "File format not accepted"}

@application.route('/fetch_disciplines')
def fetch_disciplines():
    #you must be in the database to be able to get the list of disciplines
    identity = authenticate()
    if identity is None:
        return Response(response="Unauthorized", status=401)
    disciplines = get_disciplines()
    discipline_schedule_with_abv = []
    for i in range(len(disciplines)):
        abbreviation = get_discipline_abbreviation(disciplines[i])
        abbreviation = display(abbreviation)
        disciplines[i] = display(disciplines[i])
        discipline_schedule_with_abv.append([disciplines[i], abbreviation])

    return discipline_schedule_with_abv


@application.route('/update_master_schedule', methods=['POST'])
def update_tutors_in_master_schedule():
    #you must be an admin to be able to update the master schedule
    identity = authenticate()
    if identity is None or identity.group == "tutor":
        return Response(response="Unauthorized", status=401)
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
    
@application.route('/add_discipline', methods=['POST'])
def add_new_discipline():
    #you must be an admin to be able to add disciplines
    identity = authenticate()
    if identity is None or identity.group == "tutor":
        return Response(response="Unauthorized", status=401)
    req = request.get_json()
    print(req)
    discipline_name = req['name']
    discipline_abbreviation = req["abv"]
    print("Adding discipline: " + discipline_name)
    add_discipline(sanitize(discipline_name), sanitize(discipline_abbreviation), [])
    return {"msg": "Success"}

@application.route('/remove_discipline', methods=['POST'])
def remove_discipline():
    #you must be an admin to be able to remove disciplines
    identity = authenticate()
    if identity is None or identity.group == "tutor":
        return Response(response="Unauthorized", status=401)
    req = request.get_json()
    discipline_name = req['disciplineName']
    delete_discipline(sanitize(discipline_name))
    return {"msg": "Removed successfully"}

@application.route('/get_admins')
def get_admins():
    #you must be an admin to be able to view the list of admins
    identity = authenticate()
    if identity is None or identity.group == "tutor":
        return Response(response="Unauthorized", status=401)
    admin_info = get_admin_roster()
    admin_display_lst = []
    for email, name in admin_info:
        display_email = email
        display_name = display(name)
        admin_display_lst.append([display_name, display_email])
    return admin_display_lst

@application.route('/add_admin', methods=['POST'])
def add_new_admin():
    #you must be an admin to be able to add an admin
    identity = authenticate()
    if identity is None or identity.group == "tutor":
        return Response(response="Unauthorized", status=401)
    req = request.get_json()
    admin_name = sanitize(req["name"])
    admin_email = sanitize(req["email"])
    add_admin(admin_name, admin_email)
    return {"msg": "Added successfully"}

@application.route('/remove_admin', methods=['POST'])
def remove_admin():
    #you must be an admin to be able to remove an admin
    identity = authenticate()
    if identity is None or identity.group == "tutor":
        return Response(response="Unauthorized", status=401)
    req = request.get_json()
    admin_email = req['email']
    delete_admins(admin_email)
    return {"msg": "Removed successfully"}


@application.route('/open_schedule', methods=['POST'])
def set_time_window():
    #you must be an admin to be able to open or close registration
    identity = authenticate()
    if identity is None or identity.group == "tutor":
        return Response(response="Unauthorized", status=401)
    req_data = request.get_json()
    block = int(req_data['block'])
    is_open = bool(req_data['is_open'])
    current_block = read_from_file("block")
    if block != current_block:
        write_to_file("block", block)
        write_to_file("is_open", is_open)
    else:
        write_to_file("is_open", is_open)
    if not is_open: #shift registration has been closed
        write_master_schedule()
    return {"msg": "Changes successful"}

@application.route('/regenerate_schedule', methods=['POST'])
def regenerate_schedule():
    #you must be an admin to be able to regenerate the master schedule
    identity = authenticate()
    if identity is None or identity.group == "tutor":
        return Response(response="Unauthorized", status=401)
    write_master_schedule()
    return {"msg": "Schedule regenerated"}
    

@application.route('/get_disciplines')
def get_discipline_list():
    #you must be in the system to be able to view the list of disciplines
    identity = authenticate()
    if identity is None:
        return Response(response="Unauthorized", status=401)
    sanitized_disciplines = []
    fetched_disciplines =  get_disciplines() 
    for discipline in fetched_disciplines:
        discipline = display(discipline)
        sanitized_disciplines.append(discipline)

    return sanitized_disciplines

@application.route('/get_schedule_skeleton')
def get_schedule_skeleton():
    #you must be an admin to be able to view the schedule skeleton
    identity = authenticate()
    if identity is None or identity.group == "tutor":
        return Response(response="Unauthorized", status=401)
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

@application.route('/set_schedule_skeleton', methods = ['POST'])
def set_schedule_skeleton():
    #you must be an admin to be able to set the schedule skeleton
    identity = authenticate()
    if identity is None or identity.group == "tutor":
        return Response(response="Unauthorized", status=401)
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
    return {"msg": "Schedule skeleton saved"}

@application.route('/tutor/get_availability', methods = ['GET'])
def get_availability():
    #you must be in the system to see a tutor's availability
    identity = authenticate()
    if identity is None:
        return Response(response="Unauthorized", status=401)
    priorities = ["High", "Medium", "Low"]
    ret = {}
    tutoring_disciplines = identity.disciplines
    for i in range(SHIFT_SLOTS):
        all_possible_disciplines = []
        picked = ""
        favorited = "Low"
        shift_dict = {}
        for discipline in tutoring_disciplines:
            shifts_offered = ast.literal_eval(get_discipline_shifts_offered(discipline))
            if i in shifts_offered:
                all_possible_disciplines.append(display(get_discipline_abbreviation(discipline)))
                available_tutors_string_form = get_discipline_shift(discipline, i)
                if available_tutors_string_form is not None:
                    available_tutors = ast.literal_eval(available_tutors_string_form)
                    if identity.id in available_tutors:
                        picked = display(get_discipline_abbreviation(discipline))
                        for j in range(3):
                            print(identity.favorited_shifts[j])
                            if i in identity.favorited_shifts[j]:
                                favorited = priorities[j]
        shift_dict['all_possible_disciplines'] = all_possible_disciplines
        shift_dict['picked'] = picked
        shift_dict['favorited'] = favorited
        ret[i] = shift_dict
    return ret

@application.route('/tutor/set_availability', methods = ['POST'])
def set_availability():
    #you must be in the system to be able to set your availability
    identity = authenticate()
    if identity is None:
        return Response(response="Unauthorized", status=401)
    req = request.get_json()
    abbreviations = get_abbreviations()
    for i in range(len(abbreviations)):
        abbreviations[i] = display(abbreviations[i])
    all_disciplines = get_disciplines()
    favorited_list = [[],[],[]]
    for i in range(SHIFT_SLOTS):
        for discipline in all_disciplines:
            available_tutors = get_discipline_shift(discipline, i)
            if available_tutors is not None:
                available_tutors = ast.literal_eval(available_tutors)
            else:
                available_tutors = []
            #remove tutor from any shift they had previously selected (give them a "clean slate")
            if identity.id  in available_tutors:
                available_tutors.remove(identity.id)
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
        if identity.id not in available_tutors:
            available_tutors.append(identity.id)
        add_shifts(discipline, i, available_tutors)   
        
        if picked != None and favorited == "Low":
            favorited_list[2].append(i)
        elif picked != None and favorited == "Medium":
            favorited_list[1].append(i)
        elif picked != None and favorited == "High":
            favorited_list[0].append(i)

    update_favorite_shifts(identity.id, favorited_list)
    return {'msg': 'Changes saved'}

@application.route('/get_tutors_information', methods = ['GET'])
def get_tutors_information():
    #you must be an admin to get information on all tutors
    identity = authenticate()
    if identity is None or identity.group == "tutor":
        return Response(response="Unauthorized", status=401)
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

@application.route('/set_tutors_information', methods = ['POST'])
def set_tutors_information():
    #you must be an admin to be able to change information for any tutor
    identity = authenticate()
    if identity is None or identity.group == "tutor":
        return Response(response="Unauthorized", status=401)
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

@application.route('/get_block', methods = ['GET'])
def get_block():
    #you must be in the system to view the block number
    identity = authenticate()
    if identity is None:
        return Response(response="Unauthorized", status=401)
    block_number = read_from_file("block")
    return {'block': block_number}

@application.route('/is_open', methods = ['GET'])
def is_open():
    #you must be in the system to see if the schedule is open for editing
    identity = authenticate()
    if identity is None:
        return Response(response="Unauthorized", status=401)
    is_open = read_from_file("is_open")
    return {"msg": str(is_open)}


#take in the tutors' chosen shifts and use them to create the master schedule
def write_master_schedule():
    #Get the list of all disciplines
    disciplines = get_disciplines()
    tutors = []
    open_shifts = []
    avail_tables = []
    #open_shifts: The schedule skeleton / list of shifts per discipline that could be taken
    for i in range(len(disciplines)):
        open_shifts.append(ast.literal_eval(get_discipline_shifts_offered(disciplines[i])))

    for i in range(len(disciplines)):
        dictionary = {}
        for j in range(len(open_shifts[i])):
            dictionary[open_shifts[i][j]] = []
        avail_tables.append(dictionary)

    low_priority = []
    mid_priority = []
    high_priority = []
    for tutor in get_roster():
        # #remove tutors who have been marked as unavailable
        # if tutor[3] == 1:
        #     continue
        if tutor[9] == 1: #"absence" is True - tutor has unexcused absences
            low_priority.append(User(tutor[0], tutor[1], 'tutor', tutor[2], tutor[3], tutor[4], tutor[5], tutor[6], tutor[7], tutor[8], tutor[9]))
        elif tutor[5] == 1: #"tutor_this_block" is True - tutor is an LA this block
            mid_priority.append(User(tutor[0], tutor[1], 'tutor', tutor[2], tutor[3], tutor[4], tutor[5], tutor[6], tutor[7], tutor[8], tutor[9]))
        else:
            high_priority.append(User(tutor[0], tutor[1], 'tutor', tutor[2], tutor[3], tutor[4], tutor[5], tutor[6], tutor[7], tutor[8], tutor[9]))
        tutors = [high_priority, mid_priority, low_priority]
    for i in range(len(disciplines)):
        for shift in range(SHIFT_SLOTS):
            avail_tables[i][shift] = get_discipline_shift(disciplines[i], shift)
            if avail_tables[i][shift] == None:
                avail_tables[i][shift] = []

    solution = algorithm(200, tutors, avail_tables, open_shifts)
    #print("chosen solution",solution)
    #solution is in the format:
    #[{1: "g_pham@coloradocollege.edu", #the first discipline
    # 5: "m_padilla@coloradocollege.edu"},
    # {2: "j_hannebert@coloradocollege.edu", #the second discipline
    # 4: "p_mishra@coloradocollege.edu"}]
    for i in range(SHIFT_SLOTS):
        assignments = []
        for dict in solution:
            assignments.append(dict[i])
        add_to_master_schedule(i, disciplines, assignments)
    return({"msg" : "DONE"})


#greedy algorithm to determine a possible allocation of schedule shifts
#tutors: [] list of User objects representing all tutors in the roster
#avail_tables: [] data structure representing tutor availability, in the format (and in order of tutor priority):
#[[{1: [Moises, Jessica], #this dictionary is for the first discipline returned by get_disciplines
#  2: [],
#  3: [Pralad]},
#  {1: [Moises, Jessica, Giang], #this dictionary is for the second discipline
#  2: [Moises]}]]
#open_shifts: The schedule skeleton / list of shifts per discipline that could be taken
#in the format:
# [[1,2,3],[3,4,6],[1,2,4]] #where the lists are lists per discipline in the order returned by get_disciplines
#priorities: {} dictionary enumerating each tutor's preferences for shifts, in the format:
#{ 'j_hannebert': [[1,5],[2],[3]],
#  'p_mishra': [[2],[],[3]]} #where the lists go [[high],[medium],[low]]
def greedy(tutors, avail_tables, open_shifts):
    unavailable = []
    #remove tutors who have been marked as unavailable
    for tutor in tutors:
        if tutor.this_block_unavailable == 1:
            unavailable.append(tutor)
    for tutor in unavailable:
        tutors.remove(tutor)
    attempts = 0
    assigned = 0
    disciplines = get_disciplines()
    total_shifts = sum([len(shift_list) for shift_list in open_shifts])
    capacities = [tutor.shift_capacity for tutor in tutors]
    emails = [tutor.id for tutor in tutors]
    sum_capacities = sum(capacities)
    avail_copy = deepcopy(avail_tables)
    master_schedule = []
    for i in range(len(disciplines)):
        dictionary = {}
        for j in range(SHIFT_SLOTS):
            dictionary[j] = ""
        master_schedule.append(dictionary)
    while(assigned < total_shifts and assigned < sum_capacities and attempts < 100):
        for tutor in sample(tutors,len(tutors)): #choose a tutor at random
            if capacities[emails.index(tutor.id)] < 1:
                continue #skip this tutor, they cannot take any more shifts
            #try to give them a shift they want
            assigned_bool = False
            for priority_list in tutor.favorited_shifts:
                if assigned_bool:
                    break #skip on to the next tutor
                for shift_index in priority_list:
                    if assigned_bool:
                        break #skip on to the next tutor
                    #figure out which discipline they actually signed up for, if that shift hasn't been taken
                    for i in range(len(disciplines)):
                        if assigned_bool:
                            break #skip on to the next tutor
                        discipline_dict = avail_copy[i]
                        #discipline = disciplines[i]
                        if discipline_dict[shift_index] != []: #if someone is available to take the shift
                            if tutor.id in discipline_dict[shift_index]: #the tutor is available for this shift
                                assigned_bool = True
                                master_schedule[i][shift_index] = tutor.id
                                capacities[emails.index(tutor.id)] -= 1
                                assigned += 1
                                discipline_dict[shift_index] = []
                                priority_list.remove(shift_index)
                    if not assigned_bool: #we checked all the disciplines but did not assign the tutor their shift
                    #which means the shift has already been taken by someone else
                        priority_list.remove(shift_index)
        attempts += 1 #we've iterated through all the tutors once; if we do it 100 times that means we probably can't assign more shifts




        # for d in sample(list(range(len(disciplines))), len(disciplines)): #go through disciplines in random order
        #     shift = sample(open_shifts[d], 1) #select a random shift to fill
        #     #let's fill it!
        #     if len(avail_copy[d][shift]) > 0:
        #         assigned_bool = False
        #         for tutor in sample(avail_copy[d][shift],len(avail_copy[d][shift])):
        #             if capacities[emails.index(tutor)] > 0:
        #                 master_schedule[d][shift] = tutor
        #                 avail_copy[d][shift] = []
        #                 capacities[emails.index(tutor)] -= 1
        #                 assigned += 1
        #                 assigned_bool = True
        #                 break
        #         if not assigned_bool:
        #             avail_copy[d][shift] = []
        # attempts += 1
    if assigned == total_shifts:
        print("Greedy algorithm stopped: all shifts filled")
    if assigned == sum_capacities:
        print("Greedy algorithm stopped: tutors maxed out")
    if attempts >= 100:
        print("Greedy algorithm stopped: algorithm gave up")
    #for d in sample(range(len(disciplines)), len(disciplines)):
    #    for shift in sample(open_shifts[d], len(open_shifts[d])):
    #        if len(avail_copy[d][shift]) > 0:
    #            master_schedule[d][shift] = ""
    return master_schedule, assigned
            
#calculate how unfair the schedule is for tutors, favoring higher priority tutors
def tutor_unfairness(schedule, high_priority, mid_priority, low_priority, open_shifts):
    unavailable = []
    #remove tutors who have been marked as unavailable
    for tutor in high_priority:
        if tutor.this_block_unavailable == 1:
            unavailable.append(tutor)
    for tutor in unavailable:
        high_priority.remove(tutor)
    unavailable = []
    #remove tutors who have been marked as unavailable
    for tutor in mid_priority:
        if tutor.this_block_unavailable == 1:
            unavailable.append(tutor)
    for tutor in unavailable:
        mid_priority.remove(tutor)
    unavailable = []
    #remove tutors who have been marked as unavailable
    for tutor in low_priority:
        if tutor.this_block_unavailable == 1:
            unavailable.append(tutor)
    for tutor in unavailable:
        low_priority.remove(tutor)
    unfairness_score = 0 #lower is better
    for tutor in high_priority:
        #count number of shifts they have been assigned
        assigned = 0
        for i in range(len(schedule)):
            for j in open_shifts[i]:
                if schedule[i][j] == tutor.name:
                   assigned += 1
        score_component = (tutor.shift_capacity - assigned + 1) / (tutor.shift_capacity + 1)
        unfairness_score += 3 * score_component
    for tutor in mid_priority:
        #count number of shifts they have been assigned
        assigned = 0
        for i in range(len(schedule)):
            for j in open_shifts[i]:
                if schedule[i][j] == tutor.name:
                   assigned += 1
        score_component = (tutor.shift_capacity - assigned + 1) / (tutor.shift_capacity + 1)
        unfairness_score += 2 * score_component
    for tutor in low_priority:
        #count number of shifts they have been assigned
        assigned = 0
        for i in range(len(schedule)):
            for j in open_shifts[i]:
                if schedule[i][j] == tutor.name:
                   assigned += 1
        score_component = (tutor.shift_capacity - assigned + 1) / (tutor.shift_capacity + 1)
        unfairness_score += score_component
    return unfairness_score

def discipline_evenness(schedule, open_shifts):
    shift_counts = []
    for i in range(len(schedule)):
        shift_count = 0
        for j in open_shifts[i]:
            if schedule[i][j] != '':
                shift_count += 1
        shift_counts.append(shift_count)
    deviation = stdev(shift_counts)
    return deviation

def algorithm(totaltries, tutors, avail_tables, open_shifts):
    high_priority = tutors[0]
    mid_priority = tutors[1]
    low_priority = tutors[2]
    tutors = []
    tutors.extend(high_priority)
    tutors.extend(mid_priority)
    tutors.extend(low_priority)
    possible_solutions = []
    for i in range(totaltries):
        soln, assigned = greedy(tutors, avail_tables, open_shifts)
        unfairness = tutor_unfairness(soln, high_priority, mid_priority, low_priority, open_shifts)
        evenness = discipline_evenness(soln, open_shifts)
        possible_solutions.append((soln, assigned, unfairness, evenness))
    assigned_amounts = [soln[1] for soln in possible_solutions]
    maximum = max(assigned_amounts)
    i = 0
    while i < len(possible_solutions):
        soln = possible_solutions[i]
        if soln[1] != maximum:
            possible_solutions.remove(soln)
        else:
            i+=1
    unfairness_amounts = [soln[2] for soln in possible_solutions]
    minimum = min(unfairness_amounts)
    i = 0
    while i < len(possible_solutions):
        soln = possible_solutions[i]
        if soln[2] != minimum:
            possible_solutions.remove(soln)
        else:
            i+=1
    evenness_amounts = [soln[3] for soln in possible_solutions]
    maximum = max(evenness_amounts)
    i = 0
    while i < len(possible_solutions):
        soln = possible_solutions[i]
        if soln[3] != maximum:
            possible_solutions.remove(soln)
        else:
            i+=1

    # for soln in possible_solutions:
    #     print(soln[1], soln[2], soln[3])   
    #     for line in soln[0]:
    #         print(line)

    return possible_solutions[0][0]

# #     # Setting debug to True enables debug output. This line should be
# #     # removed before deploying a production app.
# #     application.debug = True
# #     application.run()

