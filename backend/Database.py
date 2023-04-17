import sqlite3 as sql
import ast


# import datetime
# import time
# The Database file includes:

# 1. the creation of tables
# create_master_schedule(all_disciplines)
# add_new_discipline_table(discipline_name)
# create_discipline_tables(all_disciplines)
# create_tables(all_disciplines)

# 2. The insertion of new rows into the tables
# add_tutor(name, email)
# add_superuser(name, email)
# add_admin(name, email)
# add_discipline(discipline, shifts)
# add_shifts(discipline, shift_number, available_tutors)
# add_to_master_schedule(shift_number, assignments)
# update_master_schedule_single_discipline(shift_number, discipline, new_assignment)
# add_time_window(block, start_time, end_time)
# add_block(block)

# 3. The updating of tables should new information be added ex. more disciplines
# create_new_master_schedule(new_disciplines)

# 4. The deletion of rows from tables
# delete_tutors(email)
# delete_admins(email)
# delete_superusers(email)
# delete_discipline(discipline)
# clear_table(table)
# delete_time_window(block)
# delete_block(block)

# 5. The deletion of tables should we need to make new tables
# delete_table(table)

# 6. The retrieval of data from the tables
# get_single_tutor_info(email)
# get_admin_info(email)
# get_super_user_info(email)
# get_discipline_shift(discipline_number)
# get_master_schedule_info(discipline_number)
# get_roster()
# get_disciplines()
# get_abbreviations()
# get_discipline_from_abbreviation(discipline)
# get_discipline_shifts_offered(discipline)
# get_discipline_abbreviation(discipline)
# get_time_window(block)
# get_block()

# 7. The ability to check if elements in the database
# check_user(email)
# check_abbreviation(abbreviation)

# 8. The updating of rows in tables
# update_tutor_status(email)
# update_shift_capacity(email, new_shift_capacity)
# update_tutoring_disciplines(email, disciplines)
# update_this_block_la(email)
# update_next_block_la(email)
# update_individual_tutor(email)
# update_absence(email)
# update_discipline_shifts(discipline, shift_number, new_available_tutors)
# update_master_schedule(shift_number,all_disciplines, new_assignments)
# update_time_window(block, start_time, end_time)
# update_discipline_abbreviation(discipline, abbreviation)

# 9 Other functions to help with the basic keeping of the database
# reset_absence(email)
# reconfigure_database(new_disciplines_list)
# list_all_tables(exceptions)
# check_time(current_time, block)
# clear_absences()
# reboot_database(all_disciplines, exceptions)


# Function to create the master_schedule
def create_master_schedule(all_disciplines):
    conn = sql.connect('database.db')
    sql_query = 'CREATE TABLE IF NOT EXISTS master_schedule(shift_number INTEGER, '
    for discipline in all_disciplines:
        sql_query = sql_query + discipline + ' TEXT, '
    sql_query = sql_query + 'PRIMARY KEY (shift_number))'
    conn.execute(sql_query)
    conn.close()


# Function to create new discipline tables if they don't already exist
def add_new_discipline_table(discipline_name):
    conn = sql.connect('database.db')
    sql_query = 'CREATE TABLE IF NOT EXISTS ' + discipline_name + '(shift_number INTEGER, available_tutors TEXT,' \
                                                                  ' PRIMARY KEY (shift_number))'
    conn.execute(sql_query)
    conn.close()


# Function to take in discipline list and create all the disciplines tables
def create_discipline_tables(all_disciplines):
    for discipline in all_disciplines:
        empty_list = []
        add_new_discipline_table(discipline)
        add_discipline(discipline, '    ', empty_list)


# Function to create the tables
def create_tables(all_disciplines):
    # create a database
    create_master_schedule(all_disciplines)
    # create a master_schedule shift availability

    conn = sql.connect('database.db')

    # create superuser table
    conn.execute('CREATE TABLE IF NOT EXISTS superuser(email TEXT, name TEXT, PRIMARY KEY (email))')
    # create the tutors table
    conn.execute('CREATE TABLE IF NOT EXISTS tutors(email TEXT, name TEXT, status INTEGER,shift_capacity '
                 'INTEGER, tutoring_disciplines TEXT, this_block_la INTEGER, next_block_la INTEGER, '
                 'individual_tutor INTEGER, favorite_shifts TEXT, absence INTEGER, PRIMARY KEY (email))')
    # create the admins table
    conn.execute('CREATE TABLE IF NOT EXISTS admins(email TEXT, name TEXT, PRIMARY KEY (email)) ')
    # create the disciplines table
    conn.execute('CREATE TABLE IF NOT EXISTS disciplines(discipline TEXT, abbreviation TEXT, available_shifts TEXT,'
                 ' PRIMARY KEY (discipline))')
    # create the times table
    conn.execute('CREATE TABLE IF NOT EXISTS time_window(block INTEGER, start_time BIGINT, end_time BIGINT,'
                 'PRIMARY KEY (block))')

    # create the block table
    conn.execute('CREATE TABLE IF NOT EXISTS block_number(block INTEGER, PRIMARY KEY(block))')
    # close connection to database
    conn.close()
    # creates the remaining tables (disciplines, and master_schedule)
    create_discipline_tables(all_disciplines)


# Function that will add tutors to the tutors table
# if the tutor already exists than it will check if the name matches
# if it doesn't then it will update the name to the new one, else nothing happens
def add_tutor(name, email):
    status = 0
    shift_cap = 0
    this_block_la = 0
    next_block_la = 0
    individual_tutor = 0
    tutoring_disciplines = '[]'
    favorite_shifts = '[[],[],[]]'
    absence = 0
    try:
        with sql.connect("database.db") as conn:
            cur = conn.cursor()
            sql_select_query = 'SELECT * FROM tutors WHERE email=? '
            cur.execute(sql_select_query, (email,))
            data = cur.fetchone()

            # If the user doesn't exist add a new user
            if data is None:
                cur.execute('INSERT OR IGNORE INTO tutors(email, name, status, shift_capacity, tutoring_disciplines, '
                            'this_block_la, next_block_la, individual_tutor, favorite_shifts, absence) '
                            'VALUES(?, ?, ?, ?, ?, ?, ?,?, ?, ?)',
                            (email, name, status, shift_cap, tutoring_disciplines, this_block_la,
                             next_block_la, individual_tutor, favorite_shifts, absence))
            # If the user is being put into the roster and the name
            elif data[1] == name:
                email, name, status, shift_cap, tutoring_disciplines, this_block_la, next_block_la, individual_tutor, \
                    favorite_shifts, absence = data
                delete_query = 'DELETE FROM tutors WHERE email = ?'
                cur.execute(delete_query, (email,))
                cur.execute('INSERT OR IGNORE INTO tutors(email, name, status, shift_capacity, tutoring_disciplines, '
                            'this_block_la, next_block_la, individual_tutor, favorite_shifts, absence) '
                            'VALUES(?, ?, ?, ?, ?, ?, ?,?, ?, ?)',
                            (email, name, status, shift_cap, tutoring_disciplines, this_block_la, next_block_la,
                             individual_tutor, favorite_shifts, absence))
            # else update the name of the user
            else:
                update_query = 'UPDATE tutors SET name = ? WHERE email = ?'
                cur.execute(update_query, (name, email))

                sql_select_query = 'SELECT * FROM tutors WHERE email=? '
                cur.execute(sql_select_query, (email,))
                data = cur.fetchone()
                print(data)
                email, name, status, shift_cap, tutoring_disciplines, this_block_la, next_block_la, individual_tutor, \
                    favorite_shifts, absence = data
                delete_query = 'DELETE FROM tutors WHERE email = ?'
                cur.execute(delete_query, (email,))
                cur.execute('INSERT OR IGNORE INTO tutors(email, name, status, shift_capacity, tutoring_disciplines, '
                            'this_block_la, next_block_la, individual_tutor, favorite_shifts, absence) '
                            'VALUES(?, ?, ?, ?, ?, ?, ?,?, ?, ?)',
                            (email, name, status, shift_cap, tutoring_disciplines, this_block_la, next_block_la,
                             individual_tutor, favorite_shifts, absence))
            conn.commit()
    except:
        conn.rollback()
    finally:
        conn.close()


# Function to add superusers
def add_superuser(name, email):
    try:
        with sql.connect("database.db") as conn:
            cur = conn.cursor()
            cur.execute('INSERT OR IGNORE INTO superuser (email, name) VALUES(?, ?)', (email, name))
            conn.commit()
    except:
        conn.rollback()
    finally:
        conn.close()


# Function to add admins
def add_admin(name, email):
    try:
        with sql.connect("database.db") as conn:
            cur = conn.cursor()
            cur.execute('INSERT OR IGNORE INTO admins (email, name) VALUES(?, ?)', (email, name))
            conn.commit()
    except:
        conn.rollback()
    finally:
        conn.close()


# Function that will add rows to the discipline table
def add_discipline(discipline, abbreviation, shifts):
    try:
        with sql.connect("database.db") as conn:
            cur = conn.cursor()
            sql_select_query = 'SELECT * FROM disciplines WHERE discipline=? '
            cur.execute(sql_select_query, (discipline,))
            data = cur.fetchone()
            # If the user doesn't exist add the discipline
            if data is None:
                cur.execute('INSERT OR IGNORE INTO disciplines (discipline, abbreviation,  available_shifts) '
                            'VALUES(?, ?, ?)', (discipline, abbreviation, str(shifts)))
                conn.commit()

            # else update
            else:
                update_query = 'UPDATE disciplines SET abbreviation = ?, available_shifts = ? WHERE discipline = ?'
                cur.execute(update_query, (abbreviation, str(shifts), discipline))
                conn.commit()
    except:
        conn.rollback()
    finally:
        conn.close()
        add_new_discipline_table(discipline)
        col_amount = len(get_master_schedule_columns())
        discipline_count = len(get_disciplines())
        if col_amount != discipline_count and col_amount < discipline_count:
            reconfigure_when_adding()


# Function to add rows to a specific discipline table
def add_shifts(discipline, shift_number, available_tutors):
    try:
        with sql.connect("database.db") as conn:
            cur = conn.cursor()
            sql_query = 'INSERT OR IGNORE INTO ' + discipline + ' (shift_number, available_tutors) VALUES (?, ?)'
            cur.execute(sql_query, (shift_number, str(available_tutors)))
            conn.commit()
    except:
        conn.rollback()
    finally:
        conn.close()


# Function to add rows to the master schedule table by shift and the tutors assignment to each discipline
def add_to_master_schedule(shift_number, all_disciplines, assignments):
    try:
        with sql.connect("database.db") as conn:
            cur = conn.cursor()
            t_list = (shift_number,)
            values = "VALUES(?, "
            sql_query = 'INSERT OR IGNORE INTO master_schedule(shift_number, '
            for index, tutor in enumerate(assignments):
                t_list = t_list + (tutor,)
                if index != len(assignments) - 1:
                    values = values + "?, "
                    sql_query = sql_query + all_disciplines[index] + ", "
                else:
                    values = values + "?)"
                    sql_query = sql_query + all_disciplines[index] + ") "
            sql_query = sql_query + values
            cur.execute(sql_query, t_list)
            conn.commit()
    except:
        conn.rollback()
    finally:
        conn.close()


# Function to add Time window
def add_time_window(block, start_date, end_date):
    try:
        with sql.connect("database.db") as conn:

            cur = conn.cursor()
            select_query = 'SELECT * FROM time_window WHERE block = ?'
            cur.execute(select_query, (block,))
            data = cur.fetchone()
            if data is None:
                sql_query = 'INSERT OR IGNORE INTO time_window(block, start_time, end_time) VALUES (?, ?, ?)'
                cur.execute(sql_query, (block, start_date, end_date))
            else:
                update_query = 'UPDATE time_window SET start_time = ?, end_time = ?  WHERE block = ?'
                cur.execute(update_query, (start_date, end_date, block))
            conn.commit()
    except:
        conn.rollback()
    finally:
        conn.close()


# Function to add a block
def add_block(block):
    try:
        with sql.connect("database.db") as conn:
            cur = conn.cursor()
            sql_select_query = 'SELECT * FROM block_number'
            cur.execute(sql_select_query)
            data = cur.fetchone()
            # If the user doesn't exist add the discipline
            if data is None:
                sql_query = 'INSERT OR IGNORE INTO block_number(block) VALUES (?)'
                cur.execute(sql_query, (block,))
                print('There was no value')
            else:
                sql_clear_query = 'DELETE FROM block_number'
                cur.execute(sql_clear_query)
                sql_query = 'INSERT OR IGNORE INTO block_number(block) VALUES (?)'
                cur.execute(sql_query, (block,))
                print('there was a value')

            conn.commit()
    except:
        conn.rollback()
    finally:
        conn.close()


# update the master schedule after the discipline list has been updated
# drops the old master schedule and creates a new one
def create_new_master_schedule(new_disciplines):
    conn = sql.connect('database.db')
    conn.execute('DROP TABLE master_schedule')
    create_master_schedule(new_disciplines)
    conn.close()


# function that will delete tutors
def delete_tutors(email):
    try:
        with sql.connect("database.db") as conn:
            cur = conn.cursor()
            cur.execute('DELETE FROM tutors WHERE email = ?', (email,))
            conn.commit()
    except:
        conn.rollback()
    finally:
        conn.close()


# function that will delete admins
def delete_admins(email):
    try:
        with sql.connect("database.db") as conn:
            cur = conn.cursor()
            cur.execute('DELETE FROM admins WHERE email = ?', (email,))
            conn.commit()
    except:
        conn.rollback()
    finally:
        conn.close()


# function that will delete superusers
def delete_superusers(email):
    try:
        with sql.connect("database.db") as conn:
            cur = conn.cursor()
            cur.execute('DELETE FROM superuser WHERE email = ?', (email,))
            conn.commit()
    except:
        conn.rollback()
    finally:
        conn.close()


# Function to delete a discipline from the disciplines table
def delete_discipline(discipline):
    try:
        with sql.connect("database.db") as conn:
            cur = conn.cursor()
            cur.execute('DELETE FROM disciplines WHERE discipline = ?', (discipline,))
            conn.commit()
    except:
        conn.rollback()
    finally:
        conn.close()
        wipe(discipline)


# clears every row in a table
def clear_table(table):
    try:
        with sql.connect("database.db") as conn:
            cur = conn.cursor()
            sql_query = 'DELETE FROM ' + table
            cur.execute(sql_query)
            conn.commit()
    except:
        conn.rollback()
    finally:
        conn.close()


# function to delete Tables
def delete_table(table):
    conn = sql.connect('database.db')
    conn.execute('DROP TABLE ' + table)
    conn.close()


# Function to delete certain block's time window
def delete_time_window(block):
    try:
        with sql.connect("database.db") as conn:
            cur = conn.cursor()
            cur.execute('DELETE FROM time_window WHERE block = ?', (block,))
            conn.commit()
    except:
        conn.rollback()
    finally:
        conn.close()


# Function to delete block from block_number table
def delete_block(block):
    try:
        with sql.connect("database.db") as conn:
            cur = conn.cursor()
            cur.execute('DELETE FROM block_number WHERE block = ?', (block,))
            conn.commit()
    except:
        conn.rollback()
    finally:
        conn.close()


# Function to get all the information from a single tutor user
# Returns the information about the user requested
def get_single_tutor_info(email):
    try:
        with sql.connect("database.db") as conn:
            cur = conn.cursor()
            sql_search_query = 'SELECT * FROM tutors WHERE email = ?'
            cur.execute(sql_search_query, (email,))
            record = cur.fetchone()
            return record
    except:
        conn.rollback()
    finally:
        conn.close()


# Function to get the information from a single admin user
# Returns the information about the user requested
def get_admin_info(email):
    try:
        with sql.connect("database.db") as conn:
            cur = conn.cursor()
            sql_search_query = 'SELECT * FROM admins WHERE email = ?'
            cur.execute(sql_search_query, (email,))
            record = cur.fetchone()
            return record
    except:
        conn.rollback()
    finally:
        conn.close()


# Function to get the information from a single superuser user
# Returns the information about the user requested
def get_superuser_info(email):
    try:
        with sql.connect("database.db") as conn:
            cur = conn.cursor()
            sql_search_query = 'SELECT * FROM superuser WHERE email = ?'
            cur.execute(sql_search_query, (email,))
            record = cur.fetchone()
            return record
    except:
        conn.rollback()
    finally:
        conn.close()


# Function to retrieve the people who are available for a particular shift
# Returns the available tutors for that discipline on that shift
def get_discipline_shift(discipline, shift_number):
    try:
        with sql.connect("database.db") as con:
            cur = con.cursor()
            sql_search_query = 'SELECT * FROM ' + discipline + ' WHERE shift_number = ?'
            cur.execute(sql_search_query, (shift_number,))
            record = cur.fetchone()
            _, res = record

            return res
    except:
        con.rollback()
    finally:
        con.close()


# Function to get all the content of a table
def get_table_contents(table):
    try:
        with sql.connect("database.db") as conn:
            cur = conn.cursor()
            sql_search_query = 'SELECT * FROM ' + table
            cur.execute(sql_search_query)
            record = cur.fetchall()
            return list(record)
    except:
        conn.rollback()
    finally:
        conn.close()


# Function to retrieve the assignments for a particular shift
def get_master_schedule_info(shift_number):
    try:
        with sql.connect("database.db") as conn:
            cur = conn.cursor()
            sql_search_query = 'SELECT * FROM master_schedule WHERE shift_number = ?'
            cur.execute(sql_search_query, (shift_number,))
            record = cur.fetchone()
            return list(record[1:])
    except:
        conn.rollback()
    finally:
        conn.close()


# Function that will get the tutors in the system along with their information
def get_roster():
    try:
        with sql.connect("database.db") as conn:
            roster_list = []
            cur = conn.cursor()
            sql_search_query = 'SELECT * FROM tutors'
            cur.execute(sql_search_query)
            records = cur.fetchall()
            for record in records:
                roster_list.append(record)
            return roster_list
    except:
        conn.rollback()
    finally:
        conn.close()


# Function to get the roster of admins
def get_admin_roster():
    try:
        with sql.connect("database.db") as conn:
            roster_list = []
            cur = conn.cursor()
            sql_search_query = 'SELECT * FROM admins'
            cur.execute(sql_search_query)
            records = cur.fetchall()
            for record in records:
                roster_list.append(record)
            return roster_list
    except:
        conn.rollback()
    finally:
        conn.close()


# Function that will retrieve all existing disciplines
def get_disciplines():
    try:
        with sql.connect("database.db") as conn:
            disciplines = []
            cur = conn.cursor()
            sql_search_query = 'SELECT * FROM disciplines'
            cur.execute(sql_search_query)
            records = cur.fetchall()
            for record in records:
                disciplines.append(record[0])
            return disciplines
    except:
        conn.rollback()
    finally:
        conn.close()


# Function that will retrieve all existing abbreviations
def get_abbreviations():
    try:
        with sql.connect("database.db") as conn:
            abbreviations_list = []
            cur = conn.cursor()
            sql_search_query = 'SELECT * FROM disciplines'
            cur.execute(sql_search_query)
            records = cur.fetchall()
            for record in records:
                abbreviations_list.append(record[1])
            return abbreviations_list
    except:
        conn.rollback()
    finally:
        conn.close()


# Function to return discipline names from abbreviations
def get_discipline_from_abbreviation(abbreviation):
    try:
        with sql.connect("database.db") as conn:
            cur = conn.cursor()
            sql_search_query = 'SELECT * FROM disciplines where abbreviation = ?'
            cur.execute(sql_search_query, (abbreviation,))
            record = cur.fetchone()
            return record
    except:
        conn.rollback()
    finally:
        conn.close()


# Function that will return which shifts a particular discipline is available for
def get_discipline_shifts_offered(discipline):
    try:
        with sql.connect("database.db") as conn:
            cur = conn.cursor()
            sql_search_query = 'SELECT * FROM disciplines WHERE discipline = ?'
            cur.execute(sql_search_query, (discipline,))
            record = cur.fetchone()
            return list(record)[2]
    except:
        conn.rollback()
    finally:
        conn.close()


# Function to get the time window of a certain block
def get_time_window(block):
    try:
        with sql.connect("database.db") as conn:
            cur = conn.cursor()
            sql_search_query = 'SELECT * FROM time_window WHERE block = ?'
            cur.execute(sql_search_query, (block,))
            record = cur.fetchone()
            _, start_time, end_time = record
            return start_time, end_time
    except:
        conn.rollback()
    finally:
        conn.close()


# Function to get the discipline abbreviation
def get_discipline_abbreviation(discipline):
    try:
        with sql.connect("database.db") as conn:
            cur = conn.cursor()
            sql_search_query = 'SELECT * FROM disciplines WHERE discipline = ?'
            cur.execute(sql_search_query, (discipline,))
            record = cur.fetchone()
            return record[1]
    except:
        conn.rollback()
    finally:
        conn.close()


# Function to get the column names of the master_schedule
def get_master_schedule_columns():
    if True:
        with sql.connect("database.db") as conn:
            cur = conn.cursor()
            sql_query = 'PRAGMA table_info(master_schedule)'
            cur.execute(sql_query)
            record = cur.fetchall()
            name_list = []
            for column in record:
                number, name, _, _, _, _ = column
                if number != 0:
                    name_list.append(name)
            return name_list


# Function to get the block number
def get_block_number():
    try:
        with sql.connect("database.db") as conn:
            cur = conn.cursor()
            sql_search_query = 'SELECT * FROM block_number'
            cur.execute(sql_search_query)
            record = cur.fetchone()
            return list(record)[0]
    except:
        conn.rollback()
    finally:
        conn.close()


# Function to get a user's preferred shifts
def get_favorite_shifts(user):
    while True:
        with sql.connect("database.db") as conn:
            cur = conn.cursor()
            cur.execute("SELECT * FROM tutors WHERE email = ?", (user,))
            data = cur.fetchone()
            return ast.literal_eval(data[8])


# Function to get a user's preferred shifts
def get_favorite_shifts_high(user):
    favorite_shifts = get_favorite_shifts(user)
    return favorite_shifts[0]


# Function to get a user's preferred shifts
def get_favorite_shifts_med(user):
    favorite_shifts = get_favorite_shifts(user)
    return favorite_shifts[1]


# Function to get a user's preferred shifts
def get_favorite_shifts_low(user):
    favorite_shifts = get_favorite_shifts(user)
    return favorite_shifts[2]


# Function to get a user's absence
def get_absence(user):
    try:
        with sql.connect("database.db") as conn:
            cur = conn.cursor()
            cur.execute("SELECT * FROM tutors WHERE email = ?", (user,))
            data = list(cur.fetchone())
            return data[9]
    except:
        conn.rollback()
    finally:
        conn.close()


# function to check if the user is in the system
# Will return a boolean based on answer as well as the table the user has access to
def check_user(user):
    try:
        with sql.connect("database.db") as conn:
            cur = conn.cursor()
            cur.execute("select * from superuser")
            rows = cur.fetchall()
            for row in rows:
                if row[0] == user:
                    return True, "superuser"

            # Checks to see if the user is an admin
            cur.execute("select * from admins")
            rows = cur.fetchall()
            for row in rows:
                if row[0] == user:
                    return True, "admin"

            # Checks to see if the user is a tutor
            cur.execute("select * from tutors")
            rows = cur.fetchall()
            for row in rows:
                if row[0] == user:
                    return True, "tutor"
            return False, "None"
    except:
        conn.rollback()
    finally:
        conn.close()


# Function to see if an abbreviation exists
def check_abbreviation(abbreviation):
    abbreviation_list = get_abbreviations()
    if abbreviation in abbreviation_list:
        return True
    return False


# Functions that will be used to update different Tutor columns
# 0 = email
# 1 = name
# 2 = status
# 3 = shift_capacity
# 4 = tutoring_disciplines
# 5 = this_block_la
# 6 = next_block_la
# 7 = individual_tutor
# 8 = favorite_shifts
# 9 = absence
# Function that will update the user's status
def update_status(email):
    try:
        with sql.connect("database.db") as conn:
            cur = conn.cursor()
            sql_select_query = 'SELECT * FROM tutors WHERE email=? '
            cur.execute(sql_select_query, (email,))
            data = cur.fetchone()
            # if the status is active turn it off
            if data[2] == 1:
                # do stuff to update status to 0
                update_query = 'UPDATE tutors SET status = 0 WHERE email = ?'
            # else turn it on
            else:
                # do stuff to turn it on
                update_query = 'UPDATE tutors SET status = 1 WHERE email = ?'
            cur.execute(update_query, (email,))
            conn.commit()
    except:
        conn.rollback()
    finally:
        conn.close()


# Function to update the user's shift capacity
# noinspection PyBroadException
def update_shift_capacity(email, new_capacity):
    try:
        with sql.connect("database.db") as conn:
            cur = conn.cursor()
            # update capacity to desired capacity
            update_query = 'UPDATE tutors SET shift_capacity =' + str(new_capacity)
            update_query = update_query + ' WHERE email = ?'
            cur.execute(update_query, (email,))
            conn.commit()
    except:
        conn.rollback()
    finally:
        conn.close()


# Function to update the user's tutoring disciplines
def update_tutoring_disciplines(email, disciplines):
    try:
        with sql.connect("database.db") as conn:
            cur = conn.cursor()
            update_query = 'UPDATE tutors SET tutoring_disciplines =? WHERE email = ?'
            disciplines = str(disciplines)
            cur.execute(update_query, (disciplines, email))
            conn.commit()
    except:
        conn.rollback()
    finally:
        conn.close()


# Function to update the user's la status during the current block
def update_this_block_la(email):
    try:
        with sql.connect("database.db") as conn:
            cur = conn.cursor()
            sql_select_query = 'SELECT * FROM tutors WHERE email=? '
            cur.execute(sql_select_query, (email,))
            data = cur.fetchone()
            # if the la status is active turn it off
            if data[4] == 1:
                # do stuff to update la status to 0
                update_query = 'UPDATE tutors SET this_block_la = 0 WHERE email = ?'
            # else turn it on
            else:
                # do stuff to turn it on
                update_query = 'UPDATE tutors SET this_block_la = 1 WHERE email = ?'
            cur.execute(update_query, (email,))
            conn.commit()
    except:
        conn.rollback()
    finally:
        conn.close()


# Function to update the user's la status during the next block
def update_next_block_la(email):
    try:
        with sql.connect("database.db") as conn:
            cur = conn.cursor()
            sql_select_query = 'SELECT * FROM tutors WHERE email=? '
            cur.execute(sql_select_query, (email,))
            data = cur.fetchone()
            # if the status is active turn it off
            if data[5] == 1:
                # do stuff to update status to 0
                update_query = 'UPDATE tutors SET next_block_la = 0 WHERE email = ?'
            # else turn it on
            else:
                # do stuff to turn it on
                update_query = 'UPDATE tutors SET next_block_la = 1 WHERE email = ?'
            cur.execute(update_query, (email,))
            conn.commit()
    except:
        conn.rollback()
    finally:
        conn.close()


# Function to update whether the tutor is doing individual tutoring or not
def update_individual_tutor(email):
    try:
        with sql.connect("database.db") as conn:
            cur = conn.cursor()
            sql_select_query = 'SELECT * FROM tutors WHERE email=? '
            cur.execute(sql_select_query, (email,))
            data = cur.fetchone()
            # if the status is active turn it off
            if data[6] == 1:
                # do stuff to update status to 0
                update_query = 'UPDATE tutors SET individual_tutor = 0 WHERE email = ?'
            # else turn it on
            else:
                # do stuff to turn it on
                update_query = 'UPDATE tutors SET individual_tutor = 1 WHERE email = ?'
            cur.execute(update_query, (email,))
            conn.commit()
    except:
        conn.rollback()
    finally:
        conn.close()


# Function to update the favored shifts of a tutor
def update_favorite_shifts(user, new_favorite_shifts):
    try:
        with sql.connect("database.db") as conn:
            cur = conn.cursor()
            update_query = 'UPDATE tutors SET favorite_shifts = ? WHERE email = ?'
            favored_shifts = str(new_favorite_shifts)
            print(favored_shifts)
            cur.execute(update_query, (favored_shifts, user))
            conn.commit()
    except:
        conn.rollback()
    finally:
        conn.close()


# Function to update the user's la status during the current block
def update_absence(email):
    try:
        with sql.connect("database.db") as conn:
            cur = conn.cursor()
            sql_select_query = 'SELECT * FROM tutors WHERE email=? '
            cur.execute(sql_select_query, (email,))
            data = cur.fetchone()
            # if the absence is active turn it off
            if data[9] == 1:
                # update absence to 0
                update_query = 'UPDATE tutors SET absence = 0 WHERE email = ?'
            # else turn it on
            elif data[9] == 0:
                # do stuff to turn it on
                update_query = 'UPDATE tutors SET absence = 1 WHERE email = ?'
            cur.execute(update_query, (email,))
            conn.commit()
    except:
        conn.rollback()
    finally:
        conn.close()


# Function to update the shifts of the disciplines
def update_discipline_shifts(discipline, shift_number, new_available_tutors):
    try:
        with sql.connect("database.db") as conn:
            cur = conn.cursor()
            update_query = 'UPDATE ' + discipline + ' SET available_tutors = ? WHERE shift_number = ?'
            cur.execute(update_query, (new_available_tutors, shift_number))
            conn.commit()
    except:
        conn.rollback()
    finally:
        conn.close()


# Function to update what shifts certain disciplines are available for tutoring
def update_discipline_shift_availability(discipline, new_available_shifts):
    try:
        with sql.connect("database.db") as conn:
            cur = conn.cursor()
            update_query = 'UPDATE disciplines SET available_shifts = ? WHERE discipline = ?'
            cur.execute(update_query, (str(new_available_shifts), discipline))
            conn.commit()
    except:
        conn.rollback()
    finally:
        conn.close()


# Function to update the master schedule by the shift number
# will check to see if a shift exists before trying to update
# else it will create it and fill it with an empty list
def update_master_schedule(shift_number, disciplines, new_assignments):
    try:
        with sql.connect("database.db") as conn:
            cur = conn.cursor()
            sql_select_query = 'SELECT * FROM master_schedule WHERE shift_number=? '
            cur.execute(sql_select_query, (shift_number,))
            data = cur.fetchone()
            # if the data exists
            if data is not None:
                params = ()
                update_query = 'UPDATE master_schedule SET '
                # loop through the disciplines to get every column
                for item, discipline in enumerate(disciplines):
                    if item != len(disciplines) - 1:
                        update_query = update_query + discipline + ' = ?, '
                    else:
                        update_query = update_query + discipline + ' = ? '

                    params = params + (new_assignments[item],)

                params = params + (shift_number,)
                update_query = update_query + ' WHERE shift_number = ?'
                cur.execute(update_query, params)
            # if data doesn't exist
            else:
                insert_params = ()
                insert_query = 'INSERT INTO master_schedule(shift_number, '
                values = 'VALUES(?, '
                # loop through the disciplines to get every column
                for item, discipline in enumerate(disciplines):
                    if item != len(disciplines) - 1:
                        insert_query = insert_query + discipline + ', '
                        values = values + '?, '
                    else:
                        insert_query = insert_query + discipline + ' )'
                        values = values + ' ?)'

                    insert_params = insert_params + (new_assignments[item],)

                empty_params = (shift_number,) + insert_params
                insert_query = insert_query + values
                cur.execute(insert_query, empty_params)
            conn.commit()
    except:
        conn.rollback()
    finally:
        conn.close()


# Function that will update a single discipline in a shift
def update_master_schedule_single_discipline(shift_number, discipline, new_assignment):
    try:
        with sql.connect("database.db") as conn:
            cur = conn.cursor()
            sql_update_query = 'UPDATE master_schedule SET ' + discipline + ' = ? WHERE shift_number = ? '
            cur.execute(sql_update_query, (new_assignment, shift_number))
            conn.commit()
    except:
        conn.rollback()
    finally:
        conn.close()


# Function to update the time window
def update_time_window(block, start_time, end_time):
    try:
        with sql.connect("database.db") as conn:
            cur = conn.cursor()
            update_query = 'UPDATE time_window SET start_time = ?, end_time = ?  WHERE block = ?'
            cur.execute(update_query, (start_time, end_time, block))
            conn.commit()
    except:
        conn.rollback()
    finally:
        conn.close()


# Function to update the discipline abbreviation
def update_discipline_abbreviation(discipline, new_abbreviation):
    try:
        with sql.connect("database.db") as conn:
            cur = conn.cursor()
            update_query = 'UPDATE disciplines SET abbreviation = ? WHERE discipline = ?'
            cur.execute(update_query, (new_abbreviation, discipline))
            conn.commit()
    except:
        conn.rollback()
    finally:
        conn.close()


# Function to update the user's la status during the current block
def reset_absence(email):
    try:
        with sql.connect("database.db") as conn:
            cur = conn.cursor()
            update_query = 'UPDATE tutors SET absence = 0 WHERE email = ?'
            cur.execute(update_query, (email,))
            conn.commit()
    except:
        conn.rollback()
    finally:
        conn.close()


# Function that will return a list of all tables
def list_all_tables(exceptions):
    try:
        with sql.connect("database.db") as conn:
            table_list = []
            cur = conn.cursor()
            sql_query = 'PRAGMA main.table_list'
            cur.execute(sql_query)
            data = list(cur.fetchall())
            for table in data:
                if exceptions == 'Yes':
                    if table[1] != 'sqlite_schema' and table[1] != 'tutors' and table[1] != 'admins' \
                            and table[1] != 'superusers':
                        table_list.append(table[1])
                else:
                    if table[1] != 'sqlite_schema':
                        table_list.append(table[1])
            return table_list
    except:
        conn.rollback()
    finally:
        conn.close()


# Function that will compare current_time to the times saved in the time_window for a particular block
def check_time(current_time, block):
    try:
        with sql.connect("database.db") as conn:
            cur = conn.cursor()
            sql_search_query = 'SELECT * FROM time_window WHERE block = ?'
            cur.execute(sql_search_query, (block,))
            record = cur.fetchone()
            _, start_time, end_time = record
            if start_time <= current_time <= end_time:
                return True
            else:
                return False
    except:
        conn.rollback()
    finally:
        conn.close()


# Function to clear all absences in roster
def clear_absences():
    roster = get_roster()
    email_list = []
    for data in roster:
        email, _, _, _, _, _, _, _, _, _ = data
        email_list.append(email)
    for email in email_list:
        reset_absence(email)


# Function to reboot the database in its entirety (mostly for testing)
def reboot_database(all_disciplines, exceptions):
    all_tables = list_all_tables(exceptions)
    for table in all_tables:
        delete_table(table)
    create_tables(all_disciplines)
    print("database reboot completed")


# Experiment to copy information from one table to another
def reconfigure_when_adding():
    try:
        with sql.connect("database.db") as conn:
            cur = conn.cursor()

            # create a temporary table
            discipline_list = get_disciplines()
            print('---------------')
            print('Discipline List')
            print('---------------')
            print(discipline_list)
            current_disciplines = get_master_schedule_columns()
            print('---------------')
            print('Columns List')
            print('---------------')
            print(current_disciplines)
            sql_query = 'CREATE TABLE master_schedule_copy(shift_number INTEGER, '
            for discipline in current_disciplines:
                sql_query = sql_query + discipline + ' TEXT, '
            sql_query = sql_query + 'PRIMARY KEY (shift_number))'
            cur.execute(sql_query)
            print('Step 1 Passed')

            sql_query = 'INSERT INTO master_schedule_copy(shift_number, '
            subjects_string = ''
            for index, discipline in enumerate(current_disciplines):
                if index != len(current_disciplines) - 1:
                    subjects_string = subjects_string + discipline + ", "
                else:
                    subjects_string = subjects_string + discipline
            sql_query = sql_query + subjects_string + ') SELECT shift_number, ' \
                                                      '' + subjects_string + ' FROM master_schedule'
            cur.execute(sql_query)
            print('Step 2 Passed')

            # drop the master_schedule
            sql_drop_query = 'DROP TABLE master_schedule'
            conn.execute(sql_drop_query)
            print('Step 3 Passed')

            # create new master schedule
            sql_create_query = 'CREATE TABLE IF NOT EXISTS master_schedule(shift_number INTEGER, '
            for discipline in discipline_list:
                sql_create_query = sql_create_query + discipline + ' TEXT, '
            sql_create_query = sql_create_query + 'PRIMARY KEY (shift_number))'
            conn.execute(sql_create_query)
            print('Step 4 Passed')

            # # copy contents of copy of master_schedule into the real master_schedule
            sql_copy_query = 'INSERT INTO master_schedule(shift_number, '
            subjects_string = ''
            for index, discipline in enumerate(current_disciplines):
                if index != len(current_disciplines) - 1:
                    subjects_string = subjects_string + discipline + ", "
                else:
                    subjects_string = subjects_string + discipline
            sql_copy_query = sql_copy_query + subjects_string + ') SELECT shift_number, ' \
                                                                '' + subjects_string + ' FROM master_schedule_copy'
            cur.execute(sql_copy_query)
            print('Step 5 Passed')

            # # drop the master_schedule_copy
            sql_drop_query = 'DROP TABLE master_schedule_copy'
            conn.execute(sql_drop_query)
            print('Step 6 Passed')
            # commit
            conn.commit()
    except:
        conn.rollback()
    finally:
        conn.close()


# Function to reconfigure the database when aa discipline has been deleted
def reconfigure_after_deleting():
    try:
        with sql.connect("database.db") as conn:
            cur = conn.cursor()

            # create a temporary table
            discipline_list = get_disciplines()
            print('---------------')
            print('Discipline List')
            print('---------------')
            print(discipline_list)
            current_disciplines = get_master_schedule_columns()
            print('---------------')
            print('Columns List')
            print('---------------')
            print(current_disciplines)
            sql_query = 'CREATE TABLE master_schedule_copy(shift_number INTEGER, '
            for discipline in discipline_list:
                sql_query = sql_query + discipline + ' TEXT, '
            sql_query = sql_query + 'PRIMARY KEY (shift_number))'
            cur.execute(sql_query)
            print('Step 1 Passed')

            sql_query = 'INSERT INTO master_schedule_copy(shift_number, '
            subjects_string = ''
            for index, discipline in enumerate(discipline_list):
                if index != len(discipline_list) - 1:
                    subjects_string = subjects_string + discipline + ", "
                else:
                    subjects_string = subjects_string + discipline
            sql_query = sql_query + subjects_string + ') SELECT shift_number, ' \
                                                      '' + subjects_string + ' FROM master_schedule'
            cur.execute(sql_query)
            print('Step 2 Passed')

            # drop the master_schedule
            sql_drop_query = 'DROP TABLE master_schedule'
            conn.execute(sql_drop_query)
            print('Step 3 Passed')

            # create new master schedule
            sql_create_query = 'CREATE TABLE IF NOT EXISTS master_schedule(shift_number INTEGER, '
            for discipline in discipline_list:
                sql_create_query = sql_create_query + discipline + ' TEXT, '
            sql_create_query = sql_create_query + 'PRIMARY KEY (shift_number))'
            conn.execute(sql_create_query)
            print('Step 4 Passed')

            # # copy contents of copy of master_schedule into the real master_schedule
            sql_copy_query = 'INSERT INTO master_schedule(shift_number, '
            subjects_string = ''
            for index, discipline in enumerate(discipline_list):
                if index != len(discipline_list) - 1:
                    subjects_string = subjects_string + discipline + ", "
                else:
                    subjects_string = subjects_string + discipline
            sql_copy_query = sql_copy_query + subjects_string + ') SELECT shift_number, ' \
                                                                '' + subjects_string + ' FROM master_schedule_copy'
            cur.execute(sql_copy_query)
            print('Step 5 Passed')

            # # drop the master_schedule_copy
            sql_drop_query = 'DROP TABLE master_schedule_copy'
            conn.execute(sql_drop_query)
            print('Step 6 Passed')
            # commit
            conn.commit()
    except:
        conn.rollback()
    finally:
        conn.close()


# Function to wipe database
def wipe(discipline):
    reconfigure_after_deleting()
    delete_table(discipline)


# Function to return user from database with first name or first name and last initial
# returns the row of user data if it exists and a None if not
def find_first_name(attempted_name):
    roster = get_roster()
    occur = get_occur(roster)
    new_name = attempted_name.split('.')
    for name in roster:
        _, data, _, _, _, _, _, _, _, _ = name
        split_data = data.split(' ')
        # if the name is in the roster
        if new_name[0].lower() == split_data[0].lower():
            # check if there are multiple occurrences of that name
            if occur[new_name[0].lower()] == 1:
                return name
            # if the bane was put in without further info
            elif occur[new_name[0].lower()] > 1 and len(new_name) == 1:
                return name
            # if name was put in and also the first letter of last name matches
            elif new_name[1].lower() == split_data[1][0].lower():
                return name
    # if name is not in the database
    return None


# Function to see how many times certain names occur in the function
def get_occur(roster):
    occur = {}
    for name in roster:
        _, data, _, _, _, _, _, _, _, _ = name
        name = data.split(' ')
        first_name = name[0].lower()
        if first_name not in occur:
            occur[first_name] = 1
        else:
            occur[first_name] = occur[first_name] + 1
    return occur


# given username return first name,and also last initial if multiple people have the same first name
def find_from_username(username):
    roster = get_roster()
    occur = get_occur(roster)
    if get_single_tutor_info(username) is not None:
        _, data, _, _, _, _, _, _, _, _ = get_single_tutor_info(username)
        name = data.split()
        if occur[name[0].lower()] == 1:
            return name[0]
        elif occur[name[0].lower()] > 1 and len(name) == 1:
            return name[0]
        elif occur[name[0].lower()] > 1:
            return name[0] + ' ' + name[1][0]
        else:
            return None
    else:
        return None


if __name__ == '__main__':
    disciplines_list = ["CS", "Math", "Econ", "Physics", "CHBC"]
    new_favorite_shifts = [[1, 2, 3, 4, 5], [5, 6], [9, 11]]
    tutors1 = ['James Jones', 'Rick Sanchez', 'May June', "Jerry Smith", 'Jerry Mouse']
    tutors2 = ['James email', 'Rick Email', 'May email', "Jerry email", 'Joe email']
    clear_table('tutors')
    add_tutor('James Jones', 'other email')
    add_tutor('James May', ' james email')
    add_tutor('Jones May', "new email")
    print(get_single_tutor_info('other email'))
    print(get_favorite_shifts_med('other email'))
    update_favorite_shifts('other email', new_favorite_shifts)
    print(get_single_tutor_info('other email'))
    print(get_favorite_shifts_high('other email'))
    print(get_favorite_shifts_med('other email'))
    print(get_favorite_shifts_low('other email'))
# database changes
