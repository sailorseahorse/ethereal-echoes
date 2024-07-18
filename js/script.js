// Wait for the DOM to be fully loaded before running our script
document.addEventListener('DOMContentLoaded', () => {


    // Sound Canvas Interaction
    // This section handles the visual feedback when users interact with the main canvas
    const soundCanvas = document.getElementById('sound-canvas');
    soundCanvas.addEventListener('click', (e) => {
        const rect = soundCanvas.getBoundingClientRect();

        // Outputs rectangle dimension relative to the viewport
        // Accounts for any margins or positioning of parent elements
        console.log('Canvas rectangle:', rect);

        // Create a visual dot where the user clicks
        // This will later be tied to sound generation
        const dot = document.createElement('div');
        dot.className = 'sound-dot';
        
        // Position the dot relative to the canvas
        const left = e.clientX - rect.left - 2;
        const top = e.clientY - rect.top - 2;

        // Position of click event relative to the viewport
        // Calculated position is the difference between click coordinates and the canvas's top-left corner
        console.log('Click event:', e.clientX, e.clientY);
        console.log('Canvas offset:', soundCanvas.offsetLeft, soundCanvas.offsetTop);
        console.log('Calculated position:', left, top);

        dot.style.left = `${left}px`;
        dot.style.top = `${top}px`;

        soundCanvas.appendChild(dot);
    });
    

    // Symbol Library Interaction
    // This section manages the selection of symbols, which will later influence the sound
    const symbols = document.querySelectorAll('.symbol');

    symbols.forEach(symbol => {
        symbol.addEventListener('click', () => {
            // Deactivate all symbols
            symbols.forEach(s => s.classList.remove('active'));
            symbol.classList.add('active');
            // Later, this will trigger changes in the sound or visuals
        });
    });


    // Sound Controls
    // This section handles the sound parameter adjustments
    // 2024-07-17 Update Sound Controls event listener
    const soundControls = document.querySelectorAll('#sound-controls input');
    soundControls.forEach(control => {
        control.addEventListener('input', () => {
            const value = parseInt(control.value);
            const controlName = control.id;
            console.log(`${controlName}: ${value}`);
            // Log the changed value (for now)
            // In the future, this will actually modify the sound
            // UPDATE the display of the current value

            // Update the display of the current value
            const displayElement = document.getElementById(`${controlName}-value`);
            if (displayElement) {
                displayElement.textContent = value;
            }

            // Here you would typically call a function to update the sound
            updateSound(controlName, value);
        });
    });

    
    // Placeholder for sound update function
    // 2024-07-17 Update the updateSound function
    function updateSound(controlName, value) {
        if (!audioContext) initAudio();

        switch(controlName) {
            case 'pitch':
                // Map 0-100 to 220-880 Hz (A3 to A5)
                const frequency = 220 * Math.pow(2, value / 50);
                oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
                break;
            case 'volume':
                // Map 0-100 to 0-1 for volume
                gainNode.gain.setValueAtTime(value / 100, audioContext.currentTime);
                break;
            case 'reverb':
                // We'll implement a simple delay for 'reverb'
                // This is a placeholder and not true reverb
                console.log('Reverb not yet implemented');
                break;
        }
    }


    // Interaction for Meditation Mode
    // This section manages the meditation feature
    const startMeditation = document.getElementById('start-meditation');
    const duration = document.getElementById('duration');
    let meditationInterval;

    startMeditation.addEventListener('click', () => {
        if (startMeditation.textContent === 'Start'){
            // Start meditation
            const durationInMinutes = parseInt(duration.value);

            // Log the meditation duration (placeholder action)
            console.log(`Starting meditation for ${durationInMinutes} minutes`);
            // Change button text to indicate active state
            startMeditation.textContent = 'Stop';
            duration.disabled = true;
            // In the future, this will start a timer and trigger the meditation sound

            let remainingTime = durationInMinutes * 60;
            updateRemainingTime(remainingTime);

            meditationInterval = setInterval(() => {
                remainingTime--;
                updateRemainingTime(remainingTime);

                if (remainingTime <= 0) {
                    stopMeditation();
                }
            }, 1000);
            // Adding sound to the start and stop meditation functions
            startMeditationSound();
        }

        // Here you would typically start the meditation sound
        // startMeditationSound();
        else {
            // Stop meditation
            stopMeditation();
        }
    });

    function updateRemainingTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        const timeString = `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
        document.getElementById('remaining-time').textContent = timeString;
    }

    function stopMeditation() {
        clearInterval(meditationInterval);
        startMeditation.textContent = 'Start';
        duration.disabled = false;
        document.getElementById('remaining-time').textContent = '';console.log('Meditation stopped');
        // Here you would typically stop the meditation sound
        stopMeditationSound();
    }

    // Placeholder for meditation sound functions
    // 2024-07-17 Update "Meditation Mode" functions
    function startMeditationSound() {
        if (!audioContext) initAudio();
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime); // Set to a calming volume
        oscillator.frequency.setValueAtTime(256, audioContext.currentTime); // Set to a calming frequency (C4)
        console.log('Starting meditation sound');
    }

    function stopMeditationSound() {
        if (audioContext) {
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        }
        console.log('Stopping meditation sound');
    }


    // This adds interactivity to the start audio button
    document.getElementById('start-audio').addEventListener('click', function() {
        initAudio();
        this.disabled = true;
        this.textContent = 'Audio Started';
    });
    
    
    // Web Audio API setup
    let audioContext;
    let oscillator;
    let gainNode;

    // Function to initialize audio context
    function initAudio() {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        oscillator = audioContext.createOscillator();
        gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.type = 'sine'; // Start with a sine wave
        oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // Start at 440Hz (A4)
        gainNode.gain.setValueAtTime(0.5, audioContext.currentTime); // Set initial volume to 50%

        oscillator.start();
    }
});