import json
import numpy as np
import sys
from itertools import permutations

def parse_into_matrix(json_response):
    response = json.loads(json_response)
    ids = []
    for x in response["data"]:
        if ids.count(x["waypoints"][0]) == 0:
            ids.append(x["waypoints"][0])
        if ids.count(x["waypoints"][1]) == 0:
            ids.append(x["waypoints"][1])

    ids_to_coordinates = dict()
    for i in range(len(ids)):
        ids_to_coordinates[i] = ids[i]

    # Implement a hard limit for the biggest 
    # data we can process so we don't run out of memory

    assert(len(ids) < 1024)
    matrix_size = len(ids)
    matrix = np.zeros((matrix_size, matrix_size, 2))
    for x in response["data"]:
        first_node = ids.index(x["waypoints"][0])
        second_node = ids.index(x["waypoints"][1])
        matrix[first_node][second_node][0] = x["time"]
        matrix[second_node][first_node][0] = x["time"]
        matrix[first_node][second_node][1] = x["distance"] 
        matrix[second_node][first_node][1] = x["distance"]
    return (matrix, ids, ids_to_coordinates)
    
# Brute Force Approach << 6

def calculate_cost(matrix, perms, data_type):
    cost = 0
    for i in range(len(matrix) - 1):
        cost += matrix[perms[i]][perms[i+1]][data_type]
    cost += matrix[perms[len(matrix) - 1]][perms[0]][data_type]
    return cost

def brute_force(matrix, data_type = 0):
    elems = [i for i in range(len(matrix[0]))]
    perms = permutations(elems)
    response_list = []
    cost_list = []
    for i in perms:
        i = list(i)
        if len(response_list) == i[0]:
            response_list.append(i)
            cost_list.append(calculate_cost(matrix, i, data_type))
        else:
            cost = calculate_cost(matrix, i, data_type)
            if cost < cost_list[i[0]]:
                cost_list[i[0]] = cost
                response_list[i[0]] = i[:]
    for i in range(len(response_list)):
        response_list[i].append(response_list[i][0])
    return response_list

# A greedy approximation that just takes the
# shortest path between nodes

def greedy_approximation(matrix, data_type):
    response_list = []
    for x in range(len(matrix[0])):
        visited = [x]
        total = 0
        found_unused = True
        while found_unused:
            remaining_nodes = []
            found_unused = False
            for y in range(len(matrix[0])):
                if visited.count(y) == 0:
                    remaining_nodes.append((matrix[x][y][data_type], y))
                    found_unused = True
            if not found_unused:
                break
            remaining_nodes = sorted(remaining_nodes)
            visited.append(remaining_nodes[0][1])
            total += remaining_nodes[0][0]
        total += matrix[len(visited) - 1][0][data_type]
        visited.append(visited[0])
        response_list.append(visited)
    return response_list

def convert_to_final(response_list, ids_to_coordinates):
    routes = []   
    for i in response_list:
        node_id = ids_to_coordinates[i[0]]
        route = [] 
        for j in i:
            route.append(ids_to_coordinates[j])
        routes.append([node_id, route])
    return json.dumps(routes)


data = '{"data":[{"waypoints":[[45.74999192554706,21.221653436307722],[45.75138517298641,21.229362798452147]],"distance":1408.5,"time":153.5},{"waypoints":[[45.74999192554706,21.221653436307722],[45.753643836167804,21.222727429410654]],"distance":669.5,"time":67.1},{"waypoints":[[45.74999192554706,21.221653436307722],[45.75515745131398,21.226957231421014]],"distance":1014.6,"time":103.9},{"waypoints":[[45.74999192554706,21.221653436307722],[45.754511878131304,21.2312090487645]],"distance":1841.4,"time":201},{"waypoints":[[45.74999192554706,21.221653436307722],[45.7526560478546,21.232711409916867]],"distance":1387.1,"time":152.1},{"waypoints":[[45.74999192554706,21.221653436307722],[45.74987218672686,21.232539711499463]],"distance":1496.5,"time":222.8},{"waypoints":[[45.74999192554706,21.221653436307722],[45.74834549425301,21.229706687612097]],"distance":1068.9,"time":106.3},{"waypoints":[[45.74999192554706,21.221653436307722],[45.74798626642583,21.225242528759317]],"distance":730.8,"time":72.9},{"waypoints":[[45.74999192554706,21.221653436307722],[45.75068041877819,21.225414227176724]],"distance":906.4,"time":97.6},{"waypoints":[[45.75138517298641,21.229362798452147],[45.753643836167804,21.222727429410654]],"distance":888.9,"time":91.4},{"waypoints":[[45.75138517298641,21.229362798452147],[45.75515745131398,21.226957231421014]],"distance":1234.1,"time":128.2},{"waypoints":[[45.75138517298641,21.229362798452147],[45.754511878131304,21.2312090487645]],"distance":1003.5,"time":115.9},{"waypoints":[[45.75138517298641,21.229362798452147],[45.7526560478546,21.232711409916867]],"distance":584.2,"time":79.2},{"waypoints":[[45.75138517298641,21.229362798452147],[45.74987218672686,21.232539711499463]],"distance":693.5,"time":143.5},{"waypoints":[[45.75138517298641,21.229362798452147],[45.74834549425301,21.229706687612097]],"distance":1121,"time":119},{"waypoints":[[45.75138517298641,21.229362798452147],[45.74798626642583,21.225242528759317]],"distance":782.9,"time":85.6},{"waypoints":[[45.75138517298641,21.229362798452147],[45.75068041877819,21.225414227176724]],"distance":464.9,"time":57},{"waypoints":[[45.753643836167804,21.222727429410654],[45.75515745131398,21.226957231421014]],"distance":345.1,"time":36.8},{"waypoints":[[45.753643836167804,21.222727429410654],[45.754511878131304,21.2312090487645]],"distance":1992.7,"time":209.3},{"waypoints":[[45.753643836167804,21.222727429410654],[45.7526560478546,21.232711409916867]],"distance":1538.4,"time":160.4},{"waypoints":[[45.753643836167804,21.222727429410654],[45.74987218672686,21.232539711499463]],"distance":1647.8,"time":231.1},{"waypoints":[[45.753643836167804,21.222727429410654],[45.74834549425301,21.229706687612097]],"distance":1220.2,"time":114.6},{"waypoints":[[45.753643836167804,21.222727429410654],[45.74798626642583,21.225242528759317]],"distance":882.1,"time":81.2},{"waypoints":[[45.753643836167804,21.222727429410654],[45.75068041877819,21.225414227176724]],"distance":1057.7,"time":105.9},{"waypoints":[[45.75515745131398,21.226957231421014],[45.754511878131304,21.2312090487645]],"distance":2182.3,"time":222.3},{"waypoints":[[45.75515745131398,21.226957231421014],[45.7526560478546,21.232711409916867]],"distance":1895.9,"time":196.1},{"waypoints":[[45.75515745131398,21.226957231421014],[45.74987218672686,21.232539711499463]],"distance":2253,"time":299.9},{"waypoints":[[45.75515745131398,21.226957231421014],[45.74834549425301,21.229706687612097]],"distance":1825.4,"time":183.4},{"waypoints":[[45.75515745131398,21.226957231421014],[45.74798626642583,21.225242528759317]],"distance":1487.3,"time":150},{"waypoints":[[45.75515745131398,21.226957231421014],[45.75068041877819,21.225414227176724]],"distance":1662.9,"time":174.7},{"waypoints":[[45.754511878131304,21.2312090487645],[45.7526560478546,21.232711409916867]],"distance":978.9,"time":122.6},{"waypoints":[[45.754511878131304,21.2312090487645],[45.74987218672686,21.232539711499463]],"distance":1832.4,"time":269.5},{"waypoints":[[45.754511878131304,21.2312090487645],[45.74834549425301,21.229706687612097]],"distance":1706.4,"time":184.5},{"waypoints":[[45.754511878131304,21.2312090487645],[45.74798626642583,21.225242528759317]],"distance":1836.4,"time":185.9},{"waypoints":[[45.754511878131304,21.2312090487645],[45.75068041877819,21.225414227176724]],"distance":1518.4,"time":157.3},{"waypoints":[[45.7526560478546,21.232711409916867],[45.74987218672686,21.232539711499463]],"distance":985.2,"time":169.7},{"waypoints":[[45.7526560478546,21.232711409916867],[45.74834549425301,21.229706687612097]],"distance":928.8,"time":86.7},{"waypoints":[[45.7526560478546,21.232711409916867],[45.74798626642583,21.225242528759317]],"distance":1074.5,"time":111.8},{"waypoints":[[45.7526560478546,21.232711409916867],[45.75068041877819,21.225414227176724]],"distance":756.5,"time":83.2},{"waypoints":[[45.74987218672686,21.232539711499463],[45.74834549425301,21.229706687612097]],"distance":1440.1,"time":202.2},{"waypoints":[[45.74987218672686,21.232539711499463],[45.74798626642583,21.225242528759317]],"distance":1101.9,"time":168.8},{"waypoints":[[45.74987218672686,21.232539711499463],[45.75068041877819,21.225414227176724]],"distance":784,"time":140.2},{"waypoints":[[45.74834549425301,21.229706687612097],[45.74798626642583,21.225242528759317]],"distance":357.3,"time":34},{"waypoints":[[45.74834549425301,21.229706687612097],[45.75068041877819,21.225414227176724]],"distance":836.4,"time":84.6},{"waypoints":[[45.74798626642583,21.225242528759317],[45.75068041877819,21.225414227176724]],"distance":1399.7,"time":134.8}]}'
x = parse_into_matrix(data)
print(convert_to_final(greedy_approximation(x[0], 0), x[2]))
