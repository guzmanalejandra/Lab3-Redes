const readline = require("readline");

function flooding(graph, start) {
    let visited = {}; // Nodos visitados
    let queue = [start]; // se hace uso de cola para ver los nodos visitados 

    while (queue.length > 0) {
        let currentNode = queue.shift(); // Obtener el primer nodo

        // Marcar el nodo como visitado
        visited[currentNode] = true;

        // Manda el mensaje a todos los vecinos menos al actual
        for (let neighbor of graph[currentNode]) {
            if (!visited[neighbor]) {
                visited[neighbor] = true; 
                queue.push(neighbor);
            }
        }
    }

    return Object.keys(visited); // Lista de los nodos visitados
}


function tablaEnrutamiento(nodesReached, start, message) {
    let routingTable = {};
    routingTable["from"] = start;
    routingTable["message"] = message;
    routingTable["nodesReached"] = nodesReached;

    return routingTable;
}
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

let graph = {
    A: ['B', 'C', 'E'],
    B: ['A', 'C', 'D', 'F'],
    C: ['A', 'B', 'D', 'G'],
    D: ['B', 'C', 'H', 'I'],
    E: ['A', 'F'],
    F: ['B', 'E', 'G'],
    G: ['C', 'F', 'H'],
    H: ['D', 'G', 'I', 'J'],
    I: ['D', 'H'],
    J: ['H']
};

console.log("Grafo: ");
console.log(graph);

// Nodo de inicio
rl.question("Ingrese el nodo de inicio: ", function(start) {
    // Mensaje
    rl.question("Ingrese un mensaje: ", function(message) {
        console.log("El mensaje es: " + message);

        let nodesReached = flooding(graph, start);
        console.log("Nodos que recibieron el mensaje: ", nodesReached.join(", "));
        console.log("Tabla de enrutamiento: ");
        console.log(tablaEnrutamiento(nodesReached, start, message));
        
        rl.close();
    });
});
