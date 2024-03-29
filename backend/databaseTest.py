import sqlite3 as sql
# The Database file includes:
    # 1. the creation of tables -> Complete
        # create_master_schedule()          O
        # add_new_discipline_table()        O
        # create_discipline_tables()        O
        # create_tables()                   O
    # 2. The insertion of new rows into the tables-> Complete
        # add_tutor()                       O
        # add_superuser()                   O
        # add_admin()                       O
        # add_disciplines()                 O
        # add_shifts()                      O
        # add_to_master_schedule()          O
    # 3. The updating of tables should new information be added ex. more disciplines -> Complete
        # create_new_master_schedule()      O
    # 4. The deletion of rows from tables -> Complete
        # delete_tutors()                   O
        # delete_admins()                   O
        # delete_superusers()               O
        # clear_table()                     O
    # 5. The deletion of tables should we need to make new tables -> Complete
        # delete_table()                    O
    # 6. The retrieval of data from the tables-> Complete
        # get_single_tutor_info()           O
        # get_admin_info                    O
        # get_super_user_info               O
        # get_discipline_shift()            O
        # get_master_schedule_info()        O
        # get_roster()                      O
        # get_disciplines()                 O
        # get_discipline_shifts_offered()   O
    # 7. The ability to check if a user exits in the database -> Complete
        # check_user()              `       O
    # 8. The updating of rows in tables -> Complete
        # update_tutor_status()             O
        # update_shift_capacity()           O
        # update_tutoring_disciplines       O
        # update_this_block_la()            O
        # update_next_block_la()            O
        # update_individual_tutor()         O
        # update_discipline_shifts()        O
        # update_master_schedule()          O
    # 9 Other functions to help with the basic keeping of the database
        # rebirth()
        # list_all_tables()
        # reboot_database()                 O


# function to create the master_schedule
# then populates the schedule with all the shifts and empty
def create_master_schedule(all_disciplines):
    conn = sql.connect('database.db')
    sql_query = 'CREATE TABLE IF NOT EXISTS master_schedule(shift_number INTEGER, '
    for discipline in all_disciplines:
        sql_query = sql_query + discipline + ' TEXT, '
    sql_query = sql_query + 'PRIMARY KEY (shift_number))'
    conn.execute(sql_query)
    conn.close()


# create the individual discipline tables
# Function to create new discipline tables in the future
def add_new_discipline_table(discipline_name):
    conn = sql.connect('database.db')
    sql_query = 'CREATE TABLE IF NOT EXISTS ' + discipline_name + '(shift_number INTEGER, available_tutors TEXT,' \
                                                                  ' PRIMARY KEY (shift_number))'
    conn.execute(sql_query)
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
    conn.execute('CREATE TABLE IF NOT EXISTS disciplines(subject TEXT, available_shifts TEXT, PRIMARY KEY (subject))')
    # close connection to database
    conn.close()
    # creates the remaining tables (disciplines, and master)
    create_discipline_tables(all_disciplines)
    create_master_schedule(all_disciplines)


# function that will add tutors to the tutorTable
# if the tutor already exists than it will check if the name matches
# if it doesn't then it will update the name to the new one
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
            # If the user doesn't exist
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
                # do stuff to turn it on
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


# function that will add rows to the admins table
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


# function that will add rows to the discipline table
def add_disciplines(subject, shifts):
   try:
        with sql.connect("database.db") as con:
            cur = con.cursor()
            sql_select_query = 'SELECT * FROM disciplines WHERE subject=? '
            cur.execute(sql_select_query, (subject,))
            data = cur.fetchone()
            # If the user doesn't exist
            if data is None:
                cur.execute('INSERT OR IGNORE INTO disciplines (subject, available_shifts) '
                            'VALUES(?, ?)', (subject, str(shifts)))
                con.commit()
            # else update the name of the user
            else:
                pass
   except:
       con.rollback()
   finally:
       con.close()


# function to add rows to a specific discipline table
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


# add rows to the master schedule
# take in list of shift assignments and then return the finished schedule
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
            print(sql_query)
            cur.execute(sql_query, t_list)
            con.commit()
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
            # delete the row whose email matches
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
            # delete the row whose email matches
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
            # delete the row whose email matches
            cur.execute('DELETE FROM superuser WHERE email = ?', (email,))
            con.commit()
    except:
        con.rollback()
    finally:
        con.close()


# clears every row in the master schedule
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


# Function to get all the information from a single tutor user
# Returns the information about the user requested
def get_single_tutor_info(user):
    try:
        # code to fetch data from the database
        with sql.connect("database.db") as con:
            cur = con.cursor()
            # get the row whose email matches
            sql_search_query = 'SELECT * FROM tutors WHERE email = ?'
            cur.execute(sql_search_query, (user,))
            record = cur.fetchone()
            return record
    except:
        con.rollback()
    finally:
        con.close()


# Function to get the information from a single admin user
# Returns the information about the user requested
def get_admin_info(user):
    try:
        # code to fetch data from the database
        with sql.connect("database.db") as con:
            cur = con.cursor()
            # get the row whose email matches
            sql_search_query = 'SELECT * FROM admins WHERE email = ?'
            cur.execute(sql_search_query, (user,))
            record = cur.fetchone()
            return record
    except:
        con.rollback()
    finally:
        con.close()


# Function to get the information from a single superuser user
# Returns the information about the user requested
def get_superuser_info(user):
    try:
        # code to fetch data from the database
        with sql.connect("database.db") as con:
            cur = con.cursor()
            # get the row whose email matches
            sql_search_query = 'SELECT * FROM superuser WHERE email = ?'
            cur.execute(sql_search_query, (user,))
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
        # code to fetch data from the database
        with sql.connect("database.db") as con:
            cur = con.cursor()
            # get the row whose email matches
            sql_search_query = 'SELECT * FROM '
            sql_search_query = sql_search_query + discipline
            sql_search_query = sql_search_query + ' WHERE shift_number = ?'
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
        # code to fetch data from the database
        with sql.connect("database.db") as con:
            cur = con.cursor()
            # get the row whose email matches
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
        # code to fetch data from the database
        with sql.connect("database.db") as con:
            roster_list = []
            cur = con.cursor()
            # get the row whose email matches
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


# Function that will retrieve all existing disciplines
def get_disciplines():
    try:
        # code to fetch data from the database
        with sql.connect("database.db") as con:
            disciplines_list = []
            cur = con.cursor()
            # get the row whose email matches
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

# Function that will return which shifts a particular discipline is available for
def get_discipline_shifts_offered(discipline):
    try:
        # code to fetch data from the database
        with sql.connect("database.db") as con:
            cur = con.cursor()
            # get the row whose email matches
            sql_search_query = 'SELECT * FROM disciplines WHERE subject = ?'
            cur.execute(sql_search_query, (discipline,))
            record = cur.fetchone()
            return list(record)[1]
    except:
        con.rollback()
    finally:
        con.close()


# function to check if the user is in the system
# Will return a boolean based on answer as well as the table the user has access to
def check_user(user):
    try:
        # code to fetch data from the database
        with sql.connect("database.db") as con:
            cur = con.cursor()
            # Checks to see if the user is a superuser
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
                    return True, "tutors"
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
def update_status(user):
    try:
        with sql.connect("database.db") as con:
            cur = con.cursor()
            sql_select_query = 'SELECT * FROM tutors WHERE email=? '
            cur.execute(sql_select_query, (user,))
            data = cur.fetchone()
            # if the status is active turn it off
            if data[2] == 1:
                # do stuff to update status to 0
                update_query = 'UPDATE tutors SET status = 0 WHERE email = ?'
            # else turn it on
            else:
                # do stuff to turn it on
                update_query = 'UPDATE tutors SET status = 1 WHERE email = ?'
            cur.execute(update_query, (user,))
    except:
        con.rollback()
    finally:
        con.close()


# Function to update the user's shift capacity
def update_shift_capacity(user, new_capacity):
    try:
        with sql.connect("database.db") as con:
            cur = con.cursor()
            # do stuff to update capacity to desired capacity
            update_query = 'UPDATE tutors SET shift_capacity =' + str(new_capacity)
            update_query = update_query + ' WHERE email = ?'
            cur.execute(update_query, (user,))
    except:
        con.rollback()
    finally:
        con.close()


# Function to update the user's tutoring disciplines
def update_tutoring_disciplines(user, disciplines):
    try:
        with sql.connect("database.db") as con:
            cur = con.cursor()
            # do stuff to update capacity to desired capacity
            update_query = 'UPDATE tutors SET tutoring_disciplines =? WHERE email = ?'
            disciplines = str(disciplines)
            cur.execute(update_query, (disciplines, user))
    except:
        con.rollback()
    finally:
        con.close()


# Function to update the user's la status during the current block
def update_this_block_la(user):
    try:
        with sql.connect("database.db") as con:
            cur = con.cursor()
            sql_select_query = 'SELECT * FROM tutors WHERE email=? '
            cur.execute(sql_select_query, (user,))
            data = cur.fetchone()
            # if the la status is active turn it off
            if data[4] == 1:
                # do stuff to update status to 0
                update_query = 'UPDATE tutors SET this_block_la = 0 WHERE email = ?'
            # else turn it on
            else:
                # do stuff to turn it on
                update_query = 'UPDATE tutors SET this_block_la = 1 WHERE email = ?'
            cur.execute(update_query, (user,))
    except:
        con.rollback()
    finally:
        con.close()


# Function to update the user's la status during the next block
def update_next_block_la(user):
    try:
        with sql.connect("database.db") as con:
            cur = con.cursor()
            sql_select_query = 'SELECT * FROM tutors WHERE email=? '
            cur.execute(sql_select_query, (user,))
            data = cur.fetchone()
            # if the status is active turn it off
            if data[5] == 1:
                # do stuff to update status to 0
                update_query = 'UPDATE tutors SET next_block_la = 0 WHERE email = ?'
            # else turn it on
            else:
                # do stuff to turn it on
                update_query = 'UPDATE tutors SET next_block_la = 1 WHERE email = ?'
            cur.execute(update_query, (user,))
    except:
        con.rollback()
    finally:
        con.close()


# Function to update whether the tutor is doing individual tutoring or not
def update_individual_tutor(user):
    try:
        with sql.connect("database.db") as con:
            cur = con.cursor()
            sql_select_query = 'SELECT * FROM tutors WHERE email=? '
            cur.execute(sql_select_query, (user,))
            data = cur.fetchone()
            # if the status is active turn it off
            if data[6] == 1:
                # do stuff to update status to 0
                update_query = 'UPDATE tutors SET individual_tutor = 0 WHERE email = ?'
            # else turn it on
            else:
                # do stuff to turn it on
                update_query = 'UPDATE tutors SET individual_tutor = 1 WHERE email = ?'
            cur.execute(update_query, (user,))
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
            if data != None:
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


# Function to reset the database and create all the appropriate tables once a new discipline has been added
def reconfigure_database(new_disciplines_list):
    # creates the new master_schedule after deleting the old one
    create_new_master_schedule(new_disciplines_list)
    # creates a new table for the new discipline
    create_discipline_tables(new_disciplines_list)
    empty_list = []
    # get all the current existing tables
    current_disciplines = get_disciplines()
    # iterates through the new discipline list
    for discipline in new_disciplines_list:
        # if it is new then add it to the discipline table with an empty list
        if discipline not in current_disciplines:
            add_disciplines(discipline, empty_list)
    print("Rebirth process complete")


# Function that will return a list of all tables
def list_all_tables():
    try:
        with sql.connect("database.db") as con:
            table_list = []
            cur = con.cursor()

            sql_query = 'PRAGMA main.table_list'
            cur.execute(sql_query)
            data = list(cur.fetchall())
            for table in data:
                if table[1] != 'sqlite_schema':
                    table_list.append(table[1])

            return table_list
    except:
        con.rollback()
    finally:
        con.close()


# Function to reboot the database in its entirety (mostly for testing)
def reboot_database(all_disciplines):
    all_tables = list_all_tables()
    for table in all_tables:
        delete_table(table)
    create_tables(all_disciplines)
    print("database reboot completed")


# Function for testing table copying
def table_copy(table_name):
    pass




if __name__ == '__main__':
    discipline_list = ["CS", "Math", "Econ", "Physics", "CHBC"]
    reboot_database(discipline_list)
    empty_list = []
    tutors = ["Joe", None, None, None, "james"]
    new_tutors = ["Jill", "Janet", "July", "Him", "her"]
    non_empty_list = [1, 2, 3, 4, 5, 6, 7]
    create_tables(discipline_list)

    update_master_schedule(1, discipline_list, new_tutors)
    print(get_master_schedule_info(1))
    clear_table('master_schedule')

