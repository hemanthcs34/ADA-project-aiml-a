def topological_sort(graph):
    visited = set()
    stack = []
    def dfs(v):
        visited.add(v)
        for neighbor in graph.get(v, []):
            if neighbor not in visited:
                dfs(neighbor)
        stack.append(v)
    for node in graph:
        if node not in visited:
            dfs(node)
    stack.reverse()
    return stack 