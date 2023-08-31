let initial_graph = {
    "A": {"G": 9, "D": 4, "B": 5},
    "B": {"E": 8, "F": 8, "C": 9},
    "C": {"F": 1, "E": 5, "A": 2},
    "D": {"A": 5, "B": 5, "E": 10, "F": 5, "G": 10, "C": 8},
    "E": {"D": 7, "A": 10, "F": 4, "G": 1},
    "F": {"B": 4, "A": 2, "D": 2, "C": 6},
    "G": {"B": 3}
};

function findSmallestNode(distances, visited) {
    let smallest = null;
    for (let node in distances) {
        if (smallest === null || distances[node] < distances[smallest]) {
            if (!visited.includes(node)) {
                smallest = node;
            }
        }
    }
    return smallest;
}

function dijkstra(graph, start, end) {
    let distances = {};
    let predecessors = {};
    let visited = [];

    for (let node in graph) {
        distances[node] = Infinity;
        predecessors[node] = null;
    }
    distances[start] = 0;

    let currentNode = start;

    while (currentNode) {
        let neighbors = graph[currentNode];
        for (let neighbor in neighbors) {
            let newDistance = distances[currentNode] + neighbors[neighbor];
            if (newDistance < distances[neighbor]) {
                distances[neighbor] = newDistance;
                predecessors[neighbor] = currentNode;
            }
        }
        visited.push(currentNode);
        currentNode = findSmallestNode(distances, visited);
    }

    let path = [end];
    let path_costs = {};
    let prevNode = end;
    while (prevNode !== start) {
        let cost = distances[prevNode] - distances[predecessors[prevNode]];
        path_costs[predecessors[prevNode] + "->" + prevNode] = cost;
        path.unshift(predecessors[prevNode]);
        prevNode = predecessors[prevNode];
    }

    // console.log("Shortest path:", path.join(" -> "));
    // for (let jump in path_costs) {
    //     console.log("Cost of", jump + ":", path_costs[jump]);
    // }
    return path
}

console.log(dijkstra(initial_graph, "G", "D"))
