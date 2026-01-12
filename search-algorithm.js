class SearchAlgorithmVisualizer {
    constructor() {
        this.graph = this.createDemoGraph();
        this.openSet = [];
        this.closedSet = new Set();
        this.currentNode = null;
        this.goalNode = "G";
        this.stepCounter = 0;
        this.animationSpeed = 1000;
        this.isRunning = false;
    }

    createDemoGraph() {
        const nodes = {};
        const gridSize = 4;

        for (let row = 0; row < gridSize; row++) {
            for (let col = 0; col < gridSize; col++) {
                const id = `N${row}${col}`;
                nodes[id] = {
                    id: id,
                    x: col * 80 + 40,
                    y: row * 60 + 40,
                    cost: Infinity,
                    heuristic: 0,
                    previous: null,
                    neighbors: []
                };
            }
        }
        
        for (let row = 0; row < gridSize; row++) {
            for (let col = 0; col < gridSize; col++) {
                const node = nodes[`N${row}${col}`];
                
                // Add neighbors with costs
                if (row > 0) node.neighbors.push({ id: `N${row-1}${col}`, cost: 1 + Math.random() });
                if (row < gridSize - 1) node.neighbors.push({ id: `N${row+1}${col}`, cost: 1 + Math.random() });
                if (col > 0) node.neighbors.push({ id: `N${row}${col-1}`, cost: 1 + Math.random() });
                if (col < gridSize - 1) node.neighbors.push({ id: `N${row}${col+1}`, cost: 1 + Math.random() });

                const goalRow = 3;
                const goalCol = 3;
                node.heuristic = Math.abs(row - goalRow) + Math.abs(col - goalCol);
            }
        }

        nodes["N00"].isStart = true;
        nodes["N33"].isGoal = true;
        nodes["N00"].cost = 0;
        
        return nodes;
    }

    reset() {
        this.graph = this.createDemoGraph();
        this.openSet = [];
        this.closedSet = new Set();
        this.currentNode = null;
        this.stepCounter = 0;
        this.isRunning = false;

        this.openSet.push({ id: "N00", fScore: this.graph["N00"].heuristic });
        this.currentNode = "N00";
    }

    async visualizeDijkstra() {
        this.reset();
        this.isRunning = true;
        
        while (this.isRunning && this.openSet.length > 0) {
            this.stepCounter++;

            this.openSet.sort((a, b) => a.fScore - b.fScore);
            const current = this.openSet.shift();
            this.currentNode = current.id;

            this.closedSet.add(current.id);

            this.updateAlgorithmDisplay();

            if (current.id === this.goalNode) {
                this.showPath();
                this.isRunning = false;
                return this.reconstructPath();
            }
        
            const neighbors = this.graph[current.id].neighbors;
            for (const neighbor of neighbors) {
                if (this.closedSet.has(neighbor.id)) continue;
                
                const tentativeCost = this.graph[current.id].cost + neighbor.cost;
                const existingNode = this.openSet.find(n => n.id === neighbor.id);
                
                if (!existingNode) {
                    // New node discovered
                    this.graph[neighbor.id].cost = tentativeCost;
                    this.graph[neighbor.id].previous = current.id;
                    
                    const fScore = tentativeCost; // Dijkstra uses only g-cost
                    this.openSet.push({ id: neighbor.id, fScore: fScore });
                } else if (tentativeCost < this.graph[neighbor.id].cost) {
                    // Found better path
                    this.graph[neighbor.id].cost = tentativeCost;
                    this.graph[neighbor.id].previous = current.id;
                    
                    existingNode.fScore = tentativeCost;
                }
            }

            await this.sleep(this.animationSpeed);
        }
        
        return null; // No path found
    }

    async visualizeAStar() {
        this.reset();
        this.isRunning = true;
        
        while (this.isRunning && this.openSet.length > 0) {
            this.stepCounter++;

            this.openSet.sort((a, b) => a.fScore - b.fScore);
            const current = this.openSet.shift();
            this.currentNode = current.id;

            this.closedSet.add(current.id);

            this.updateAlgorithmDisplay();

            if (current.id === this.goalNode) {
                this.showPath();
                this.isRunning = false;
                return this.reconstructPath();
            }
            const neighbors = this.graph[current.id].neighbors;
            for (const neighbor of neighbors) {
                if (this.closedSet.has(neighbor.id)) continue;
                
                const tentativeCost = this.graph[current.id].cost + neighbor.cost;
                const existingNode = this.openSet.find(n => n.id === neighbor.id);
                
                if (!existingNode) {
                    // New node discovered
                    this.graph[neighbor.id].cost = tentativeCost;
                    this.graph[neighbor.id].previous = current.id;
                    
                    const fScore = tentativeCost + this.graph[neighbor.id].heuristic;
                    this.openSet.push({ id: neighbor.id, fScore: fScore });
                } else if (tentativeCost < this.graph[neighbor.id].cost) {
                    // Found better path
                    this.graph[neighbor.id].cost = tentativeCost;
                    this.graph[neighbor.id].previous = current.id;
                    
                    existingNode.fScore = tentativeCost + this.graph[neighbor.id].heuristic;
                }
            }
            

            await this.sleep(this.animationSpeed);
        }
        
        return null; 
    }

    reconstructPath() {
        const path = [];
        let currentNode = this.goalNode;
        
        while (currentNode) {
            path.unshift(currentNode);
            currentNode = this.graph[currentNode].previous;
        }
        
        return path;
    }

    showPath() {
        const path = this.reconstructPath();
        path.forEach(nodeId => {
            const node = this.graph[nodeId];
            node.onPath = true;
        });
        this.updateAlgorithmDisplay();
    }

    updateAlgorithmDisplay() {
        const algoGrid = document.getElementById('algo-grid');
        if (!algoGrid) return;
        
        algoGrid.innerHTML = '';
        
        const gridSize = 4;
        
        for (let row = 0; row < gridSize; row++) {
            for (let col = 0; col < gridSize; col++) {
                const nodeId = `N${row}${col}`;
                const node = this.graph[nodeId];
                
                const nodeElement = document.createElement('div');
                nodeElement.className = 'algo-node';
                nodeElement.id = `node-${nodeId}`;
                nodeElement.style.gridColumn = col + 1;
                nodeElement.style.gridRow = row + 1;

                if (node.isStart) nodeElement.classList.add('start');
                if (node.isGoal) nodeElement.classList.add('goal');
                if (this.closedSet.has(nodeId)) nodeElement.classList.add('visited');
                if (this.openSet.find(n => n.id === nodeId)) nodeElement.classList.add('frontier');
                if (node.onPath) nodeElement.classList.add('path');
                if (nodeId === this.currentNode) nodeElement.classList.add('current');

                const nodeIdSpan = document.createElement('div');
                nodeIdSpan.className = 'node-id';
                nodeIdSpan.textContent = nodeId;
                
                const nodeCostSpan = document.createElement('div');
                nodeCostSpan.className = 'node-cost';
                nodeCostSpan.textContent = node.cost === Infinity ? '∞' : node.cost.toFixed(1);
                
                const nodeHeuristicSpan = document.createElement('div');
                nodeHeuristicSpan.className = 'node-heuristic';
                nodeHeuristicSpan.textContent = `h=${node.heuristic}`;
                
                nodeElement.appendChild(nodeIdSpan);
                nodeElement.appendChild(nodeCostSpan);
                nodeElement.appendChild(nodeHeuristicSpan);
                
                algoGrid.appendChild(nodeElement);
            }
        }

        const stepElement = document.getElementById('algo-step');
        if (stepElement) {
            stepElement.textContent = `Step ${this.stepCounter}`;
        }
    }

    createLegend() {
        return `
            <div class="algorithm-legend">
                <div class="legend-item">
                    <div class="legend-color start"></div>
                    <span>Start Node</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color goal"></div>
                    <span>Goal Node</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color visited"></div>
                    <span>Visited (Closed Set)</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color frontier"></div>
                    <span>Frontier (Open Set)</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color current"></div>
                    <span>Current Node</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color path"></div>
                    <span>Optimal Path</span>
                </div>
            </div>
        `;
    }

    explainStep() {
        const explanations = [
            "Step 1: Initialize with start node in open set",
            "Step 2: Select node with lowest cost from open set",
            "Step 3: Move selected node to closed set",
            "Step 4: Explore neighbors of current node",
            "Step 5: Update costs and add new nodes to open set",
            "Step 6: Check if goal is reached",
            "Step 7: Repeat until goal found or open set empty",
            "Step 8: Reconstruct optimal path from goal to start"
        ];
        
        return explanations[Math.min(this.stepCounter - 1, explanations.length - 1)] || "Algorithm completed";
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    stop() {
        this.isRunning = false;
    }

    setSpeed(speed) {
        this.animationSpeed = speed;
    }
}

window.SearchAlgorithmVisualizer = SearchAlgorithmVisualizer;

window.searchVisualizer = new SearchAlgorithmVisualizer();
