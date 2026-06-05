# AURA — 3D Experience

A premium, fully interactive 3D web experience built with modern web technologies.

## 🎨 Features

- **Three.js 3D Background**: Animated particle system with WebGL shaders and wireframe geometry
- **GSAP Animations**: Scroll-triggered reveals, parallax effects, and smooth transitions
- **Glassmorphism Design**: Frosted glass cards with backdrop blur effects
- **Custom Cursor**: Interactive cursor that responds to hover states
- **Text Scramble Effect**: Animated hero subtitle with character transitions
- **Magnetic Buttons**: Buttons that follow mouse movement
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Performance Optimized**: WebGL rendering with additive blending

## 🛠️ Technologies

- **Three.js** - 3D graphics library
- **GSAP** - Animation library with ScrollTrigger plugin
- **Tailwind CSS** - Utility-first CSS framework
- **WebGL** - Custom shaders for particle effects
- **Vanilla JavaScript** - No frameworks required

## 📁 Project Structure

```
aura-3d-experience/
├── index.html          # Main HTML file
├── css/
│   └── styles.css      # Global styles
├── js/
│   └── script.js       # All JavaScript functionality
└── README.md           # Documentation
```

## 🚀 Quick Start

1. Clone the repository
```bash
git clone https://github.com/onisemosamuelolakunle-oss/aura-3d-experience.git
cd aura-3d-experience
```

2. Open in browser
```bash
# Using Python
python -m http.server 8000

# Using Node.js (with http-server)
npx http-server
```

3. Navigate to `http://localhost:8000` in your browser

## 📱 Browser Support

- Chrome/Edge (recommended)
- Firefox
- Safari
- Mobile browsers (touch-optimized)

## ⚙️ Customization

### Particle Count
Edit `js/script.js` line ~10:
```javascript
const particlesCount = 1500; // Adjust for performance
```

### Colors
Edit `js/script.js` particles material uniforms:
```javascript
uColor1: { value: new THREE.Color('#667eea') },
uColor2: { value: new THREE.Color('#f093fb') }
```

### Animation Speed
Edit `css/styles.css` or individual GSAP animations in `js/script.js`

## 🏛️ Sections

1. **Hero** - Eye-catching entrance with animated headline
2. **About** - Company description with statistics
3. **Features** - 3-column capability showcase
4. **Work** - Portfolio grid with hover effects
5. **CTA** - Call-to-action section
6. **Footer** - Social links and copyright

## 📊 Performance Tips

- Reduce particle count on lower-end devices
- Disable text scramble effect on mobile
- Use CSS animations instead of JavaScript for better performance
- Implement lazy loading for images (future versions)

## 🔗 CDN Links Used

- Tailwind CSS: `https://cdn.tailwindcss.com`
- Three.js: `https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js`
- GSAP: `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js`
- Google Fonts: Inter & Space Grotesk

## 📝 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

Created by Onisemo Samuel Olakunle

---

**Live Demo**: Deploy to GitHub Pages or Netlify for instant hosting.
