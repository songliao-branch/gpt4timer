// script.js
document.addEventListener('DOMContentLoaded', function() {
    const speakerNameInput = document.getElementById('speakerName');
    const speechDurationSelect = document.getElementById('speechDuration');
    const customTimeInput = document.getElementById('customTime');
    const startStopButton = document.getElementById('startStopButton');
    const timerDisplay = document.getElementById('timerDisplay');
    const historyList = document.getElementById('historyList');
    const clickSound = document.getElementById('clickSound');
    const showTimeButton = document.getElementById('showTimeButton');
    showTimeButton.addEventListener('click', animateBars);

    let timer = null;
    let time = 0;
    let isTiming = false;

    const speechDurations = {
        'short': { green: 5, yellow: 10, red: 15 },
        'iceBreaker': { green: 3 * 60, yellow: 3 * 60 + 30, red: 4 * 60 },
        'regular': { green: 5 * 60, yellow: 6 * 60, red: 7 * 60 },
        'evaluator': { green: 2 * 60, yellow: 2 * 60 + 30, red: 3 * 60 }
        // 'custom' handled separately
    };

    speechDurationSelect.addEventListener('change', function(e) {
        if (e.target.value === 'custom') {
            customTimeInput.style.display = 'block';
        } else {
            customTimeInput.style.display = 'none';
        }
    });

    startStopButton.addEventListener('click', function() {
        if (isTiming) {
            stopTimer();
        } else {
            startTimer();
        }
    });

    function startTimer() {
        const selectedDuration = speechDurationSelect.value;
        const { green, yellow, red } = selectedDuration === 'custom' ? 
            { green: parseInt(customTimeInput.value) * 60 / 3, yellow: parseInt(customTimeInput.value) * 60 * 2 / 3, red: parseInt(customTimeInput.value) * 60 } : 
            speechDurations[selectedDuration];

        isTiming = true;
        time = 0; // Start from 0
        startStopButton.textContent = 'Stop';
        document.body.style.backgroundColor = 'white';

        timer = setInterval(function() {
            time++;
            updateTimerDisplay(time);

            if (time === green || time === yellow || time === red) {
                clickSound.play();
                document.body.style.backgroundColor = time === green ? 'green' : time === yellow ? 'yellow' : 'red';
            }

            updateTimerDisplay(time);
        }, 1000);
    }

    function stopTimer() {
    clearInterval(timer);
    isTiming = false;
    startStopButton.textContent = 'Start';
    document.body.style.backgroundColor = 'white';
    const finalTime = formatTime(time);
    historyList.innerHTML += `<li>${speakerNameInput.value}</li>`;
    renderBarChart(speakerNameInput.value, time);
    time = 0; // Reset time

    // Append a new list item with the speaker's name, duration, and a remove button
    const listItem = document.createElement('li');
    listItem.classList.add('history-item');
    listItem.innerHTML = `
        ${speakerNameInput.value}
        <span class="duration-time"> - ${finalTime}</span>
        <button class="remove-btn">X</button>
    `;

    // Append the list item to the history list
    historyList.appendChild(listItem);

    // // Store a reference to the SVG bar in the listItem for later removal
    // listItem.barSvg = barChartContainer.node().appendChild(renderBarChart(speakerNameInput.value, time));

    // // Add click event listener for the remove button
    // listItem.querySelector('.remove-btn').addEventListener('click', function() {
    //     listItem.remove(); // Remove the list item
    //     listItem.barSvg.remove(); // Remove the corresponding bar
    // });
}

// ... existing JavaScript ...


// function renderBarChart(speakerName, duration) {
//     const barChartContainer = d3.select('#barChartContainer');
    
//     const selectedDuration = speechDurationSelect.value;
//     const thresholds = selectedDuration === 'custom' ?
//         { green: parseInt(customTimeInput.value) * 60 / 3, yellow: parseInt(customTimeInput.value) * 60 * 2 / 3, red: parseInt(customTimeInput.value) * 60 } :
//         speechDurations[selectedDuration];
    
//     let barColor = 'gray';
//     if (duration >= thresholds.green && duration < thresholds.yellow) barColor = 'green';
//     else if (duration >= thresholds.yellow && duration < thresholds.red) barColor = 'yellow';
//     else if (duration >= thresholds.red) barColor = 'red';

//     // Calculate width based on the duration and maximum time (red threshold)
//     const maxWidth = document.getElementById('barChartContainer').offsetWidth;
//     const widthPercentage = (duration / thresholds.red) * 100;

//     // Append a new bar as an SVG rectangle
//     barChartContainer.append('svg')
//         .attr('width', maxWidth)
//         .attr('height', '25px')
//         .append('rect')
//         .attr('height', '20px')
//         .attr('width', 0) // Start with a width of 0
//         .attr('fill', barColor)
//         .attr('stroke', 'black')
//         .transition() // Animate the width of the rect
//         .duration(duration * 10) // Duration is proportional to the speaker's time
//         .attr('width', `${Math.min(widthPercentage, 100)}%`); // Animate to the final width

//     // Add text to the bar
//     d3.select(barChartContainer.node().lastChild)
//         .append('text')
//         .attr('x', 5)
//         .attr('y', 15)
//         .attr('fill', 'black')
//         .text(`${speakerName} (${duration}s)`);
// }

    function updateTimerDisplay(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        timerDisplay.textContent = `${pad(minutes)}:${pad(remainingSeconds)}`;
    }

    function pad(number) {
        return number < 10 ? '0' + number : number;
    }

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}m ${remainingSeconds}s`;
    }

    // Function to store the bar data
const barData = [];

function renderBarChart(speakerName, duration) {
    const selectedDuration = speechDurationSelect.value;
    const thresholds = selectedDuration === 'custom' ?
        { green: parseInt(customTimeInput.value) * 60 / 3, yellow: parseInt(customTimeInput.value) * 60 * 2 / 3, red: parseInt(customTimeInput.value) * 60 } :
        speechDurations[selectedDuration];
    
    let barColor = 'gray';
    if (duration >= thresholds.green && duration < thresholds.yellow) barColor = 'green';
    else if (duration >= thresholds.yellow && duration < thresholds.red) barColor = 'yellow';
    else if (duration >= thresholds.red) barColor = 'red';

    // Store bar data instead of directly rendering the bar
    barData.push({ speakerName, duration, barColor, thresholds });
    return barSvg.node();
}

// Function to animate the bars
function animateBars() {
    const barChartContainer = d3.select('#barChartContainer');
    const maxWidth = document.getElementById('barChartContainer').offsetWidth;

    // Find the maximum duration among the bars
    const maxDuration = Math.max(...barData.map(data => data.duration));

    barData.forEach(data => {
        const widthPercentage = (data.duration / data.thresholds.red) * 100;

        // Calculate animation duration for each bar relative to the maxDuration
        // The longest bar (maxDuration) takes 5 seconds (5000ms) to animate
        const animationDuration = (data.duration / maxDuration) * 5000;

        // Append a new bar as an SVG rectangle
        const barSvg = barChartContainer.append('svg')
            .attr('width', maxWidth)
            .attr('height', '25px');

        const barRect = barSvg.append('rect')
            .attr('height', '20px')
            .attr('width', 0) // Start with a width of 0
            .attr('fill', 'gray') // Start with gray color
            .attr('stroke', 'black');

        // Animate the width and color of the rect
        barRect.transition()
            .duration(animationDuration)
            .attr('width', `${Math.min(widthPercentage, 100)}%`) // Animate to the final width
            .tween('attr.fill', function() {
                const node = d3.select(this); // 'this' refers to the barRect
                return function(t) {
                    // Calculate the intermediate duration based on current time 't'
                    const intermediateDuration = t * data.duration;
                    // Determine the color based on the intermediate duration
                    let color = 'gray';
                    if (intermediateDuration >= data.thresholds.green && intermediateDuration < data.thresholds.yellow) color = 'green';
                    else if (intermediateDuration >= data.thresholds.yellow && intermediateDuration < data.thresholds.red) color = 'yellow';
                    else if (intermediateDuration >= data.thresholds.red) color = 'red';
                    // Apply the color
                    node.attr('fill', color);
                };
            });

        // Add text to the bar
        barSvg.append('text')
            .attr('x', 5)
            .attr('y', 15)
            .attr('fill', 'black')
            .text(`${data.speakerName} (${data.duration}s)`);
    });

    // Clear barData after animation
    barData.length = 0;
}


});
