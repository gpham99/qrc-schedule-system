import pandas as pd
import traceback

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
            newstring = ""
            newstring += full_names[i] + "," + df['email address'][i]
            output.append(newstring)
    except KeyError:
        print("Error reading file. Please ensure your columns are named \"first name\", \"last name\", and \"email address\".")
    except:
        print("Error reading file. Please ensure you submitted an Excel file.")
        traceback.print_exc()
    return output


