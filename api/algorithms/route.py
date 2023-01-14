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
    
    # Implement a hard limit for the biggest 
    # data we can process so we don't run out of memory

    assert(len(ids) < 1024)
    matrix_size = len(ids)
    matrix = [[None for i in range(matrix_size)] for j in range(matrix_size)]
    for x in response["data"]:
        first_node = ids.index(x["waypoints"][0])
        second_node = ids.index(x["waypoints"][1])
        matrix[first_node][second_node] = (x["time"], x["distance"])
        matrix[second_node][first_node] = (x["time"], x["distance"])
    return (matrix, ids)
    
# Brute Force Approach

def permutations(elements):
    if len(elements) <= 1:
        yield elements
        return
    for perm in permutations(elements[1:]):
        for i in range(len(elements)):
            yield perm[:i] + elements[0:1] + perm[i:]

def brute_force(matrix, data_type = 0):
    elems = [i for i in range(len(matrix[0]))]
    perms = permutations(elems)
    for i in perms:
        print(i)

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

brute_force([[0,1,2]])