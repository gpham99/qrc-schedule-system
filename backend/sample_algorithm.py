from new_models import Tutor
from random import randint, sample

disciplines = ['CHMB', 'M', 'P', 'CS', 'E']
names = ['Jessica', 'Moises', 'Pralad', 'Giang']
emails = ['j_hannebert@coloradocollege.edu', 'm_padilla@coloradocollege.edu', 'p_mishra@coloradocollege.edu', 'g_pham@coloradocollege.edu']
tutors = []
open_shifts = [[0, 1, 2, 3, 5, 6, 7, 9, 10, 11, 13, 14, 15, 17, 18, 19],
               [0, 1, 2, 4, 6, 8, 10, 12, 14, 16, 17, 18, 19],
               [3, 5, 7, 9, 11, 13, 15, 17, 19],
               [1, 3, 5, 7, 9, 11, 13, 15, 17, 19],
               [1, 2, 3, 5, 7, 9, 11, 15, 19]]
total_shifts = 57
#generate a list of tutors who can tutor in random disciplines
for i in range(len(names)):
    tutors.append(Tutor(names[i], emails[i], shift_cap=randint(2, 5), disciplines=sample(disciplines, randint(1, 2))))
    print(tutors[i].name, tutors[i].disciplines, tutors[i].shift_cap)

avail_tables = []
for i in range(len(disciplines)):
    dictionary = {}
    for j in range(len(open_shifts[i])):
        dictionary[open_shifts[i][j]] = []
    avail_tables.append(dictionary)

def random_able_shifts():
    for i in range(len(disciplines)):
        for tutor in tutors:
            if disciplines[i] in tutor.disciplines:
                shifts = sample(open_shifts[i], randint(3, 9))
                for shift in shifts:
                    avail_tables[i][shift].append(tutor.name)

random_able_shifts()

i = 0
for dictionary in avail_tables:
    print(disciplines[i], dictionary)
    i += 1

print("----------------------------------------------------------")
def greedy():
    attempts = 0
    assigned = 0
    capacities = [tutor.shift_cap for tutor in tutors]
    sum_capacities = sum(capacities)
    avail_copy = avail_tables #delete tutors from this one; master schedule will contain only finalized changes
    master_schedule = []
    for i in range(len(disciplines)):
        dictionary = {}
        for j in range(len(open_shifts[i])):
            dictionary[open_shifts[i][j]] = ""
        master_schedule.append(dictionary)
    while(assigned < total_shifts and assigned < sum_capacities and attempts < 100):
        for d in sample(range(len(disciplines)), len(disciplines)):
            for shift in sample(open_shifts[d], 1): #this can be simplified to a variable and the inner code tabbed back
                if len(avail_copy[d][shift]) > 0:
                    assigned_bool = False
                    for tutor in sample(avail_copy[d][shift],len(avail_copy[d][shift])):
                        if capacities[names.index(tutor)] > 0:
                            master_schedule[d][shift] = tutor
                            avail_copy[d][shift] = []
                            capacities[names.index(tutor)] -= 1
                            assigned += 1
                            assigned_bool = True
                            break
                    if not assigned_bool:
                        avail_copy[d][shift] = []
                    break
        attempts += 1
    if assigned == total_shifts:
        print("all shifts filled")
    if assigned == sum_capacities:
        print("tutors maxed out")
    if attempts >= 100:
        print("greedy algorithm gave up")
    #for d in sample(range(len(disciplines)), len(disciplines)):
    #    for shift in sample(open_shifts[d], len(open_shifts[d])):
    #        if len(avail_copy[d][shift]) > 0:
    #            master_schedule[d][shift] = ""
    return master_schedule, assigned
            
def tutor_unfairness(schedule):
    unfairness_score = 0 #lower is better
    for tutor in tutors:
        #count number of shifts they have been assigned
        assigned = 0
        for i in range(len(schedule)):
            for j in open_shifts[i]:
                if schedule[i][j] == tutor.name:
                   assigned += 1
        score_component = (tutor.shift_cap - assigned) / tutor.shift_cap
        unfairness_score += score_component
    return unfairness_score

def discipline_evenness(schedule):
    shift_counts = []
    for i in range(len(schedule)):
        shift_count = 0
        for j in open_shifts[i]:
            if schedule[i][j] != '':
                shift_count += 1
        shift_counts.append(shift_count)
    maximum = max(shift_counts)
    return sum(shift_counts) / (len(shift_counts) * maximum) 

def algorithm():
    possible_solutions = []
    for i in range(10):
        soln, assigned = greedy()
        unfairness = tutor_unfairness(soln)
        evenness = discipline_evenness(soln)
        possible_solutions.append((soln, assigned, unfairness, evenness))
    assigned_amounts = [soln[1] for soln in possible_solutions]
    maximum = max(assigned_amounts)
    for soln in possible_solutions:
        if soln[1] != maximum:
            possible_solutions.remove(soln) 
    unfairness_amounts = [soln[2] for soln in possible_solutions]
    minimum = min(unfairness_amounts)
    for soln in possible_solutions:
        if soln[2] != minimum:
            possible_solutions.remove(soln) 
    evenness_amounts = [soln[3] for soln in possible_solutions]
    maximum = max(evenness_amounts)
    for soln in possible_solutions:
        if soln[3] != maximum:
            possible_solutions.remove(soln)
    j = 0
    for d in possible_solutions[0]:
        print(disciplines[j], d)
        j += 1

algorithm()
