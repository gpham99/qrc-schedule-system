import sqlite3 as sql
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

# 3. The updating of tables should new information be added ex. more disciplines
# create_new_master_schedule(new_disciplines)

# 4. The deletion of rows from tables
# delete_tutors(email)
# delete_admins(email)
# delete_superusers(email)
# delete_discipline(discipline)
# clear_table(table)
# delete_time_window(block)

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

# 7. The ability to check if a user exits in the database
# check_user(email)              `

# 8. The updating of rows in tables
# update_tutor_status(email)
# update_shift_capacity(email, new_shift_capacity)
# update_tutoring_disciplines(email, disciplines)
# update_this_block_la(email)
# update_next_block_la(email)
# update_individual_tutor(email)
# update_discipline_shifts(discipline, shift_number, new_available_tutors)
# update_master_schedule(shift_number,all_disciplines, new_assignments)
# update_time_window(block, start_time, end_time)
# update_discipline_abbreviation(discipline, abbreviation)

# 9 Other functions to help with the basic keeping of the database
# reconfigure_database(new_disciplines_list)
# list_all_tables(exceptions)
# check_time(current_time, block)
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
    conn = sql.connect('database.db')

    # create superuser table
    conn.execute('CREATE TABLE IF NOT EXISTS superuser (email TEXT, name TEXT, PRIMARY KEY (email))')
    # create the tutors table
    conn.execute('CREATE TABLE IF NOT EXISTS tutors (email TEXT, name TEXT, status INTEGER,shift_capacity '
                 'INTEGER, tutoring_disciplines TEXT, this_block_la INTEGER, next_block_la INTEGER, '
                 'individual_tutor INTEGER, PRIMARY KEY (email))')
    # create the admins table
    conn.execute('CREATE TABLE IF NOT EXISTS admins (email TEXT, name TEXT, PRIMARY KEY (email)) ')
    # create the disciplines table
    conn.execute('CREATE TABLE IF NOT EXISTS disciplines(discipline TEXT, abbreviation TEXT, available_shifts TEXT,'
                 ' PRIMARY KEY (discipline))')
    # create the times table
    conn.execute('CREATE TABLE IF NOT EXISTS time_window(block INTEGER, start_time BIGINT, end_time BIGINT,'
                 'PRIMARY KEY (block))')
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
    try:
        with sql.connect("database.db") as con:
            cur = con.cursor()
            sql_select_query = 'SELECT * FROM tutors WHERE email=? '
            cur.execute(sql_select_query, (email,))
            data = cur.fetchone()
            # If the user doesn't exist add a new user
            if data is None:
                cur.execute('INSERT OR IGNORE INTO tutors(email, name, status, shift_capacity, tutoring_disciplines, '
                            'this_block_la, next_block_la, individual_tutor) VALUES(?, ?, ?, ?, ?, ?, ?, ?)',
                            (email, name, status, shift_cap, tutoring_disciplines, this_block_la, next_block_la,
                             individual_tutor))
                con.commit()
            # If the user is being put into the roster and the name are the same do nothing
            if data[1] == name:
                pass
            # else update the name of the user
            else:
                update_query = 'UPDATE tutors SET name = ? WHERE email = ?'
            cur.execute(update_query, (name, email))
    except:
        con.rollback()
    finally:
        con.close()


# Function to add superusers
def add_superuser(name, email):
    try:
        with sql.connect("database.db") as con:
            cur = con.cursor()
            cur.execute('INSERT OR IGNORE INTO superuser (email, name) VALUES(?, ?)', (email, name))
            con.commit()
    except:
        con.rollback()
    finally:
        con.close()


# Function to add admins
def add_admin(name, email):
    try:
        with sql.connect("database.db") as con:
            cur = con.cursor()
            cur.execute('INSERT OR IGNORE INTO admins (email, name) VALUES(?, ?)', (email, name))
            con.commit()
    except:
        con.rollback()
    finally:
        con.close()


# Function that will add rows to the discipline table
def add_discipline(discipline, abbreviation, shifts):
    if True:
        with sql.connect("database.db") as con:
            cur = con.cursor()
            sql_select_query = 'SELECT * FROM disciplines WHERE discipline=? '
            cur.execute(sql_select_query, (discipline,))
            data = cur.fetchone()
            # If the user doesn't exist add the discipline
            if data is None:
                cur.execute('INSERT OR IGNORE INTO disciplines (discipline, abbreviation,  available_shifts) '
                            'VALUES(?, ?, ?)', (discipline, abbreviation, str(shifts)))
                con.commit()
                # reconfigure_database()
            # else update
            else:
                update_query = 'UPDATE disciplines SET abbreviation = ?, available_shifts = ? WHERE discipline = ?'
                cur.execute(update_query, (abbreviation, str(shifts), discipline))
                print("updated stuff")



# Function to add rows to a specific discipline table
def add_shifts(discipline, shift_number, available_tutors):
    try:
        with sql.connect("database.db") as con:
            cur = con.cursor()
            sql_query = 'INSERT OR IGNORE INTO ' + discipline + ' (shift_number, available_tutors) VALUES (?, ?)'
            cur.execute(sql_query, (shift_number, str(available_tutors)))
            con.commit()
    except:
        con.rollback()
    finally:
        con.close()


# Function to add rows to the master schedule table by shift and the tutors assignment to each discipline
def add_to_master_schedule(shift_number, all_disciplines, assignments):
    try:
        with sql.connect("database.db") as con:
            cur = con.cursor()
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
            con.commit()
    except:
        con.rollback()
    finally:
        con.close()


# Function to add Time window
def add_time_window(block, start_date, end_date):
    try:
        with sql.connect("database.db") as con:

            cur = con.cursor()
            sql_query = 'INSERT OR IGNORE INTO time_window(block, start_time, end_time) VALUES (?, ?, ?)'
            cur.execute(sql_query, (block, start_date, end_date))
            con.commit()
            print('inserted')
    except:
        con.rollback()
    finally:
        con.close()


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
        with sql.connect("database.db") as con:
            cur = con.cursor()
            cur.execute('DELETE FROM tutors WHERE email = ?', (email,))
            con.commit()
    except:
        con.rollback()
    finally:
        con.close()


# function that will delete admins
def delete_admins(email):
    try:
        with sql.connect("database.db") as con:
            cur = con.cursor()
            cur.execute('DELETE FROM admins WHERE email = ?', (email,))
            con.commit()
    except:
        con.rollback()
    finally:
        con.close()


# function that will delete superusers
def delete_superusers(email):
    try:
        with sql.connect("database.db") as con:
            cur = con.cursor()
            cur.execute('DELETE FROM superuser WHERE email = ?', (email,))
            con.commit()
    except:
        con.rollback()
    finally:
        con.close()


# Function to delete a discipline from the disciplines table
def delete_discipline(discipline):
    try:
        with sql.connect("database.db") as con:
            cur = con.cursor()
            cur.execute('DELETE FROM disciplines WHERE discipline = ?', (discipline,))
            con.commit()
    except:
        con.rollback()
    finally:
        con.close()


# clears every row in a table
def clear_table(table):
    try:
        with sql.connect("database.db") as con:
            cur = con.cursor()
            sql_query = 'DELETE FROM ' + table
            cur.execute(sql_query)
            con.commit()
    except:
        con.rollback()
    finally:
        con.close()


# function to delete Tables
def delete_table(table):
    conn = sql.connect('database.db')
    conn.execute('DROP TABLE ' + table)
    conn.close()


# Function to delete certain block's time window
def delete_time_window(block):
    try:
        with sql.connect("database.db") as con:
            cur = con.cursor()
            cur.execute('DELETE FROM time_window WHERE block = ?', (block,))
            con.commit()
    except:
        con.rollback()
    finally:
        con.close()


# Function to get all the information from a single tutor user
# Returns the information about the user requested
def get_single_tutor_info(email):
    try:
        with sql.connect("database.db") as con:
            cur = con.cursor()
            sql_search_query = 'SELECT * FROM tutors WHERE email = ?'
            cur.execute(sql_search_query, (email,))
            record = cur.fetchone()
            return record
    except:
        con.rollback()
    finally:
        con.close()


# Function to get the information from a single admin user
# Returns the information about the user requested
def get_admin_info(email):
    try:
        with sql.connect("database.db") as con:
            cur = con.cursor()
            sql_search_query = 'SELECT * FROM admins WHERE email = ?'
            cur.execute(sql_search_query, (email,))
            record = cur.fetchone()
            return record
    except:
        con.rollback()
    finally:
        con.close()


# Function to get the information from a single superuser user
# Returns the information about the user requested
def get_superuser_info(email):
    try:
        with sql.connect("database.db") as con:
            cur = con.cursor()
            sql_search_query = 'SELECT * FROM superuser WHERE email = ?'
            cur.execute(sql_search_query, (email,))
            record = cur.fetchone()
            return record
    except:
        con.rollback()
    finally:
        con.close()


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


# Function to retrieve the assignments for a particular shift
def get_master_schedule_info(shift_number):
    try:
        with sql.connect("database.db") as con:
            cur = con.cursor()
            sql_search_query = 'SELECT * FROM master_schedule WHERE shift_number = ?'
            cur.execute(sql_search_query, (shift_number,))
            record = cur.fetchone()
            return list(record[1:])
    except:
        con.rollback()
    finally:
        con.close()


# Function that will get the tutors in the system along with their information
def get_roster():
    try:
        with sql.connect("database.db") as con:
            roster_list = []
            cur = con.cursor()
            sql_search_query = 'SELECT * FROM tutors'
            cur.execute(sql_search_query)
            records = cur.fetchall()
            for record in records:
                roster_list.append(record)
            return roster_list
    except:
        con.rollback()
    finally:
        con.close()


# Function to get the roster of admins
def get_admin_roster():
    try:
        with sql.connect("database.db") as con:
            roster_list = []
            cur = con.cursor()
            sql_search_query = 'SELECT * FROM admins'
            cur.execute(sql_search_query)
            records = cur.fetchall()
            for record in records:
                roster_list.append(record)
            return roster_list
    except:
        con.rollback()
    finally:
        con.close()


# Function that will retrieve all existing disciplines
def get_disciplines():
    try:
        with sql.connect("database.db") as con:
            disciplines_list = []
            cur = con.cursor()
            sql_search_query = 'SELECT * FROM disciplines'
            cur.execute(sql_search_query)
            records = cur.fetchall()
            for record in records:
                disciplines_list.append(record[0])
            return disciplines_list
    except:
        con.rollback()
    finally:
        con.close()


# Function that will retrieve all existing abbreviations
def get_abbreviations():
    try:
        with sql.connect("database.db") as con:
            disciplines_list = []
            cur = con.cursor()
            sql_search_query = 'SELECT * FROM disciplines'
            cur.execute(sql_search_query)
            records = cur.fetchall()
            for record in records:
                disciplines_list.append(record[1])
            return disciplines_list
    except:
        con.rollback()
    finally:
        con.close()


# Function to return discipline names from abbreviations
def get_discipline_from_abbreviation(abbreviation):
    try:
        with sql.connect("database.db") as con:
            disciplines_list = []
            cur = con.cursor()
            sql_search_query = 'SELECT * FROM disciplines where abbreviation = ?'
            cur.execute(sql_search_query, (abbreviation, ))
            record = cur.fetchone()
            return record
    except:
        con.rollback()
    finally:
        con.close()


# Function that will return which shifts a particular discipline is available for
def get_discipline_shifts_offered(discipline):
    try:
        with sql.connect("database.db") as con:
            cur = con.cursor()
            sql_search_query = 'SELECT * FROM disciplines WHERE discipline = ?'
            cur.execute(sql_search_query, (discipline,))
            record = cur.fetchone()
            return list(record)[2]
    except:
        con.rollback()
    finally:
        con.close()


# Function to get the time window of a certain block
def get_time_window(block):
    try:
        with sql.connect("database.db") as con:
            cur = con.cursor()
            sql_search_query = 'SELECT * FROM time_window WHERE block = ?'
            cur.execute(sql_search_query, (block,))
            record = cur.fetchone()
            _, start_time, end_time = record
            return start_time, end_time
    except:
        con.rollback()
    finally:
        con.close()


# Function to get the discipline abbreviation
def get_discipline_abbreviation(discipline):
    try:
        with sql.connect("database.db") as con:
            cur = con.cursor()
            sql_search_query = 'SELECT * FROM disciplines WHERE discipline = ?'
            cur.execute(sql_search_query, (discipline,))
            record = cur.fetchone()
            return record[1]
    except:
        con.rollback()
    finally:
        con.close()


# Function to get the column names of the master_schedule
def get_master_schedule_columns():
    if True:
        with sql.connect("database.db") as con:
            cur = con.cursor()
            sql_query = 'PRAGMA table_info(master_schedule)'
            cur.execute(sql_query)
            record = cur.fetchall()
            name_list = []
            for column in record:
                number, name, _, _, _, _ = column
                if number != 0:
                    name_list.append(name)
            return name_list


# function to check if the user is in the system
# Will return a boolean based on answer as well as the table the user has access to
def check_user(user):
    try:
        with sql.connect("database.db") as con:
            cur = con.cursor()
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
                    return True, "admins"

            # Checks to see if the user is a tutor
            cur.execute("select * from tutors")
            rows = cur.fetchall()
            for row in rows:
                if row[0] == user:
                    return True, "tutor"
            return False, "None"
    except:
        con.rollback()
    finally:
        con.close()


# Functions that will be used to update different Tutor columns
# 0 = email
# 1 = name
# 2 = status
# 3 = shift_capacity
# 4 = tutoring_disciplines
# 5 = this_block_la
# 6 = next_block_la
# 7 = individual_tutor
# Function that will update the user's status
def update_status(email):
    try:
        with sql.connect("database.db") as con:
            cur = con.cursor()
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
    except:
        con.rollback()
    finally:
        con.close()


# Function to update the user's shift capacity
# noinspection PyBroadException
def update_shift_capacity(email, new_capacity):
    try:
        with sql.connect("database.db") as con:
            cur = con.cursor()
            # update capacity to desired capacity
            update_query = 'UPDATE tutors SET shift_capacity =' + str(new_capacity)
            update_query = update_query + ' WHERE email = ?'
            cur.execute(update_query, (email,))
    except:
        con.rollback()
    finally:
        con.close()


# Function to update the user's tutoring disciplines
def update_tutoring_disciplines(email, disciplines):
    try:
        with sql.connect("database.db") as con:
            cur = con.cursor()
            update_query = 'UPDATE tutors SET tutoring_disciplines =? WHERE email = ?'
            disciplines = str(disciplines)
            cur.execute(update_query, (disciplines, email))
    except:
        con.rollback()
    finally:
        con.close()


# Function to update the user's la status during the current block
def update_this_block_la(email):
    try:
        with sql.connect("database.db") as con:
            cur = con.cursor()
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
    except:
        con.rollback()
    finally:
        con.close()


# Function to update the user's la status during the next block
def update_next_block_la(email):
    try:
        with sql.connect("database.db") as con:
            cur = con.cursor()
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
    except:
        con.rollback()
    finally:
        con.close()


# Function to update whether the tutor is doing individual tutoring or not
def update_individual_tutor(email):
    try:
        with sql.connect("database.db") as con:
            cur = con.cursor()
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
    except:
        con.rollback()
    finally:
        con.close()


# Function to update the shifts of the disciplines
def update_discipline_shifts(discipline, shift_number, new_available_tutors):
    try:
        with sql.connect("database.db") as con:
            cur = con.cursor()
            update_query = 'UPDATE ' + discipline + ' SET available_tutors = ? WHERE shift_number = ?'
            cur.execute(update_query, (shift_number, new_available_tutors))
    except:
        con.rollback()
    finally:
        con.close()


# Function to update what shifts certain disciplines are available for tutoring
def update_discipline_shift_availability(discipline, new_available_shifts):
    try:
        with sql.connect("database.db") as con:
            cur = con.cursor()
            update_query = 'UPDATE disciplines SET shifts = ? WHERE discipline = ?'
            cur.execute(update_query, (new_available_shifts, discipline))
    except:
        con.rollback()
    finally:
        con.close()


# Function to update the master schedule by the shift number
# will check to see if a shift exists before trying to update
# else it will create it and fill it with an empty list
def update_master_schedule(shift_number, disciplines, new_assignments):
    try:
        with sql.connect("database.db") as con:
            cur = con.cursor()
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
    except:
        con.rollback()
    finally:
        con.close()


# Function that will update a single discipline in a shift
def update_master_schedule_single_discipline(shift_number, discipline, new_assignment):
    try:
        with sql.connect("database.db") as con:
            cur = con.cursor()
            sql_update_query = 'UPDATE master_schedule SET ' + discipline + ' = ? WHERE shift_number = ? '
            cur.execute(sql_update_query, (new_assignment, shift_number))
    except:
        con.rollback()
    finally:
        con.close()


# Function to update the time window
def update_time_window(block, start_time, end_time):
    try:
        with sql.connect("database.db") as con:
            cur = con.cursor()
            update_query = 'UPDATE time_window SET start_time = ?, end_time = ?  WHERE block = ?'
            cur.execute(update_query, (start_time, end_time, block))
    except:
        con.rollback()
    finally:
        con.close()


# Function to update the discipline abbreviation
def update_discipline_abbreviation(discipline, new_abbreviation):
    try:
        with sql.connect("database.db") as con:
            cur = con.cursor()
            update_query = 'UPDATE disciplines SET abbreviation = ? WHERE discipline = ?'
            cur.execute(update_query, (new_abbreviation, discipline))
    except:
        con.rollback()
    finally:
        con.close()


# Function that will return a list of all tables
def list_all_tables(exceptions):
    try:
        with sql.connect("database.db") as con:
            table_list = []
            cur = con.cursor()
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
        con.rollback()
    finally:
        con.close()


# Function to reset the master_schedule and create all the appropriate tables once a new discipline has been added
def reconfigure_database():
    disciplines_list = get_disciplines()
    tables_list = list_all_tables('No')
    allowed_list = []
    # iterates through the new discipline list
    for discipline in disciplines_list:
        if discipline not in tables_list:
            add_new_discipline_table(discipline)
        allowed_list.append(discipline)
    create_new_master_schedule(allowed_list)
    print("Reconfiguration Process Complete")


# Function that will compare current_time to the times saved in the time_window for a particular block
def check_time(current_time, block):
    try:
        with sql.connect("database.db") as con:
            cur = con.cursor()
            sql_search_query = 'SELECT * FROM time_window WHERE block = ?'
            cur.execute(sql_search_query, (block,))
            record = cur.fetchone()
            _, start_time, end_time = record
            if start_time <= current_time <= end_time:
                return True
            else:
                return False
    except:
        con.rollback()
    finally:
        con.close()


# Function to reboot the database in its entirety (mostly for testing)
def reboot_database(all_disciplines, exceptions):
    all_tables = list_all_tables(exceptions)
    for table in all_tables:
        delete_table(table)
    create_tables(all_disciplines)
    print("database reboot completed")


if __name__ == '__main__':
    discipline_list = ["CS", "Math", "Econ", "Physics", "CHBC"]
    tutors = ['Joe', 'James', None, None, None]
    create_tables(discipline_list)
    add_discipline('Math', 'M', [])
    add_discipline("James", "J", [])


# update master_schedule for a single discipline
# add_discipline
# reconfigure_table
# add_new_discipline_table
