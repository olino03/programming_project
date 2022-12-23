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
