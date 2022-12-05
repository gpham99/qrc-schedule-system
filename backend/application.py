from flask import Flask, request, session, redirect, url_for
from cas import CASClient

# print a nice greeting.
def say_hello(username = "Programmer"):
    return '<p>Hello %s!</p>\n' % username

# some bits of text for the page.
header_text = '''
    <html>\n<head> <title>EB Flask Test</title> </head>\n<body>'''
instructions = '''
    <p><em>Hint</em>: This is a RESTful web service! Append a username
    to the URL (for example: <code>/Thelonious</code>) to say hello to
    someone specific.</p>\n'''
home_link = '<p><a href="/">Back</a></p>\n'
footer_text = '</body>\n</html>'
sso_link = '<p><a href="/login">Log in using SSO</a></p>'

# EB looks for an 'application' callable by default.
application = Flask(__name__)
application.secret_key = 'V7nlCN90LPHOTA9PGGyf'

cas_client = CASClient(
    version=3,    
    service_url='http://35.88.95.206:8080/',
    server_url='https://cas.coloradocollege.edu/cas/'
)

# add a rule when the page is accessed with a name appended to the site
# URL.
@application.route('/<username>')
def hello(username):
    return header_text + say_hello(username) + home_link + footer_text

# add a rule for the index page
@application.route('/')
def index():
    if 'username' in session:
        # Already logged in
        return redirect(url_for('profile'))

    next = request.args.get('next')
    ticket = request.args.get('ticket')

    if not ticket:
        return header_text + say_hello() + instructions + footer_text + sso_link
    
    application.logger.debug('ticket: %s', ticket)
    application.logger.debug('next: %s', next)
    user, attributes, pgtiou = cas_client.verify_ticket(ticket)

    application.logger.debug(
        'CAS verify ticket response: user: %s, attributes: %s, pgtiou: %s', user, attributes, pgtiou)

    if not user:
        return 'Failed to verify ticket. <a href="/login">Login</a>'
    else:  # Login successfully, redirect according `next` query parameter.
        session['username'] = user
        return redirect(url_for('profile')) # used to be redirect(next)

@application.route('/profile')
def profile(method=['GET']):
    if 'username' in session:
        return 'Logged in as %s. <a href="/logout">Logout</a>' % session['username']
    return 'Login required. <a href="/login">Login</a>', 403

@application.route('/login')
def login():
    if 'username' in session:
        # Already logged in
        return redirect(url_for('profile'))

    next = request.args.get('next')
    ticket = request.args.get('ticket')

    if not ticket:
        # No ticket, the request come from end user, send to CAS login
        cas_login_url = cas_client.get_login_url()
        application.logger.debug('CAS login URL: %s', cas_login_url)
        return redirect(cas_login_url) # hoping that the ticket is appended to login as login/ticket?=fasfaa

    # There is a ticket, the request come from CAS as callback.
    # need call `verify_ticket()` to validate ticket and get user profile.
    # application.logger.debug('ticket: %s', ticket)
    # application.logger.debug('next: %s', next)

    # user, attributes, pgtiou = cas_client.verify_ticket(ticket)

    # application.logger.debug(
    #     'CAS verify ticket response: user: %s, attributes: %s, pgtiou: %s', user, attributes, pgtiou)

    # if not user:
    #     return 'Failed to verify ticket. <a href="/login">Login</a>'
    # else:  # Login successfully, redirect according `next` query parameter.
    #     session['username'] = user
    #     return redirect(next)

@application.route('/logout')
def logout():
    # redirect_url = url_for('logout_callback', _external=True)
    redirect_url = url_for('')
    application.logger.debug('Redirect logout URL %s', redirect_url)
    cas_logout_url = cas_client.get_logout_url(redirect_url)
    application.logger.debug('CAS logout URL: %s', cas_logout_url)

    session.pop('username', None) # this eliminates logout_callback
    redirect(cas_logout_url)

@application.route('/logout_callback')
def logout_callback():
    # redirect from CAS logout request after CAS logout successfully
    session.pop('username', None)
    return 'Logged out from CAS. <a href="/login">Login</a>'

# run the app.
if __name__ == "__main__":
    # Setting debug to True enables debug output. This line should be
    # removed before deploying a production app.
    application.debug = True
    application.run()