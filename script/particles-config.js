/* ===========================================
    Particles.js: تفعيل خلفية النقاط لقسم العدادات
    =========================================== */

particlesJS('particles-js-counters', {
    "particles": {
        "number": { "value": 40, "density": { "enable": true, "value_area": 800 } },
        "color": { "value": "#ffffff" }, 
        "shape": { "type": "circle" },
        "opacity": { "value": 0.5, "random": true },
        "size": { "value": 2, "random": true }, 
        "line_linked": { "enable": true, "distance": 120, "color": "#ffffff", "opacity": 0.3, "width": 1 },
        "move": { "enable": true, "speed": 3, "direction": "none", "out_mode": "out" },
    },
    "interactivity": {
        "detect_on": "canvas",
        "events": {
            "onhover": { "enable": false }, 
            "onclick": { "enable": false }, 
            "resize": true
        },
        "modes": {}
    },
    "retina_detect": true
});