from models import User
from Database import *

#everyone in the system has a CC email
EMAIL_SUFFIX = '@coloradocollege.edu'

def _authenticate(username):
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
            return None
    except:
        return None
    return None

