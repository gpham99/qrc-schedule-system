from models import User
from Database import check_user, get_single_tutor_info
import random
import time

#everyone in the system has a CC email
EMAIL_SUFFIX = '@coloradocollege.edu'

#how long an auth token should last, in seconds - currently one week
AUTH_LENGTH = 604800

def authenticate(username, password):
    print("In authenticate: " + username)
    username = username.lower()
    if not username.endswith(EMAIL_SUFFIX):
        username += EMAIL_SUFFIX
    in_system, group = check_user(username)
    print("in_system, group: ", in_system, group)
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
    return None

def identity(payload):
    email = payload['identity']
    return authenticate(email, "")
    email = username + EMAIL_SUFFIX
    in_system, group = check_user(email)
    if in_system:
        tutor_entry = get_single_tutor_info(email)
        return User(email, tutor_entry[1], group, tutor_entry[2], tutor_entry[3], tutor_entry[4], tutor_entry[5], tutor_entry[6],
        tutor_entry[7])


#helper class for authentication - keeps track of auth tokens and token expiration
class QSSAuth:
    def __init__(self):
        self.token = random.randint(0, 100000000000)
        self.init_time = time.time()

    #token is expired if too much time has passed since it was created
    def expired(self):
        return time.time() > self.init_time + AUTH_LENGTH
    
class Authenticator:
    def __init__(self):
        self.userdict = {}

    def add_user(self, username):
        if not username.endswith(EMAIL_SUFFIX):
            username = username + EMAIL_SUFFIX
        token = QSSAuth()
        #make sure we don't accidentally give two people the same token
        duplicate = True
        while duplicate:
            duplicate = False
            for user in self.userdict:
                if self.userdict[user].token == token.token:
                    duplicate = True
                if self.userdict[username].expired(): #while we're here, may as well clean out the dict
                    #log out the user
                    self.userdict.pop(username)
            if duplicate:
                token = QSSAuth()
        self.userdict[username] = token
        return token.token

    def get_user(self, token):
        for username in self.userdict:
            if self.userdict[username].token == token:
                if self.userdict[username].expired():
                    #log out the user
                    self.userdict.pop(username)
                    return "EXPIRED"
                return username
        return "INVALID TOKEN"
    
    def logout_user(self, username):
        if not username.endswith(EMAIL_SUFFIX):
            username = username + EMAIL_SUFFIX
        if username in self.userdict:
            self.userdict.pop(username)
    