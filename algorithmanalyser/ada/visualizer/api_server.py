from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def merge_sort_steps(arr):
    steps = []
    def ms(a, l, r, depth=0):
        if l < r:
            m = (l + r) // 2
            steps.append(f"{'  '*depth}Dividing: {a[l:r+1]}")
            ms(a, l, m, depth+1)
            ms(a, m+1, r, depth+1)
            left = a[l:m+1]
            right = a[m+1:r+1]
            i = j = 0
            k = l
            steps.append(f"{'  '*depth}Merging: {left} and {right}")
            while i < len(left) and j < len(right):
                steps.append(f"{'  '*depth}Compare {left[i]} and {right[j]}")
                if left[i] < right[j]:
                    a[k] = left[i]
                    steps.append(f"{'  '*depth}Insert {left[i]} at position {k}")
                    i += 1
                else:
                    a[k] = right[j]
                    steps.append(f"{'  '*depth}Insert {right[j]} at position {k}")
                    j += 1
                k += 1
            while i < len(left):
                a[k] = left[i]
                steps.append(f"{'  '*depth}Insert {left[i]} at position {k}")
                i += 1
                k += 1
            while j < len(right):
                a[k] = right[j]
                steps.append(f"{'  '*depth}Insert {right[j]} at position {k}")
                j += 1
                k += 1
            steps.append(f"{'  '*depth}After merge: {a[l:r+1]}")
    arr_copy = arr[:]
    ms(arr_copy, 0, len(arr_copy)-1)
    steps.append(f"Sorted array: {arr_copy}")
    return steps

def quick_sort_steps(arr, pivot_strategy='last', pivot_index=None):
    steps = []
    def qs(a, l, r, depth=0):
        if l < r:
            # Handle pivot selection as per strategy
            if pivot_strategy == 'first':
                a[l], a[r] = a[r], a[l]
                steps.append(f"{'  '*depth}Pivot strategy: first element (index {l})")
            elif pivot_strategy == 'random':
                import random
                idx = random.randint(l, r)
                a[idx], a[r] = a[r], a[idx]
                steps.append(f"{'  '*depth}Pivot strategy: random element (index {idx})")
            elif pivot_strategy == 'custom' and pivot_index is not None and l <= pivot_index <= r:
                a[pivot_index], a[r] = a[r], a[pivot_index]
                steps.append(f"{'  '*depth}Pivot strategy: custom index {pivot_index}")
            else:
                steps.append(f"{'  '*depth}Pivot strategy: last element (index {r})")
            pivot = a[r]
            i = l - 1
            steps.append(f"{'  '*depth}Partitioning: {a[l:r+1]}, pivot={pivot}")
            for j in range(l, r):
                steps.append(f"{'  '*depth}Compare a[{j}]={a[j]} with pivot={pivot}")
                if a[j] <= pivot:
                    i += 1
                    a[i], a[j] = a[j], a[i]
                    steps.append(f"{'  '*depth}Swap a[{i}] and a[{j}]: {a}")
            a[i+1], a[r] = a[r], a[i+1]
            steps.append(f"{'  '*depth}Swap a[{i+1}] and a[{r}]: {a}")
            pi = i+1
            steps.append(f"{'  '*depth}Pivot {pivot} placed at index {pi}")
            qs(a, l, pi-1, depth+1)
            qs(a, pi+1, r, depth+1)
    arr_copy = arr[:]
    qs(arr_copy, 0, len(arr_copy)-1)
    steps.append(f"Sorted array: {arr_copy}")
    return steps

def merge_sort_tree(arr):
    def ms(a, l, r):
        node = {'range': [l, r], 'array': a[l:r+1]}
        if l < r:
            m = (l + r) // 2
            node['left'] = ms(a, l, m)
            node['right'] = ms(a, m+1, r)
            merged = []
            left = a[l:m+1]
            right = a[m+1:r+1]
            i = j = 0
            while i < len(left) and j < len(right):
                if left[i] < right[j]:
                    merged.append(left[i])
                    i += 1
                else:
                    merged.append(right[j])
                    j += 1
            while i < len(left):
                merged.append(left[i])
                i += 1
            while j < len(right):
                merged.append(right[j])
                j += 1
            node['merged'] = merged
        return node
    arr_copy = arr[:]
    return ms(arr_copy, 0, len(arr_copy)-1)

def selection_sort_steps(arr):
    steps = []
    arr_copy = arr[:]
    n = len(arr_copy)
    for i in range(n):
        min_idx = i
        steps.append(f"Step {i+1}: Start from index {i}, current array: {arr_copy}")
        for j in range(i+1, n):
            steps.append(f"  Compare arr[{j}]={arr_copy[j]} with current min arr[{min_idx}]={arr_copy[min_idx]}")
            if arr_copy[j] < arr_copy[min_idx]:
                min_idx = j
                steps.append(f"  New min found at index {min_idx}: {arr_copy[min_idx]}")
        arr_copy[i], arr_copy[min_idx] = arr_copy[min_idx], arr_copy[i]
        steps.append(f"  Swap arr[{i}] and arr[{min_idx}]: {arr_copy}")
    steps.append(f"Sorted array: {arr_copy}")
    return steps

def topo_sort_steps(graph):
    visited = set()
    stack = []
    steps = []
    def dfs(v, depth=0):
        visited.add(v)
        steps.append(f"{'  '*depth}Visit {v}, stack: {stack}, visited: {sorted(visited)}")
        for neighbor in graph.get(v, []):
            if neighbor not in visited:
                steps.append(f"{'  '*depth}Go deeper from {v} to {neighbor}")
                dfs(neighbor, depth+1)
            else:
                steps.append(f"{'  '*depth}Already visited {neighbor}")
        stack.append(v)
        steps.append(f"{'  '*depth}Push {v} to stack: {stack}")
    for node in graph:
        if node not in visited:
            steps.append(f"Start DFS from {node}")
            dfs(node)
    stack.reverse()
    steps.append(f"Topological order: {stack}")
    return steps, stack

def activity_selection_steps(activities):
    acts = sorted(activities, key=lambda x: x[1])
    selected = []
    last_end = -1
    steps = []
    for start, end in acts:
        if start >= last_end:
            selected.append((start, end))
            steps.append(f"Select activity ({start}, {end})")
            last_end = end
        else:
            steps.append(f"Skip activity ({start}, {end})")
    steps.append(f"Selected: {selected}")
    return steps, selected

def floyd_warshall_steps(matrix):
    n = len(matrix)
    dist = [row[:] for row in matrix]
    steps = [f"Initial matrix: {dist}"]
    matrices = [[row[:] for row in dist]]  # Store initial matrix
    for k in range(n):
        steps.append(f"Using node {k} as intermediate:")
        for i in range(n):
            for j in range(n):
                if dist[i][j] > dist[i][k] + dist[k][j]:
                    old = dist[i][j]
                    dist[i][j] = dist[i][k] + dist[k][j]
                    steps.append(f"  Update dist[{i}][{j}] from {old} to {dist[i][j]} (via {k})")
        matrices.append([row[:] for row in dist])  # Store after each k
    steps.append(f"Final matrix: {dist}")
    return steps, dist, matrices

@app.route('/api/floyd-warshall', methods=['POST'])
def api_floyd_warshall():
    data = request.get_json()
    matrix = data.get('matrix')
    if not (isinstance(matrix, list) and all(isinstance(row, list) and len(row) == len(matrix) for row in matrix)):
        return jsonify({'error': 'Input must be a square adjacency matrix.'}), 400
    try:
        n = len(matrix)
        mat = []
        for i in range(n):
            row = []
            for j in range(n):
                val = matrix[i][j]
                if i == j:
                    row.append(0)
                elif val == 0:
                    row.append(float('inf'))
                else:
                    row.append(val)
            mat.append(row)
        steps, result, matrices = floyd_warshall_steps(mat)
        return jsonify({'result': result, 'steps': steps, 'matrices': matrices})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def warshall_steps(matrix):
    n = len(matrix)
    closure = [row[:] for row in matrix]
    steps = [f"Initial matrix: {closure}"]
    matrices = [[row[:] for row in closure]]
    for k in range(n):
        steps.append(f"Using node {k} as intermediate:")
        for i in range(n):
            for j in range(n):
                if closure[i][j] or (closure[i][k] and closure[k][j]):
                    if not closure[i][j]:
                        steps.append(f"  Path from {i} to {j} via {k} found. Set closure[{i}][{j}] = 1")
                    closure[i][j] = 1
        matrices.append([row[:] for row in closure])
    steps.append(f"Transitive closure: {closure}")
    return steps, closure, matrices

@app.route('/api/warshall', methods=['POST'])
def api_warshall():
    data = request.get_json()
    matrix = data.get('matrix')
    if not (isinstance(matrix, list) and all(isinstance(row, list) and len(row) == len(matrix) for row in matrix)):
        return jsonify({'error': 'Input must be a square adjacency matrix.'}), 400
    try:
        # Ensure all values are 0 or 1
        for row in matrix:
            for x in row:
                if x not in (0, 1):
                    return jsonify({'error': 'Matrix must contain only 0 or 1.'}), 400
        steps, closure, matrices = warshall_steps(matrix)
        return jsonify({'result': closure, 'steps': steps, 'matrices': matrices})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def topo_sort_kahn_steps(matrix):
    n = len(matrix)
    indegree = [0]*n
    for i in range(n):
        for j in range(n):
            if matrix[i][j]:
                indegree[j] += 1
    order = []
    steps = [f"Initial indegrees: {indegree}"]
    queue = [i for i in range(n) if indegree[i] == 0]
    steps.append(f"Start with zero indegree nodes: {queue}")
    while queue:
        u = queue.pop(0)
        order.append(u)
        steps.append(f"Remove vertex {u}, current order: {order}")
        for v in range(n):
            if matrix[u][v]:
                indegree[v] -= 1
                steps.append(f"  Decrement indegree of {v} to {indegree[v]}")
                if indegree[v] == 0:
                    queue.append(v)
                    steps.append(f"  Add {v} to queue")
    if len(order) != n:
        steps.append("Cycle detected! No topological order.")
        return steps, None
    steps.append(f"Topological order: {order}")
    return steps, order

@app.route('/api/topo-sort', methods=['POST'])
def api_topo_sort():
    data = request.get_json()
    matrix = data.get('matrix')
    if not (isinstance(matrix, list) and all(isinstance(row, list) and len(row) == len(matrix) for row in matrix)):
        return jsonify({'error': 'Input must be a square adjacency matrix.'}), 400
    try:
        steps, order = topo_sort_kahn_steps(matrix)
        if order is None:
            return jsonify({'error': 'Cycle detected! No topological order.', 'steps': steps})
        return jsonify({'result': order, 'steps': steps, 'matrix': matrix})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/activity-selection', methods=['POST'])
def api_activity_selection():
    data = request.get_json()
    activities = data.get('activities')
    if not (isinstance(activities, list) and all(isinstance(x, list) and len(x) == 2 for x in activities)):
        return jsonify({'error': 'Input must be a list of [start, end] pairs.'}), 400
    try:
        steps, selected = activity_selection_steps(activities)
        return jsonify({'result': selected, 'steps': steps})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def build_merge_sort_tree(arr, l, r):
    node = {
        'range': [l, r],
        'array': arr[l:r+1],
        'left': None,
        'right': None,
        'merged': None
    }
    if l == r:
        return node
    m = (l + r) // 2
    node['left'] = build_merge_sort_tree(arr, l, m)
    node['right'] = build_merge_sort_tree(arr, m+1, r)
    merged = []
    L = arr[l:m+1]
    R = arr[m+1:r+1]
    i = j = 0
    while i < len(L) and j < len(R):
        if L[i] < R[j]:
            merged.append(L[i])
            i += 1
        else:
            merged.append(R[j])
            j += 1
    while i < len(L):
        merged.append(L[i])
        i += 1
    while j < len(R):
        merged.append(R[j])
        j += 1
    node['merged'] = merged
    return node

@app.route('/api/merge-sort', methods=['POST'])
def api_merge_sort():
    data = request.get_json()
    arr = data.get('array')
    if not isinstance(arr, list):
        return jsonify({'error': 'Input must be a list.'}), 400
    arr_copy = arr[:]
    def merge_sort(a):
        if len(a) <= 1:
            return a
        m = len(a) // 2
        L = merge_sort(a[:m])
        R = merge_sort(a[m:])
        res = []
        i = j = 0
        while i < len(L) and j < len(R):
            if L[i] < R[j]:
                res.append(L[i])
                i += 1
            else:
                res.append(R[j])
                j += 1
        while i < len(L):
            res.append(L[i])
            i += 1
        while j < len(R):
            res.append(R[j])
            j += 1
        return res
    sorted_arr = merge_sort(arr_copy)
    tree = build_merge_sort_tree(arr_copy, 0, len(arr_copy)-1) if arr_copy else None
    steps = merge_sort_steps(arr[:])
    return jsonify({'result': sorted_arr, 'tree': tree, 'steps': steps})

@app.route('/api/quick-sort', methods=['POST'])
def api_quick_sort():
    data = request.get_json()
    arr = data.get('array')
    pivot_strategy = data.get('pivot_strategy', 'last')
    pivot_index = data.get('pivot_index', None)
    if not isinstance(arr, list):
        return jsonify({'error': 'Input must be a list.'}), 400
    try:
        def quick_sort(arr):
            def partition(a, l, r):
                if pivot_strategy == 'first':
                    a[l], a[r] = a[r], a[l]
                elif pivot_strategy == 'random':
                    import random
                    idx = random.randint(l, r)
                    a[idx], a[r] = a[r], a[idx]
                elif pivot_strategy == 'custom' and pivot_index is not None and l <= pivot_index <= r:
                    a[pivot_index], a[r] = a[r], a[pivot_index]
                # else: default is last element as pivot
                pivot = a[r]
                i = l - 1
                for j in range(l, r):
                    if a[j] <= pivot:
                        i += 1
                        a[i], a[j] = a[j], a[i]
                a[i+1], a[r] = a[r], a[i+1]
                return i+1
            def qs(a, l, r):
                if l < r:
                    pi = partition(a, l, r)
                    qs(a, l, pi-1)
                    qs(a, pi+1, r)
            arr_copy = arr[:]
            qs(arr_copy, 0, len(arr_copy)-1)
            return arr_copy
        result = quick_sort(arr[:])
        steps = quick_sort_steps(arr[:], pivot_strategy, pivot_index)
        return jsonify({'result': result, 'steps': steps})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/selection-sort', methods=['POST'])
def api_selection_sort():
    data = request.get_json()
    arr = data.get('array')
    if not isinstance(arr, list):
        return jsonify({'error': 'Input must be a list.'}), 400
    try:
        # Define the sorting logic locally to remove external dependency
        def local_selection_sort(a):
            arr_copy = a[:]
            n = len(arr_copy)
            for i in range(n):
                min_idx = i
                for j in range(i + 1, n):
                    if arr_copy[j] < arr_copy[min_idx]:
                        min_idx = j
                arr_copy[i], arr_copy[min_idx] = arr_copy[min_idx], arr_copy[i]
            return arr_copy
        result = local_selection_sort(arr[:])
        steps = selection_sort_steps(arr[:])
        return jsonify({'result': result, 'steps': steps})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/knapsack', methods=['POST'])
def api_knapsack():
    data = request.get_json()
    weights = data.get('weights')
    profits = data.get('profits')
    capacity = data.get('capacity')
    if not (isinstance(weights, list) and isinstance(profits, list) and isinstance(capacity, int)):
        return jsonify({'error': 'Input must be weights (list), profits (list), and capacity (int).'}), 400
    try:
        n = len(weights)
        W = capacity
        dp = [[0]*(W+1) for _ in range(n+1)]
        steps = []
        for i in range(1, n+1):
            for w in range(W+1):
                if weights[i-1] <= w:
                    include = profits[i-1] + dp[i-1][w-weights[i-1]]
                    exclude = dp[i-1][w]
                    dp[i][w] = max(exclude, include)
                    if include > exclude:
                        steps.append(f"dp[{i}][{w}] = {dp[i][w]} (Include item {i-1}: profit={profits[i-1]}, weight={weights[i-1]}; compare {exclude} (exclude) vs {include} (include))")
                    else:
                        steps.append(f"dp[{i}][{w}] = {dp[i][w]} (Exclude item {i-1}: profit={profits[i-1]}, weight={weights[i-1]}; compare {exclude} (exclude) vs {include} (include))")
                else:
                    dp[i][w] = dp[i-1][w]
                    steps.append(f"dp[{i}][{w}] = {dp[i][w]} (Cannot include item {i-1}: weight={weights[i-1]} > capacity {w}; carry over {dp[i-1][w]})")
        # Traceback to find selected items
        res = dp[n][W]
        w = W
        items = []
        for i in range(n, 0, -1):
            if dp[i][w] != dp[i-1][w]:
                items.append(i-1)
                w -= weights[i-1]
        items.reverse()
        steps.append(f"Selected items: {items}")
        return jsonify({'result': res, 'matrix': dp, 'items': items, 'steps': steps})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/prims', methods=['POST'])
def api_prims():
    data = request.get_json()
    matrix = data.get('matrix')
    if not (isinstance(matrix, list) and all(isinstance(row, list) and len(row) == len(matrix) for row in matrix)):
        return jsonify({'error': 'Input must be a square adjacency matrix.'}), 400
    try:
        import heapq
        n = len(matrix)
        selected = [False]*n
        edges = []
        min_e = [(0, 0, -1)] # (cost, to, from)
        total = 0
        steps = []
        while min_e:
            cost, u, frm = heapq.heappop(min_e)
            if selected[u]: continue
            selected[u] = True
            if frm != -1:
                edges.append((frm, u, cost))
                total += cost
                steps.append(f"Add edge ({frm}, {u}) with cost {cost}")
            for v in range(n):
                if not selected[v] and matrix[u][v] and matrix[u][v] != float('inf'):
                    heapq.heappush(min_e, (matrix[u][v], v, u))
        steps.append(f"MST edges: {edges}, total cost: {total}")
        return jsonify({'edges': edges, 'total': total, 'steps': steps})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/kruskal', methods=['POST'])
def api_kruskal():
    data = request.get_json()
    matrix = data.get('matrix')
    if not (isinstance(matrix, list) and all(isinstance(row, list) and len(row) == len(matrix) for row in matrix)):
        return jsonify({'error': 'Input must be a square adjacency matrix.'}), 400
    try:
        n = len(matrix)
        edges = []
        for i in range(n):
            for j in range(i+1, n):
                if matrix[i][j] and matrix[i][j] != float('inf'):
                    edges.append((matrix[i][j], i, j))
        edges.sort()
        parent = list(range(n))
        def find(u):
            while parent[u] != u:
                parent[u] = parent[parent[u]]
                u = parent[u]
            return u
        mst = []
        total = 0
        steps = []
        for cost, u, v in edges:
            pu, pv = find(u), find(v)
            if pu != pv:
                parent[pu] = pv
                mst.append((u, v, cost))
                total += cost
                steps.append(f"Add edge ({u}, {v}) with cost {cost}")
        steps.append(f"MST edges: {mst}, total cost: {total}")
        return jsonify({'edges': mst, 'total': total, 'steps': steps})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/dijkstra', methods=['POST'])
def api_dijkstra():
    data = request.get_json()
    matrix = data.get('matrix')
    source = data.get('source', 0)
    if not (isinstance(matrix, list) and all(isinstance(row, list) and len(row) == len(matrix) for row in matrix)):
        return jsonify({'error': 'Input must be a square adjacency matrix.'}), 400
    try:
        import heapq
        n = len(matrix)
        dist = [float('inf')]*n
        prev = [None]*n
        dist[source] = 0
        hq = [(0, source)]
        steps = [f"Start from source {source}"]
        while hq:
            d, u = heapq.heappop(hq)
            if d > dist[u]: continue
            steps.append(f"Visit node {u} with current distance {d}")
            for v in range(n):
                if matrix[u][v] and matrix[u][v] != float('inf'):
                    alt = dist[u] + matrix[u][v]
                    if alt < dist[v]:
                        dist[v] = alt
                        prev[v] = u
                        heapq.heappush(hq, (alt, v))
                        steps.append(f"Update distance of {v} to {alt} via {u}")
        # Reconstruct paths
        paths = []
        for t in range(n):
            if dist[t] == float('inf'): continue
            path = []
            x = t
            while x is not None:
                path.append(x)
                x = prev[x]
            paths.append(path[::-1])
        steps.append(f"Distances: {dist}")
        steps.append(f"Paths: {paths}")
        return jsonify({'distances': dist, 'paths': paths, 'steps': steps})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5002, debug=True)