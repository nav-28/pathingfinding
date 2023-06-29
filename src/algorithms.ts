import { Edge } from './edge';
import { Grid } from './grid';

export interface SearchResult {
    expandedNodes: Edge[];
    path: Edge[];
}


export function dijkstra(grid: Grid): SearchResult {
    const startNode = grid.getStartNode();
    const endNode = grid.getEndNode();

    const queue: Edge[] = [];
    const visited: Set<Edge> = new Set();
    const previous: Map<Edge, Edge | undefined> = new Map();
    const distance: Map<Edge, number> = new Map();

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
            const tentativeDistance = distance.get(currentNode!)! + grid.cost(neighbour.row - currentNode!.row, neighbour.col - currentNode!.col);
            if (!visited.has(neighbour) && (distance.get(neighbour) === undefined || tentativeDistance < distance.get(neighbour)!)) {
                distance.set(neighbour, tentativeDistance);
                previous.set(neighbour, currentNode);
                queue.push(neighbour);
            }
        }
    }

    const expandedNodes = Array.from(visited);

    const path: Edge[] = [];
    let currentNode: Edge | undefined = endNode;
    while (currentNode !== undefined) {
        path.unshift(currentNode);
        currentNode = previous.get(currentNode);
    }

    return { expandedNodes, path };
}
