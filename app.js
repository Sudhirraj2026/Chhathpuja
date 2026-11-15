/**
 * app.js
 * Main entry point for the Virtual AI Chhath Ghat Application.
 * Integrates visual simulation, audio engine, AI computer vision,
 * and user interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('ghatCanvas');
    const scene = new GhatScene(canvas);
    window.scene = scene;

    // Start 60fps rendering loop
    scene.render();

    // DOM Elements
    const phaseBtns = document.querySelectorAll('.phase-btn');
    const soundToggleBtn = document.getElementById('soundToggleBtn'); // optional — not in current HTML
    const soundIcon = document.getElementById('soundIcon');           // optional — not in current HTML
    const offerArghyaBtn = document.getElementById('offerArghyaBtn');
    const floatDiyaBtn = document.getElementById('floatDiyaBtn');
    const flowerRainBtn = document.getElementById('flowerRainBtn');
    const playShankhBtn = document.getElementById('playShankhBtn');
    const aiCameraBtn = document.getElementById('aiCameraToggleBtn');
    const closePipBtn = document.getElementById('closePipBtn');
    const divineToast = document.getElementById('divineToast');
    const toastMsg = document.getElementById('toastMsg');

    // 1. Phase Selection (Sunset, Sunrise, Night)
    phaseBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            phaseBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const phase = btn.getAttribute('data-phase');
            scene.setPhase(phase);
            document.body.className = `mode-${phase}`;

            if (phase === 'sunset') {
                showToast("🌅 संध्या अर्घ्य: अस्ताचलगामी सूर्य देव को नमन");
            } else if (phase === 'sunrise') {
                showToast("🌄 उषा अर्घ्य: उदयगामी भगवान भुवन भास्कर को प्रणाम");
            } else {
                showToast("✨ रात्रि जागरण व खरना: गंगा तट पर दीपों की आभा");
            }

            window.chhathAudio.playBell(1250);
        });
    });

    // 2. Sound Toggle & Audio Unlock (soundToggleBtn is optional — not in current HTML)
    if (soundToggleBtn) {
        soundToggleBtn.addEventListener('click', () => {
            const isMuted = window.chhathAudio.toggleMute();
            if (soundIcon) soundIcon.innerText = isMuted ? '🔇' : '🔊';

            if (!isMuted) {
                showToast("🎵 पारंपरिक बांसुरी व मंगल धुन शुरू हुई");
            } else {
                showToast("ध्वनि म्यूट की गई");
            }
        });
    }

    // User first-interaction auto-start audio (standard browser autoplay policy)
    const unlockAudio = () => {
        window.chhathAudio.init();
        // Auto-play is intentionally not forced here; user can press Play manually
    };
    window.addEventListener('click', unlockAudio, { once: true });
    window.addEventListener('keydown', unlockAudio, { once: true });

    // 3. Arghya Offering Action
    const performArghya = () => {
        scene.triggerArghya();
        showToast("ॐ सूर्याय नमः! दूध और गंगाजल से पावन अर्घ्य समर्पित।");
    };

    offerArghyaBtn.addEventListener('click', performArghya);

    // Keyboard Shortcut (Spacebar or 'A' key to offer Arghya)
    window.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'SELECT') {
            e.preventDefault();
            performArghya();
        } else if (e.key.toLowerCase() === 'a' && document.activeElement.tagName !== 'INPUT') {
            performArghya();
        }
    });

    // 4. Floating Diya Action
    floatDiyaBtn.addEventListener('click', () => {
        const x = window.innerWidth * (0.2 + Math.random() * 0.6);
        const y = window.innerHeight * (0.65 + Math.random() * 0.28);
        scene.addDiya(x, y);
        window.chhathAudio.playBell(1200 + Math.random() * 200);
        showToast("🪔 नदी में पावन दीप प्रवाहित किया गया");
    });

    // 5. Flower Rain Action
    flowerRainBtn.addEventListener('click', () => {
        scene.triggerFlowerRain(40);
        window.chhathAudio.playBell(1400);
        showToast("🌸 गेंदे और गुलाब के पुष्पों की वर्षा!");
    });

    // 6. Shankhnaad Action
    playShankhBtn.addEventListener('click', () => {
        window.chhathAudio.playShankh();
        showToast("🐚 शंखनाद: ॐ नमो भगवते सूर्याय नमः");
    });

    // 7. AI Camera Gesture Vision
    aiCameraBtn.addEventListener('click', () => {
        window.chhathAIVision.toggle();
    });

    if (closePipBtn) {
        closePipBtn.addEventListener('click', () => {
            window.chhathAIVision.stopCamera();
        });
    }

    // 8. Music Jukebox Controls
    const playPauseBtn   = document.getElementById('playPauseBtn');
    const nextTrackBtn   = document.getElementById('nextTrackBtn');
    const volumeSlider   = document.getElementById('volumeSlider');
    const trackSelect    = document.getElementById('trackSelect');
    const uploadAudioBtn = document.getElementById('uploadAudioBtn');
    const localAudioPicker = document.getElementById('localAudioPicker');

    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', () => {
            window.chhathAudio.togglePlay();
        });
    }

    if (nextTrackBtn) {
        nextTrackBtn.addEventListener('click', () => {
            window.chhathAudio.nextTrack();
        });
    }

    if (volumeSlider) {
        volumeSlider.addEventListener('input', () => {
            window.chhathAudio.setVolume(Number(volumeSlider.value));
        });
    }

    if (trackSelect) {
        trackSelect.addEventListener('change', () => {
            const val = trackSelect.value;
            if (val === 'custom') return; // handled by upload button
            window.chhathAudio.playTrack(Number(val));
        });
    }

    if (uploadAudioBtn && localAudioPicker) {
        uploadAudioBtn.addEventListener('click', () => {
            localAudioPicker.click();
        });
        localAudioPicker.addEventListener('change', () => {
            const file = localAudioPicker.files[0];
            if (file) {
                window.chhathAudio.playCustomFile(file);
            }
        });
    }

    // Helper: Show Divine Toast Banner
    function showToast(message) {
        if (!divineToast || !toastMsg) return;
        toastMsg.innerText = message;
        divineToast.classList.remove('hidden');

        if (window.toastTimeout) {
            clearTimeout(window.toastTimeout);
        }
        window.toastTimeout = setTimeout(() => {
            divineToast.classList.add('hidden');
        }, 4000);
    }
    window.showToast = showToast;

    // Initial greeting after 1 second
    setTimeout(() => {
        showToast("जय छठी मइया! सूर्य उपासना के पावन महापर्व में आपका स्वागत है।");
    }, 1000);
});
