import pandas as pd
import traceback
from databaseTest import create_tables, add_tutor

class Tutor:
    def __init__(self, name, email, status=0, shift_cap=0, this_block_la=0, next_block_la=0, individual_tutor=0, disciplines = []):
        self.email = email
        self.name = name
        self.status = status
        self.shift_cap = shift_cap
        self.this_block_la = this_block_la
        self.next_block_la = next_block_la
        self.individual_tutor = individual_tutor
        self.disciplines = disciplines

    def asdict(self):
        return {
            "Email": self.email,
            "Name": self.name,
            "Status": self.status,
            "Shift cap": self.shift_cap,
            "This block LA": self.this_block_la,
            "Next block LA": self.next_block_la,
            "Individual tutor": self.individual_tutor,
            "Disciplines": self.disciplines
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
        create_tables(['CHMB','CS','E','M','P'])
        for tutor in output:
            add_tutor(tutor[0], tutor[1])


