// Enhanced Data for Parkora.ai simulation
const mockData = {
    locations: {
        start: { 
            id: "start", 
            name: "Current Location", 
            x: 15, 
            y: 15,
            icon: "fas fa-car",
            type: "start"
        },
        utm: { 
            id: "utm", 
            name: "UTM University", 
            x: 25, 
            y: 35,
            icon: "fas fa-university",
            type: "university",
            parking: {
                totalSpaces: 500,
                occupied: 450,
                costPerHour: 2.5,
                securityLevel: "high",
                walkingDistance: 5
            }
        },
        mall: { 
            id: "mall", 
            name: "Shopping Mall", 
            x: 75, 
            y: 45,
            icon: "fas fa-shopping-cart",
            type: "commercial",
            parking: {
                totalSpaces: 1000,
                occupied: 600,
                costPerHour: 5.0,
                securityLevel: "medium",
                walkingDistance: 2
            }
        },
        hospital: { 
            id: "hospital", 
            name: "City Hospital", 
            x: 55, 
            y: 75,
            icon: "fas fa-hospital",
            type: "hospital",
            parking: {
                totalSpaces: 300,
                occupied: 250,
                costPerHour: 3.0,
                securityLevel: "high",
                walkingDistance: 1
            }
        },
        airport: { 
            id: "airport", 
            name: "Airport", 
            x: 85, 
            y: 85,
            icon: "fas fa-plane",
            type: "airport",
            parking: {
                totalSpaces: 2000,
                occupied: 1800,
                costPerHour: 10.0,
                securityLevel: "high",
                walkingDistance: 8
            }
        },
        stadium: { 
            id: "stadium", 
            name: "Sports Stadium", 
            x: 35, 
            y: 85,
            icon: "fas fa-football-ball",
            type: "stadium",
            parking: {
                totalSpaces: 800,
                occupied: 750,
                costPerHour: 8.0,
                securityLevel: "medium",
                walkingDistance: 10
            }
        }
    },

    // Enhanced route network with multiple paths
    routeNetwork: {
        nodes: {
            A: { x: 15, y: 15, name: "Start" },
            B: { x: 25, y: 20, name: "Junction 1" },
            C: { x: 35, y: 25, name: "Junction 2" },
            D: { x: 25, y: 35, name: "UTM" },
            E: { x: 45, y: 30, name: "Junction 3" },
            F: { x: 55, y: 35, name: "Junction 4" },
            G: { x: 75, y: 45, name: "Mall" },
            H: { x: 45, y: 50, name: "Junction 5" },
            I: { x: 55, y: 75, name: "Hospital" },
            J: { x: 65, y: 60, name: "Junction 6" },
            K: { x: 85, y: 85, name: "Airport" },
            L: { x: 35, y: 85, name: "Stadium" },
            M: { x: 40, y: 70, name: "Junction 7" }
        },
        edges: [
            { from: "A", to: "B", distance: 3, congestion: 0.3 },
            { from: "B", to: "C", distance: 4, congestion: 0.2 },
            { from: "B", to: "D", distance: 2, congestion: 0.4 },
            { from: "C", to: "E", distance: 5, congestion: 0.3 },
            { from: "E", to: "F", distance: 4, congestion: 0.5 },
            { from: "F", to: "G", distance: 6, congestion: 0.4 },
            { from: "E", to: "H", distance: 3, congestion: 0.2 },
            { from: "H", to: "I", distance: 5, congestion: 0.3 },
            { from: "H", to: "J", distance: 4, congestion: 0.4 },
            { from: "J", to: "K", distance: 8, congestion: 0.6 },
            { from: "C", to: "M", distance: 7, congestion: 0.3 },
            { from: "M", to: "L", distance: 3, congestion: 0.5 }
        ]
    },

    trafficConditions: {
        peak: {
            level: "HIGH",
            color: "#ff6b6b",
            description: "Heavy traffic",
            timeMultiplier: 2.0,
            congestionFactor: 0.8
        },
        offpeak: {
            level: "LOW",
            color: "#4ecdc4",
            description: "Light traffic",
            timeMultiplier: 0.8,
            congestionFactor: 0.2
        },
        evening: {
            level: "MEDIUM",
            color: "#ffa726",
            description: "Moderate traffic",
            timeMultiplier: 1.2,
            congestionFactor: 0.5
        }
    },

    // Enhanced parking patterns with temporal knowledge
    parkingPatterns: {
        utm: { 
            peak: 0.2, 
            offpeak: 0.6, 
            evening: 0.4,
            trend: "decreasing",
            confidence: 0.85
        },
        mall: { 
            peak: 0.4, 
            offpeak: 0.8, 
            evening: 0.6,
            trend: "stable",
            confidence: 0.75
        },
        hospital: { 
            peak: 0.5, 
            offpeak: 0.7, 
            evening: 0.6,
            trend: "increasing",
            confidence: 0.90
        },
        airport: { 
            peak: 0.6, 
            offpeak: 0.9, 
            evening: 0.8,
            trend: "stable",
            confidence: 0.80
        },
        stadium: { 
            peak: 0.3, 
            offpeak: 0.8, 
            evening: 0.5,
            trend: "variable",
            confidence: 0.70
        }
    },

    states: {
        S0: { id: "S0", name: "APP_IDLE", color: "#4ecdc4", description: "Application open, no destination set" },
        S1: { id: "S1", name: "DEST_SET", color: "#00adb5", description: "Destination entered by the user" },
        S2: { id: "S2", name: "TRAFFIC_CHECK", color: "#2196f3", description: "System fetching live traffic data" },
        S3: { id: "S3", name: "LOW_TRAFFIC", color: "#4caf50", description: "Traffic congestion below threshold" },
        S4: { id: "S4", name: "HIGH_TRAFFIC", color: "#ff9800", description: "Traffic congestion above threshold" },
        S5: { id: "S5", name: "PARKING_CHECK", color: "#9c27b0", description: "System checking parking availability" },
        S6: { id: "S6", name: "PARKING_AVAIL", color: "#4caf50", description: "Available parking spots detected" },
        S7: { id: "S7", name: "NO_PARKING", color: "#f44336", description: "No parking spot available around destination" },
        S8: { id: "S8", name: "PREDICTING", color: "#ff9800", description: "ML model predicting future availability" },
        S9: { id: "S9", name: "ROUTE_CALC", color: "#2196f3", description: "Running Dijkstra/A* algorithm" },
        S10: { id: "S10", name: "ROUTE_READY", color: "#00adb5", description: "Optimal route computed" },
        S11: { id: "S11", name: "NAVIGATING", color: "#4ecdc4", description: "User following guided route" },
        S12: { id: "S12", name: "REROUTE_NEEDED", color: "#ff9800", description: "Traffic/parking change detected" },
        S13: { id: "S13", name: "PARKING_REACHED", color: "#4caf50", description: "User successfully parked" },
        S14: { id: "S14", name: "SESSION_END", color: "#607d8b", description: "Journey completed" }
    },

    // Scenarios from your state space document
    scenarios: {
        optimal: {
            name: "Optimal Path",
            description: "Low traffic + Available parking",
            traffic: "offpeak",
            parkingAvailable: true,
            sequence: ['S0', 'S1', 'S2', 'S3', 'S5', 'S6', 'S9', 'S10', 'S11', 'S13', 'S14']
        },
        highTrafficNoParking: {
            name: "High Traffic + No Parking",
            description: "Use when FETCH_PARKING returns NO_PARKING at high traffic",
            traffic: "peak",
            parkingAvailable: false,
            sequence: ['S0', 'S1', 'S2', 'S4', 'S5', 'S7', 'S8', 'S9', 'S10', 'S11', 'S12', 'S13', 'S14']
        },
        reroute: {
            name: "Mid-route Reroute",
            description: "Parking becomes unavailable during navigation",
            traffic: "evening",
            parkingAvailable: false,
            sequence: ['S0', 'S1', 'S2', 'S3', 'S5', 'S6', 'S9', 'S10', 'S11', 'S12', 'S11', 'S13', 'S14']
        },
        severeDelay: {
            name: "Severe Delay",
            description: "Parking slot lost with timer exceeding critical threshold",
            traffic: "peak",
            parkingAvailable: false,
            sequence: ['S0', 'S1', 'S2', 'S4', 'S5', 'S7', 'S8', 'S9', 'S10', 'S11', 'S9', 'S10', 'S11', 'S13', 'S14']
        }
    }
};

// Enhanced Knowledge Base for FOL reasoning
const knowledgeBase = {
    parkingLots: {
        utm: { available: true, occupiedSpaces: 450, totalSpaces: 500 },
        mall: { available: true, occupiedSpaces: 600, totalSpaces: 1000 },
        hospital: { available: false, occupiedSpaces: 250, totalSpaces: 300 },
        airport: { available: true, occupiedSpaces: 1800, totalSpaces: 2000 },
        stadium: { available: false, occupiedSpaces: 750, totalSpaces: 800 }
    },
    
    // First Order Logic predicates
    predicates: {
        ParkingLot: ['utm', 'mall', 'hospital', 'airport', 'stadium'],
        Available: function(lot) {
            const data = knowledgeBase.parkingLots[lot];
            return data && data.available;
        },
        Occupied: function(lot) {
            const data = knowledgeBase.parkingLots[lot];
            return data && (data.occupiedSpaces / data.totalSpaces) > 0.9;
        },
        Near: function(lot1, lot2) {
            // Simplified proximity check
            const locations = ['utm', 'mall', 'hospital', 'airport', 'stadium'];
            const idx1 = locations.indexOf(lot1);
            const idx2 = locations.indexOf(lot2);
            return Math.abs(idx1 - idx2) <= 1;
        }
    }
};

// Enhanced route finding with Dijkstra algorithm
function findOptimalRoute(startId, destinationId, trafficCondition) {
    const graph = createGraphFromNetwork();
    const startNode = "A"; // Always start from node A
    const destNode = getNodeForLocation(destinationId);
    
    if (!destNode) return null;
    
    const distances = {};
    const previous = {};
    const visited = new Set();
    const pq = new PriorityQueue();
    
    // Initialize distances
    for (const node in graph) {
        distances[node] = Infinity;
        previous[node] = null;
    }
    distances[startNode] = 0;
    pq.enqueue(startNode, 0);
    
    // Dijkstra's algorithm
    while (!pq.isEmpty()) {
        const currentNode = pq.dequeue().element;
        
        if (currentNode === destNode) break;
        if (visited.has(currentNode)) continue;
        visited.add(currentNode);
        
        const neighbors = graph[currentNode];
        for (const neighbor in neighbors) {
            const edgeCost = neighbors[neighbor];
            const trafficMultiplier = trafficCondition.timeMultiplier || 1;
            const totalCost = distances[currentNode] + (edgeCost * trafficMultiplier);
            
            if (totalCost < distances[neighbor]) {
                distances[neighbor] = totalCost;
                previous[neighbor] = currentNode;
                pq.enqueue(neighbor, totalCost);
            }
        }
    }
    
    // Reconstruct path
    const path = [];
    let currentNode = destNode;
    while (currentNode !== null) {
        path.unshift(currentNode);
        currentNode = previous[currentNode];
    }
    
    // Convert node path to coordinates
    const coordinates = path.map(nodeId => {
        const node = mockData.routeNetwork.nodes[nodeId];
        return [node.x, node.y];
    });
    
    const totalDistance = distances[destNode];
    const baseTime = totalDistance * 2; // 2 minutes per unit
    
    return {
        from: startId,
        to: destinationId,
        distance: totalDistance,
        normalTime: baseTime,
        trafficTime: baseTime * trafficCondition.timeMultiplier,
        path: path,
        coordinates: coordinates,
        nodes: path
    };
}

function createGraphFromNetwork() {
    const graph = {};
    
    // Initialize nodes
    for (const nodeId in mockData.routeNetwork.nodes) {
        graph[nodeId] = {};
    }
    
    // Add edges
    mockData.routeNetwork.edges.forEach(edge => {
        const congestion = edge.congestion || 0;
        const baseCost = edge.distance * (1 + congestion);
        
        graph[edge.from][edge.to] = baseCost;
        graph[edge.to][edge.from] = baseCost; // Undirected graph
    });
    
    return graph;
}

function getNodeForLocation(locationId) {
    const mapping = {
        'utm': 'D',
        'mall': 'G',
        'hospital': 'I',
        'airport': 'K',
        'stadium': 'L'
    };
    return mapping[locationId];
}

// Priority Queue for Dijkstra
class PriorityQueue {
    constructor() {
        this.items = [];
    }
    
    enqueue(element, priority) {
        const queueElement = { element, priority };
        let added = false;
        
        for (let i = 0; i < this.items.length; i++) {
            if (queueElement.priority < this.items[i].priority) {
                this.items.splice(i, 0, queueElement);
                added = true;
                break;
            }
        }
        
        if (!added) {
            this.items.push(queueElement);
        }
    }
    
    dequeue() {
        return this.items.shift();
    }
    
    isEmpty() {
        return this.items.length === 0;
    }
}

function calculateTravelTime(route, trafficCondition) {
    if (!route || !trafficCondition) return 0;
    return (route.normalTime || 15) * trafficCondition.timeMultiplier;
}

function checkParkingAvailability(destinationId, timeOfDay) {
    const pattern = mockData.parkingPatterns[destinationId];
    if (!pattern) return Math.random() > 0.5;
    const probability = pattern[timeOfDay] || 0.5;
    return Math.random() < probability;
}

function calculateEfficiency(route, trafficCondition) {
    if (!route || !trafficCondition) return 50;
    const baseTime = route.normalTime || 15;
    const actualTime = baseTime * trafficCondition.timeMultiplier;
    const bestTime = baseTime * 0.8;
    const efficiency = Math.max(0, Math.min(100, (bestTime / actualTime) * 100));
    return Math.round(efficiency);
}

function calculateFuelSaved(timeSaved) {
    return timeSaved * 0.08;
}

// FOL Reasoning Functions
function applyFOLRule1(parkingLot) {
    // KR1: Parking Availability Representation
    const lot = knowledgeBase.parkingLots[parkingLot];
    if (!lot) return false;
    
    const available = lot.available;
    const spaces = lot.totalSpaces;
    const occupied = lot.occupiedSpaces;
    
    // ∀p (ParkingLot(p) → (Available(p) ↔ ∃s (Space(s) ∧ In(s, p) ∧ ¬Occupied(s))))
    const hasFreeSpace = occupied < spaces;
    return available && hasFreeSpace;
}

function applyFOLRule2(route, parkingLot) {
    // KR2: Optimal Route Selection
    // ∀r∀p ((Route(r) ∧ Connects(r, UserLocation, p) ∧ Available(p) ∧ LeastCost(r)) → OptimalRoute(r))
    const isAvailable = applyFOLRule1(parkingLot);
    if (!isAvailable) return false;
    
    // Check if route connects to parking lot
    const connects = route && route.to === parkingLot;
    const hasLeastCost = route && route.trafficTime < (route.normalTime * 1.5); // Simple cost check
    
    return connects && hasLeastCost;
}

// Export functions for global use
window.mockData = mockData;
window.knowledgeBase = knowledgeBase;
window.findOptimalRoute = findOptimalRoute;
window.applyFOLRule1 = applyFOLRule1;
window.applyFOLRule2 = applyFOLRule2;
window.calculateTravelTime = calculateTravelTime;
window.checkParkingAvailability = checkParkingAvailability;
window.calculateEfficiency = calculateEfficiency;
window.calculateFuelSaved = calculateFuelSaved;