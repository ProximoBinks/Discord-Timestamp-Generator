const dateInput = document.getElementById('d');
const timeInput = document.getElementById('hm');
const typeInput = document.getElementById('t');
const output = document.getElementById('code');
const copy = document.getElementById('copy');
const current = document.getElementById('current');
const preview = document.getElementById('preview');

dateInput.onchange = updateOutput;
timeInput.onchange = updateOutput;
typeInput.onchange = updateOutput;
output.onmouseover = function () { this.select(); }
copy.onclick = async () => {
    updateOutput();
    try {
        await navigator.clipboard.writeText(output.value);
        alert("Successfully copied");
    } catch (e) {
        console.error("Could not copy text: ", e);
        alert("Failed to copy text");
    }
};

const onload = _ => {
    const now = new Date();
    dateInput.value = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
    timeInput.value = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    updateOutput();
}

window.onload = onload;
current.onclick = onload;

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
    const selectedDate = new Date(dateInput.value + "T" + timeInput.value + ":00");
    const unixTimestamp = Math.floor(selectedDate.getTime() / 1000);
    output.value = `<t:${unixTimestamp}:${typeInput.value}>`;

    // Format the preview
    if (typeInput.value === 'R') {
        const now = new Date();
        const differenceInSeconds = Math.floor((selectedDate - now) / 1000);
        const formatter = new Intl.RelativeTimeFormat(navigator.language || 'en', typeFormats[typeInput.value] || {});
        let unit = 'second';
        let value = differenceInSeconds;
        if (Math.abs(differenceInSeconds) > 60) {
            value = Math.floor(differenceInSeconds / 60);
            unit = 'minute';
        }
        if (Math.abs(value) > 60) {
            value = Math.floor(value / 60);
            unit = 'hour';
        }
        if (Math.abs(value) > 24) {
            value = Math.floor(value / 24);
            unit = 'day';
        }
        preview.textContent = formatter.format(value, unit);
    } else {
        const formatter = new Intl.DateTimeFormat(navigator.language || 'en', typeFormats[typeInput.value] || {});
        preview.textContent = formatter.format(selectedDate);
    }
}
