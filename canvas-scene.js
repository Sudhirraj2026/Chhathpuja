/**
 * canvas-scene.js
 * High-performance 60FPS simulation of Chhath Ghat:
 * - Dynamic sky, clouds, and Surya Dev with radiant light rays
 * - Multi-harmonic river waves with realistic sun path glint
 * - Sugarcane canopy (ईख का मंडप), Ghat steps, and sacred offerings
 * - Devotee (व्रती) standing in water with Soop
 * - Milk/Jal Arghya stream simulation
 * - Floating Diyas with realistic flame flicker and physics
 * - Flower petal shower (Marigold & Rose)
 */

class GhatScene {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = window.innerWidth;
        this.height = window.innerHeight;

        // Current phase: 'sunset', 'sunrise', 'night'
        this.phase = 'sunset';
        this.time = 0;

        // Interactive entities
        this.diyas = [];
        this.petals = [];
        this.arghyaActive = false;
        this.arghyaProgress = 0; // 0 to 1
        this.arghyaRipples = [];

        this.initCanvasSize();
        this.bindEvents();
        this.initDefaultDiyas();
    }

    initCanvasSize() {
        const dpr = window.devicePixelRatio || 1;
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width * dpr;
        this.canvas.height = this.height * dpr;
        this.ctx.scale(dpr, dpr);
    }

    bindEvents() {
        window.addEventListener('resize', () => this.initCanvasSize());

        // Click on water to float a diya
        this.canvas.addEventListener('click', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Check if clicked in river region (bottom half)
            const riverLine = this.height * 0.52;
            if (y > riverLine) {
                this.addDiya(x, y);
                window.chhathAudio.playBell(1100 + Math.random() * 200);
            }
        });
    }

    setPhase(phase) {
        this.phase = phase;
    }

    initDefaultDiyas() {
        // Spawn a few initial floating diyas on the river
        for (let i = 0; i < 7; i++) {
            this.addDiya(
                this.width * 0.15 + Math.random() * (this.width * 0.7),
                this.height * (0.62 + Math.random() * 0.32),
                false
            );
        }
    }

    addDiya(x, y, withSplash = true) {
        this.diyas.push({
            x: x,
            y: y,
            baseY: y,
            vx: 0.15 + Math.random() * 0.25, // Gentle drift rightward
            size: 14 + (y / this.height) * 16, // Perspective scaling
            flicker: Math.random() * 10,
            seed: Math.random() * 100
        });

        if (withSplash) {
            this.arghyaRipples.push({
                x: x,
                y: y,
                radius: 4,
                maxRadius: 40,
                alpha: 0.8
            });
        }
    }

    triggerArghya() {
        this.arghyaActive = true;
        this.arghyaProgress = 0;
        this.triggerFlowerRain(45);
        window.chhathAudio.playArghyaSplash();
        window.chhathAudio.playShankh();

        // Ring temple bell after short delay
        setTimeout(() => {
            window.chhathAudio.playBell();
        }, 800);
    }

    triggerFlowerRain(count = 35) {
        for (let i = 0; i < count; i++) {
            this.petals.push({
                x: Math.random() * this.width,
                y: -20 - Math.random() * 200,
                vx: -0.8 + Math.random() * 1.6,
                vy: 1.2 + Math.random() * 2.2,
                rot: Math.random() * Math.PI * 2,
                vrot: -0.05 + Math.random() * 0.1,
                size: 9 + Math.random() * 10,
                isRose: Math.random() > 0.45 // Marigold or Rose
            });
        }
    }

    render() {
        this.time += 0.02;
        const w = this.width;
        const h = this.height;

        this.ctx.clearRect(0, 0, w, h);

        // 1. Draw Sky & Sun
        this.drawSky(w, h);
        this.drawSunAndRays(w, h);

        // 2. Draw Distant Shore / Horizon
        this.drawDistantBank(w, h);

        // 3. Draw Sacred River with Waves & Light Reflections
        this.drawRiver(w, h);

        // 4. Draw Ghat Architecture (Steps & Sugarcane Mandap)
        this.drawGhatSteps(w, h);
        this.drawSugarcaneCanopy(w, h);

        // 5. Draw Devotee with Soop
        this.drawDevotee(w, h);

        // 6. Draw Arghya Stream (if active)
        if (this.arghyaActive) {
            this.drawArghyaStream(w, h);
        }

        // 7. Draw Floating Diyas
        this.drawDiyas(w, h);

        // 8. Draw Flower Petals
        this.drawPetals(w, h);

        // 9. Draw Atmospheric Golden Glow Vignette
        this.drawDivineAura(w, h);

        requestAnimationFrame(() => this.render());
    }

    /* -------------------------------------------------------------
       SKY & CELESTIAL ELEMENTS
       ------------------------------------------------------------- */
    drawSky(w, h) {
        const horizon = h * 0.52;
        const skyGrad = this.ctx.createLinearGradient(0, 0, 0, horizon);

        if (this.phase === 'sunset') {
            // Sandhya Arghya: Crimson, deep orange, golden twilight
            skyGrad.addColorStop(0, '#1a0505');
            skyGrad.addColorStop(0.25, '#4a100a');
            skyGrad.addColorStop(0.55, '#c62828');
            skyGrad.addColorStop(0.82, '#ef6c00');
            skyGrad.addColorStop(1, '#ffb74d');
        } else if (this.phase === 'sunrise') {
            // Usha Arghya: Dawn purple-pink to brilliant amber gold
            skyGrad.addColorStop(0, '#0d1b2a');
            skyGrad.addColorStop(0.3, '#2a0845');
            skyGrad.addColorStop(0.65, '#e55d87');
            skyGrad.addColorStop(0.85, '#ff9900');
            skyGrad.addColorStop(1, '#ffe082');
        } else {
            // Ghat Jagran / Night: Deep starry indigo
            skyGrad.addColorStop(0, '#020612');
            skyGrad.addColorStop(0.6, '#0b1329');
            skyGrad.addColorStop(1, '#1b2845');
        }

        this.ctx.fillStyle = skyGrad;
        this.ctx.fillRect(0, 0, w, horizon);

        // If Night, draw stars
        if (this.phase === 'night') {
            this.ctx.fillStyle = '#ffffff';
            for (let i = 0; i < 40; i++) {
                const sx = (Math.sin(i * 123.45 + this.time * 0.05) * 0.5 + 0.5) * w;
                const sy = (Math.cos(i * 678.9) * 0.5 + 0.5) * (horizon * 0.8);
                const sRadius = 0.8 + (Math.sin(this.time * 2 + i) * 0.5 + 0.5) * 1.4;
                this.ctx.beginPath();
                this.ctx.arc(sx, sy, sRadius, 0, Math.PI * 2);
                this.ctx.fill();
            }
        }
    }

    drawSunAndRays(w, h) {
        const horizon = h * 0.52;
        let sunX = w * 0.5;
        let sunY = horizon - 28;
        let sunRadius = 46;

        if (this.phase === 'sunset') {
            sunY = horizon - 32;
        } else if (this.phase === 'sunrise') {
            sunY = horizon - 44;
            sunRadius = 52;
        } else {
            // Night Moon
            sunX = w * 0.72;
            sunY = h * 0.18;
            sunRadius = 24;
            this.drawMoon(sunX, sunY, sunRadius);
            return;
        }

        this.sunPos = { x: sunX, y: sunY };

        // Divine Radiant Sun Rays
        const numRays = 24;
        const rayLen = Math.max(w, h) * 0.65;
        this.ctx.save();
        this.ctx.translate(sunX, sunY);

        for (let i = 0; i < numRays; i++) {
            const angle = (i * Math.PI * 2) / numRays + this.time * 0.04;
            const rayAlpha = 0.04 + Math.sin(this.time * 1.5 + i) * 0.025;

            this.ctx.beginPath();
            this.ctx.moveTo(0, 0);
            this.ctx.arc(0, 0, rayLen, angle - 0.06, angle + 0.06);
            this.ctx.closePath();

            const rayGrad = this.ctx.createRadialGradient(0, 0, 10, 0, 0, rayLen);
            rayGrad.addColorStop(0, `rgba(255, 235, 59, ${rayAlpha * 2})`);
            rayGrad.addColorStop(0.5, `rgba(255, 152, 0, ${rayAlpha})`);
            rayGrad.addColorStop(1, 'rgba(255, 87, 34, 0)');

            this.ctx.fillStyle = rayGrad;
            this.ctx.fill();
        }
        this.ctx.restore();

        // Sun Halo Glow
        const glowRadius = sunRadius * 4.2;
        const glowGrad = this.ctx.createRadialGradient(sunX, sunY, sunRadius * 0.4, sunX, sunY, glowRadius);
        glowGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
        glowGrad.addColorStop(0.2, 'rgba(255, 215, 0, 0.8)');
        glowGrad.addColorStop(0.5, 'rgba(255, 111, 0, 0.4)');
        glowGrad.addColorStop(1, 'rgba(255, 87, 34, 0)');

        this.ctx.fillStyle = glowGrad;
        this.ctx.beginPath();
        this.ctx.arc(sunX, sunY, glowRadius, 0, Math.PI * 2);
        this.ctx.fill();

        // Sun Solid Disc
        this.ctx.beginPath();
        this.ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
        this.ctx.fillStyle = this.phase === 'sunset' ? '#FFE082' : '#FFFFFF';
        this.ctx.shadowColor = '#FF6F00';
        this.ctx.shadowBlur = 40;
        this.ctx.fill();
        this.ctx.shadowBlur = 0;
    }

    drawMoon(x, y, r) {
        const moonGlow = this.ctx.createRadialGradient(x, y, r * 0.5, x, y, r * 3);
        moonGlow.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
        moonGlow.addColorStop(0.4, 'rgba(187, 222, 251, 0.25)');
        moonGlow.addColorStop(1, 'rgba(13, 71, 161, 0)');

        this.ctx.fillStyle = moonGlow;
        this.ctx.beginPath();
        this.ctx.arc(x, y, r * 3, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.fillStyle = '#FFFDE7';
        this.ctx.beginPath();
        this.ctx.arc(x, y, r, 0, Math.PI * 2);
        this.ctx.fill();
    }

    drawDistantBank(w, h) {
        const horizon = h * 0.52;
        this.ctx.fillStyle = this.phase === 'night' ? '#09101c' : '#23120b';
        this.ctx.beginPath();
        this.ctx.moveTo(0, horizon);

        // Gentle undulations of distant riverbank and temple spires
        for (let x = 0; x <= w; x += 30) {
            const elev = Math.sin(x * 0.005) * 6 + Math.cos(x * 0.02) * 4;
            this.ctx.lineTo(x, horizon - 8 + elev);
        }

        this.ctx.lineTo(w, horizon);
        this.ctx.closePath();
        this.ctx.fill();
    }

    /* -------------------------------------------------------------
       SACRED RIVER & WAVE SIMULATION
       ------------------------------------------------------------- */
    drawRiver(w, h) {
        const horizon = h * 0.52;
        const riverGrad = this.ctx.createLinearGradient(0, horizon, 0, h);

        if (this.phase === 'sunset') {
            riverGrad.addColorStop(0, '#50170a');
            riverGrad.addColorStop(0.3, '#321010');
            riverGrad.addColorStop(0.7, '#180a0a');
            riverGrad.addColorStop(1, '#0c0505');
        } else if (this.phase === 'sunrise') {
            riverGrad.addColorStop(0, '#3e172e');
            riverGrad.addColorStop(0.25, '#2b1030');
            riverGrad.addColorStop(0.65, '#12122b');
            riverGrad.addColorStop(1, '#050716');
        } else {
            riverGrad.addColorStop(0, '#0a1628');
            riverGrad.addColorStop(0.5, '#040b17');
            riverGrad.addColorStop(1, '#02050d');
        }

        this.ctx.fillStyle = riverGrad;
        this.ctx.fillRect(0, horizon, w, h - horizon);

        // Shimmering Golden Sun/Moon Glint Path on the water
        const sunX = this.sunPos ? this.sunPos.x : w * 0.5;
        const glintGrad = this.ctx.createLinearGradient(sunX, horizon, sunX, h);
        if (this.phase === 'sunset') {
            glintGrad.addColorStop(0, 'rgba(255, 179, 0, 0.7)');
            glintGrad.addColorStop(0.4, 'rgba(255, 111, 0, 0.45)');
            glintGrad.addColorStop(1, 'rgba(216, 67, 21, 0.1)');
        } else if (this.phase === 'sunrise') {
            glintGrad.addColorStop(0, 'rgba(255, 235, 59, 0.8)');
            glintGrad.addColorStop(0.35, 'rgba(255, 160, 0, 0.5)');
            glintGrad.addColorStop(1, 'rgba(255, 111, 0, 0.15)');
        } else {
            glintGrad.addColorStop(0, 'rgba(200, 230, 255, 0.45)');
            glintGrad.addColorStop(0.5, 'rgba(144, 202, 249, 0.2)');
            glintGrad.addColorStop(1, 'rgba(13, 71, 161, 0)');
        }

        // Realistic animated water wave ripples
        const waveLayers = 14;
        for (let i = 0; i < waveLayers; i++) {
            const progress = i / waveLayers;
            const y = horizon + progress * (h - horizon);
            const waveHeight = 2.5 + progress * 7;
            const speed = (1 + progress * 0.8) * 1.4;

            this.ctx.beginPath();
            this.ctx.moveTo(0, y);

            for (let x = 0; x <= w; x += 15) {
                const waveY = y + Math.sin(x * 0.015 + this.time * speed + i) * waveHeight;
                this.ctx.lineTo(x, waveY);
            }

            // Highlighting the sun glint across wave peaks
            const glintWidth = 140 + progress * 380;
            const isNearSun = (x) => Math.abs(x - sunX) < glintWidth;

            this.ctx.strokeStyle = (this.phase === 'night') 
                ? `rgba(187, 222, 251, ${0.08 + progress * 0.08})`
                : `rgba(255, 213, 79, ${0.12 + progress * 0.16})`;
            this.ctx.lineWidth = 1 + progress * 1.5;
            this.ctx.stroke();
        }

        // Broad glint wash
        this.ctx.fillStyle = glintGrad;
        this.ctx.beginPath();
        this.ctx.moveTo(sunX - 35, horizon);
        this.ctx.lineTo(sunX + 35, horizon);
        this.ctx.lineTo(sunX + 220, h);
        this.ctx.lineTo(sunX - 220, h);
        this.ctx.closePath();
        this.ctx.fill();
    }

    /* -------------------------------------------------------------
       GHAT STEPS & SACRED OFFERINGS
       ------------------------------------------------------------- */
    drawGhatSteps(w, h) {
        // Ancient stone steps on left and right foreground
        const drawStepSide = (isLeft) => {
            const startX = isLeft ? 0 : w;
            const sign = isLeft ? 1 : -1;
            const stepCount = 5;

            for (let s = 0; s < stepCount; s++) {
                const stepY = h * 0.72 + s * (h * 0.06);
                const stepWidth = (180 + s * 45);

                this.ctx.fillStyle = (this.phase === 'night') ? '#141824' : '#2d1b13';
                this.ctx.fillRect(isLeft ? 0 : w - stepWidth, stepY, stepWidth, h - stepY);

                // Step Top Edge Highlight
                this.ctx.fillStyle = (this.phase === 'night') ? '#263238' : '#4e2d20';
                this.ctx.fillRect(isLeft ? 0 : w - stepWidth, stepY, stepWidth, 4);

                // Traditional Aripan/Alpana floor pattern markings
                if (s === 2 || s === 3) {
                    this.ctx.fillStyle = 'rgba(255, 235, 238, 0.35)';
                    this.ctx.font = '14px sans-serif';
                    const markX = isLeft ? 35 + s * 15 : w - 90 - s * 15;
                    this.ctx.fillText('卐', markX, stepY + 18);
                }
            }
        };

        drawStepSide(true);
        drawStepSide(false);
    }

    drawSugarcaneCanopy(w, h) {
        // Authentic Sugarcane (ईख) Arch / Canopy tied at the top
        const drawCanopy = (baseX, isFlipped) => {
            const baseY = h * 0.92;
            const archTopX = baseX + (isFlipped ? -85 : 85);
            const archTopY = h * 0.38;

            this.ctx.save();
            this.ctx.strokeStyle = '#33691E'; // Rich sugarcane green
            this.ctx.lineWidth = 9;
            this.ctx.lineCap = 'round';

            // Main cane stems (set of 3 tall canes)
            for (let c = -1; c <= 1; c++) {
                const cX = baseX + c * 14;
                this.ctx.beginPath();
                this.ctx.moveTo(cX, baseY);
                this.ctx.quadraticCurveTo(
                    cX + (isFlipped ? -35 : 35),
                    h * 0.65,
                    archTopX,
                    archTopY
                );
                this.ctx.stroke();

                // Cane Segment Nodes (पोर)
                this.ctx.strokeStyle = '#7CB342';
                this.ctx.lineWidth = 10;
                for (let n = 0.2; n < 0.9; n += 0.15) {
                    const ny = baseY - n * (baseY - archTopY);
                    this.ctx.strokeRect(cX + (isFlipped ? -15 : 15) * n, ny, 3, 2);
                }
                this.ctx.strokeStyle = '#33691E';
                this.ctx.lineWidth = 9;
            }

            // Lush Cane Leaves at the top
            this.ctx.fillStyle = '#558B2F';
            for (let l = 0; l < 6; l++) {
                const leafAngle = (l * Math.PI) / 3 - 0.4;
                this.ctx.beginPath();
                this.ctx.ellipse(
                    archTopX + Math.cos(leafAngle) * 35,
                    archTopY + Math.sin(leafAngle) * 20,
                    40,
                    9,
                    leafAngle,
                    0,
                    Math.PI * 2
                );
                this.ctx.fill();
            }

            // Sacred red/yellow cloth tied around the junction (मौली / कलावा)
            this.ctx.fillStyle = '#D50000';
            this.ctx.fillRect(archTopX - 10, archTopY - 6, 20, 12);
            this.ctx.fillStyle = '#FFD600';
            this.ctx.fillRect(archTopX - 8, archTopY - 2, 16, 4);

            this.ctx.restore();
        };

        drawCanopy(w * 0.12, false);
        drawCanopy(w * 0.88, true);
    }

    /* -------------------------------------------------------------
       DEVOTEE (व्रती) OFFERING ARGHYA
       ------------------------------------------------------------- */
    drawDevotee(w, h) {
        // Devotee standing waist-deep in the center-right of the river
        const vratiX = w * 0.5;
        const vratiY = h * 0.76;
        const scale = 1.1;

        this.ctx.save();
        this.ctx.translate(vratiX, vratiY);

        // Water reflection/ripples around the standing devotee
        this.ctx.strokeStyle = 'rgba(255, 213, 79, 0.4)';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.ellipse(0, 0, 32 * scale, 8 * scale, 0, 0, Math.PI * 2);
        this.ctx.stroke();

        // Traditional Saree / Dhoti (Sacred Saffron/Red)
        this.ctx.fillStyle = (this.phase === 'night') ? '#5d1c15' : '#B71C1C';
        this.ctx.beginPath();
        this.ctx.moveTo(-18 * scale, 0);
        this.ctx.lineTo(-12 * scale, -45 * scale);
        this.ctx.lineTo(12 * scale, -45 * scale);
        this.ctx.lineTo(18 * scale, 0);
        this.ctx.closePath();
        this.ctx.fill();

        // Upper body / Pallu (Yellow/Gold Chhatri)
        this.ctx.fillStyle = '#FF8F00';
        this.ctx.beginPath();
        this.ctx.moveTo(-14 * scale, -45 * scale);
        this.ctx.lineTo(0, -65 * scale);
        this.ctx.lineTo(14 * scale, -45 * scale);
        this.ctx.fill();

        // Head with sacred Sindoor (नाक से मांग तक लंबा सिंदूर)
        this.ctx.fillStyle = '#4E342E';
        this.ctx.beginPath();
        this.ctx.arc(0, -70 * scale, 10 * scale, 0, Math.PI * 2);
        this.ctx.fill();

        // Traditional Long Orange/Red Vermilion (सिंदूर)
        this.ctx.strokeStyle = '#FF3D00';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.moveTo(0, -76 * scale);
        this.ctx.lineTo(0, -63 * scale);
        this.ctx.stroke();

        // Extended Arms holding the Sacred Soop (सूप)
        this.ctx.strokeStyle = '#FFB300';
        this.ctx.lineWidth = 4 * scale;
        this.ctx.beginPath();
        this.ctx.moveTo(-10 * scale, -52 * scale);
        this.ctx.lineTo(-4 * scale, -75 * scale);
        this.ctx.lineTo(0, -78 * scale);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.moveTo(10 * scale, -52 * scale);
        this.ctx.lineTo(4 * scale, -75 * scale);
        this.ctx.lineTo(0, -78 * scale);
        this.ctx.stroke();

        // Golden Bamboo Soop (सूप)
        const soopY = -80 * scale;
        this.ctx.fillStyle = '#FFE082';
        this.ctx.beginPath();
        this.ctx.ellipse(0, soopY, 22 * scale, 9 * scale, 0, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.strokeStyle = '#E65100';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        // Offerings in the soop: Thekua, banana, coconut
        this.ctx.fillStyle = '#5D4037'; // Coconut
        this.ctx.beginPath();
        this.ctx.arc(-8 * scale, soopY - 3, 5 * scale, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.fillStyle = '#FFD54F'; // Thekua
        this.ctx.beginPath();
        this.ctx.ellipse(7 * scale, soopY - 2, 5 * scale, 3 * scale, 0.4, 0, Math.PI * 2);
        this.ctx.fill();

        // Glowing Diya resting in the center of the Soop
        this.ctx.fillStyle = '#D84315';
        this.ctx.beginPath();
        this.ctx.arc(0, soopY - 2, 4 * scale, 0, Math.PI);
        this.ctx.fill();

        // Diya Flame
        const flameHeight = 10 + Math.sin(this.time * 6) * 3;
        this.ctx.fillStyle = '#FFEE58';
        this.ctx.beginPath();
        this.ctx.moveTo(-3 * scale, soopY - 3);
        this.ctx.quadraticCurveTo(0, soopY - flameHeight * scale, 3 * scale, soopY - 3);
        this.ctx.fill();

        // Diya Glow Halo
        this.ctx.fillStyle = 'rgba(255, 179, 0, 0.45)';
        this.ctx.beginPath();
        this.ctx.arc(0, soopY - 8, 18 * scale, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.restore();

        // Store devotee hands origin for the Arghya stream
        this.arghyaOrigin = {
            x: vratiX,
            y: vratiY - 80 * scale
        };
    }

    /* -------------------------------------------------------------
       ARGHYA OFFERING STREAM (दूध व गंगाजल की धार)
       ------------------------------------------------------------- */
    drawArghyaStream(w, h) {
        if (!this.arghyaOrigin) return;

        this.arghyaProgress += 0.008;
        if (this.arghyaProgress > 1.0) {
            this.arghyaActive = false;
            return;
        }

        const startX = this.arghyaOrigin.x;
        const startY = this.arghyaOrigin.y;
        const targetX = startX + 35;
        const targetY = h * 0.77;

        this.ctx.save();

        // Arching divine stream of milk and gangajal
        const midX = startX + 25;
        const midY = startY - 25;

        // Multiple glowing stream layers
        this.ctx.beginPath();
        this.ctx.moveTo(startX, startY);
        this.ctx.quadraticCurveTo(midX, midY, targetX, targetY);

        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)'; // Holy milk stream
        this.ctx.lineWidth = 6;
        this.ctx.lineCap = 'round';
        this.ctx.stroke();

        this.ctx.strokeStyle = 'rgba(255, 235, 59, 0.6)'; // Golden holy water reflection
        this.ctx.lineWidth = 12;
        this.ctx.stroke();

        // Concentric Splash Ripples where stream meets river
        if (Math.random() > 0.4) {
            this.arghyaRipples.push({
                x: targetX,
                y: targetY,
                radius: 2,
                maxRadius: 35 + Math.random() * 20,
                alpha: 0.9
            });
        }

        // Draw and update splash ripples
        for (let i = this.arghyaRipples.length - 1; i >= 0; i--) {
            const rip = this.arghyaRipples[i];
            rip.radius += 0.8;
            rip.alpha -= 0.02;

            if (rip.alpha <= 0 || rip.radius >= rip.maxRadius) {
                this.arghyaRipples.splice(i, 1);
            } else {
                this.ctx.strokeStyle = `rgba(255, 235, 59, ${rip.alpha})`;
                this.ctx.lineWidth = 2;
                this.ctx.beginPath();
                this.ctx.ellipse(rip.x, rip.y, rip.radius, rip.radius * 0.35, 0, 0, Math.PI * 2);
                this.ctx.stroke();
            }
        }

        this.ctx.restore();
    }

    /* -------------------------------------------------------------
       FLOATING DIYAS (नदी में तैरते पावन दीप)
       ------------------------------------------------------------- */
    drawDiyas(w, h) {
        for (let i = 0; i < this.diyas.length; i++) {
            const d = this.diyas[i];

            // Gentle wave bobbing physics
            d.x += d.vx;
            d.y = d.baseY + Math.sin(this.time * 2 + d.seed) * 4;

            // Wrap around screen
            if (d.x > w + 40) {
                d.x = -30;
                d.baseY = h * (0.58 + Math.random() * 0.36);
            }

            const scale = d.size / 24;

            this.ctx.save();
            this.ctx.translate(d.x, d.y);

            // Water Ripple around Diya
            this.ctx.strokeStyle = 'rgba(255, 179, 0, 0.25)';
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            this.ctx.ellipse(0, 0, 18 * scale, 5 * scale, 0, 0, Math.PI * 2);
            this.ctx.stroke();

            // Broad Sacred Green Leaf Base (दौना / पत्ता)
            this.ctx.fillStyle = '#2E7D32';
            this.ctx.beginPath();
            this.ctx.ellipse(0, 1 * scale, 14 * scale, 6 * scale, 0, 0, Math.PI * 2);
            this.ctx.fill();

            // Terracotta Diya (मिट्टी का दीपक)
            this.ctx.fillStyle = '#BF360C';
            this.ctx.beginPath();
            this.ctx.ellipse(0, -1 * scale, 9 * scale, 4 * scale, 0, 0, Math.PI * 2);
            this.ctx.fill();

            // Flickering Flame
            const flicker = Math.sin(this.time * 8 + d.flicker) * 2;
            const flameH = (12 + flicker) * scale;

            // Flame Halo / Ambient Glow on water
            const glow = this.ctx.createRadialGradient(0, -3, 2, 0, -3, 30 * scale);
            glow.addColorStop(0, 'rgba(255, 235, 59, 0.7)');
            glow.addColorStop(0.35, 'rgba(255, 111, 0, 0.35)');
            glow.addColorStop(1, 'rgba(255, 87, 34, 0)');

            this.ctx.fillStyle = glow;
            this.ctx.beginPath();
            this.ctx.arc(0, -3, 30 * scale, 0, Math.PI * 2);
            this.ctx.fill();

            // Inner Core Flame
            this.ctx.fillStyle = '#FFF59D';
            this.ctx.beginPath();
            this.ctx.moveTo(-3 * scale, -2 * scale);
            this.ctx.quadraticCurveTo(0, -flameH, 3 * scale, -2 * scale);
            this.ctx.fill();

            // Flame Reflection on Water Surface
            this.ctx.fillStyle = 'rgba(255, 160, 0, 0.3)';
            this.ctx.beginPath();
            this.ctx.ellipse(0, 6 * scale, 4 * scale, 6 * scale, 0, 0, Math.PI * 2);
            this.ctx.fill();

            this.ctx.restore();
        }
    }

    /* -------------------------------------------------------------
       FLOWER PETAL RAIN (पुष्प वर्षा)
       ------------------------------------------------------------- */
    drawPetals(w, h) {
        for (let i = this.petals.length - 1; i >= 0; i--) {
            const p = this.petals[i];
            p.x += p.vx + Math.sin(this.time + p.y * 0.01) * 0.6;
            p.y += p.vy;
            p.rot += p.vrot;

            if (p.y > h + 30) {
                this.petals.splice(i, 1);
                continue;
            }

            this.ctx.save();
            this.ctx.translate(p.x, p.y);
            this.ctx.rotate(p.rot);

            // Shape of petal
            this.ctx.fillStyle = p.isRose ? '#E91E63' : '#FFA000'; // Rose or Marigold
            this.ctx.beginPath();
            this.ctx.ellipse(0, 0, p.size, p.size * 0.55, 0, 0, Math.PI * 2);
            this.ctx.fill();

            // Shading
            this.ctx.fillStyle = p.isRose ? '#880E4F' : '#FF6F00';
            this.ctx.beginPath();
            this.ctx.ellipse(-p.size * 0.2, 0, p.size * 0.4, p.size * 0.3, 0, 0, Math.PI * 2);
            this.ctx.fill();

            this.ctx.restore();
        }
    }

    /* -------------------------------------------------------------
       DIVINE VIGNETTE / AURA
       ------------------------------------------------------------- */
    drawDivineAura(w, h) {
        const vignette = this.ctx.createRadialGradient(w * 0.5, h * 0.5, h * 0.4, w * 0.5, h * 0.5, w * 0.8);
        vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
        vignette.addColorStop(1, 'rgba(6, 4, 2, 0.5)');

        this.ctx.fillStyle = vignette;
        this.ctx.fillRect(0, 0, w, h);
    }
}

// Global scene instance helper
window.GhatScene = GhatScene;
