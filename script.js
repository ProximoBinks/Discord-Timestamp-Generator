const dateInput = document.getElementById('d');
const timeInput = document.getElementById('hm');
const typeInput = document.getElementById('t');
const output = document.getElementById('code');
const copy = document.getElementById('copy');
const current = document.getElementById('current');
const preview = document.getElementById('preview');

document.getElementById("currentYear").textContent = new Date().getFullYear();

copy.addEventListener('mousedown', function () {
    this.classList.add('button-clicked');
});
copy.addEventListener('mouseup', function () {
    this.classList.remove('button-clicked');
});

current.addEventListener('mousedown', function () {
    this.classList.add('button-clicked');
});
current.addEventListener('mouseup', function () {
    this.classList.remove('button-clicked');
});

dateInput.onchange = updateOutput;
timeInput.onchange = updateOutput;
typeInput.onchange = updateOutput;
output.onclick = function () { this.select(); }
copy.onclick = async () => {
    updateOutput();
    try {
        await navigator.clipboard.writeText(output.value);
        // Optional: Add a visual indication that copying worked
        const originalText = copy.textContent;
        copy.textContent = "Copied!";
        setTimeout(() => {
            copy.textContent = originalText;
        }, 1500);
    } catch (e) {
        console.error("Could not copy text: ", e);
        alert("Failed to copy text");
    }
};

let intervalId;

const onload = _ => {
    // Use setTimeout to push the UI update to the end of the JS execution queue
    setTimeout(() => {
        clearInterval(intervalId); // Clear existing interval if any

        const now = new Date();
        dateInput.value = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
        timeInput.value = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

        updateOutput(); // Update the preview

        // Update relative time every second if the type is 'R'
        if (typeInput.value === 'R') {
            intervalId = setInterval(updateOutput, 1000);
        }
    }, 0);
};

window.onload = onload;
current.onclick = onload;

if (typeInput.value === 'R') {
    intervalId = setInterval(updateOutput, 1000);
}

typeInput.onchange = function () {
    clearInterval(intervalId); // Clear existing interval
    updateOutput(); // Update once immediately

    // If new type is 'R', start a new interval
    if (typeInput.value === 'R') {
        intervalId = setInterval(updateOutput, 1000);
    }
};

const typeFormats = {
    't': { timeStyle: 'short' },
    'T': { timeStyle: 'medium' },
    'd': { dateStyle: 'short' },
    'D': { dateStyle: 'long' },
    'f': { dateStyle: 'long', timeStyle: 'short' },
    'F': { dateStyle: 'full', timeStyle: 'short' },
    'R': { style: 'long', numeric: 'auto' },
};

function updateOutput() {
    const selectedDate = new Date(dateInput.value + "T" + timeInput.value);
    const unixTimestamp = Math.floor(selectedDate.getTime() / 1000);
    output.value = `<t:${unixTimestamp}:${typeInput.value}>`;

    // Format the preview
    if (typeInput.value === 'R') {
        const now = new Date();
        const differenceInSeconds = Math.floor((selectedDate - now) / 1000);
        const formatter = new Intl.RelativeTimeFormat(navigator.language || 'en', { numeric: 'auto' });

        let unit = 'second';
        let value = differenceInSeconds;

        const conversions = [
            { unit: 'year', seconds: 60 * 60 * 24 * 365 },
            { unit: 'month', seconds: 60 * 60 * 24 * 30 },
            { unit: 'week', seconds: 60 * 60 * 24 * 7 },
            { unit: 'day', seconds: 60 * 60 * 24 },
            { unit: 'hour', seconds: 60 * 60 },
            { unit: 'minute', seconds: 60 }
        ];

        for (const conversion of conversions) {
            if (Math.abs(differenceInSeconds) >= conversion.seconds) {
                value = Math.round(differenceInSeconds / conversion.seconds);
                unit = conversion.unit;
                break;
            }
        }

        preview.textContent = formatter.format(value, unit);
    } else {
        const formatter = new Intl.DateTimeFormat(navigator.language || 'en', typeFormats[typeInput.value] || {});
        preview.textContent = formatter.format(selectedDate);
    }
}

// Theme switcher
const themeSwitcher = document.getElementById('theme-switcher');

themeSwitcher.addEventListener('change', function() {
    document.body.setAttribute('data-theme', this.value);
});

// Set default theme (already set in HTML with data-theme="hypertools")