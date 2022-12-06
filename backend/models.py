import pandas as pd
import traceback
from .databaseTest import create_tables, add_tutor

class Tutor:
    def __init__(self, email, firstname, lastname):
        self.email = email
        self.firstname = firstname
        self.lastname = lastname

    def __repr__(self):
        return self.email + self.firstname + self.lastname

    def asdict(self):
        return {
            'Email': self.email,
            "Firstname": self.firstname,
            "Lastname": self.lastname
        }

#Method to read in an Excel file and turn it into a legible table
#roster_file: Accepts a file path or file-like object as the file
def read_roster(roster_file):
    df = pd.read_excel(roster_file)
    df.columns = df.columns.str.lower()
    output = []
    try:
        full_names = df['first name'] + ' ' + df['last name']
        for i in range(len(df.index)):
            tutor_tuple = (full_names[i], df['email address'][i])
            output.append(tutor_tuple)
    except KeyError:
        print("Error reading file. Please ensure your columns are named \"first name\", \"last name\", and \"email address\".")
    except:
        print("Error reading file. Please ensure you submitted an Excel file.")
        traceback.print_exc()
    if len(output) > 0:
        create_tables(['CH/MB','CS','E','M','P'])
        for tutor in output:
            add_tutor(tutor[0], tutor[1])



