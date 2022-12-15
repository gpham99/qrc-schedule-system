
if __name__ == '__main__':
    discipline_list = ["CS", "Math", "Econ", "Physics", "CHBC"]
    discipline_abbreviations = ['CS', 'M', 'E', 'P', 'CHBC']
    tutors = ['m_padilla@ColoradoCollege.edu', None, None, None, None]
    reboot_database(discipline_list, 'No')
    add_discipline('molecular', 'mb', discipline_list)
    print(get_disciplines())