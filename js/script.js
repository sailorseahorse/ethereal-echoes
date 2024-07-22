// ********************************************************************************
// John Quiruz, 2024-07-23, For personal practice, Ethereal Echoes
//
// This project aims to create an immersive audio-visual web application that 
// allows users to interact with sound in a unique and intuitive way. The core 
// feature is the Sound Canvas, where users can click or drag to generate and 
// manipulate sounds, creating a dynamic audio landscape. The app includes 
// controls for adjusting pitch and volume, a symbol library for preset sounds, 
// and a meditation mode for relaxation. While not all components are fully 
// implemented, the goal is to combine Web Audio API with visual feedback, 
// offering an ethereal, synesthetic experience. The Sound Canvas will 
// eventually map user interactions to various sound parameters, creating a 
// playground for audio exploration. Future enhancements may include more 
// complex sound synthesis, visual effects, and the ability to save and share 
// audio creations.
// ********************************************************************************


// Wait for the DOM to be fully loaded before running our script
document.addEventListener('DOMContentLoaded', () => {


    // SOUND CANVAS INTERACTION - (Not fully committed to this idea)
    // ****************************************************************************

    // Get reference to the sound canvas element
    const soundCanvas = document.getElementById('sound-canvas');

    // Add click event listener to the sound canvas
    soundCanvas.addEventListener('click', (e) => {
        // Get the bounding rectangle of the canvas
        const rect = soundCanvas.getBoundingClientRect();

        // Log convas dimensions for debugging
        console.log('Canvas rectangle:', rect);

        // Create a new div element to represent the sound dot
        const dot = document.createElement('div');
        // Assign the 'sound-dot' class to the new div
        dot.className = 'sound-dot';
        
        // Calculate the position of the dot relative to the canvas
        // Subtract 2 to account for the border width
        const left = e.clientX - rect.left - 2;
        const top = e.clientY - rect.top - 2;

        // Log click event details for debugging
        console.log('Click event:', e.clientX, e.clientY);
        console.log('Canvas offset:', 
                    soundCanvas.offsetLeft, 
                    soundCanvas.offsetTop);
        console.log('Calculated position:', left, top);

        // Set the position of the dot
        dot.style.left = `${left}px`;
        dot.style.top = `${top}px`;

        // Add the dot to the canvas
        soundCanvas.appendChild(dot);
    });
    


    // SYMBOL LIBRARY INTERACTION
    // ****************************************************************************

    // Get all elements with the 'symbol' class
    const symbols = document.querySelectorAll('.symbol');

    // Add click event listener to each symbol
    symbols.forEach(symbol => {
        symbol.addEventListener('click', () => {
            // Remove 'active' class from all symbols
            symbols.forEach(s => s.classList.remove('active'));
            // Add 'active' class to the clicked symbol
            symbol.classList.add('active');
            // NOte: Future functionality to change sound/visuals will be added
        });
    });



    // SOUND CONTROLS
    // ****************************************************************************

    // Get all input elements within the sound controls section
    const soundControls = document.querySelectorAll('#sound-controls input');

    // Add input event listener to each control
    soundControls.forEach(control => {
        control.addEventListener('input', () => {
            // Get the current value of the control
            const value = parseInt(control.value);
            // Get the ID of the control (e.g., 'pitch', 'volume')
            const controlName = control.id;

            // Update the display of the current value
            const displayElement = document.getElementById(`${controlName}-value`);
            if (displayElement) {
                displayElement.textContent = value;
            }

            // Call function to update the sound based on the control change
            updateSound(controlName, value);
        });
    });
    
    
    
    // AUDIO PLAYBACK CONTROL
    // ****************************************************************************
    
    // Declare variables for audio context and nodes
    let audioContext;
    let oscillator;
    let gainNode;
    
    // Get reference to the audio control button
    const audioButton = document.getElementById('start-audio');
    
    // Flag to track whehter audio is currently playing
    let isAudioPlaying = false;
    
    // Add click event listener to the audio button
    audioButton.addEventListener('click', function() {
        // If audio is not playing, start or resume it
        if (!isAudioPlaying) {
            // If audio is not playing, start or resume it      
            if (!audioContext) {
                // If audio context doesn't exist, initialize it
                initAudio();
            } else {
                // If audio context exists but is suspended, resume it
                resumeAudio();
            }
            // Change button text to reflect that the audio will stop
            this.textContent = 'Stop';
            // Update flag to indicate audio is now playing
            isAudioPlaying = true;
            
        } else {      
            // If audio is playing, stop it
            stopAudio();
            // Change button text to reflect that the audio will start
            this.textContent = 'Start Audio';
            // Update flag to indicate audio is now stopped
            isAudioPlaying = false;
        }
    });
    
    
    
    // FUNCTION DEFINITIONS
    // ****************************************************************************
    
    // Function to initialize audio context
    function initAudio() { 
        // Create new audio context - Built-in Web Audio API
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // if (audioContext) {} ! Don't forget to VALIDATE Web Audio API
        
        // Create oscillator node for generating tones
        oscillator = audioContext.createOscillator();
        
        // Create gain node for volume control
        gainNode = audioContext.createGain();
        
        // Connect oscillator to gain node, and gain node to audio output
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Configure sound composition
        oscillator.type = 'sine'; // Start with sine wave
        // Set initial frequency to 440Hz (A4 piano key)
        oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
        // Set initial volume to 50%
        gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
        
        // Start the oscillator
        oscillator.start();
    }


    // Function to update sound based on control inputs
    function updateSound(controlName, value) {
        // Don't update if audio context doesn't exist
        if (!audioContext) return;

        switch(controlName) {
            case 'pitch':
                // Map 0-100 to 220-880 Hz (A3 to A5)
                const frequency = 220 * Math.pow(2, value / 50);
                oscillator.frequency.setValueAtTime(frequency, 
                                                    audioContext.currentTime);
                break;
            case 'volume':
                // Map 0-100 to 0-1 for volume
                gainNode.gain.setValueAtTime(value / 100, 
                                             audioContext.currentTime);
                break;
            case 'reverb':
                // Placeholder for reverb functionality
                console.log('Reverb not yet implemented');
                break;
        }
    }

    
    // Function to resume audio playback
    function resumeAudio() {
        // Check if audio context is suspended
        if (audioContext && audioContext.state === 'suspended') {
            // If suspended, resume it
            audioContext.resume();
        }
    }
    
    
    // Function to stop audio playback
    function stopAudio() {
        // Check if audio context exists
        if (audioContext) {
            // If it exists, stops the audio
            audioContext.suspend();
        }
    }
    
    
});