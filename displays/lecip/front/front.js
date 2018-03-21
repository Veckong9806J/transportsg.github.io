let width = 160, height = 20;

let ledCache = [];

window.addEventListener('load', () => {
    for (let x = 0; x < width; x++) {
        ledCache.push([]);
        for (let y = 0; y < height; y++) {
            ledCache[x].push([]);
        }
    }

    let ledContainer = document.getElementById('led-container');
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let ledSegment = document.createElement('div');
            ledSegment.id = 'led-' + x + '-' + y;
            ledSegment.className = 'led-segment';

            let led = document.createElement('div');
            led.className = 'led led-off';

            ledSegment.appendChild(led);

            ledCache[x][y] = led;

            ledContainer.appendChild(ledSegment);
        }
    }

    setTimeout(bootupSequence, 1500);
});

function bootupSequence() {
    for (let x = 0; x < width; x++) {
        setTimeout(() => {
            setColumn(x, true);
        }, x * 5);
    }
    setTimeout(() => {
        for (let x = 0; x < width; x++) {
            setTimeout(() => {
                setColumn(x, false);
            }, x * 5);
        }
    }, 1000);
}

function writeText(text) {
    clearLEDs();

    let chars = [...text];
    let totalWidth = chars.map(char => charSet.fat[char][0].length + 3).reduce((a, b) => a + b, 0);

    let xPos = Math.floor(width / 2 - totalWidth / 2);

    chars.forEach(char => {
        xPos += showChar(char, 'fat', xPos) + 3;
    });

}

function showSvc(svcNumber) {
    let chars = [...svcNumber.toString()];

    let totalWidth = chars.map(char => charSet.fat[char][0].length + 2).reduce((a, b) => a + b, 0);

    let xPos = width - totalWidth + 2;

    clearRect(xPos, 0, width, height);

    chars.forEach(char => {
        xPos += showChar(char, 'fat', xPos) + 2;
    });
}

function showDest(dest) {
    let chars = [...dest.toString()];

    let yOff = 0;

    let font = 'frontFat';
    if (dest.length > 13) dest = dest.slice(2);
    
    if (!dest.includes('>')) {
        font = 'frontThin';
        yOff = 1;
    }

    console.log(font);

    let totalWidth = chars.map(char => charSet[font][char][0].length + 1).reduce((a, b) => a + b, 0);

    let xPos = 0;

    clearRect(0, 0, totalWidth, 10 + yOff);

    chars.forEach(char => {
        xPos += showChar(char, font, xPos, yOff) + 1;
    });
}

function showSvcInfo(line) {
    let chars = [...line.toString()];

    let totalWidth = chars.map(char => charSet.frontThin[char][0].length + 1).reduce((a, b) => a + b, 0);

    let xPos = 0;

    clearRect(0, 13, totalWidth - 1, height);

    chars.forEach(char => {
        xPos += showChar(char, 'frontThin', xPos, 13) + 1;
    });
}

function setColumn(x, state) {
    for (let y = 0; y < height; y++) {
        setLEDState(x, y, state);
    }
}

function setLEDState(x, y, state) {
    if (!ledCache[x]) return;
    let led = ledCache[x][y];

    if (!led) return;

    var state = 'led-' + (state ? 'on' : 'off');
    led.className = 'led ' + state;
}

function showChar(char, type, dx, dy) {
    if (!(type in charSet)) return;
    if (!(char in charSet[type])) return;

    let charData = charSet[type][char];

    let charWidth = charData[0].length;
    let charHeight = charData.length;

    for (let y = 0; y < charHeight; y++) {
        for (let x = 0; x < charWidth; x++) {
            setLEDState(x + dx, y - (dy || 0) + (height - charHeight), charData[y][x]);
        }
    }
    return charWidth;
}

function clearLEDs() {
    clearRect(0, 0, width, height);
}

function clearRect(sx, sy, ex, ey) {
    for (let y = sy; y < ey; y++) {
        for (let x = sx; x < ex; x++) {
            setLEDState(x, height - y - 1, false);
        }
    }
}

window.addEventListener('message', event => {
    let eventData = JSON.parse(event.data);
    if (event.origin === location.origin) {
        switch (eventData.type) {
            case 'svc-update':
                handleSvcUpdate(eventData.svc, eventData.dest);
                break;
        }
    }
});

function handleSvcUpdate(svc, dest) {
    console.log('front: change to', svc, dest);
    clearLEDs();

    showSvc(svc);
    showDest(dest);
}
