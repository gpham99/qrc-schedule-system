import pandas as pd
import traceback
from Database import create_tables, add_tutor
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
    df = pd.read_excel(roster_file)
    df.columns = df.columns.str.lower()
    output = []
    try:
        full_names = df['first name'] + ' ' + df['last name']
        for i in range(len(df.index)):
            tutor_tuple = (full_names[i], df['email address'][i].lower())
            output.append(tutor_tuple)
    except KeyError:
        return "Error reading file. Please ensure your columns are named \"first name\", \"last name\", and \"email address\".", None
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
                    add_tutor(tutor[0], tutor[1])
            else:
                errors += "Tutor " + tutor[1] + " not added to database, please ensure that their email ends in '@coloradocollege.edu'\n"
        return errors + "File successfully read, all other tutors added to database", df
    return "No tutors found in file", None


#process Excel file and return it in an easily legible format
def prepare_excel_file(filename):
    df = pd.read_csv(filename)
    output = [[column for column in df.columns]]
    for i in range(len(df.index)):
        output.append([num for num in df.iloc[i,:]])
    return output

