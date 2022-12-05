from flask import Flask, request, session, redirect, url_for
from cas import CASClient

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
application.secret_key = 'V7nlCN90LPHOTA9PGGyf'

cas_client = CASClient(
    version=3,    
    service_url='http://35.88.95.206:8080/',
    server_url='https://cas.coloradocollege.edu/cas/'
)

# add a rule for the index page
@application.route('/')
def index():
    if 'username' in session:
        # Already logged in
        return 'You are logged in. Here you are going to see your schedule. <a href="/logout">Logout</a>'

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
        application.logger.debug('next: %s', next)
        if not next:
            return redirect(url_for('profile'))
        return redirect(next)

@application.route('/profile')
def profile(method=['GET']):
    if 'username' in session:
        return 'Logged in as {}. Your email address is {}. <a href="/logout">Logout</a>'.format(session['username'], session['email'])
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
        return redirect(cas_login_url) # the return of this is /ticket?=...

@application.route('/logout')
def logout():
    redirect_url = url_for('logout_callback', _external=True)
    application.logger.debug('Redirect logout URL %s', redirect_url)
    cas_logout_url = cas_client.get_logout_url(redirect_url)
    application.logger.debug('CAS logout URL: %s', cas_logout_url)

    session.clear() # because logout_callback doesn't work, I have to add this line and the next
    return redirect(cas_logout_url)

@application.route('/logout_callback')
def logout_callback():
    # redirect from CAS logout request after CAS logout successfully
    session.clear()
    return 'Logged out from CAS. <a href="/login">Login</a>'

# run the app.
if __name__ == "__main__":
    # Setting debug to True enables debug output. This line should be
    # removed before deploying a production app.
    application.debug = True
    application.run()