import sqlite3
# from flask import current_app, g
from flask import Flask
import sqlite3 as sql

app = Flask(__name__)

# the database file has:
    # 1. the creation of tables -> Complete
    # create_master_schedule()
    # add_new_discipline_table()
    # create_discipline_tables()
    # create_tables()
# 2. The insertion of new rows into the tables-> Complete
    # add_tutor()
    # add_superuser()
    # add_admin()
    # add_disciplines()
    # add_shifts()
    # add_to_master_schedule()
# 3. The updating of tables should new information be added ex. more disciplines -> Complete
    # create_new_master_schedule()
# 4. The deletion of rows from tables -> Complete
    # delete_tutors()
    # delete_admins()
    # delete_superusers()
    # clear_table()
# 5. The deletion of tables should we need to make new tables -> Complete
    # delete_table()
# 6. The retrieval of data from the tables-> Complete
    # get_single_tutor_info()
    # get_discipline_shift()
    # get_master_schedule_info()
# 7. The ability to check if a user exits in the database -> Complete
    # check_user()
# 8. The updating of rows into tables ->Incomplete
    # update_tutor_status()
    # update_shift_capacity()       
    # update_this_block_LA()        
    # update_next_block_LA()        
    # update_indiv_tutor()          
    # update_discipline_shifts()    X
    # update_master_schedule()      X


# function to create the master_schedule
def create_master_schedule(all_disciplines):
    conn = sqlite3.connect('database.db')
    sql_query = 'CREATE TABLE IF NOT EXISTS master_schedule(shift_number INTEGER, '
    for index, discipline in enumerate(all_disciplines):
        if index != len(all_disciplines) - 1:
            sql_query = sql_query + discipline + ' TEXT, '
        elif index == len(all_disciplines) - 1:
            sql_query = sql_query + discipline + ' TEXT '
    sql_query = sql_query + ')'
    conn.execute(sql_query)
    print("Master Schedule table was created successfully")
    conn.close()


# create the individual discipline tables
# Function to create new discipline tables in the future
def add_new_discipline_table(discipline_name):
    conn = sqlite3.connect('database.db')
    sql_query = 'CREATE TABLE IF NOT EXISTS ' + discipline_name + '(shift_number INTEGER, available_tutors TEXT)'
    conn.execute(sql_query)
    print(discipline_name + " Table created successfully")
    # close connection to database
    conn.close()


# Function to take in discipline list and create all the disciplines
def create_discipline_tables(all_disciplines):
    # Loops through discipline list to create a table for each discipline
    for discipline in all_disciplines:
        add_new_discipline_table(discipline)


# Function to create the tables
def create_tables(all_disciplines):
    # create a database
    conn = sqlite3.connect('database.db')
    print("Opened database successfully")

    # create the tables if they already don't exist
    conn.execute('CREATE TABLE IF NOT EXISTS superuser (email TEXT, name TEXT)')
    print("superuser Table created successfully")

    conn.execute('CREATE TABLE IF NOT EXISTS tutors (email TEXT, name TEXT, status INTEGER,shift_capacity '
                 'INTEGER, thisblockLA INTEGER, nextblockLA INTEGER, indivtutor INTEGER, PRIMARY KEY (email))')
    print("Tutor Table created successfully")

    conn.execute('CREATE TABLE IF NOT EXISTS admins (name TEXT, email TEXT)')
    print("Admins table created successfully")

    conn.execute('CREATE TABLE IF NOT EXISTS disciplines(name TEXT, available_shifts TEXT)')
    print("Disciplines table was created successfully")
    # close connection to database
    conn.close()
    create_discipline_tables(all_disciplines)
    create_master_schedule(all_disciplines)


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
                        'shift_capacity, thisblockLA, nextblockLA, indivtutor) VALUES(?, ?, ?, ?, ?, ?, ?)'
                        '', (email, name, status, shift_cap, this_block_la, next_block_la, indivtutor))
            con.commit()
            msg = "Tutor successfully added"
    except:
        con.rollback()
        msg = "error in insert operation"
    finally:
        con.close()
    print(msg)


# function to add superusers
def add_superuser(email, name):
    try:
        with sql.connect("database.db") as con:
            cur = con.cursor()
            cur.execute('INSERT INTO superuser (email, name) VALUES(?, ?)', (email, name))
            con.commit()
            msg = "Superuser successfully added"
    except:
        con.rollback()
        msg = "error in insert operation"
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
            sql_query = 'INSERT INTO ' + discipline + '(shift_number, available_tutors) VALUES (?, ?)'

            print(sql_query)
            cur.execute(sql_query, (shift_number, available_tutors))
            con.commit()
            msg = "Discipline shifts successfully added"
    except:
        con.rollback()
        msg = "error in insert operation"
    finally:
        con.close()
    print(msg)


# add rows to the master schedule
# take in list of shift assignments and then return the finished schedule
def add_to_master_schedule(shift_number, all_disciplines, assignments):
    try:
        with sql.connect("database.db") as con:
            cur = con.cursor()
            t_list = (shift_number,)
            values = "VALUES(?, "
            sql_query = 'INSERT INTO master_schedule(shift_number, '
            for index, tutor in enumerate(assignments):
                t_list = t_list + (tutor,)
                if index != len(assignments) - 1:
                    values = values + "?, "
                    sql_query = sql_query + all_disciplines[index] + ", "
                else:
                    values = values + "?)"
                    sql_query = sql_query + all_disciplines[index] + ") "
            sql_query = sql_query + values
            print(sql_query)
            print(t_list)
            cur.execute(sql_query, t_list)
            con.commit()
            msg = "Master Schedule altered successfully added"
    except:
        con.rollback()
        msg = "error in insert operation"
    finally:
        con.close()
    print(msg)


# update the master schedule after the discipline list has been updated
# drops the old master schedule and creates a new one
def create_new_master_schedule(all_disciplines):
    conn = sqlite3.connect('database.db')
    print("Opened database successfully")
    conn.execute('DROP TABLE master_schedule')
    create_master_schedule(all_disciplines)
    print("New table has been made")
    conn.close()


# function that will delete tutors
# Not working properly
def delete_tutors(table, email):
    try:
        with sql.connect("database.db") as con:
            cur = con.cursor()
            # delete the row whose email matches
            print("step 1 secure")
            cur.execute('DELETE FROM tutors WHERE email = ?', (email,))
            print("step 2 secure")
            con.commit()
            msg = "Tutor deleted successfully"
    except:
        con.rollback()
        msg = "error in deletion operation"
    finally:
        con.close()
    print(msg)


# function that will delete tutors
def delete_admins(email):
    try:
        with sql.connect("database.db") as con:
            cur = con.cursor()
            # delete the row whose email matches
            cur.execute('DELETE FROM admins WHERE email = ?', (email,))
            con.commit()
            msg = "Admin deleted successfully"
    except:
        con.rollback()
        msg = "error in deletion operation"
    finally:
        con.close()
    print(msg)


# function that will delete tutors
def delete_superusers(email):
    try:
        with sql.connect("database.db") as con:
            cur = con.cursor()
            # delete the row whose email matches
            cur.execute('DELETE FROM superuser WHERE email = ?', (email,))
            con.commit()
            msg = "superuser deleted successfully"
    except:
        con.rollback()
        msg = "error in deletion operation"
    finally:
        con.close()
    print(msg)


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


# function to delete table
def delete_table(table):
    conn = sqlite3.connect('database.db')
    print("Opened database successfully")
    conn.execute('DROP TABLE ' + table)
    conn.close()


# Function to get the information from a single user
def get_single_tutor_info(user):
    try:
        # code to fetch data from the database
        with sql.connect("database.db") as con:
            cur = con.cursor()
            # get the row whose email matches
            sql_search_query = 'SELECT * FROM tutors WHERE email = ?'
            cur.execute(sql_search_query, (user,))
            record = cur.fetchone()
            print(record)
    except:
        con.rollback()
        print("Error reading data from MySQL table")
    finally:
        con.close()


# Function to retrieve the people who are available for a particular shift
def get_discipline_shift(discipline, shift_number):
    try:
        # code to fetch data from the database
        with sql.connect("database.db") as con:
            cur = con.cursor()
            # get the row whose email matches
            sql_search_query = 'SELECT * FROM '
            sql_search_query = sql_search_query + discipline
            sql_search_query = sql_search_query + ' WHERE shift_number = ?'
            print(sql_search_query)
            cur.execute(sql_search_query, (shift_number,))
            record = cur.fetchone()
            print(record)
    except:
        con.rollback()
        print("Error reading data from MySQL table")
    finally:
        con.close()


# Function to retrieve the assignments for a particular shift
def get_master_schedule_info(shift_number):
    try:
        # code to fetch data from the database
        with sql.connect("database.db") as con:
            cur = con.cursor()
            # get the row whose email matches
            sql_search_query = 'SELECT * FROM master_schedule WHERE shift_number = ?'
            print(sql_search_query)
            cur.execute(sql_search_query, (shift_number,))
            record = cur.fetchone()
            print(record)
    except:
        con.rollback()
        print("Error reading data from MySQL table")
    finally:
        con.close()


# function to check if the user is in the system
# Will return a boolean based on answer as well as the table the user has access to
def check_user(user):
    try:
        # code to fetch data from the database
        with sql.connect("database.db") as con:
            con.row_factory = sql.Row

            cur = con.cursor()

            # Checks to see if the user is a superuser
            cur.execute("select * from superuser")
            rows = cur.fetchall()
            for row in rows:
                if row[0] == user:

                    print("User is a Superuser")
                    con.close()
                    return True, "superuser"

            # Checks to see if the user is an admin
            cur.execute("select * from admins")
            rows = cur.fetchall()
            for row in rows:
                if row[0] == user:
                    print("User is an Administrator")
                    con.close()
                    return True, "admins"
            # Checks to see if the user is a tutor
            cur.execute("select * from tutors")
            rows = cur.fetchall()
            for row in rows:
                if row[0] == user:
                    con.close()
                    print("User is a Tutor")
                    return True, "tutors"

            return False, "None"
    except:
        con.rollback()
        print("Error reading data from MySQL table")
    finally:
        con.close()


# Functions that will be used to update different aspects of the user
# Tutor columns
    # 0 = email
    # 1 = name
    # 2 = status
    # 3 = shift_capacity
    # 4 = thisblockLA
    # 5 = nextblockLA
    # 6 = indivtutor
# Function that will update the user's status
def update_status(user):
    try:
        with sql.connect("database.db") as con:
            cur = con.cursor()
            sql_select_query = 'SELECT * FROM tutors WHERE email=? '
            cur.execute(sql_select_query, (user,))
            data = cur.fetchone()
            print(data)
            # if the status is active turn it off
            if data[2] == 1:
                # do stuff to update status to 0
                update_query = 'UPDATE tutors SET status = 0 WHERE email = ?'
            # else turn it on
            else:
                # do stuff to turn it on
                update_query = 'UPDATE tutors SET status = 1 WHERE email = ?'
            cur.execute(update_query, (user,))
            msg = "Tutor status successfully updated"
    except:
        con.rollback()
        msg = "error in update operation"
    finally:
        con.close()
    print(msg)


# Function to update the user's shift capacity
def update_shift_capacity(user, new_capacity):
    try:
        with sql.connect("database.db") as con:
            cur = con.cursor()
            sql_select_query = 'SELECT * FROM tutors WHERE email=? '
            cur.execute(sql_select_query, (user,))
            data = cur.fetchone()
            print(data)
            # do stuff to update status to 0
            update_query = 'UPDATE tutors SET shift_capacity =' + str(new_capacity)
            update_query = update_query + ' WHERE email = ?'
            cur.execute(update_query, (user,))
            msg = "Tutor shift capacity successfully updated"
    except:
        con.rollback()
        msg = "error in update operation"
    finally:
        con.close()
    print(msg)


# Function to update the user's LA status during the current block
def update_this_block_la(user):
    try:
        with sql.connect("database.db") as con:
            cur = con.cursor()
            sql_select_query = 'SELECT * FROM tutors WHERE email=? '
            cur.execute(sql_select_query, (user,))
            data = cur.fetchone()
            print(data)
            # if the la status is active turn it off
            if data[4] == 1:
                # do stuff to update status to 0
                update_query = 'UPDATE tutors SET thisblockLA = 0 WHERE email = ?'
            # else turn it on
            else:
                # do stuff to turn it on
                update_query = 'UPDATE tutors SET thisblockLA = 1 WHERE email = ?'
            cur.execute(update_query, (user,))
            msg = "Tutor thisblockLA successfully updated"
    except:
        con.rollback()
        msg = "error in update operation"
    finally:
        con.close()
    print(msg)


# Function to update the user's LA status during the next block
def update_next_block_la(user):
    try:
        with sql.connect("database.db") as con:
            cur = con.cursor()
            sql_select_query = 'SELECT * FROM tutors WHERE email=? '
            cur.execute(sql_select_query, (user,))
            data = cur.fetchone()
            print(data)
            # if the status is active turn it off
            if data[5] == 1:
                # do stuff to update status to 0
                update_query = 'UPDATE tutors SET nextblockLA = 0 WHERE email = ?'
            # else turn it on
            else:
                # do stuff to turn it on
                update_query = 'UPDATE tutors SET nextblockLA = 1 WHERE email = ?'
            cur.execute(update_query, (user,))
            msg = "Tutor nextblockLA successfully updated"
    except:
        con.rollback()
        msg = "error in update operation"
    finally:
        con.close()
    print(msg)


# Function to update whether the tutor is doing indiv tutoring or not
def update_indiv_tutor(user):
    try:
        with sql.connect("database.db") as con:
            cur = con.cursor()
            sql_select_query = 'SELECT * FROM tutors WHERE email=? '
            cur.execute(sql_select_query, (user,))
            data = cur.fetchone()
            print(data)
            # if the status is active turn it off
            if data[6] == 1:
                # do stuff to update status to 0
                update_query = 'UPDATE tutors SET indivtutor = 0 WHERE email = ?'
            # else turn it on
            else:
                # do stuff to turn it on
                update_query = 'UPDATE tutors SET indivtutor = 1 WHERE email = ?'
            cur.execute(update_query, (user,))
            msg = "Tutor indivtutor successfully updated"
    except:
        con.rollback()
        msg = "error in update operation"
    finally:
        con.close()
    print(msg)


# Function to update the shifts of the disciplines
def update_discipline_shifts():
    pass


# Function to update the master schedule
def update_master_schedule():
    pass


if __name__ == '__main__':
    discipline_list = ["CS", "Math", "Econ", "Physics", "CHBC"]
    assigned_list = discipline_list
    create_tables(discipline_list)
    for person in discipline_list:
        add_tutor(person, person)

    update_shift_capacity("Econ", 5)
    get_single_tutor_info("Econ")

    clear_table("tutors")


# Some flask code
# @app.route("/")
# def hello_world():
#     print('running server')
#     return "<p>Hello, world!</p>"
#

# if __name__ == '__main__':
#     app.run(debug=True)
