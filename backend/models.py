import pandas as pd
import traceback
from databaseTest import create_tables, add_tutor

class User:
    def __init__(self, email, name, group=None, status = 0, shift_capacity=1, tutoring_disciplines=[],\
        this_block_la=0, next_block_la=0, individual_tutor=0):
        self.id = email
        self.group = group
        self.name = name
        self.status = status
        self.shift_capacity = shift_capacity
        self.disciplines = tutoring_disciplines
        self.this_block_la = this_block_la
        self.next_block_la = next_block_la
        self.individual_tutor = individual_tutor

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
        return "Error reading file. Please ensure your columns are named \"first name\", \"last name\", and \"email address\"."
    except:
        return "Error reading file. Please ensure you submitted an Excel file."
        traceback.print_exc()
    if len(output) > 0:
        for tutor in output:
            print(tutor)
            add_tutor(tutor[0], tutor[1])
        return "File successfully read, tutors added to database"
    return "No tutors found in file"



