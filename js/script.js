// ==========================================
// THREE.JS 3D BACKGROUND
// ==========================================
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.getElementById('canvas-container').appendChild(renderer.domElement);

// Create floating particles
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 1500;
const posArray = new Float32Array(particlesCount * 3);
const scaleArray = new Float32Array(particlesCount);

for(let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 10;
}
for(let i = 0; i < particlesCount; i++) {
    scaleArray[i] = Math.random();
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
particlesGeometry.setAttribute('aScale', new THREE.BufferAttribute(scaleArray, 1));

// Custom shader material for particles
const particlesMaterial = new THREE.ShaderMaterial({
    uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uColor1: { value: new THREE.Color('#667eea') },
        uColor2: { value: new THREE.Color('#f093fb') }
    },
    vertexShader: `
        uniform float uTime;
        uniform vec2 uMouse;
        attribute float aScale;
        varying float vAlpha;
        
        void main() {
            vec3 pos = position;
            
            // Gentle wave motion
            pos.y += sin(uTime * 0.5 + pos.x * 2.0) * 0.1;
            pos.x += cos(uTime * 0.3 + pos.y * 2.0) * 0.1;
            
            // Mouse interaction
            float dist = distance(pos.xy, uMouse * 2.0);
            float strength = smoothstep(2.0, 0.0, dist);
            pos.z += strength * 0.5;
            
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_Position = projectionMatrix * mvPosition;
            gl_PointSize = (4.0 * aScale + 2.0) * (10.0 / -mvPosition.z);
            
            vAlpha = 0.6 + strength * 0.4;
        }
    `,
    fragmentShader: `
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        varying float vAlpha;
        
        void main() {
            float dist = length(gl_PointCoord - vec2(0.5));
            if (dist > 0.5) discard;
            
            float alpha = smoothstep(0.5, 0.0, dist) * vAlpha;
            vec3 color = mix(uColor1, uColor2, gl_PointCoord.y);
            
            gl_FragColor = vec4(color, alpha);
        }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
});

const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// Create a wireframe torus knot for extra visual interest
const torusGeometry = new THREE.TorusKnotGeometry(1, 0.3, 100, 16);
const torusMaterial = new THREE.MeshBasicMaterial({ 
    color: 0x667eea, 
    wireframe: true, 
    transparent: true, 
    opacity: 0.05 
});
const torus = new THREE.Mesh(torusGeometry, torusMaterial);
torus.position.z = -3;
scene.add(torus);

camera.position.z = 3;

// Mouse tracking
let mouseX = 0;
let mouseY = 0;
let targetMouseX = 0;
let targetMouseY = 0;

document.addEventListener('mousemove', (e) => {
    targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
    targetMouseY = -(e.clientY / window.innerHeight) * 2 + 1;
});

// Animation loop
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    
    const elapsedTime = clock.getElapsedTime();
    particlesMaterial.uniforms.uTime.value = elapsedTime;
    
    // Smooth mouse follow
    mouseX += (targetMouseX - mouseX) * 0.05;
    mouseY += (targetMouseY - mouseY) * 0.05;
    particlesMaterial.uniforms.uMouse.value.set(mouseX, mouseY);
    
    // Rotate particles slowly
    particlesMesh.rotation.y = elapsedTime * 0.05;
    particlesMesh.rotation.x = mouseY * 0.1;
    
    // Animate torus
    torus.rotation.x = elapsedTime * 0.1;
    torus.rotation.y = elapsedTime * 0.15;
    
    renderer.render(scene, camera);
}
animate();

// Resize handler
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// ==========================================
// CUSTOM CURSOR
// ==========================================
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');
const hoverTargets = document.querySelectorAll('.hover-target');

window.addEventListener('mousemove', (e) => {
    const posX = e.clientX;
    const posY = e.clientY;
    
    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;
    
    cursorOutline.animate({
        left: `${posX}px`,
        top: `${posY}px`
    }, { duration: 500, fill: "forwards" });
});

hoverTargets.forEach(target => {
    target.addEventListener('mouseenter', () => {
        cursorOutline.classList.add('hover');
    });
    target.addEventListener('mouseleave', () => {
        cursorOutline.classList.remove('hover');
    });
});

// Hide cursor on touch devices
if ('ontouchstart' in window) {
    cursorDot.style.display = 'none';
    cursorOutline.style.display = 'none';
    document.body.style.cursor = 'auto';
}

// ==========================================
// GSAP SCROLL ANIMATIONS
// ==========================================
gsap.registerPlugin(ScrollTrigger);

// Reveal animations
const revealElements = document.querySelectorAll('.reveal');
revealElements.forEach((element) => {
    gsap.fromTo(element, 
        { opacity: 0, y: 50 },
        {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: element,
                start: "top 85%",
                toggleActions: "play none none reverse"
            }
        }
    );
});

// Parallax effect on hero
gsap.to("h1", {
    yPercent: 50,
    ease: "none",
    scrollTrigger: {
        trigger: "section:first-of-type",
        start: "top top",
        end: "bottom top",
        scrub: true
    }
});

// Work cards parallax
gsap.utils.toArray('.glass-card').forEach((card, i) => {
    gsap.fromTo(card,
        { y: 100, opacity: 0 },
        {
            y: 0,
            opacity: 1,
            duration: 0.8,
            delay: i * 0.1,
            scrollTrigger: {
                trigger: card,
                start: "top 90%",
                toggleActions: "play none none reverse"
            }
        }
    );
});

// ==========================================
// MAGNETIC BUTTON EFFECT
// ==========================================
const magneticBtns = document.querySelectorAll('.magnetic-btn');

magneticBtns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });
    
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)';
    });
});

// ==========================================
// SMOOTH SCROLL FOR NAV LINKS
// ==========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ==========================================
// TEXT SCRAMBLE EFFECT ON HERO
// ==========================================
class TextScramble {
    constructor(el) {
        this.el = el;
        this.chars = '!<>-_\\/[]{}—=+*^?#________';
        this.update = this.update.bind(this);
    }
    setText(newText) {
        const oldText = this.el.innerText;
        const length = Math.max(oldText.length, newText.length);
        const promise = new Promise((resolve) => this.resolve = resolve);
        this.queue = [];
        for (let i = 0; i < length; i++) {
            const from = oldText[i] || '';
            const to = newText[i] || '';
            const start = Math.floor(Math.random() * 40);
            const end = start + Math.floor(Math.random() * 40);
            this.queue.push({ from, to, start, end });
        }
        cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        this.update();
        return promise;
    }
    update() {
        let output = '';
        let complete = 0;
        for (let i = 0, n = this.queue.length; i < n; i++) {
            let { from, to, start, end, char } = this.queue[i];
            if (this.frame >= end) {
                complete++;
                output += to;
            } else if (this.frame >= start) {
                if (!char || Math.random() < 0.28) {
                    char = this.randomChar();
                    this.queue[i].char = char;
                }
                output += `<span class="text-gray-600">${char}</span>`;
            } else {
                output += from;
            }
        }
        this.el.innerHTML = output;
        if (complete === this.queue.length) {
            this.resolve();
        } else {
            this.frameRequest = requestAnimationFrame(this.update);
            this.frame++;
        }
    }
    randomChar() {
        return this.chars[Math.floor(Math.random() * this.chars.length)];
    }
}

// Apply scramble effect to subtitle after load
window.addEventListener('load', () => {
    const subtitle = document.querySelector('h1 span:last-child');
    if (subtitle) {
        const fx = new TextScramble(subtitle);
        setTimeout(() => {
            fx.setText('THE FUTURE');
        }, 1000);
    }
});