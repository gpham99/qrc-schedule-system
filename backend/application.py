import time
from flask import Flask, request, session, redirect, url_for
from cas import CASClient
from flask_cors import CORS

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

# # add a rule for the index page
# @application.route('/')
# def index():
#     if 'username' in session:
#         # Already logged in
#         return 'You are logged in. Here you are going to see your schedule. <a href="/logout">Exit</a>'

#     next = request.args.get('next')
#     ticket = request.args.get('ticket')

#     if not ticket:
#         return header_text + say_hello() + footer_text + sso_link
    
#     application.logger.debug('ticket: %s', ticket)
#     application.logger.debug('next: %s', next)
#     user, attributes, pgtiou = cas_client.verify_ticket(ticket)

#     application.logger.debug(
#         'CAS verify ticket response: user: %s, attributes: %s, pgtiou: %s', user, attributes, pgtiou)

#     if not user:
#         return 'Failed to verify ticket. <a href="/login">Login</a>'
#     else:  # Login successfully, redirect according `next` query parameter.
#         session['username'] = user
#         session['email'] = attributes['email']
#         if not next:
#             return redirect(url_for('profile'))
#         return redirect(next)

# @application.route('/profile')
# def profile(method=['GET']):
#     application.logger.debug('session when you hit profile: %s', session)
#     if 'username' in session:
#         return 'Logged in as {}. Your email address is {}. <a href="/logout">Exit</a>'.format(session['username'], session['email'])
#     return 'Login required. <a href="/login">Login</a>', 403

# @application.route('/login')
# def login():
#     application.logger.debug('session when you hit login: %s', session)

#     if 'username' in session:
#         # Already logged in
#         return redirect(url_for('profile'))

#     next = request.args.get('next')
#     ticket = request.args.get('ticket')

#     if not ticket:
#         # No ticket, the request come from end user, send to CAS login
#         cas_login_url = cas_client.get_login_url()
#         application.logger.debug('CAS login URL: %s', cas_login_url)
#         return redirect(cas_login_url) # the return of this is /ticket?=...

# @application.route('/cas_logout')
# def logout():
#     redirect_url = url_for('logout_callback', _external=True)
#     application.logger.debug('Redirect logout URL %s', redirect_url)
#     cas_logout_url = cas_client.get_logout_url(redirect_url)
#     application.logger.debug('CAS logout URL: %s', cas_logout_url)

#     return redirect(cas_logout_url)

# @application.route('/logout')
# def logout_callback():
#     session.clear()
#     return 'Exited CAS. <a href="/login">Login</a>'
    
@application.route('/api/time')
def get_current_time():
    return {'time': time.time()}

# # run the app.
# if __name__ == "__main__":
#     # Setting debug to True enables debug output. This line should be
#     # removed before deploying a production app.
#     application.debug = True
#     application.run()
