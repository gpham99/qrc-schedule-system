import pandas as pd
import traceback

#Method to read in an Excel file and turn it into a legible table
#roster_file: Accepts a file path or file-like object as the file
def read_roster(roster_file):
    df = pd.read_excel(roster_file)
    output = []
    try:
        full_names = df['First Name'] + ' ' + df['Last Name']
        for i in range(len(df.index)):
            newstring = ""
            newstring += full_names[i] + "," + df['Email'][i]
            output.append(newstring)

    except:
        traceback.print_exc()
    #except error as e:
       # return("Error: Unable to find first name or last name column")
    return output


print(read_roster('/Users/jessicahannebert/Documents/Colorado College/Block 28/sample_excel.xlsx'))


