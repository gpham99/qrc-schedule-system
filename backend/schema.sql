DROP TABLE IF EXISTS user;

2 seperate tables for securities 
CREATE TABLE IF NOT EXISTS user(
    ID INTEGER PRIMARY KEY NOT NULL
    Email TEXT  NOT NULL, 
    person_name TEXT NOT NULL, 
    person_role TEXT NOT NULL, 
    Disciplines TEXT NOT NULL, 
    student_availability INTEGER NOT NULL, 
    shift_capacity INTEGER NOT NULL, 
    shifts_available TEXT NOT NULL, 
    this_block_LA bit NOT NULL, 
    next_block_LA bit NOT NULL, 
    indiv_tutoring bit NOT NULL, 
    shifts_assigned TEXT NOT NULL
)

CREATE TABLE IF NOT EXISTS shifts(

)