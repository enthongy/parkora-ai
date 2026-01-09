// Enhanced Main Script for Parkora.ai
document.addEventListener('DOMContentLoaded', function() {
    console.log('Parkora.ai Enhanced Prototype Loaded');
    
    // Initialize all components
    initializeThemeToggle();
    initializeTooltips();
    initializeMapInteractions();
    initializeSoundNotifications();
    initializeResponsiveDesign();
    
    // Show welcome message
    setTimeout(() => {
        if (window.parkoraSimulation) {
            window.parkoraSimulation.addLog("Enhanced AI System Ready", "system");
            window.parkoraSimulation.addLog("Select scenario from dropdown to test different AI behaviors", "info");
            window.parkoraSimulation.addNotification("Welcome", "Parkora.ai Enhanced Prototype v2.0", "info");
            
            // Show feature highlights
            highlightNewFeatures();
        }
    }, 1000);
});

// Enhanced Theme Toggle with Animation
function initializeThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('i');
    const themeText = themeToggle.querySelector('span');
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('parkora-theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeUI(savedTheme);
    
    // Toggle theme on click
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        // Add transition animation
        document.documentElement.style.transition = 'all 0.5s ease';
        
        // Apply new theme
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('parkora-theme', newTheme);
        
        // Update UI with animation
        updateThemeUI(newTheme);
        
        // Log theme change
        if (window.parkoraSimulation) {
            window.parkoraSimulation.addLog(`Theme changed to ${newTheme} mode`, "system");
            window.parkoraSimulation.addNotification("Theme Changed", `Switched to ${newTheme} mode`, "info");
        }
        
        // Remove transition after animation
        setTimeout(() => {
            document.documentElement.style.transition = '';
        }, 500);
    });
    
    function updateThemeUI(theme) {
        if (theme === 'light') {
            themeIcon.className = 'fas fa-sun';
            themeText.textContent = 'Light Mode';
            themeToggle.title = 'Switch to dark mode';
            themeToggle.style.background = 'linear-gradient(90deg, #fdcb6e, #e17055)';
        } else {
            themeIcon.className = 'fas fa-moon';
            themeText.textContent = 'Dark Mode';
            themeToggle.title = 'Switch to light mode';
            themeToggle.style.background = 'var(--hover-bg)';
        }
    }
}

// Enhanced Tooltip System with Animations
function initializeTooltips() {
    const tooltipContainer = document.createElement('div');
    tooltipContainer.id = 'tooltip-container';
    tooltipContainer.style.cssText = `
        position: fixed;
        z-index: 10000;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.3s ease, transform 0.3s ease;
        transform: translateY(10px);
    `;
    document.body.appendChild(tooltipContainer);
    
    // Add tooltips to elements with data-tooltip attribute
    document.addEventListener('mouseover', function(e) {
        const target = e.target.closest('[data-tooltip]');
        if (!target) return;
        
        const tooltipText = target.getAttribute('data-tooltip');
        if (!tooltipText) return;
        
        const tooltip = document.getElementById('tooltip-container');
        tooltip.innerHTML = `
            <div class="tooltip">
                <div class="tooltip-arrow"></div>
                ${tooltipText}
            </div>
        `;
        
        tooltip.style.opacity = '1';
        tooltip.style.transform = 'translateY(0)';
        updateTooltipPosition(e, tooltip);
    });
    
    document.addEventListener('mousemove', function(e) {
        const tooltip = document.getElementById('tooltip-container');
        if (tooltip.style.opacity === '1') {
            updateTooltipPosition(e, tooltip);
        }
    });
    
    document.addEventListener('mouseout', function(e) {
        if (e.target.closest('[data-tooltip]')) {
            const tooltip = document.getElementById('tooltip-container');
            tooltip.style.opacity = '0';
            tooltip.style.transform = 'translateY(10px)';
        }
    });
    
    function updateTooltipPosition(e, tooltip) {
        const x = e.clientX + 15;
        const y = e.clientY + 15;
        
        const tooltipRect = tooltip.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        let finalX = x;
        let finalY = y;
        
        if (x + tooltipRect.width > viewportWidth - 10) {
            finalX = viewportWidth - tooltipRect.width - 10;
        }
        
        if (y + tooltipRect.height > viewportHeight - 10) {
            finalY = viewportHeight - tooltipRect.height - 10;
        }
        
        tooltip.style.left = finalX + 'px';
        tooltip.style.top = finalY + 'px';
    }
}

// Enhanced Map Interactions
function initializeMapInteractions() {
    const map = document.getElementById('city-map');
    if (!map) return;
    
    // Add enhanced hover effects
    map.addEventListener('mouseover', function(e) {
        const location = e.target.closest('.map-location');
        if (location && !location.classList.contains('start')) {
            location.style.transform = 'translate(-50%, -50%) scale(1.2)';
            location.style.zIndex = '15';
            location.style.boxShadow = '0 0 20px rgba(78, 205, 196, 0.5)';
            
            // Show info tooltip
            const locationName = location.querySelector('span').textContent;
            location.setAttribute('data-tooltip', `Click to select ${locationName} as destination`);
        }
    });
    
    map.addEventListener('mouseout', function(e) {
        const location = e.target.closest('.map-location');
        if (location && !location.classList.contains('start')) {
            location.style.transform = 'translate(-50%, -50%) scale(1)';
            location.style.zIndex = '5';
            location.style.boxShadow = '';
            location.removeAttribute('data-tooltip');
        }
    });
    
    // Enhanced click handler for clear logs button
    const clearLogsBtn = document.getElementById('clear-logs');
    if (clearLogsBtn) {
        clearLogsBtn.addEventListener('click', function() {
            if (window.parkoraSimulation) {
                // Add confirmation animation
                clearLogsBtn.innerHTML = '<i class="fas fa-check"></i>';
                clearLogsBtn.style.background = 'var(--success-color)';
                clearLogsBtn.style.borderColor = 'var(--success-color)';
                
                window.parkoraSimulation.simulationState.logs = [];
                window.parkoraSimulation.updateLogsDisplay();
                window.parkoraSimulation.addLog("Logs cleared", "system");
                
                // Reset button after animation
                setTimeout(() => {
                    clearLogsBtn.innerHTML = '<i class="fas fa-trash"></i>';
                    clearLogsBtn.style.background = '';
                    clearLogsBtn.style.borderColor = '';
                }, 1000);
            }
        });
    }
}

// Sound Notifications
function initializeSoundNotifications() {
    // Create audio context for sound effects
    try {
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        const audioContext = new AudioContext();
        
        // Create sound functions
        window.playSuccessSound = function() {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 523.25; // C5
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        };
        
        window.playWarningSound = function() {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 349.23; // F4
            oscillator.type = 'sawtooth';
            
            gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
        };
        
        window.playNotificationSound = function() {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
            oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime + 0.1);
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.2);
        };
        
    } catch (e) {
        console.log("Web Audio API not supported");
    }
}

// Responsive Design Adjustments
function initializeResponsiveDesign() {
    function adjustLayout() {
        const width = window.innerWidth;
        const mainContent = document.querySelector('.main-content');
        
        if (width < 1400) {
            document.body.classList.add('mobile-layout');
            if (mainContent) {
                mainContent.style.gridTemplateColumns = '1fr';
            }
        } else {
            document.body.classList.remove('mobile-layout');
            if (mainContent) {
                mainContent.style.gridTemplateColumns = '320px 1fr 340px';
            }
        }
    }
    
    // Initial adjustment
    adjustLayout();
    
    // Adjust on resize
    window.addEventListener('resize', adjustLayout);
}

// Highlight New Features
function highlightNewFeatures() {
    const newFeatures = [
        {
            element: '#scenario-select',
            message: 'Test different AI scenarios',
            color: '#00adb5'
        },
        {
            element: '#explain-ai',
            message: 'Click for AI decision explanation',
            color: '#ffa726'
        },
        {
            element: '.ml-card',
            message: 'Neural network visualization',
            color: '#4ecdc4'
        },
        {
            element: '.verification-card',
            message: 'Concept verification metrics',
            color: '#4caf50'
        }
    ];
    
    newFeatures.forEach((feature, index) => {
        setTimeout(() => {
            const element = document.querySelector(feature.element);
            if (element) {
                const originalBoxShadow = element.style.boxShadow;
                const originalBorder = element.style.borderColor;
                
                // Pulse animation
                element.style.boxShadow = `0 0 20px ${feature.color}`;
                element.style.borderColor = feature.color;
                
                // Show tooltip
                element.setAttribute('data-tooltip', feature.message);
                
                // Reset after 3 seconds
                setTimeout(() => {
                    element.style.boxShadow = originalBoxShadow;
                    element.style.borderColor = originalBorder;
                    element.removeAttribute('data-tooltip');
                }, 3000);
            }
        }, index * 1000);
    });
}

// Enhanced CSS for new features
const enhancedStyles = document.createElement('style');
enhancedStyles.textContent = `
    /* Enhanced animations */
    @keyframes float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
    }
    
    @keyframes shimmer {
        0% { background-position: -200px 0; }
        100% { background-position: 200px 0; }
    }
    
    /* Enhanced tooltip */
    .tooltip-arrow {
        position: absolute;
        top: -6px;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 0;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-bottom: 6px solid rgba(0, 0, 0, 0.9);
    }
    
    /* Scenario selector styles */
    .scenario-dropdown option {
        padding: 10px;
        background: var(--card-bg);
    }
    
    .scenario-dropdown option[value="optimal"] {
        color: var(--success-color);
    }
    
    .scenario-dropdown option[value="high-traffic"] {
        color: var(--warning-color);
    }
    
    .scenario-dropdown option[value="reroute"] {
        color: var(--info-color);
    }
    
    .scenario-dropdown option[value="severe-delay"] {
        color: var(--error-color);
    }
    
    /* Mobile layout adjustments */
    .mobile-layout .header-controls {
        flex-wrap: wrap;
        justify-content: center;
    }
    
    .mobile-layout .scenario-selector {
        order: -1;
        width: 100%;
        margin-bottom: 10px;
    }
    
    .mobile-layout .scenario-dropdown {
        width: 100%;
    }
    
    .mobile-layout .left-panel,
    .mobile-layout .right-panel {
        max-height: 400px;
        overflow-y: auto;
    }
    
    /* Print optimization */
    @media print {
        .modal,
        .tooltip,
        .notification {
            display: none !important;
        }
        
        .city-map {
            height: 200px;
        }
        
        .log-container {
            max-height: 100px;
        }
    }
    
    /* Accessibility improvements */
    @media (prefers-reduced-motion: reduce) {
        * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
        }
    }
    
    /* High contrast mode */
    @media (prefers-contrast: high) {
        :root {
            --primary-color: #0000ff;
            --text-primary: #000000;
            --text-secondary: #0000ff;
        }
        
        [data-theme="light"] {
            --primary-color: #0000ff;
            --text-primary: #000000;
            --text-secondary: #0000ff;
        }
    }
    
    /* Dark mode optimizations */
    [data-theme="dark"] .map-location {
        filter: brightness(1.2);
    }
    
    [data-theme="dark"] .fol-code {
        background: rgba(255, 255, 255, 0.05);
    }
    
    /* Light mode optimizations */
    [data-theme="light"] .map-location {
        filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
    }
    
    [data-theme="light"] .fol-code {
        background: rgba(0, 0, 0, 0.05);
    }
    
    /* Algorithm visualization enhancements */
    .algo-node {
        position: relative;
        transition: all 0.3s ease;
    }
    
    .algo-node.start {
        animation: float 2s infinite ease-in-out;
    }
    
    .algo-node.goal {
        animation: shimmer 2s infinite linear;
        background: linear-gradient(90deg, 
            var(--success-color) 0%, 
            rgba(0, 184, 148, 0.5) 50%, 
            var(--success-color) 100%);
        background-size: 200px 100%;
    }
    
    .algo-node.path {
        background: linear-gradient(45deg, 
            var(--primary-color) 0%, 
            var(--primary-light) 100%);
        color: white;
    }
    
    .algo-node.frontier {
        background: linear-gradient(45deg, 
            var(--warning-color) 0%, 
            #f57c00 100%);
        color: white;
    }
    
    .algorithm-legend {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 10px;
        margin-top: 10px;
        padding: 10px;
        background: var(--hover-bg);
        border-radius: 8px;
        border: 1px solid var(--border-color);
    }
    
    .algorithm-legend .legend-item {
        display: flex;
        align-items: center;
        gap: 5px;
        font-size: 0.7rem;
    }
    
    .algorithm-legend .legend-color {
        width: 15px;
        height: 15px;
        border-radius: 3px;
    }
    
    .algorithm-legend .legend-color.start {
        background: var(--primary-color);
    }
    
    .algorithm-legend .legend-color.goal {
        background: var(--success-color);
    }
    
    .algorithm-legend .legend-color.visited {
        background: var(--warning-color);
    }
    
    .algorithm-legend .legend-color.frontier {
        background: #f57c00;
    }
    
    .algorithm-legend .legend-color.current {
        background: var(--info-color);
    }
    
    .algorithm-legend .legend-color.path {
        background: linear-gradient(45deg, var(--primary-color), var(--primary-light));
    }
`;
document.head.appendChild(enhancedStyles);

// Make enhanced functions available globally
window.initializeEnhancedSimulation = function() {
    if (window.parkoraSimulation) {
        window.parkoraSimulation.initialize();
        
        // Play welcome sound
        if (window.playNotificationSound) {
            window.playNotificationSound();
        }
    }
};

window.demoAllFeatures = function() {
    // Cycle through all scenarios
    const scenarios = ['optimal', 'high-traffic', 'reroute', 'severe-delay'];
    let currentIndex = 0;
    
    function runNextScenario() {
        const scenarioSelect = document.getElementById('scenario-select');
        if (scenarioSelect) {
            scenarioSelect.value = scenarios[currentIndex];
            
            if (window.parkoraSimulation) {
                window.parkoraSimulation.resetSimulation();
                
                setTimeout(() => {
                    window.parkoraSimulation.startSimulation();
                    
                    currentIndex = (currentIndex + 1) % scenarios.length;
                    
                    // Schedule next scenario after completion
                    setTimeout(() => {
                        if (!window.parkoraSimulation.isRunning) {
                            runNextScenario();
                        }
                    }, 10000);
                }, 3000);
            }
        }
    }
    
    runNextScenario();
};

console.log('Parkora.ai Enhanced Prototype Ready with all features');