class ParkoraAISimulation {
    constructor() {
        this.isRunning = false;
        this.isPaused = false;
        this.stateHistory = ['S0'];
        this.routePath = null;
        this.alternativeRoutes = [];
        this.carPosition = { x: 15, y: 15 };
        this.navigationProgress = 0;
        this.scenario = 'demo';
        this.currentScenarioStep = 0;
        
        this.simulationState = {
            currentState: 'S0',
            destination: 'utm',
            timeOfDay: 'peak',
            parkingFound: false,
            trafficLevel: null,
            route: null,
            travelTime: 0,
            baseTime: 0,
            traditionalTime: 0,
            userPreferences: {
                lowCost: true,
                highSecurity: false,
                shortWalk: true
            },
            metrics: {
                searchTime: 0,
                fuelSaved: 0,
                efficiency: 0,
                successRate: 0,
                distance: 0,
                timeReduction: 0,
                userSatisfaction: 0
            },
            logs: [],
            folExplanations: []
        };
        
        this.scenarioHandlers = {
            'demo': this.runDemoScenario.bind(this),
            'optimal': this.runOptimalScenario.bind(this),
            'high-traffic': this.runHighTrafficScenario.bind(this),
            'reroute': this.runRerouteScenario.bind(this),
            'severe-delay': this.runSevereDelayScenario.bind(this)
        };
        
        this.initialize();
    }

    initialize() {
        this.isRunning = false;
        this.isPaused = false;
        this.stateHistory = ['S0'];
        this.routePath = null;
        this.alternativeRoutes = [];
        this.carPosition = { x: 15, y: 15 };
        this.navigationProgress = 0;
        this.currentScenarioStep = 0;
        
        this.simulationState = {
            currentState: 'S0',
            destination: 'utm',
            timeOfDay: 'peak',
            parkingFound: false,
            trafficLevel: null,
            route: null,
            travelTime: 0,
            baseTime: 0,
            traditionalTime: 0,
            userPreferences: {
                lowCost: true,
                highSecurity: false,
                shortWalk: true
            },
            metrics: {
                searchTime: 0,
                fuelSaved: 0,
                efficiency: 0,
                successRate: 0,
                distance: 0,
                timeReduction: 0,
                userSatisfaction: 0
            },
            logs: [],
            folExplanations: []
        };
        
        this.addLog("System initialized", "system");
        this.addLog("Select scenario and destination to begin", "info");
        this.addFOLExplanation("Initial State", "State(S0, APP_IDLE)", "System ready for user input");
        
        this.updateStateVisualization();
        this.updateMap();
        this.updateCurrentStateDisplay();
        this.updateMetricsDisplay();
        this.updateVerificationMetrics();
        
        const notificationsContainer = document.getElementById('notifications');
        if (notificationsContainer) {
            notificationsContainer.innerHTML = '';
            this.addNotification("Ready", "Parkora.ai AI System Initialized", "info");
        }
        
        // Initialize search algorithm visualization
        if (window.searchVisualizer) {
            window.searchVisualizer.reset();
            window.searchVisualizer.updateAlgorithmDisplay();
        }
    }

    startSimulation() {
        if (this.isRunning) {
            this.addLog("Simulation already running", "warning");
            return;
        }
        
        this.scenario = document.getElementById('scenario-select').value;
        this.simulationState.destination = document.getElementById('destination').value;
        this.simulationState.timeOfDay = document.getElementById('time').value;
        this.carPosition = { x: 15, y: 15 };
        this.currentScenarioStep = 0;
        
        const destination = mockData.locations[this.simulationState.destination];
        const scenarioName = document.getElementById('scenario-select').options[document.getElementById('scenario-select').selectedIndex].text;
        
        this.addLog(`Starting ${scenarioName} scenario`, "info");
        this.addLog(`Destination: ${destination.name}`, "info");
        this.addNotification("Scenario Start", `${scenarioName} - ${destination.name}`, "info");
        
        this.isRunning = true;
        this.runScenario();
    }

    pauseSimulation() {
        this.isPaused = !this.isPaused;
        const pauseBtn = document.getElementById('pause-simulation');
        if (pauseBtn) {
            const icon = pauseBtn.querySelector('i');
            const text = pauseBtn.querySelector('span');
            
            if (this.isPaused) {
                icon.className = 'fas fa-play';
                text.textContent = 'Resume';
                this.addLog("Simulation paused", "warning");
                this.addNotification("Paused", "Simulation paused", "warning");
            } else {
                icon.className = 'fas fa-pause';
                text.textContent = 'Pause';
                this.addLog("Simulation resumed", "info");
                this.addNotification("Resumed", "Simulation resumed", "info");
                this.continueScenario();
            }
        }
    }

    resetSimulation() {
        this.addLog("Simulation reset", "system");
        this.initialize();
        this.addNotification("Reset", "Simulation reset to initial state", "info");
    }

    async runScenario() {
        const handler = this.scenarioHandlers[this.scenario];
        if (handler) {
            await handler();
        } else {
            await this.runDemoScenario();
        }
    }

    async continueScenario() {
        if (!this.isRunning || this.isPaused) return;
        
        switch (this.simulationState.currentState) {
            case 'S2':
                await this.checkTraffic();
                break;
            case 'S5':
                await this.checkParking();
                break;
            case 'S8':
                await this.predictParking();
                break;
            case 'S9':
                await this.calculateRoute();
                break;
            case 'S11':
                this.animateCarAlongRoute();
                break;
        }
    }

    async runDemoScenario() {
        this.transitionToState('S1');
        
        await this.sleep(1000);
        await this.checkTraffic();
        
        await this.sleep(1000);
        await this.checkParking();
        
        if (this.simulationState.parkingFound) {
            await this.sleep(1000);
            await this.calculateRoute();
            
            await this.sleep(1000);
            this.startNavigation();
        } else {
            await this.sleep(1000);
            await this.predictParking();
            
            await this.sleep(1000);
            await this.calculateRoute();
            
            await this.sleep(1000);
            this.startNavigation();
        }
    }

    async runOptimalScenario() {
        this.simulationState.timeOfDay = 'offpeak';
        document.getElementById('time').value = 'offpeak';
        
        this.transitionToState('S1');
        this.addLog("Optimal scenario: Low traffic expected", "info");
        
        await this.sleep(1000);
        await this.checkTraffic();
        
        await this.sleep(1000);
        this.simulationState.parkingFound = true;
        this.transitionToState('S6');
        this.addLog("Parking available (optimal condition)", "success");
        this.addNotification("Parking", "Spots available", "success");
        
        await this.sleep(1000);
        await this.calculateRoute();
        
        await this.sleep(1000);
        this.startNavigation();
    }

    async runHighTrafficScenario() {
        this.simulationState.timeOfDay = 'peak';
        document.getElementById('time').value = 'peak';
        
        this.transitionToState('S1');
        this.addLog("High traffic scenario: Congestion expected", "warning");
        
        await this.sleep(1000);
        await this.checkTraffic();
        
        await this.sleep(1000);
        this.simulationState.parkingFound = false;
        this.transitionToState('S7');
        this.addLog("No parking available (high traffic condition)", "warning");
        this.addNotification("Parking", "No spots available", "warning");
        
        await this.sleep(1000);
        await this.predictParking();
        
        await this.sleep(1000);
        await this.calculateRoute();
        
        await this.sleep(1000);
        this.startNavigation();
    }

    async runRerouteScenario() {
        this.simulationState.timeOfDay = 'evening';
        document.getElementById('time').value = 'evening';
        
        this.transitionToState('S1');
        
        await this.sleep(1000);
        await this.checkTraffic();
        
        await this.sleep(1000);
        this.simulationState.parkingFound = true;
        this.transitionToState('S6');
        
        await this.sleep(1000);
        await this.calculateRoute();
        
        await this.sleep(1000);
        this.startNavigation();
        

        setTimeout(async () => {
            if (this.isRunning) {
                this.addLog("Parking spot became unavailable!", "warning");
                this.addNotification("Reroute", "Parking lost, finding alternative", "warning");
                
                this.transitionToState('S12');
                this.simulationState.parkingFound = false;
                
                await this.sleep(1000);
                await this.predictParking();
                
                await this.sleep(1000);
                await this.calculateRoute();
                
                await this.sleep(1000);
                this.continueNavigation();
            }
        }, 3000);
    }

    async runSevereDelayScenario() {
        this.simulationState.timeOfDay = 'peak';
        document.getElementById('time').value = 'peak';
        
        this.transitionToState('S1');
        this.addLog("Severe delay scenario: Worst conditions", "warning");
        
        await this.sleep(1000);
        await this.checkTraffic();
        
        await this.sleep(1000);
        this.simulationState.parkingFound = false;
        this.transitionToState('S7');
        
        await this.sleep(1000);
        await this.predictParking();
        
        await this.sleep(1000);
        await this.calculateRoute();
        
        await this.sleep(1000);
        this.startNavigation();
        
        setTimeout(async () => {
            if (this.isRunning) {
                this.addLog("Severe delay detected!", "warning");
                this.addNotification("Auto-reroute", "System finding alternative", "warning");
                
                this.transitionToState('S12');
                
                await this.sleep(1000);
                this.transitionToState('S9'); // Back to route calculation
                
                await this.sleep(1000);
                // Calculate alternative route
                this.addLog("Calculating alternative route...", "info");
                await this.calculateAlternativeRoute();
                
                await this.sleep(1000);
                this.continueNavigation();
            }
        }, 2000);
    }

    async checkTraffic() {
        if (this.isPaused) return;
        
        this.transitionToState('S2');
        
        await this.sleep(1000);
        
        const traffic = mockData.trafficConditions[this.simulationState.timeOfDay];
        this.simulationState.trafficLevel = traffic.level;
        
        // Apply FOL reasoning for traffic
        const folResult = window.folReasoner.explainDecision('trafficCongestion', 
            this.routePath, traffic);
        this.addFOLExplanation("Traffic Congestion Reasoning", folResult.folRepresentation, folResult.explanation);
        
        if (traffic.level === "LOW") {
            this.transitionToState('S3');
            this.addNotification("Traffic", traffic.description, "info");
        } else {
            this.transitionToState('S4');
            this.addNotification("Traffic", traffic.description, "warning");
        }
        
        this.addLog(`Traffic: ${traffic.description}`, "info");
        
        if (!this.isPaused) {
            setTimeout(() => this.checkParking(), 1000);
        }
    }

    async checkParking() {
        if (this.isPaused) return;
        
        this.transitionToState('S5');
        
        await this.sleep(1000);
        
        const destination = this.simulationState.destination;
        const location = mockData.locations[destination];
        const time = this.simulationState.timeOfDay;
        
        const folResult = window.folReasoner.explainDecision('parkingAvailability', destination);
        this.addFOLExplanation("Parking Availability", folResult.folRepresentation, folResult.explanation);
        
        const parkingAvailable = checkParkingAvailability(destination, time);
        
        if (parkingAvailable) {
            this.simulationState.parkingFound = true;
            this.transitionToState('S6');
            this.addLog(`Parking available at ${location.name}`, "success");
            this.addNotification("Parking", "Spots available", "success");
        } else {
            this.simulationState.parkingFound = false;
            this.transitionToState('S7');
            this.addLog(`No parking at ${location.name}`, "warning");
            this.addNotification("Parking", "No spots. Predicting...", "warning");
        }
        
        if (!this.isPaused) {
            setTimeout(() => {
                if (this.simulationState.parkingFound) {
                    this.calculateRoute();
                } else {
                    this.predictParking();
                }
            }, 1000);
        }
    }

    async predictParking() {
        if (this.isPaused) return;
        
        this.transitionToState('S8');
        
        await this.sleep(1000);
        
        this.addLog("ML prediction running...", "info");
        this.addNotification("ML", "Predicting parking...", "info");
        
        this.updateMLPrediction();
        
        await this.sleep(2000);
        
        const destination = this.simulationState.destination;
        const time = this.simulationState.timeOfDay;
        
        const folResult = window.folReasoner.explainDecision('timeBasedPrediction', 
            destination, time);
        this.addFOLExplanation("Time-Based Prediction", folResult.folRepresentation, folResult.explanation);
        
        const willBeAvailable = Math.random() > 0.4;
        
        if (willBeAvailable) {
            this.addLog("Parking likely available in 5-10 min", "info");
            this.addNotification("Prediction", "Parking expected soon", "info");
            this.simulationState.parkingFound = true;
        } else {
            this.addLog("High parking demand predicted", "warning");
            this.addNotification("Prediction", "Consider alternative location", "warning");
        }
        
        if (!this.isPaused) {
            setTimeout(() => this.calculateRoute(), 1000);
        }
    }

    async calculateRoute() {
        if (this.isPaused) return;
        
        this.transitionToState('S9');
        
        await this.sleep(1000);
        
        this.addLog("Calculating optimal route...", "info");
        this.addNotification("Route", "Finding optimal path...", "info");

        if (window.searchVisualizer) {
            window.searchVisualizer.visualizeAStar();
        }
        
        await this.sleep(1500);
        
        const route = findOptimalRoute('start', this.simulationState.destination, 
            mockData.trafficConditions[this.simulationState.timeOfDay]);
        
        if (!route) {
            this.addLog("Route calculation error", "warning");
            return;
        }
        
        this.routePath = route;
        this.simulationState.route = route;
        
        const traffic = mockData.trafficConditions[this.simulationState.timeOfDay];
        const travelTime = calculateTravelTime(route, traffic);
        const baseTime = route.normalTime || 15;
        const traditionalTime = baseTime * 1.5; // Traditional search takes 50% longer
        
        this.simulationState.travelTime = travelTime;
        this.simulationState.baseTime = baseTime;
        this.simulationState.traditionalTime = traditionalTime;
        
        const timeSaved = Math.max(0, traditionalTime - travelTime);
        const fuelSaved = calculateFuelSaved(timeSaved);
        const efficiency = calculateEfficiency(route, traffic);
        const timeReduction = ((traditionalTime - travelTime) / traditionalTime) * 100;
        
        this.simulationState.metrics.distance = route.distance;
        this.simulationState.metrics.searchTime = timeSaved;
        this.simulationState.metrics.fuelSaved = fuelSaved;
        this.simulationState.metrics.efficiency = efficiency;
        this.simulationState.metrics.successRate = this.simulationState.parkingFound ? 95 : 75;
        this.simulationState.metrics.timeReduction = timeReduction;
        this.simulationState.metrics.userSatisfaction = 85 + (efficiency / 10);

        const folResult = window.folReasoner.explainDecision('optimalRoute', 
            route, this.simulationState.destination);
        this.addFOLExplanation("Optimal Route Selection", folResult.folRepresentation, folResult.explanation);
        
        this.transitionToState('S10');
        
        this.addLog(`Route: ${route.distance.toFixed(1)} km`, "success");
        this.addLog(`AI Time: ${travelTime.toFixed(0)} min, Traditional: ${traditionalTime.toFixed(0)} min`, "info");
        
        this.addNotification("Route Ready", 
            `${route.distance.toFixed(1)} km, ${travelTime.toFixed(0)} min (Saved ${timeSaved.toFixed(0)} min)`, 
            "success");
        
        this.updateMetricsDisplay();
        this.updateVerificationMetrics();
        this.updateMap();
        
        if (!this.isPaused) {
            setTimeout(() => this.startNavigation(), 1000);
        }
    }

    async calculateAlternativeRoute() {
        this.addLog("Calculating alternative route...", "info");

        const alternativeRoute = {
            ...this.routePath,
            distance: this.routePath.distance * 1.2,
            trafficTime: this.simulationState.travelTime * 1.3,
            coordinates: [[15, 15], [30, 25], [50, 40], [70, 60], [85, 85]]
        };
        
        this.alternativeRoutes.push(alternativeRoute);
        this.simulationState.route = alternativeRoute;
        
        this.addLog("Alternative route found", "success");
        this.addNotification("Reroute", "New route calculated", "success");
        
        this.updateMap();
    }

    startNavigation() {
        this.transitionToState('S11');
        
        const destination = mockData.locations[this.simulationState.destination].name;
        this.addLog("Navigation started", "info");
        this.addNotification("Navigation", `Going to ${destination}`, "info");
        
        this.animateCarAlongRoute();
    }

    continueNavigation() {
        this.transitionToState('S11');
        this.addLog("Continuing navigation...", "info");
        this.animateCarAlongRoute();
    }

    animateCarAlongRoute() {
        if (!this.routePath || !this.routePath.coordinates || this.isPaused) return;
        
        const coordinates = this.routePath.coordinates;
        const totalSteps = coordinates.length;
        let currentStep = 0;
        const animationDuration = this.simulationState.travelTime * 1000;
        const stepDuration = animationDuration / totalSteps;
        
        const animateStep = () => {
            if (!this.isRunning || this.isPaused || currentStep >= totalSteps) {
                if (currentStep >= totalSteps) {
                    this.reachDestination();
                }
                return;
            }
            
            this.carPosition.x = coordinates[currentStep][0];
            this.carPosition.y = coordinates[currentStep][1];
            
            this.navigationProgress = (currentStep / totalSteps) * 100;
            
            if (currentStep > 0 && currentStep < totalSteps - 1) {
                if (currentStep % Math.floor(totalSteps / 4) === 0) {
                    const percent = Math.round(this.navigationProgress);
                    this.addLog(`Navigation progress: ${percent}%`, "info");
                }
            }
            
            this.updateMap();
            currentStep++;
            
            if (this.isRunning && !this.isPaused) {
                setTimeout(animateStep, stepDuration);
            }
        };
        
        animateStep();
    }

    reachDestination() {
        this.transitionToState('S13');
        
        const destination = mockData.locations[this.simulationState.destination];
        const timeSaved = this.simulationState.metrics.searchTime.toFixed(1);
        const fuelSaved = this.simulationState.metrics.fuelSaved.toFixed(2);
        const efficiency = this.simulationState.metrics.efficiency;
        
        this.addLog(`Successfully reached ${destination.name}`, "success");
        this.addLog("Parking successful", "success");
        
        this.simulationState.metrics.successRate = 100;
        this.simulationState.metrics.userSatisfaction = 95;
        
        this.updateMetricsDisplay();
        this.updateVerificationMetrics();
        
        this.addNotification("Success!", 
            `Saved ${timeSaved} min and ${fuelSaved}L fuel (${efficiency}% efficiency)`, 
            "success");
        
        setTimeout(() => this.endSession(), 2000);
    }

    endSession() {
        this.transitionToState('S14');
        
        const timeSaved = this.simulationState.metrics.searchTime.toFixed(1);
        const fuelSaved = this.simulationState.metrics.fuelSaved.toFixed(2);
        const efficiency = this.simulationState.metrics.efficiency;
        
        this.addLog("Journey completed successfully", "success");
        this.addLog(`Summary: Saved ${timeSaved} min, ${fuelSaved}L fuel, ${efficiency}% efficiency`, "system");
        
        this.isRunning = false;
        
        this.addNotification("Complete", "Ready for next simulation", "success");
    }

    transitionToState(stateId) {
        const state = mockData.states[stateId];
        if (!state) return;
        
        this.simulationState.currentState = stateId;
        this.stateHistory.push(stateId);
        
        this.addLog(`State: ${state.name}`, "info");
        
        this.updateStateVisualization();
        this.updateCurrentStateDisplay();
        this.updateMap();
    }

    addLog(message, type = "info") {
        const now = new Date();
        const timeString = now.toTimeString().split(' ')[0].substring(0, 8);
        
        this.simulationState.logs.push({
            time: timeString,
            message: message,
            type: type
        });
        
        this.updateLogsDisplay();
    }

    addFOLExplanation(title, fol, explanation) {
        const explanationContainer = document.getElementById('ai-explanation');
        if (!explanationContainer) return;
        
        const explanationStep = document.createElement('div');
        explanationStep.className = 'explanation-step';
        explanationStep.innerHTML = `
            <h4>${title}</h4>
            <p>${explanation}</p>
            <div class="fol-code">
                <code>${fol}</code>
            </div>
        `;
        
        explanationContainer.appendChild(explanationStep);
        explanationContainer.scrollTop = explanationContainer.scrollHeight;
        
        // Keep only last 5 explanations
        const children = explanationContainer.children;
        if (children.length > 5) {
            explanationContainer.removeChild(children[0]);
        }
    }

    addNotification(title, message, type = "info") {
        const notificationsContainer = document.getElementById('notifications');
        if (!notificationsContainer) return;
        
        const iconClass = {
            'info': 'fa-info-circle',
            'warning': 'fa-exclamation-triangle',
            'success': 'fa-check-circle'
        }[type] || 'fa-info-circle';
        
        const notifEl = document.createElement('div');
        notifEl.className = `notification ${type}`;
        notifEl.innerHTML = `
            <div class="notification-icon">
                <i class="fas ${iconClass}"></i>
            </div>
            <div class="notification-content">
                <h4>${title}</h4>
                <p>${message}</p>
            </div>
        `;
        
        notificationsContainer.appendChild(notifEl);

        const children = notificationsContainer.children;
        if (children.length > 3) {
            notificationsContainer.removeChild(children[0]);
        }
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notifEl.parentNode === notificationsContainer) {
                notificationsContainer.removeChild(notifEl);
            }
        }, 5000);
    }

    updateMLPrediction() {
        const predictionFill = document.getElementById('prediction-fill');
        const predictionValue = document.getElementById('prediction-value');
        
        if (predictionFill && predictionValue) {
            const probability = this.simulationState.parkingFound ? 85 : 35;
            predictionFill.style.width = `${probability}%`;
            predictionValue.textContent = `${probability}%`;
            
            // Animate neurons
            const neurons = document.querySelectorAll('.neuron[data-activation]');
            neurons.forEach((neuron, index) => {
                const activation = this.simulationState.parkingFound ? 
                    (0.8 - index * 0.2) : (0.4 - index * 0.1);
                neuron.setAttribute('data-activation', activation.toFixed(1));
                neuron.style.background = `rgba(0, 184, 148, ${activation})`;
            });
        }
    }

    updateStateVisualization() {
        const stateVis = document.getElementById('state-graph');
        if (!stateVis) return;
        
        const width = stateVis.clientWidth;
        const height = stateVis.clientHeight;

        d3.select(stateVis).selectAll("*").remove();
        
        const svg = d3.select(stateVis)
            .attr("width", width)
            .attr("height", height);

        const states = Object.values(mockData.states);
        const columns = 4;
        const nodeSize = 80;
        const nodeRadius = 30;
        
        states.forEach((state, index) => {
            const row = Math.floor(index / columns);
            const col = index % columns;
            const x = col * (nodeSize + 20) + nodeRadius + 10;
            const y = row * (nodeSize + 20) + nodeRadius + 10;
            
            state.x = x;
            state.y = y;
        });

        const transitions = [
            { from: 'S0', to: 'S1' },
            { from: 'S1', to: 'S2' },
            { from: 'S2', to: 'S3' },
            { from: 'S2', to: 'S4' },
            { from: 'S3', to: 'S5' },
            { from: 'S4', to: 'S5' },
            { from: 'S5', to: 'S6' },
            { from: 'S5', to: 'S7' },
            { from: 'S7', to: 'S8' },
            { from: 'S8', to: 'S9' },
            { from: 'S6', to: 'S9' },
            { from: 'S9', to: 'S10' },
            { from: 'S10', to: 'S11' },
            { from: 'S11', to: 'S12' },
            { from: 'S12', to: 'S9' },
            { from: 'S11', to: 'S13' },
            { from: 'S13', to: 'S14' }
        ];
        
        transitions.forEach(transition => {
            const fromState = mockData.states[transition.from];
            const toState = mockData.states[transition.to];
            
            if (fromState && toState) {
                svg.append("line")
                    .attr("x1", fromState.x)
                    .attr("y1", fromState.y)
                    .attr("x2", toState.x)
                    .attr("y2", toState.y)
                    .attr("stroke", this.stateHistory.includes(transition.from) && 
                                   this.stateHistory.includes(transition.to) ? 
                                   "#4ecdc4" : "#394867")
                    .attr("stroke-width", 2)
                    .attr("stroke-dasharray", "5,5");
            }
        });

        states.forEach(state => {
            const isActive = this.simulationState.currentState === state.id;
            const isVisited = this.stateHistory.includes(state.id);
            
            const nodeGroup = svg.append("g")
                .attr("transform", `translate(${state.x}, ${state.y})`);

            nodeGroup.append("circle")
                .attr("r", nodeRadius)
                .attr("fill", isActive ? state.color : 
                              isVisited ? state.color + "40" : "#39486740")
                .attr("stroke", state.color)
                .attr("stroke-width", isActive ? 3 : 1);

            nodeGroup.append("text")
                .attr("text-anchor", "middle")
                .attr("dy", "-0.5em")
                .style("font-size", "12px")
                .style("font-weight", "bold")
                .style("fill", isActive ? "#ffffff" : state.color)
                .text(state.id);

            nodeGroup.append("text")
                .attr("text-anchor", "middle")
                .attr("dy", "1.2em")
                .style("font-size", "10px")
                .style("fill", isActive ? "#ffffff" : "#8a9bb2")
                .text(state.name);

            nodeGroup.style("cursor", "pointer")
                .on("mouseover", function() {
                    d3.select(this).select("circle")
                        .transition()
                        .duration(200)
                        .attr("r", nodeRadius + 3);
                })
                .on("mouseout", function() {
                    d3.select(this).select("circle")
                        .transition()
                        .duration(200)
                        .attr("r", nodeRadius);
                })
                .on("click", () => {
                    this.showStateInfo(state);
                });
        });

        const stateCount = document.getElementById('state-count');
        if (stateCount) {
            stateCount.textContent = `${this.stateHistory.length}/${states.length}`;
        }
    }

    showStateInfo(state) {
        const modal = document.getElementById('explanation-modal');
        const modalBody = modal.querySelector('.modal-body');
        
        if (modalBody) {
            modalBody.innerHTML = `
                <div class="state-info">
                    <h3>${state.name} (${state.id})</h3>
                    <p><strong>Description:</strong> ${state.description}</p>
                    <p><strong>Color Code:</strong> <span style="color:${state.color}">${state.color}</span></p>
                    <p><strong>Status:</strong> ${this.simulationState.currentState === state.id ? 'Active' : this.stateHistory.includes(state.id) ? 'Visited' : 'Not visited'}</p>
                    
                    ${this.simulationState.currentState === state.id ? `
                        <div class="current-state-actions">
                            <h4>Current Actions:</h4>
                            <ul>
                                ${this.getStateActions(state.id).map(action => `<li>${action}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                </div>
            `;
        }
        
        modal.style.display = 'block';
    }

    getStateActions(stateId) {
        const actions = {
            'S0': ['Waiting for user input', 'Displaying initial interface'],
            'S1': ['Processing destination input', 'Updating user preferences'],
            'S2': ['Fetching traffic data from APIs', 'Analyzing congestion patterns'],
            'S3': ['Traffic condition: Low', 'Proceeding with normal routing'],
            'S4': ['Traffic condition: High', 'Considering alternative routes'],
            'S5': ['Querying parking sensors', 'Checking database for availability'],
            'S6': ['Parking available', 'Proceeding to route calculation'],
            'S7': ['No parking available', 'Initiating prediction model'],
            'S8': ['Running ML prediction', 'Analyzing historical patterns'],
            'S9': ['Executing Dijkstra/A* algorithm', 'Calculating optimal path'],
            'S10': ['Route computation complete', 'Preparing navigation'],
            'S11': ['Active navigation', 'Monitoring progress'],
            'S12': ['Reroute needed', 'Recalculating path'],
            'S13': ['Destination reached', 'Parking confirmed'],
            'S14': ['Session ended', 'Updating metrics']
        };
        
        return actions[stateId] || ['No specific actions defined'];
    }

    updateMap() {
        const map = document.getElementById('city-map');
        if (!map) return;
        
        map.innerHTML = '';
        
        // Draw alternative routes if any
        if (this.alternativeRoutes.length > 0) {
            this.alternativeRoutes.forEach((route, index) => {
                if (route.coordinates) {
                    this.drawRouteLine(route.coordinates, "#ffa726", index + 1);
                }
            });
        }

        if (this.routePath && this.routePath.coordinates) {
            this.drawRouteLine(this.routePath.coordinates, "#4ecdc4", 0);
        }

        Object.values(mockData.locations).forEach(location => {
            const isStart = location.id === 'start';
            const isDestination = location.id === this.simulationState.destination;
            
            const locEl = document.createElement('div');
            locEl.className = `map-location ${isStart ? 'start' : ''} ${isDestination ? 'destination' : ''}`;
            locEl.style.left = `${location.x}%`;
            locEl.style.top = `${location.y}%`;
            locEl.innerHTML = `
                <i class="${location.icon}"></i>
                <span>${location.name}</span>
            `;
            
            if (isDestination) {
                const pulseRing = document.createElement('div');
                pulseRing.className = 'pulse-ring';
                locEl.appendChild(pulseRing);
            }
            
            if (!isStart) {
                locEl.addEventListener('click', () => {
                    if (!this.isRunning) {
                        document.getElementById('destination').value = location.id;
                        this.simulationState.destination = location.id;
                        this.updateMap();
                        this.addLog(`Selected destination: ${location.name}`, "info");
                    }
                });
            }
            
            map.appendChild(locEl);
        });
        
        // Draw car if navigating
        if (this.simulationState.currentState === 'S11' || 
            this.simulationState.currentState === 'S13') {
            this.drawCar();
        }
    }

    drawRouteLine(coordinates, color, zIndex) {
        const map = document.getElementById('city-map');
        if (!map) return;
        
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("width", "100%");
        svg.setAttribute("height", "100%");
        svg.style.position = "absolute";
        svg.style.top = "0";
        svg.style.left = "0";
        svg.style.zIndex = zIndex.toString();
        
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        let pathData = `M ${coordinates[0][0]}% ${coordinates[0][1]}% `;
        
        for (let i = 1; i < coordinates.length; i++) {
            pathData += `L ${coordinates[i][0]}% ${coordinates[i][1]}% `;
        }
        
        path.setAttribute("d", pathData);
        path.setAttribute("fill", "none");
        path.setAttribute("stroke", color);
        path.setAttribute("stroke-width", zIndex === 0 ? "4" : "2");
        path.setAttribute("stroke-linecap", "round");
        path.setAttribute("stroke-dasharray", zIndex === 0 ? "10,5" : "5,5");
        path.classList.add("route-line");
        
        const glow = path.cloneNode();
        glow.setAttribute("stroke", color + "30");
        glow.setAttribute("stroke-width", zIndex === 0 ? "10" : "6");
        glow.setAttribute("stroke-dasharray", "none");
        
        svg.appendChild(glow);
        svg.appendChild(path);
        map.appendChild(svg);
    }

    drawCar() {
        const map = document.getElementById('city-map');
        if (!map) return;
        
        const car = document.createElement('div');
        car.className = 'user-car';
        car.innerHTML = '<i class="fas fa-car"></i>';
        car.style.left = `${this.carPosition.x}%`;
        car.style.top = `${this.carPosition.y}%`;
        car.style.position = 'absolute';
        car.style.transform = 'translate(-50%, -50%)';
        car.style.fontSize = '24px';
        car.style.color = '#00adb5';
        car.style.zIndex = '20';
        car.style.filter = 'drop-shadow(0 0 8px rgba(0, 131, 143, 0.8))';
        
        map.appendChild(car);
    }

    updateCurrentStateDisplay() {
        const currentStateEl = document.getElementById('current-state');
        if (currentStateEl) {
            const state = mockData.states[this.simulationState.currentState];
            currentStateEl.textContent = state ? state.name : 'UNKNOWN';
            currentStateEl.style.color = state ? state.color : '#00adb5';
        }
        
        const agentStatus = document.getElementById('agent-status');
        if (agentStatus) {
            const indicator = agentStatus.querySelector('.status-indicator');
            const statusTitle = agentStatus.querySelector('.status-title');
            
            if (indicator) {
                if (this.isRunning) {
                    indicator.style.background = this.isPaused ? '#ffa726' : '#4ecdc4';
                } else {
                    indicator.style.background = '#ff6b6b';
                }
            }
            
            if (statusTitle) {
                if (this.isPaused) {
                    statusTitle.textContent = 'Paused';
                } else if (this.isRunning) {
                    statusTitle.textContent = 'Processing';
                } else {
                    statusTitle.textContent = 'Ready';
                }
            }
        }
    }

    updateLogsDisplay() {
        const logsContainer = document.getElementById('ai-logs');
        if (!logsContainer) return;
        
        const recentLogs = this.simulationState.logs.slice(-10);
        
        logsContainer.innerHTML = '';
        recentLogs.forEach(log => {
            const logEntry = document.createElement('div');
            logEntry.className = `log-entry ${log.type}`;
            logEntry.innerHTML = `
                <span class="log-time">${log.time}</span>
                <span class="log-message">${log.message}</span>
            `;
            logsContainer.appendChild(logEntry);
        });
        
        logsContainer.scrollTop = logsContainer.scrollHeight;
    }

    updateMetricsDisplay() {
        const metrics = this.simulationState.metrics;
        
        const updateMetric = (id, value, suffix = '') => {
            const element = document.getElementById(id);
            if (element) {
                const oldValue = element.textContent.replace(suffix, '');
                const newValue = value + suffix;
                
                if (oldValue !== newValue) {
                    element.textContent = newValue;
                    element.classList.add('updated');
                    setTimeout(() => element.classList.remove('updated'), 1000);
                }
            }
        };
        
        updateMetric('metric-time', metrics.searchTime.toFixed(1), ' min');
        updateMetric('metric-fuel', metrics.fuelSaved.toFixed(2), ' L');
        updateMetric('metric-efficiency', metrics.efficiency, '%');
        updateMetric('metric-success', metrics.successRate, '%');

        const performanceScore = Math.round(
            (metrics.efficiency * 0.3 +
             metrics.successRate * 0.3 +
             Math.min(100, metrics.searchTime * 5) * 0.2 +
             metrics.userSatisfaction * 0.2)
        );
        
        updateMetric('performance-score', Math.min(100, Math.max(0, performanceScore)), '%');
        updateMetric('time-saved', metrics.searchTime.toFixed(1), ' min');
    }

    updateVerificationMetrics() {
        const metrics = this.simulationState.metrics;
        
        const updateMetric = (id, value, suffix = '') => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value + suffix;
            }
        };
        
        updateMetric('time-reduction', metrics.timeReduction.toFixed(0), '%');
        updateMetric('fuel-savings', (metrics.fuelSaved * 100 / 10).toFixed(0), '%'); // Convert to percentage
        updateMetric('user-satisfaction', metrics.userSatisfaction.toFixed(0), '%');
        updateMetric('overall-success', metrics.successRate, '%');

        const traditionalBar = document.querySelector('.chart-bar.traditional .bar-fill');
        const aiBar = document.querySelector('.chart-bar.ai .bar-fill');
        const traditionalValue = document.querySelector('.chart-bar.traditional .bar-value');
        const aiValue = document.querySelector('.chart-bar.ai .bar-value');
        
        if (traditionalBar && aiBar && traditionalValue && aiValue) {
            const traditionalSuccess = 100 - metrics.timeReduction;
            const aiSuccess = metrics.successRate;
            
            traditionalBar.style.height = `${traditionalSuccess}%`;
            aiBar.style.height = `${aiSuccess}%`;
            traditionalValue.textContent = `${traditionalSuccess.toFixed(0)}%`;
            aiValue.textContent = `${aiSuccess.toFixed(0)}%`;
        }
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

let parkoraSimulation;

document.addEventListener('DOMContentLoaded', () => {
    parkoraSimulation = new ParkoraAISimulation();
    window.parkoraSimulation = parkoraSimulation;

    const startBtn = document.getElementById('start-simulation');
    const pauseBtn = document.getElementById('pause-simulation');
    const resetBtn = document.getElementById('reset-simulation');
    const scenarioSelect = document.getElementById('scenario-select');
    const explainBtn = document.getElementById('explain-ai');
    const clearExplanationBtn = document.getElementById('clear-explanation');
    const showGraphBtn = document.getElementById('show-graph');
    const interactivePEASBtn = document.getElementById('interactive-peas');
    const modalClose = document.querySelector('.close-modal');
    const modal = document.getElementById('explanation-modal');
    
    if (startBtn) {
        startBtn.addEventListener('click', () => {
            parkoraSimulation.startSimulation();
        });
    }
    
    if (pauseBtn) {
        pauseBtn.addEventListener('click', () => {
            parkoraSimulation.pauseSimulation();
        });
    }
    
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            parkoraSimulation.resetSimulation();
        });
    }
    
    if (scenarioSelect) {
        scenarioSelect.addEventListener('change', () => {
            const scenario = scenarioSelect.value;
            const scenarioName = scenarioSelect.options[scenarioSelect.selectedIndex].text;
            parkoraSimulation.addLog(`Scenario changed to: ${scenarioName}`, "system");
            parkoraSimulation.addNotification("Scenario", `Selected: ${scenarioName}`, "info");
        });
    }
    
    if (explainBtn) {
        explainBtn.addEventListener('click', () => {
            modal.style.display = 'block';
        });
    }
    
    if (clearExplanationBtn) {
        clearExplanationBtn.addEventListener('click', () => {
            const explanationContainer = document.getElementById('ai-explanation');
            if (explanationContainer) {
                explanationContainer.innerHTML = '';
                parkoraSimulation.addFOLExplanation("Cleared", "System reset", "Explanation log cleared");
            }
        });
    }
    
    if (showGraphBtn) {
        showGraphBtn.addEventListener('click', () => {
            // Implement full graph view
            parkoraSimulation.addLog("Showing full state space graph", "info");
        });
    }
    
    if (interactivePEASBtn) {
        interactivePEASBtn.addEventListener('click', () => {
            parkoraSimulation.addLog("Interactive PEAS demonstration", "info");
            parkoraSimulation.addNotification("PEAS", "Interactive model activated", "info");
            
            // Highlight PEAS components
            const peasItems = document.querySelectorAll('.peas-item');
            peasItems.forEach((item, index) => {
                setTimeout(() => {
                    item.style.transform = 'translateY(-5px)';
                    item.style.boxShadow = '0 8px 16px rgba(0, 131, 143, 0.3)';
                    
                    setTimeout(() => {
                        item.style.transform = '';
                        item.style.boxShadow = '';
                    }, 1000);
                }, index * 500);
            });
        });
    }
    
    if (modalClose) {
        modalClose.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    setTimeout(() => {
        if (!parkoraSimulation.isRunning) {
            const scenarioSelect = document.getElementById('scenario-select');
            if (scenarioSelect) {
                scenarioSelect.value = 'optimal';
            }
            
            setTimeout(() => {
                if (!parkoraSimulation.isRunning) {
                    startBtn.click();
                }
            }, 2000);
        }
    }, 3000);

});
