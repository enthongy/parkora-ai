# Parkora.ai - AI Traffic & Parking Advisor 🚗🧠

## Live Demo for Prototype
🔗 **[https://enthongy.github.io/parkora-ai/](https://enthongy.github.io/parkora-ai/)**

## Link of Figma Prototype 
🔗 **[https://www.figma.com/make/VHnbtUyzP42soJNwcY0Uyd/Parking-Suggestion-Prototype?fullscreen=1&t=65v3eaxUjp7mC4Ab-1 ](https://www.figma.com/make/VHnbtUyzP42soJNwcY0Uyd/Parking-Suggestion-Prototype?fullscreen=1&t=65v3eaxUjp7mC4Ab-1 )**

## 📋 Project Overview
**Parkora.ai** is an intelligent Traffic & Parking Advisor application designed for smart cities. It combines AI technologies to solve real-world urban mobility challenges by reducing traffic congestion, optimizing parking search, and enhancing driver experience through real-time intelligent decision-making.

### Key Features:
- **Real-time AI Decision Making** - Intelligent route and parking optimization
- **State Space Search Visualization** - Interactive exploration of AI decision paths
- **First Order Logic (FOL) Reasoning** - Knowledge representation for intelligent inference
- **PEAS Model Implementation** - Complete intelligent agent framework
- **Machine Learning Predictions** - Neural network visualization for parking availability
- **Multi-scenario Simulation** - Test different traffic and parking conditions

## 🎯 AI Implementation Components

### 1. **Knowledge Representation (FOL)**
Five core logical representations implemented:
1. **Parking Availability** - `∀p (ParkingLot(p) → (Available(p) ↔ ∃s (Space(s) ∧ In(s, p) ∧ ¬Occupied(s))))`
2. **Optimal Route Selection** - `∀r∀p ((Route(r) ∧ Connects(r, UserLocation, p) ∧ Available(p) ∧ LeastCost(r)) → OptimalRoute(r))`
3. **Time-Based Prediction** - `∀p∀t ((ParkingLot(p) ∧ HighOccupancy(p, time_past)) → LikelyUnavailable(p, time_now))`
4. **User Preference** - `∀p ((Available(p) ∧ Near(p, Destination)) → Preferred(p))`
5. **Traffic Congestion** - `∀r ((Road(r) ∧ VehicleDensity(r) > Threshold) → Congested(r))`

### 2. **State Space Search**
15 distinct states with interactive visualization:
- **Initial State**: APP_IDLE (S0)
- **Goal State**: PARKING_REACHED (S13)
- **States**: DEST_SET, TRAFFIC_CHECK, PARKING_AVAIL, ROUTE_CALC, NAVIGATING, etc.
- **4 Scenarios**: Optimal Path, High Traffic, Mid-route Reroute, Severe Delay

### 3. **PEAS Model Implementation**
- **Performance**: Reduce search time, avoid congestion, maximize success rate
- **Environment**: Urban road network, parking lots, traffic conditions
- **Actuators**: Route guidance, notifications, rerouting, parking suggestions
- **Sensors**: IoT sensors, traffic APIs, GPS, user input

### 4. **Search Algorithms**
- **Dijkstra's Algorithm** implementation for optimal route finding
- **A* Algorithm** with heuristic optimization
- **Interactive algorithm visualization** showing step-by-step execution

## 🚀 How to Use the Prototype

### 1. **Start the Simulation**
1. Select a destination from dropdown (UTM, Mall, Hospital, Airport, Stadium)
2. Choose time of day (Peak, Off-peak, Evening)
3. Click "Start AI Simulation"

### 2. **Test Different Scenarios**
Use the scenario dropdown to test AI behavior in various conditions:
- **Demo Mode**: Default simulation
- **Optimal**: Low traffic + Available parking
- **High Traffic**: High traffic + No parking
- **Reroute**: Mid-route parking loss
- **Severe Delay**: Multiple failures with auto-reroute

### 3. **Interactive Features**
- **Click map locations** to select destinations
- **Hover over PEAS components** for tooltips
- **Click AI status** for detailed explanations
- **Toggle Dark/Light mode** using moon icon
- **View real-time logs** and notifications

## 🧪 Concept Verification

### Performance Metrics Tracked:
1. **Time Saved**: Average reduction in parking search time
2. **Fuel Saved**: Calculated based on reduced travel distance
3. **Efficiency Score**: AI vs Traditional comparison
4. **Success Rate**: Parking success probability
5. **User Satisfaction**: Based on journey smoothness

### Verification Dashboard Shows:
- **30% Time Reduction** compared to traditional search
- **25% Fuel Savings** through optimized routing
- **88% User Satisfaction** from stress-free parking
- **92% Overall Success Rate** in finding parking

## 🏗️ Technical Implementation

### Frontend Technologies:
- **HTML5/CSS3** with CSS Grid/Flexbox
- **JavaScript (ES6+)** for core logic
- **D3.js** for state space visualization
- **Font Awesome** for icons
- **Responsive Design** for all devices

### AI Components:
1. **FOL Reasoner Class** - Logical inference engine
2. **Search Algorithm Visualizer** - Dijkstra/A* implementation
3. **Simulation Engine** - State transition management
4. **ML Prediction Model** - Neural network simulation

### Project Structure:
```
parkora-ai/
├── index.html          # Main interface
├── styles.css          # Styling and animations
├── data.js             # Mock data and knowledge base
├── fol-reasoner.js     # FOL inference engine
├── search-algorithm.js # Dijkstra/A* implementation
├── simulation.js       # State machine and simulation
└── script.js           # UI interactions and enhancements
```

## 📊 Key AI Concepts Demonstrated

### 1. **Intelligent Agent Design**
- Goal-oriented behavior
- Rational decision making
- Environment interaction
- Performance optimization

### 2. **Search and Optimization**
- State space exploration
- Cost function minimization
- Path finding algorithms
- Real-time adaptation

### 3. **Knowledge-Based Reasoning**
- First Order Logic inference
- Rule-based decision making
- Context-aware recommendations
- Temporal reasoning

### 4. **Machine Learning Integration**
- Predictive modeling
- Pattern recognition
- Real-time adaptation
- Confidence scoring

## 🎥 Video Demonstration Points

### 3-Minute Walkthrough:
1. **Introduction (30s)**: Problem statement and AI solution overview
2. **Core AI Components (60s)**: Show KR, State Space, PEAS implementation
3. **Live Demo (90s)**: Test scenarios and show AI decision-making
4. **Verification (30s)**: Performance metrics and concept validation

### Key Demonstration Scenes:
1. **Optimal Scenario**: Show smooth AI-guided parking
2. **High Traffic Challenge**: Demonstrate AI adaptation
3. **Mid-route Reroute**: Show intelligent recovery
4. **FOL Reasoning**: Explain AI decision logic

## 📈 How This Prototype Validates the Concept

### 1. **Real-world Problem Solving**
- Addresses actual urban mobility challenges
- Demonstrates measurable improvements
- Shows practical AI application

### 2. **Comprehensive AI Integration**
- Multiple AI techniques working together
- End-to-end intelligent system
- Scalable architecture

### 3. **Measurable Impact**
- Quantitative performance metrics
- Comparative analysis (AI vs Traditional)
- User experience improvements

### 4. **Scalable Foundation**
- Modular design for expansion
- API-ready architecture
- Real-world data integration ready

## 👥 Team Information
**TriSpark Tech** - SECJ3553 Artificial Intelligence | Section 07
- **Austin See Yong Hui** (A23CS5015)
- **Wong Jia Xuan** (A23CS0197)
- **Yap En Thong** (A23CS0284)

**Lecturer**: Dr. Ruhaidah binti Samsudin  
**Course**: SECJ3553 Artificial Intelligence  
**Semester**: I 2025/2026  
**University**: Universiti Teknologi Malaysia (UTM)

## 🔗 Links
- **Live Demo**: [https://enthongy.github.io/parkora-ai/](https://enthongy.github.io/parkora-ai/)
- **GitHub Repository**: [https://github.com/enthongy/parkora-ai](https://github.com/enthongy/parkora-ai)

## 🏆 Project Significance
Parkora.ai demonstrates how AI can transform urban mobility by:
1. **Reducing congestion** through intelligent routing
2. **Saving time and resources** via optimized parking
3. **Improving quality of life** through stress-free navigation
4. **Supporting smart city initiatives** with data-driven solutions

This prototype serves as a proof-of-concept for implementing comprehensive AI solutions to real-world problems, showcasing the practical application of theoretical AI concepts in a user-friendly, interactive interface.

---

**🚀 Experience the future of smart parking at: [https://enthongy.github.io/parkora-ai/](https://enthongy.github.io/parkora-ai/)**
