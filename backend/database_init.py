from Database import *
reboot_database(["Computer_Science", "Mathematics", "Physics", "Economics", "Chemistry$Molecular_Biology"],'No')
create_tables(["Computer_Science", "Mathematics", "Physics", "Economics", "Chemistry$Molecular_Biology"])
add_tutor("Jessica Hannebert", "j_hannebert@coloradocollege.edu")
add_tutor("Giang Pham", "g_pham@coloradocollege.edu")
update_tutoring_disciplines("g_pham@coloradocollege.edu", ["Economics", "Chemistry$Molecular_Biology"])
update_tutoring_disciplines("j_hannebert@coloradocollege.edu", ["Economics", "Physics"])
add_discipline("Computer_Science", "CS", [1, 3, 5, 7, 9, 11, 13, 15, 17, 19])
add_discipline("Mathematics", "M", [0, 1, 2, 4, 6, 8, 10, 12, 14, 16, 17, 18, 19])
add_discipline("Physics", "P", [3, 5, 7, 9, 11, 13, 15, 17, 19])
add_discipline("Economics", "E", [1, 2, 3, 5, 7, 9, 11, 15, 19])
add_discipline("Chemistry$Molecular_Biology", "CH$MB", [0, 1, 2, 3, 5, 6, 7, 9, 10, 11, 13, 14, 15, 17, 18, 19])

for i in range(2, 19):
    add_to_master_schedule(i, ["Computer_Science", "Mathematics", "Physics", "Economics", "Chemistry$Molecular_Biology"], ["j_hannebert@coloradocollege.edu", "g_pham@coloradocollege.edu", None])

add_to_master_schedule(19, ["Computer_Science", "Mathematics", "Physics", "Economics", "Chemistry$Molecular_Biology"], ["j_hannebert@coloradocollege.edu", None, "g_pham@coloradocollege.edu"])
add_admin("Steve Getty", "sgetty@coloradocollege.edu")
add_admin("Karen Chui", "kchui@coloradocollege.edu")
add_admin("Jessica Hannebert", "j_hannebert@coloradocollege.edu")
add_admin("Giang Pham", "g_pham@coloradocollege.edu")
