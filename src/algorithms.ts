import { Node } from "./node";
import { Grid } from "./grid";

export interface SearchResult {
  expandedNodes: Node[];
  path: Node[];
}

export enum Algo {
  Dijkstra = "Dijkstra",
  Bfs = "Breath First Search",
  Dfs = "Depth First Search",
}

export function dijkstra(grid: Grid): SearchResult {
  const startNode = grid.getStartNode();
  const endNode = grid.getEndNode();

  const queue: Node[] = [];
  const visited: Set<Node> = new Set();
  const previous: Map<Node, Node | undefined> = new Map();
  const distance: Map<Node, number> = new Map();

  distance.set(startNode, 0);
  queue.push(startNode);

  while (queue.length > 0) {
    queue.sort((a, b) => distance.get(a)! - distance.get(b)!);
    const currentNode = queue.shift();
    visited.add(currentNode!);
    if (currentNode === endNode) {
      break;
    }

    const neighbors = grid.successors(currentNode!);
    for (const neighbour of neighbors) {
      const tentativeDistance =
        distance.get(currentNode!)! +
        grid.cost(
          neighbour.row - currentNode!.row,
          neighbour.col - currentNode!.col,
        );
      if (
        !visited.has(neighbour) &&
        (distance.get(neighbour) === undefined ||
          tentativeDistance < distance.get(neighbour)!)
      ) {
        distance.set(neighbour, tentativeDistance);
        previous.set(neighbour, currentNode);
        queue.push(neighbour);
      }
    }
  }

  return getPath(visited, previous, endNode);
}


export function bfs(grid: Grid): SearchResult {
  const startNode = grid.getStartNode();
  const endNode = grid.getEndNode();

  const queue: Node[] = [];
  const visited: Set<Node> = new Set();
  const previous: Map<Node, Node | undefined> = new Map();

  queue.push(startNode);
  visited.add(startNode);

  while (queue.length > 0) {
    const currentNode = queue.shift();
    if (currentNode === endNode) {
      break;
    }

    const neighbors = grid.successors(currentNode!);
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        queue.push(neighbor);
        visited.add(neighbor);
        previous.set(neighbor, currentNode);
      }
    }
  }

  return getPath(visited, previous, endNode);
}

export function dfs(grid: Grid): SearchResult {
  const startNode = grid.getStartNode();
  const endNode = grid.getEndNode();

  const visited: Set<Node> = new Set();
  const previous: Map<Node, Node | undefined> = new Map();

  function dfsRecursive(node: Node) {
    visited.add(node);

    if (node === endNode) {
      return true;
    }

    const neighbors = grid.successors(node);
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        previous.set(neighbor, node);
        if (dfsRecursive(neighbor)) {
          return true;
        }
      }
    }

    return false;
  }

  dfsRecursive(startNode);

  return getPath(visited, previous, endNode);
}



function getPath(visited: Set<Node>, previous: Map<Node, Node | undefined>, endNode: Node): SearchResult {
  const expandedNodes = Array.from(visited);
  const path: Node[] = [];
  let currentNode: Node | undefined = endNode;
  while (currentNode !== undefined) {
    path.unshift(currentNode);
    currentNode = previous.get(currentNode);
  }

  return { expandedNodes, path };
}
