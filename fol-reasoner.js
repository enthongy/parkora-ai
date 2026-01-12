class FOLReasoner {
    constructor() {
        this.knowledgeBase = window.knowledgeBase;
        this.inferenceRules = this.initializeInferenceRules();
        this.explanationLog = [];
    }

    initializeInferenceRules() {
        return {
            // KR1: Parking Availability Representation
            parkingAvailability: {
                name: "Parking Availability Rule",
                fol: "∀p (ParkingLot(p) → (Available(p) ↔ ∃s (Space(s) ∧ In(s, p) ∧ ¬Occupied(s))))",
                apply: (parkingLot) => {
                    const lot = this.knowledgeBase.parkingLots[parkingLot];
                    if (!lot) return { result: false, explanation: "Parking lot not found" };
                    
                    const available = lot.available;
                    const hasFreeSpace = lot.occupiedSpaces < lot.totalSpaces;
                    
                    const result = available && hasFreeSpace;
                    const explanation = `ParkingLot(${parkingLot}) → Available(${parkingLot}) = ${available} ∧ HasFreeSpace = ${hasFreeSpace} → Result = ${result}`;
                    
                    return { result, explanation };
                }
            },

            // KR2: Optimal Route Selection
            optimalRoute: {
                name: "Optimal Route Selection Rule",
                fol: "∀r∀p ((Route(r) ∧ Connects(r, UserLocation, p) ∧ Available(p) ∧ LeastCost(r)) → OptimalRoute(r))",
                apply: (route, parkingLot) => {
                    const parkingResult = this.inferenceRules.parkingAvailability.apply(parkingLot);
                    if (!parkingResult.result) {
                        return { 
                            result: false, 
                            explanation: `Route cannot be optimal because parking lot ${parkingLot} is not available`
                        };
                    }
                    
                    const connects = route && route.to === parkingLot;
                    const hasLeastCost = route && route.trafficTime < (route.normalTime * 1.5);
                    
                    const result = connects && hasLeastCost;
                    const explanation = `Route connects to ${parkingLot} = ${connects} ∧ Has least cost = ${hasLeastCost} ∧ Parking available = ${parkingResult.result} → OptimalRoute = ${result}`;
                    
                    return { result, explanation };
                }
            },

            // KR3: Time-Based Parking Prediction
            timeBasedPrediction: {
                name: "Time-Based Parking Prediction Rule",
                fol: "∀p∀t ((ParkingLot(p) ∧ HighOccupancy(p, time_past)) → LikelyUnavailable(p, time_now))",
                apply: (parkingLot, timeOfDay) => {
                    const pattern = window.mockData.parkingPatterns[parkingLot];
                    if (!pattern) return { result: false, explanation: "No parking pattern data available" };
                    
                    const occupancyRate = pattern[timeOfDay] || 0.5;
                    const likelyUnavailable = occupancyRate > 0.8;
                    const trend = pattern.trend || "stable";
                    
                    let prediction = likelyUnavailable ? "Likely Unavailable" : "Likely Available";
                    if (trend === "increasing" && occupancyRate > 0.6) {
                        prediction = "Likely Unavailable (Increasing trend)";
                    }
                    
                    const explanation = `ParkingLot(${parkingLot}) ∧ Time(${timeOfDay}) → OccupancyRate = ${occupancyRate} ∧ Trend = ${trend} → ${prediction}`;
                    
                    return { result: likelyUnavailable, explanation, prediction };
                }
            },

            // KR4: User Preference and Proximity Rule
            userPreference: {
                name: "User Preference and Proximity Rule",
                fol: "∀p ((Available(p) ∧ Near(p, Destination)) → Preferred(p))",
                apply: (parkingLot, destination, userPreferences = {}) => {
                    const parkingResult = this.inferenceRules.parkingAvailability.apply(parkingLot);
                    const isNear = this.isNear(parkingLot, destination);
                    
                    let preferenceScore = 0;
                    let factors = [];
                    
                    if (parkingResult.result) preferenceScore += 40;
                    if (isNear) preferenceScore += 30;
                    
                    // Additional user preferences
                    if (userPreferences.lowCost) {
                        const cost = window.mockData.locations[parkingLot]?.parking?.costPerHour || 0;
                        if (cost < 5) preferenceScore += 20;
                        factors.push(`Low cost: ${cost < 5}`);
                    }
                    
                    if (userPreferences.highSecurity) {
                        const security = window.mockData.locations[parkingLot]?.parking?.securityLevel || "low";
                        if (security === "high") preferenceScore += 10;
                        factors.push(`High security: ${security === "high"}`);
                    }
                    
                    const isPreferred = preferenceScore >= 60;
                    const explanation = `Available(${parkingLot}) = ${parkingResult.result} ∧ Near(${parkingLot}, ${destination}) = ${isNear} ${factors.length > 0 ? `∧ ${factors.join(' ∧ ')}` : ''} → PreferenceScore = ${preferenceScore} → Preferred = ${isPreferred}`;
                    
                    return { result: isPreferred, explanation, score: preferenceScore };
                }
            },

            // KR5: Traffic Congestion Reasoning
            trafficCongestion: {
                name: "Traffic Congestion Reasoning Rule",
                fol: "∀r ((Road(r) ∧ VehicleDensity(r) > Threshold) → Congested(r))",
                apply: (route, trafficCondition) => {
                    if (!route || !trafficCondition) {
                        return { result: false, explanation: "No route or traffic data available" };
                    }
                    
                    const congestionFactor = trafficCondition.congestionFactor || 0.5;
                    const isCongested = congestionFactor > 0.7;
                    
                    let congestionLevel = "Low";
                    if (congestionFactor > 0.7) congestionLevel = "High";
                    else if (congestionFactor > 0.4) congestionLevel = "Medium";
                    
                    const explanation = `Route traffic condition: ${trafficCondition.description} → CongestionFactor = ${congestionFactor} → CongestionLevel = ${congestionLevel} → Congested = ${isCongested}`;
                    
                    return { result: isCongested, explanation, level: congestionLevel };
                }
            }
        };
    }

    isNear(parkingLot1, parkingLot2) {
        // Simplified proximity check
        const locations = ['utm', 'mall', 'hospital', 'airport', 'stadium'];
        const idx1 = locations.indexOf(parkingLot1);
        const idx2 = locations.indexOf(parkingLot2);
        return Math.abs(idx1 - idx2) <= 1;
    }

    inferOptimalParking(destination, timeOfDay, userPreferences = {}) {
        const parkingLots = Object.keys(this.knowledgeBase.parkingLots);
        let bestParking = null;
        let bestScore = -Infinity;
        let explanations = [];

        parkingLots.forEach(lot => {
            // Apply all relevant rules
            const availability = this.inferenceRules.parkingAvailability.apply(lot);
            const prediction = this.inferenceRules.timeBasedPrediction.apply(lot, timeOfDay);
            const preference = this.inferenceRules.userPreference.apply(lot, destination, userPreferences);

            // Calculate composite score
            let score = 0;
            if (availability.result) score += 30;
            if (!prediction.result) score += 25; // Not likely unavailable
            score += preference.score / 2; // Half of preference score

            explanations.push({
                parkingLot: lot,
                availability: availability,
                prediction: prediction,
                preference: preference,
                score: score
            });

            if (score > bestScore) {
                bestScore = score;
                bestParking = lot;
            }
        });

        const bestExplanation = explanations.find(e => e.parkingLot === bestParking);
        
        return {
            optimalParking: bestParking,
            score: bestScore,
            allScores: explanations,
            explanation: bestExplanation ? `
                Selected ${bestParking} because:
                1. ${bestExplanation.availability.explanation}
                2. ${bestExplanation.prediction.explanation}
                3. ${bestExplanation.preference.explanation}
                Total Score: ${bestScore.toFixed(1)}
            ` : "No parking lot selected"
        };
    }

    explainDecision(decisionType, ...args) {
        const rule = this.inferenceRules[decisionType];
        if (!rule) {
            return { error: "Unknown decision type" };
        }

        const result = rule.apply(...args);
        
        const explanation = {
            ruleName: rule.name,
            folRepresentation: rule.fol,
            inputs: args,
            result: result.result,
            explanation: result.explanation,
            timestamp: new Date().toISOString()
        };

        this.explanationLog.push(explanation);
        return explanation;
    }

    getAllExplanations() {
        return this.explanationLog;
    }

    clearExplanations() {
        this.explanationLog = [];
    }

    demonstrateFOLRule(ruleId, exampleData) {
        const rule = this.inferenceRules[ruleId];
        if (!rule) return null;

        const demoSteps = [];

        demoSteps.push({
            step: 1,
            title: "First Order Logic Rule",
            content: rule.fol,
            type: "fol"
        });

        const instantiated = this.instantiateFOL(rule.fol, exampleData);
        demoSteps.push({
            step: 2,
            title: "Instantiated Rule",
            content: instantiated,
            type: "instantiation"
        });

        const result = rule.apply(...Object.values(exampleData));
        demoSteps.push({
            step: 3,
            title: "Rule Application",
            content: result.explanation,
            type: "application"
        });

        demoSteps.push({
            step: 4,
            title: "Inference Result",
            content: `Result: ${result.result}`,
            type: "result"
        });

        return demoSteps;
    }

    instantiateFOL(folRule, data) {
        let instantiated = folRule;
        Object.keys(data).forEach(key => {
            const value = data[key];
            if (typeof value === 'string') {
                instantiated = instantiated.replace(new RegExp(`\\b${key}\\b`, 'g'), value);
            }
        });
        return instantiated;
    }
}

window.FOLReasoner = FOLReasoner;

window.folReasoner = new FOLReasoner();
