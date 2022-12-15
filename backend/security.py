from models import User
from Database import check_user

def authenticate(username, password):
    email = username + "@coloradocollege.edu"
    in_system, group = check_user(username+"@coloradocollege.edu")
    if in_system:
        return User(email, group)


def identity(payload):
    email = payload['identity']
    return authenticate(email, "")