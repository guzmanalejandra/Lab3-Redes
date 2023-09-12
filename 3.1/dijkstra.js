// ------------------Dikjstra's algorithm------------------

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

  let result = {
    opt_path: path,
    cost: distances[end],
  };

  return result;
}

function createMessageDikjstra(graph) {
  let results = {};

  for (let startNode in graph) {
    results[startNode] = {};
    for (let endNode in graph) {
      if (startNode !== endNode) {
        results[startNode][endNode] = dijkstra(graph, startNode, endNode);
      }
    }
  }
  return results;
}

function convertGraph(graph) {
  let newGraph = {};
  for (let key in graph) {
    newGraph[key] = Object.keys(graph[key]);
  }
  return newGraph;
}

// -------------------------Flooding-----------------------
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

// function main() {
//   const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout,
//   });

//   let initial_graph = {
//     A: { G: 9, D: 4, B: 5 },
//     B: { E: 8, F: 8, C: 9 },
//     C: { F: 1, E: 5, A: 2 },
//     D: { A: 5, B: 5, E: 10, F: 5, G: 10, C: 8 },
//     E: { D: 7, A: 10, F: 4, G: 1 },
//     F: { B: 4, A: 2, D: 2, C: 6 },
//     G: { B: 3 },
//   };

//   let graph = convertGraph(initial_graph);

//   console.log("Grafo: ");
//   console.log(graph);

//   // Nodo de inicio
//   rl.question("Ingrese el nodo de inicio: ", function (start) {
//     // Mensaje aka paquete
//     message = JSON.stringify(createMessageDikjstra(initial_graph));
//     console.log("El mensaje es: " + message);
//     let nodesReached = flooding(graph, start);
//     console.log("Nodos que recibieron el mensaje: ", nodesReached.join(", "));
//     console.log("Tabla de enrutamiento: ");
//     console.log(tablaEnrutamiento(nodesReached, start, message));
//   });
// }

function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const nodesInfo = {
    A: "messi10@alumchat.xyz",
    B: "mom20067@alumchat.xyz",
    C: "her20053@alumchat.xyz",
    D: "gon20362@alumchat.xyz",
    E: "superman@alumchat.xyz",
    F: "pablishi@alumchat.xyz",
    G: "joehueco@alumchat.xyz",
  };

  let initial_graph = {};

  let nodes = Object.keys(nodesInfo);

  function askForDistances(index) {
    if (index >= nodes.length) {
      // Finalizamos el proceso de ingreso de distancias y continuamos con el programa
      let graph = convertGraph(initial_graph);

      console.log("Grafo: ");
      console.log(graph);

      rl.question("Ingrese el nodo de inicio: ", function (start) {
        let message = JSON.stringify(createMessageDikjstra(initial_graph));
        console.log("El mensaje es: " + message);
        let nodesReached = flooding(graph, start);
        console.log(
          "Nodos que recibieron el mensaje: ",
          nodesReached.join(", ")
        );
        console.log("Tabla de enrutamiento: ");
        console.log(tablaEnrutamiento(nodesReached, start, message));
        rl.close();
      });
      return;
    }

    let currentNode = nodes[index];
    initial_graph[currentNode] = {};

    function askForNeighborDistances(nodeIndex) {
      if (nodeIndex >= nodes.length) {
        // Pasar al siguiente nodo principal
        askForDistances(index + 1);
        return;
      }
      if (nodes[nodeIndex] === currentNode) {
        // Si el nodo vecino es igual al nodo actual, simplemente pasamos al siguiente nodo vecino
        askForNeighborDistances(nodeIndex + 1);
        return;
      }

      rl.question(
        `Ingrese la distancia de ${currentNode} a ${nodes[nodeIndex]} (deje en blanco si no están conectados): `,
        function (distance) {
          if (distance.trim() !== "") {
            initial_graph[currentNode][nodes[nodeIndex]] = parseInt(
              distance,
              10
            );
          }
          askForNeighborDistances(nodeIndex + 1);
        }
      );
    }

    askForNeighborDistances(0);
  }

  askForDistances(0);
}

main();
