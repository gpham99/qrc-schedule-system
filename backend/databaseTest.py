import sqlite3

from flask import current_app, g
from flask import Flask
import sqlite3 as sql

app = Flask(__name__)



# Function to create the majority of the tables
def create_tables():
    # create a database
    conn = sqlite3.connect('database.db')
    print("Opened database successfully")

    # create the tables if they already don't exist
    conn.execute('CREATE TABLE IF NOT EXISTS tutors (email TEXT, name TEXT, status INTEGER,shift_cap '
                 'INTEGER, thisblockLA INTEGER, nextblockLA INTEGER, indivtutor INTEGER, PRIMARY KEY (email))')
    print("Tutor Table created successfully")

    conn.execute('CREATE TABLE IF NOT EXISTS admins (name TEXT, email TEXT)')
    print("Admins table created successfully")

    conn.execute('CREATE TABLE IF NOT EXISTS disciplines(name TEXT, available_shifts TEXT)')
    print("Disciplines table was created successfully")

    conn.execute('CREATE TABLE IF NOT EXISTS masterSchedule(shiftNumber Integer, math TEXT, '
                 'cs TEXT, econ TEXT, physics TEXT, chbc TEXT)')
    print("Master Schedule table was created successfully")
    # close connection to database
    conn.close()


# create the indidivual discipline tables
# Function to create new discipline tables in the future
def add_new_discipline(discipline_name):
    conn = sqlite3.connect('database.db')
    sql_query = 'CREATE TABLE IF NOT EXISTS ' + discipline_name + '(shift_number INTEGER, available_tutors TEXT)'
    conn.execute(sql_query)
    print(discipline_name + " Table created successfully")

    # close connection to database
    conn.close()


# Function to take in discipline list and create all of the disciplines
def create_discipline_tables(discipline_list):
    # Loops through discipline list to create a table for each discipline
    for discipline in discipline_list:
        add_new_discipline(discipline)


# function that will add tutors to the tutorTable
def add_tutor(name, email):
    name = name
    email = email
    status = 0
    shift_cap = 0
    this_block_la = 0
    next_block_la = 0
    indivtutor = 0
    try:
        with sql.connect("database.db") as con:
            cur = con.cursor()
            cur.execute('INSERT INTO tutors (email, name, status, '
                        'shift_cap, thisblockLA, nextblockLA, indivtutor) VALUES(?, ?, ?, ?, ?, ?, ?)'
                        '', (email, name, status, shift_cap, this_block_la, next_block_la, indivtutor))
            con.commit()
            msg = "Tutor successfully added"
    except:
        con.rollback()
        msg = "error in insert operation"
    finally:
        con.close()
    print(msg)


# function that will delete tutors
# Not working properly
def delete_tutor(email):
    try:
        with sql.connect("database.db") as con:
            cur = con.cursor()
            # get the row whose email matches
            sql_search_query = 'SELECT * FROM tutors WHERE email = ' + email
            cur.execute(sql_search_query)
            record = cur.fetchone()
            print(record)

            # delete the row whose email matches
            sql_delete_query = 'DELETE FROM tutors WHERE email = ' + email
            cur.execute(sql_delete_query)
            con.commit()

            # verify deletion was successful
            cur.execute(sql_search_query)
            records = cur.fetchall()
            if len(records) == 0:
                msg = "Tutor deleted successfully"
    except:
        con.rollback()
        msg = "error in deletion operation"
    finally:
        con.close()
    print(msg)


# function that will add rows to the adminTable
def add_admin(name, email):
    name = name
    email = email
    try:
        with sql.connect("database.db") as con:
            cur = con.cursor()
            cur.execute('INSERT INTO admins (name, email) VALUES(?, ?)', (name, email))
            con.commit()
            msg = "Admin successfully added"
    except:
        con.rollback()
        msg = "error in insert operation"
    finally:
        con.close()
    print(msg)


# function that will add rows to the discipline table
def add_disciplines(subject, shifts):
    try:
        with sql.connect("database.db") as con:
            cur = con.cursor()
            cur.execute('INSERT INTO disciplines (name, available_shifts) VALUES(?, ?)', (subject, shifts))
            con.commit()
            msg = "Disciplines successfully added"
    except:
        con.rollback()
        msg = "error in insert operation"
    finally:
        con.close()
    print(msg)


# function to add rows to a specific discipline table
def add_shifts(discipline, shift_number, available_tutors):
    try:
        with sql.connect("database.db") as con:
            cur = con.cursor()
            sql_query = 'INSERT INTO' + discipline + '(shift_number, available_tutors' + '(' + shift_number + ', ' + available_tutors + ')'
            cur.execute(sql_query)
            con.commit()
            msg = "Discipline shifts successfully added"
    except:
        con.rollback()
        msg = "error in insert operation"
    finally:
        con.close()
    print(msg)


# add rows to the master schedule
def add_master_schedule(shift_number ):
    print(shift_number)


# clears every row in the master schedule
def clear_table(table):
    try:
        with sql.connect("database.db") as con:
            cur = con.cursor()
            sql_query = 'DELETE FROM ' + table
            cur.execute(sql_query)
            con.commit()
            msg = table + " successfully cleared"
    except:
        con.rollback()
        msg = "error in clearing operation"
    finally:
        con.close()
    print(msg)


# Functions that will be used to update different aspects of the user
# Function that will update the user's status
def update_status(user):
    try:
        with sql.connect("database.db") as con:
            cur = con.cursor()
            sql_update_query = 'UPDATE tutors SET status = '
            cur.execute(sql_update_query)
            con.commit()
            msg = "Tutor status successfully updated"
    except:
        con.rollback()
        msg = "error in update operation"
    finally:
        con.close()
    print(msg)


# Read information from the tutor table
def get_all_user_info():
    try:
        # code to fetch data from the database
        con = sql.connect("database.db")
        con.row_factory = sql.Row

        cur = con.cursor()
        cur.execute("select * from tutors")

        rows = cur.fetchall()

        print("\nPrinting each row")
        count = 0
        for row in rows:
            print("Tutor " + str(count))
            print("Email = ", row[0], )
            print("Name = ", row[1])
            count = count + 1
    except:
        print("Error reading data from MySQL table")
    finally:
        con.close()


# Function to get the information from a single user
def get_single_user_info(user):



if __name__ == '__main__':
    discipline_list = ["CS", "Math", "Econ", "Physics", "CHBC"]

    #create tables
    create_tables()
    #create discipline tables
    create_discipline_tables(discipline_list)
    #add_tutor

    for person in discipline_list:
        add_tutor(person, person)
    #get the user's info
    get_all_user_info()
    get_single_user_info()
    clear_table("tutors")
    get_all_user_info()


# @app.route("/")
# def hello_world():
#     print('running server')
#     return "<p>Hello, world!</p>"
#
#
# if __name__ == '__main__':
#     app.run(debug=True)
