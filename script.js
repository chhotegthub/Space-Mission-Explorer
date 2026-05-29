// Solar System Canvas Setup
const canvas = document.getElementById('solarSystemCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Planets Data
const planets = [
    { name: 'Mercury', distance: 60, size: 8, color: '#8c7853', speed: 0.04, angle: 0 },
    { name: 'Venus', distance: 100, size: 12, color: '#ffc649', speed: 0.015, angle: 0 },
    { name: 'Earth', distance: 150, size: 13, color: '#4a90e2', speed: 0.01, angle: 0 },
    { name: 'Mars', distance: 200, size: 10, color: '#e74c3c', speed: 0.008, angle: 0 },
    { name: 'Jupiter', distance: 280, size: 25, color: '#f4a460', speed: 0.002, angle: 0 },
    { name: 'Saturn', distance: 350, size: 22, color: '#f0e68c', speed: 0.0009, angle: 0 },
    { name: 'Uranus', distance: 400, size: 18, color: '#87ceeb', speed: 0.0004, angle: 0 },
    { name: 'Neptune', distance: 450, size: 17, color: '#4169e1', speed: 0.0001, angle: 0 }
];

const sun = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 20,
    color: '#FDB813'
};

let hoveredPlanet = null;
let selectedPlanet = null;

// Draw Sun
function drawSun() {
    ctx.fillStyle = sun.color;
    ctx.beginPath();
    ctx.arc(sun.x, sun.y, sun.radius, 0, Math.PI * 2);
    ctx.fill();

    // Sun glow
    ctx.fillStyle = 'rgba(253, 184, 19, 0.2)';
    ctx.beginPath();
    ctx.arc(sun.x, sun.y, sun.radius * 1.5, 0, Math.PI * 2);
    ctx.fill();

    // Sun rays
    ctx.strokeStyle = 'rgba(253, 184, 19, 0.3)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(
            sun.x + Math.cos(angle) * sun.radius * 1.5,
            sun.y + Math.sin(angle) * sun.radius * 1.5
        );
        ctx.lineTo(
            sun.x + Math.cos(angle) * sun.radius * 2.5,
            sun.y + Math.sin(angle) * sun.radius * 2.5
        );
        ctx.stroke();
    }
}

// Draw Orbit Lines
function drawOrbits() {
    ctx.strokeStyle = 'rgba(233, 69, 96, 0.2)';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    
    planets.forEach(planet => {
        ctx.beginPath();
        ctx.arc(sun.x, sun.y, planet.distance, 0, Math.PI * 2);
        ctx.stroke();
    });

    ctx.setLineDash([]);
}

// Draw Planets
function drawPlanets() {
    planets.forEach(planet => {
        const x = sun.x + Math.cos(planet.angle) * planet.distance;
        const y = sun.y + Math.sin(planet.angle) * planet.distance;

        // Planet body
        ctx.fillStyle = planet.color;
        ctx.beginPath();
        ctx.arc(x, y, planet.size, 0, Math.PI * 2);
        ctx.fill();

        // Hover effect
        if (hoveredPlanet === planet.name) {
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(x, y, planet.size + 5, 0, Math.PI * 2);
            ctx.stroke();

            // Glow effect
            ctx.fillStyle = `rgba(${hexToRgb(planet.color).r}, ${hexToRgb(planet.color).g}, ${hexToRgb(planet.color).b}, 0.3)`;
            ctx.beginPath();
            ctx.arc(x, y, planet.size + 8, 0, Math.PI * 2);
            ctx.fill();
        }

        // Selection effect
        if (selectedPlanet === planet.name) {
            ctx.strokeStyle = '#00ff00';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.arc(x, y, planet.size + 8, 0, Math.PI * 2);
            ctx.stroke();
        }

        // Planet label
        ctx.fillStyle = hoveredPlanet === planet.name ? '#fff' : 'rgba(255, 255, 255, 0.7)';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(planet.name, x, y + planet.size + 15);
    });
}

// Update Planet Positions
function updatePlanets() {
    planets.forEach(planet => {
        planet.angle += planet.speed;
    });
}

// Animate Solar System
function animateSolarSystem() {
    ctx.fillStyle = 'rgba(15, 12, 41, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawOrbits();
    drawSun();
    drawPlanets();
    updatePlanets();

    requestAnimationFrame(animateSolarSystem);
}

// Canvas Mouse Events
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    hoveredPlanet = null;

    planets.forEach(planet => {
        const x = sun.x + Math.cos(planet.angle) * planet.distance;
        const y = sun.y + Math.sin(planet.angle) * planet.distance;
        
        const distance = Math.sqrt((mouseX - x) ** 2 + (mouseY - y) ** 2);
        
        if (distance < planet.size + 10) {
            hoveredPlanet = planet.name;
            canvas.style.cursor = 'pointer';
            updatePlanetInfo(planet);
        }
    });

    if (!hoveredPlanet) {
        canvas.style.cursor = 'default';
    }
});

canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    planets.forEach(planet => {
        const x = sun.x + Math.cos(planet.angle) * planet.distance;
        const y = sun.y + Math.sin(planet.angle) * planet.distance;
        
        const distance = Math.sqrt((mouseX - x) ** 2 + (mouseY - y) ** 2);
        
        if (distance < planet.size + 10) {
            selectedPlanet = planet.name;
            showPlanetDetails(planet);
        }
    });
});

// Update Planet Info Display
function updatePlanetInfo(planet) {
    const planetDetails = document.getElementById('planetDetails');
    
    const planetDescriptions = {
        'Mercury': 'The smallest planet and closest to the Sun. It has extreme temperature variations.',
        'Venus': 'The hottest planet with a thick atmosphere of carbon dioxide and clouds of sulfuric acid.',
        'Earth': 'Our home planet. The only known planet with life and liquid water on its surface.',
        'Mars': 'The Red Planet. A prime target for future human colonization missions.',
        'Jupiter': 'The largest planet in our solar system. A gas giant with a Great Red Spot storm.',
        'Saturn': 'Famous for its spectacular ring system made of ice and rock particles.',
        'Uranus': 'An ice giant that rotates on its side. Has a faint ring system.',
        'Neptune': 'The farthest planet from the Sun. Known for the strongest winds in the solar system.'
    };

    planetDetails.innerHTML = `
        <h3>${planet.name}</h3>
        <p><strong>Distance from Sun:</strong> ${planet.distance} million km</p>
        <p><strong>Size:</strong> ${planet.size}x Earth's radius</p>
        <p><strong>Description:</strong> ${planetDescriptions[planet.name]}</p>
    `;
}

// Show Detailed Planet Information
function showPlanetDetails(planet) {
    const planetDetails = document.getElementById('planetDetails');
    
    const detailedInfo = {
        'Mercury': {
            description: 'The smallest and fastest planet in our solar system.',
            moons: 0,
            dayLength: 59 + ' Earth days',
            yearLength: 88 + ' Earth days'
        },
        'Venus': {
            description: 'The hottest planet with a surface temperature of 462°C.',
            moons: 0,
            dayLength: 243 + ' Earth days',
            yearLength: 225 + ' Earth days'
        },
        'Earth': {
            description: 'Our home planet, the only known planet with life.',
            moons: 1,
            dayLength: 24 + ' hours',
            yearLength: 365.25 + ' days'
        },
        'Mars': {
            description: 'The Red Planet, target of many space exploration missions.',
            moons: 2,
            dayLength: 24.6 + ' hours',
            yearLength: 687 + ' Earth days'
        },
        'Jupiter': {
            description: 'The largest planet, a gas giant with a Great Red Spot.',
            moons: 95,
            dayLength: 10 + ' hours',
            yearLength: 12 + ' Earth years'
        },
        'Saturn': {
            description: 'Known for its beautiful ring system.',
            moons: 146,
            dayLength: 10.7 + ' hours',
            yearLength: 29 + ' Earth years'
        },
        'Uranus': {
            description: 'An ice giant that rotates on its side.',
            moons: 27,
            dayLength: 17 + ' hours',
            yearLength: 84 + ' Earth years'
        },
        'Neptune': {
            description: 'The farthest planet with the strongest winds.',
            moons: 14,
            dayLength: 16 + ' hours',
            yearLength: 165 + ' Earth years'
        }
    };

    const info = detailedInfo[planet.name];

    planetDetails.innerHTML = `
        <h3>${planet.name} - Detailed Info</h3>
        <p><strong>Description:</strong> ${info.description}</p>
        <p><strong>Moons:</strong> ${info.moons}</p>
        <p><strong>Day Length:</strong> ${info.dayLength}</p>
        <p><strong>Year Length:</strong> ${info.yearLength}</p>
    `;
}

// Hex to RGB conversion
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
}

// Start animation
animateSolarSystem();

// Smooth scroll functionality
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

// Navigation link click handler
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const href = link.getAttribute('href');
        const sectionId = href.substring(1);
        scrollToSection(sectionId);
    });
});

// Planet card hover effects
document.querySelectorAll('.planet-card').forEach(card => {
    card.addEventListener('click', () => {
        const planetName = card.getAttribute('data-planet');
        selectedPlanet = planetName;
        const planet = planets.find(p => p.name === planetName);
        if (planet) {
            showPlanetDetails(planet);
            scrollToSection('solar-system');
        }
    });
});

// Timeline animation
const timelineItems = document.querySelectorAll('.timeline-item');
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
        }
    });
}, observerOptions);

timelineItems.forEach(item => {
    observer.observe(item);
});

// Mission card hover effects
document.querySelectorAll('.mission-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px)';
    });
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// Rocket card interactive effects
document.querySelectorAll('.rocket-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.boxShadow = '0 0 30px rgba(233, 69, 96, 0.8)';
    });
    card.addEventListener('mouseleave', function() {
        this.style.boxShadow = '';
    });
});

// Apollo mission cards click handler
document.querySelectorAll('.apollo-card').forEach(card => {
    card.addEventListener('click', function() {
        const mission = this.textContent.trim();
        alert(`Selected: ${mission}\n\nThis Apollo mission was instrumental in space exploration.`);
    });
});

// Parallax effect on scroll
window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.backgroundPosition = `0% ${scrollPos * 0.5}px`;
    }
});

// Initialize tooltips for planets
function initializePlanetTooltips() {
    document.querySelectorAll('.planet-card').forEach(card => {
        card.title = 'Click to view on solar system map';
    });
}

initializePlanetTooltips();

// Add some interactivity to stats
function animateCounter(element, target, duration = 2000) {
    let current = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, 16);
}

// Animate numbers on scroll into view
const statElements = document.querySelectorAll('.stat-number');
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
            const target = parseInt(entry.target.textContent);
            animateCounter(entry.target, target);
            entry.target.dataset.animated = true;
        }
    });
}, { threshold: 0.5 });

statElements.forEach(el => {
    statsObserver.observe(el);
});

// Space-themed background animation
function createSpaceElements() {
    const hero = document.querySelector('.hero');
    for (let i = 0; i < 50; i++) {
        const star = document.createElement('div');
        star.style.position = 'absolute';
        star.style.width = Math.random() * 3 + 'px';
        star.style.height = star.style.width;
        star.style.backgroundColor = 'white';
        star.style.borderRadius = '50%';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.opacity = Math.random();
        star.style.animation = `twinkle ${Math.random() * 3 + 2}s infinite`;
        hero.appendChild(star);
    }
}

// Smooth scroll behavior
document.documentElement.style.scrollBehavior = 'smooth';

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        selectedPlanet = null;
        hoveredPlanet = null;
        const planetDetails = document.getElementById('planetDetails');
        if (planetDetails) {
            planetDetails.innerHTML = '<h3>Hover over planets to learn more</h3><p>Click on any planet for detailed information</p>';
        }
    }
});

// Track user interactions
let interactionCount = 0;
document.addEventListener('click', () => {
    interactionCount++;
});

// Log page load
console.log('🚀 Space Mission Explorer loaded successfully!');
console.log('Planets in our solar system:', planets.length);
console.log('Use arrow keys or mouse to explore the solar system');

// Add fade-in animation on page load
window.addEventListener('load', () => {
    document.body.style.animation = 'fadeIn 1s ease-in';
});

// Periodic message
setInterval(() => {
    console.log('🌍 Keep exploring the universe!');
}, 30000);
