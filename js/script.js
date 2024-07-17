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
    const soundControls = document.querySelectorAll('#sound-controls input');
    soundControls.forEach(control => {
        control.addEventListener('input', () => {
            // Log the changed value (for now)
            // In the future, this will actually modify the sound
            console.log(`${control.id}: ${control.value}`);
        });
    });

    // Interaction for Meditation Mode
    // This section manages the meditation feature
    const startMeditation = document.getElementById('start-meditation');
    const duration = document.getElementById('duration');
    startMeditation.addEventListener('click', () => {
        // Log the meditation duration (placeholder action)
        console.log(`Starting meditation for ${duration.value} minutes`);
        // Change button text to indicate active state
        startMeditation.textContent = 'Stop';
        // In the future, this will start a timer and trigger the meditation sound
    });
    
});