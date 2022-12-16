from models import User
from Database import check_user, get_single_tutor_info

def authenticate(username, password):
    email = username + "@coloradocollege.edu"
    in_system, group = check_user(username+"@coloradocollege.edu")
    if in_system:
        tutor_entry = get_single_tutor_info(email)
        return User(email, group, tutor_entry[1], tutor_entry[2], tutor_entry[3], tutor_entry[4], tutor_entry[5], tutor_entry[6],
        tutor_entry[7])


def identity(payload):
    email = payload['identity']
    return authenticate(email, "")