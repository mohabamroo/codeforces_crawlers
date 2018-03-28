import json
import os
import pandas as pd
import numpy as np

from sklearn.metrics.pairwise import cosine_similarity
from scipy import sparse
import math

submissions_directory = '../JSON/users_submissions/'
users = {}
problems = {}
similarity = {}

def get_verdict(verdict):
    if(verdict == "OK"):
        return {"key": "OK", "score": 2}
    else:
        return {"key": "W", "score": 1}
    return {
        'WRONG_ANSWER': {"key": 'W', "score": 0},
        'OK': {"key": 'OK', "score": 5},
        'COMPILATION_ERROR': {"key": 'C', "score": 2},
        'RUNTIME_ERROR': {"key": 'R', "score": 2},
        'MEMORY_LIMIT_EXCEEDED': {"key": 'M', "score": 3},
        'TIME_LIMIT_EXCEEDED': {"key": 'T', "score": 3},
        'CHALLENGED': {"key": 'CH', "score": 3},
        'PARTIAL': {"key": 'P', "score": 4},
        'SKIPPED': {"key": 'S', "score": 1},
        'PRESENTATION_ERROR': {"key": "P", "score": 2}
    }[verdict]

def process_user(username):
    users[username]['problems'] = {}
    file = open(submissions_directory + username + '.json', 'r')
    for submission_line in list(file):
        submission = json.loads(submission_line)
        problem_id = submission['title'].split('-')[0].strip()
        verdict_object = get_verdict(submission['verdict'])
        score = verdict_object['score']
        if users[username]['problems'].get(problem_id, None) == None:
            users[username]['problems'][problem_id] = {
                'count': 1,
                verdict_object['key']: 1,
                'score': score,
                'title': submission['title']
                }
        else:
            users[username]['problems'][problem_id]['count'] += 1
            users[username]['problems'][problem_id][verdict_object['key']] = users[username]['problems'][problem_id].get(verdict_object['key'], 0) + 1
            users[username]['problems'][problem_id]['score'] += score

def process_files():
    count = 0
    for filename in os.listdir(submissions_directory):
        if filename.endswith(".json"):
            count += 1
            if(count < 10):
                username = filename.split('.')[0]
                users[username] = {}
                process_user(username)
    # print users['00QRITEL00']['problems']['798B']

# inverse relation between problems and users
def init_item_matrix():
    for user in users:
        total_avg = 0
        for problem in users[user]['problems']:
            problem_avg = users[user]['problems'][problem]['score'] / users[user]['problems'][problem]['count']
            users[user]['problems'][problem]['avg'] = problem_avg
            if(problems.get(problem) == None):
                problems[problem] = {'users':{}}
            problems[problem]['users'][user] = problem_avg
            total_avg += problem_avg

        try:
            total_avg = total_avg/len(users[user]['problems'].keys())
        except ZeroDivisionError:
            total_avg = 0
        users[user]['total_avg'] = total_avg
    maxx = 0
    max_p = None

    for pz in problems:
        if(len(problems[pz]['users']) > maxx):
            maxx = len(problems[pz]['users'])
            max_p = pz
    print "Max problem: " + str(max_p) + " = " + str(maxx)

    item_user_matrix = {}
    for prob in problems:
        for user in users:
            item_user_matrix[problem][user] = var_rating



def user_user_sim(user, other_user):
    sum = 0
    sum_u = 0
    sum_v = 0

    if(user == other_user):
        return 1

    # try:
    #     return similarity[other_user][user]
    # except KeyError:
    #     flag = True

    for problem in users[user]['problems']:
        for problem_2 in users[other_user]['problems']:
            if(problem == problem_2):
                # print "Sims"
                r_u_i = users[user]['problems'][problem]['avg'] - users[user]['total_avg']
                r_v_i = users[other_user]['problems'][problem_2]['avg'] - users[other_user]['total_avg']
                sum += (r_u_i * r_v_i)
                sum_u += pow(r_u_i, 2)
                sum_v += pow(r_v_i, 2)
    try:
        sim = sum / (math.sqrt(sum_u) * math.sqrt(sum_v))
        sim = round(sim, 4)
    except ZeroDivisionError:
        return 0
    return sim

def compute_user_sim():
    for user in users:
        similarity[user] = {}
        for other_user in users:
            similarity[user][other_user] = user_user_sim(user, other_user)
def compute_predictions():
    for user in users:
        x = 0

if __name__ == "__main__":
    print "started main"
    process_files()
    init_item_matrix()
    compute_user_sim()

    df = pd.DataFrame.from_dict(similarity, orient='index', dtype=None)
    print df
