from collections import defaultdict


class Graph:

    def __init__(self, directed):
        self.edges = defaultdict(list)
        self.weights = {}
        self.directed = directed

    def __repr__(self):
        pass

    def __delitem__(self, key):
        del self.edges[key]

    def add_edge(self, from_node, to_node, weight):

        self.edges[from_node].append(to_node)
        self.weights[(from_node, to_node)] = weight

        if not self.directed:
            self.edges[to_node].append(from_node)
            self.weights[(to_node, from_node)] = weight

    def remove_edge(self, from_node, to_node):

        self.edges[from_node].remove(to_node)
        del self.weights[(from_node, to_node)]

        if not self.directed:
            self.edges[to_node].remove(from_node)
            del self.weights[(to_node, from_node)]

    def clear(self):

        self.edges.clear()
        self.weights.clear()


def DIJKSTRA(initial, end, graph):

    shortest_paths = {initial: (None, 0)}
    current_node = initial
    visited = set()

    while current_node != end:
        visited.add(current_node)
        destinations = graph.edges[current_node]
        weight_to_current_node = shortest_paths[current_node][1]

        for next_node in destinations:
            weight = graph.weights[(current_node, next_node)] + weight_to_current_node
            if next_node not in shortest_paths:
                shortest_paths[next_node] = (current_node, weight)
            else:
                current_shortest_weight = shortest_paths[next_node][1]
                if current_shortest_weight > weight:
                    shortest_paths[next_node] = (current_node, weight)

        next_destinations = {node: shortest_paths[node] for node in shortest_paths if node not in visited}
        if not next_destinations:
            return

        current_node = min(next_destinations, key=lambda k: next_destinations[k][1])

    path = []
    while current_node is not None:
        path.append(current_node)
        next_node = shortest_paths[current_node][0]
        current_node = next_node

    return path[::-1]