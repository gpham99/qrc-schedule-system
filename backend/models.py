import pandas as pd
import traceback
from Database import create_tables, add_tutor, get_roster, delete_tutors
from ast import literal_eval

class User:
    def __init__(self, email, name, group=None, this_block_unavailable = 0, shift_capacity=1, tutoring_disciplines=[],\
        this_block_la=0, next_block_la=0, individual_tutor=0, favorited_shifts=[[],[],[]], absence=0):
        self.id = email
        self.group = group
        self.name = name
        self.this_block_unavailable = this_block_unavailable
        self.shift_capacity = shift_capacity
        if isinstance(tutoring_disciplines, list):
            self.disciplines = tutoring_disciplines
        else:
            self.disciplines = literal_eval(tutoring_disciplines)
        self.this_block_la = this_block_la
        self.next_block_la = next_block_la
        self.individual_tutor = individual_tutor
        if isinstance(favorited_shifts, list):
            self.favorited_shifts = favorited_shifts
        else:
            self.favorited_shifts = literal_eval(favorited_shifts)
        self.absence = absence

    def __repr__(self):
        return "User (email=%s, group=%s)"%(self.email, str(self.group))

    #def asdict(self):
    #    return {
    #        'Email': self.email,
    #        "Firstname": self.firstname,
    #        "Lastname": self.lastname
    #    }

#Method to read in an Excel file and turn it into a legible table
#roster_file: Accepts a file path or file-like object as the file
def read_roster(roster_file):
    #get a list of tutors to compare against
    existing_tutors = get_roster()
    emails = [tutor[0] for tutor in existing_tutors]
    print(emails)
    df = pd.read_excel(roster_file)
    df.columns = df.columns.str.lower()
    output = []
    try:
        full_names = df['fn'] + ' ' + df['ln']
        for i in range(len(df.index)):
            tutor_tuple = (full_names[i], df['email'][i].lower())
            output.append(tutor_tuple)
    except KeyError:
        return "Error reading file. Please ensure your columns are named \"fn\", \"ln\", and \"email\".", None
    except:
        return "Error reading file. Please ensure you submitted an Excel file.", None
        traceback.print_exc()
    errors = ""
    if len(output) > 0:
        ALLOWED_CHARS_NAME = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 -'"
        ALLOWED_CHARS_EMAIL = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_@."
        for tutor in output:
            #print(tutor)
            valid_tutor = True
            if tutor[1].endswith("@coloradocollege.edu"):
                for char in tutor[0]:
                    if char not in ALLOWED_CHARS_NAME:
                        errors += "Tutor " + tutor[1] + " not added to database; invalid character detected in name: " + char
                        valid_tutor = False
                        break
                for char in tutor[1]:
                    if char not in ALLOWED_CHARS_EMAIL:
                        errors += "Tutor " + tutor[1] + " not added to database; invalid character detected in email: " + char
                        valid_tutor = False
                        break
                if valid_tutor:
                    if tutor[1] in emails: #this tutor already exists!
                        for existing_tutor in existing_tutors:
                            if existing_tutor[1] == tutor[1]:
                                if not existing_tutor[0] == tutor[0]: #the roster has given us new information on this tutor
                                    print("Changing tutor info: ", tutor[0], existing_tutor[0])
                                    delete_tutors(tutor[1])
                                    add_tutor(tutor[1], tutor[0])
                                    break
                        #otherwise, no need to update the database, but we can take them off the list
                        print("Removing tutor: ", tutor[1])
                        emails.remove(tutor[1])
                    else: #this tutor does not already exist
                        print("New tutor: ", tutor[1])
                        add_tutor(tutor[0], tutor[1])               
            else:
                errors += "Tutor " + tutor[1] + " not added to database, please ensure that their email ends in '@coloradocollege.edu'\n"
        for email in emails: #by now, all emails for existing tutors have been removed if the tutors were in the roster
            delete_tutors(email)
            print(email)
        return errors + "File successfully read, all tutors added to database", df
    return "No tutors found in file", None

def read_from_file(request):
    if request == "block":
        file = "curr_block.txt"
    elif request == "is_open":
        file = "is_open.txt"
    else:
        return None
    with open(file) as f:
        contents = f.readlines()
    if request == "block":
        return int(contents[0])
    elif request == "is_open":
        return bool(contents[0])
    
def write_to_file(request, value):
    if request == "block":
        file = "curr_block.txt"
    elif request == "is_open":
        file = "is_open.txt"
    else:
        return None
    with open(file, "w") as f:
        f.write(str(value))