from databaseTest import get_roster, get_master_schedule_info, get_disciplines
import time
from flask import Flask, request, session, redirect, url_for
from cas import CASClient
from flask_cors import CORS
import ast

# print a nice greeting.
def say_hello(username = "Team"):
    return '<p>Hello %s!</p>\n' % username

# some bits of text for the page.
header_text = '''
    <html>\n<head> <title>EB Flask Test</title> </head>\n<body>'''
home_link = '<p><a href="/">Back</a></p>\n'
footer_text = '</body>\n</html>'
sso_link = '<p><a href="/login">Log in using SSO</a></p>'

# EB looks for an 'application' callable by default.
application = Flask(__name__)
CORS(application)
application.secret_key = 'V7nlCN90LPHOTA9PGGyf'
cas_client = CASClient(
    version=3,    
    service_url='http://52.12.35.11:8080/',
    server_url='https://cas.coloradocollege.edu/cas/'
)

# add a rule for the index page
@application.route('/')
def index():
    if 'username' in session:
        # Already logged in
        return 'You are logged in. Here you are going to see your schedule. <a href="/logout">Exit</a>'

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
        if not next:
            return redirect(url_for('profile'))
        return redirect(next)

@application.route('/profile')
def profile(method=['GET']):
    application.logger.debug('session when you hit profile: %s', session)
    if 'username' in session:
        return 'Logged in as {}. Your email address is {}. <a href="/logout">Exit</a>'.format(session['username'], session['email'])
    return 'Login required. <a href="/login">Login</a>', 403

@application.route('/login')
def login():
    application.logger.debug('session when you hit login: %s', session)

    if 'username' in session:
        # Already logged in
        return redirect(url_for('profile'))

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
    roster = get_roster()
    master_schedule = []
    master_schedule_with_disciplines = {}
    for i in range(20): #TODO: MAGIC CONSTANT
        master_schedule.append(get_master_schedule_info(i))
    shift_num = 0
    for line in master_schedule:
        if line != None:
            for d in range(len(line)):
                email = line[d]
                if email != None:
                    for tutor_entry in roster:
                        tutor_found = False
                        if tutor_entry[0] == email: #find the tutor in the roster
                            tutor_found = True
                            discipline_list = ast.literal_eval(tutor_entry[4])
                            for i in range(len(discipline_list)): 
                                if discipline_list[i] == 'CHMB':
                                    discipline_list[i] = 'CH/MB'
                            output_str = "/".join(discipline_list) + ": " + str(email)
                            master_schedule_with_disciplines[str(shift_num)+disciplines[d]] = output_str
                    if (!tutor_found):
                        print("Warning: One tutor (", email, ") not found in database. Omitting corresponding shift.")
        shift_num += 1
    return master_schedule_with_disciplines

@application.route('/api/tutor/<username>')
def get_tutor_schedule(username):
    disciplines = get_disciplines()
    
    

# # run the app.
# if __name__ == "__main__":
#     # Setting debug to True enables debug output. This line should be
#     # removed before deploying a production app.
#     application.debug = True
#     application.run()
