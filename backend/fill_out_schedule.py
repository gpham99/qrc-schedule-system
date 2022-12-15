from Database import add_to_master_schedule

for i in range(2, 19):
    add_to_master_schedule(i, ["Computer_Science", "Mathematics", "Physics", "Economics", "Chemistry$Molecular_Biology"], ["p_mishra@coloradocollege.edu", "m_padilla@coloradocollege.edu", "j_hannebert@coloradocollege.edu", "g_pham@coloradocollege.edu", None])

add_to_master_schedule(19, ["Computer_Science", "Mathematics", "Physics", "Economics", "Chemistry$Molecular_Biology"], ["p_mishra@coloradocollege.edu", "m_padilla@coloradocollege.edu", "j_hannebert@coloradocollege.edu", None, "g_pham@coloradocollege.edu"])
