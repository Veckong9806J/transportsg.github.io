let currentSvc = '1111';
let currentDest = 'OFF SERVICE';
let currentDir = false;

let currentState = 'off';
let svcBeingInputted = [0,0,0,0];

let ledsInverted = false;

function loadEDSData(svc, cb) {
    if (dests[svc]) {
        if (cb) cb();
        return;
    }

    ajax({url: 'https://beta.transportsg.me/eds/' + svc}, data => {
        if (data !== 'error!') {
            if (data.operator === 'SBST')
                dests[svc] = {
                    interchanges: data.interchanges.map(int => {
                        int = '> ' + int.toUpperCase().replace(/ TEMP/, '').replace(/BUSINESS/, 'BIZ');
                        if (int === '> BEACH STATION BUS TERMINAL')
                            int = '> SENTOSA';
                        if (int === '> BT MERAH INT')
                            int = '> BUKIT MERAH INT';
                        return int;
                    }).filter((e, i, a) => a.indexOf(e) === i),
                    routeType: data.routeType,
                    loopPoint: data.loopPoint
            }   ;
        }
        if (cb) cb();
    });
}

function triggerUpdate(data) {
    if (parent) {
        parent.postMessage(JSON.stringify(data), parent.location.toString());
    }
}

let failedDests = [];

let dests = {
    258: {
        interchanges: ['> JOO KOON'],
        routeType: 'INDUSTRIAL',
        loopPoint: 'Jurong West St 64'
    },
    174: {
        interchanges: ['> BOON LAY INT', '> KAMPONG BAHRU TER'],
        routeType: 'TRUNK',
        loopPoint: ''
    },
    '174e': {
        interchanges: ['> BOON LAY INT', '> KAMPONG BAHRU TER'],
        routeType: 'EXPRESS',
        loopPoint: ''
    },
    181: {
        interchanges: ['> BOON LAY INT'],
        routeType: 'TRUNK',
        loopPoint: 'Jurong West.'
    },
    807: {
        interchanges: ['> YISHUN INT'],
        routeType: 'FEEDER',
        loopPoint: 'Yishun St 71'
    },
    811: {
        interchanges: ['> YISHUN INT'],
        routeType: 'TOWNLINK',
        loopPoint: 'Yishun Ave 5&1'
    },
    812: {
        interchanges: ['> YISHUN INT'],
        routeType: 'TOWNLINK',
        loopPoint: 'Yishun Ave 4&3'
    }
};

function renderText(line1, line2) {
    if (!!line1)
        document.getElementById('output-line1').textContent = line1;
    if (!!line2)
        document.getElementById('output-line2').textContent = line2;
}

function padTo4Digit(svcArray) {
    return Array(4).fill(0).concat(svcArray).slice(-4).join('');
}

function padTo4DigitSpace(svcArray) {
    return Array(4).fill(' ').concat(svcArray).slice(-4).join('');
}

function registerKeyPress(number) {
    if (currentState === 'home') {
        svcBeingInputted.shift();
        svcBeingInputted.push(number);
        currentState = 'inputSvc';
        renderText('Input Route No. ', '           ' + padTo4Digit(svcBeingInputted));
    } else if (currentState === 'inputSvc') {
        svcBeingInputted.shift();
        svcBeingInputted.push(number);
        renderText('Input Route No. ', '           ' + padTo4Digit(svcBeingInputted));
    }
}

function onEntPressed() {
    if (currentState === 'inputSvc') {
        currentSvc = svcBeingInputted.join('').slice(-4).replace(/^0+/, '').replace('E', 'e');
        if (currentSvc.startsWith('8') && currentSvc.length === 4) currentSvc = currentSvc.toUpperCase();

        if (currentSvc in failedDests) {
            currentDir = '             E11';
            return;
        }

        if (svcBeingInputted.filter((e, i, a) => a.indexOf(e) === i).length === 1 || currentSvc === '1') {
            triggerUpdate({
                type: 'special-code',
                code: currentSvc
            });

            currentDest = '';

            svcBeingInputted = [0,0,0,0];
            currentState = 'home';
            return;
        }

        loadEDSData(currentSvc, () => {
            if (!currentSvc) currentSvc = '0';

            svcBeingInputted = [0,0,0,0];

            currentDir = 0;
            if (dests[currentSvc]) {
                let routeType = dests[currentSvc].routeType;

                if (routeType === 'CITY_LINK') {
                    currentDest = 'CITY DIRECT';
                } else if (routeType.includes('FLAT FARE')) {
                    currentDest = 'PREMIUM';
                } else {
                    currentDest = dests[currentSvc].interchanges[0];
                }
                triggerUpdate({
                    type: 'svc-update',
                    svc: currentSvc,
                    dest: currentDest,
                    loopPoint: dests[currentSvc].loopPoint,
                    routeType: routeType,
                    direction: Number(currentDir)
                });
            }
            else {
                currentDest = '             E11';
                failedDests.push(currentSvc);
            }
            currentState = 'home';
        });
    }
}

function onClrPressed() {
    if (currentState === 'inputSvc') {
        svcBeingInputted = [0,0,0,0];
        registerKeyPress(0);
    }
}

function onF4Pressed() {
    if (currentState === 'home') {
        if (!(currentSvc in dests)) return;
        if (dests[currentSvc].interchanges.length === 2) {
            currentDir = !currentDir;
            currentDest = dests[currentSvc].interchanges[Number(currentDir)];

            triggerUpdate({
                type: 'svc-update',
                svc: currentSvc,
                dest: currentDest,
                loopPoint: dests[currentSvc].loopPoint,
                routeType: dests[currentSvc].routeType,
                direction: Number(currentDir)
            });
        }
    }
}

function onF3Pressed() {
    if (currentState === 'home') {
        ledsInverted = !ledsInverted;
        triggerUpdate({
            type: 'led-invert',
            state: ledsInverted
        });
    }
}

function ammendVariant(direction) {
    if (isNaN(parseInt(svcBeingInputted[3]))) {
        let currentVariant = svcBeingInputted[3].charCodeAt(0);
        let newVariantCID = currentVariant += direction;
        if (newVariantCID > 90) newVariantCID = 65;
        if (newVariantCID < 65) newVariantCID = 90;

        let newVariant = String.fromCharCode(newVariantCID);
        svcBeingInputted.pop();
        svcBeingInputted.push(newVariant);
    } else {
        svcBeingInputted.shift();
        svcBeingInputted.push('A');
    }

    renderText('Input Route No. ', '           ' + padTo4Digit(svcBeingInputted));
}

function onUpPressed() {
    if (currentState === 'inputSvc') {
        ammendVariant(+1);
    }
}

function onDownPressed() {
    if (currentState === 'inputSvc') {
        ammendVariant(-1);
    }
}

function paintHome() {
    renderText('Route No: ' + padTo4DigitSpace([...currentSvc]) + ' ' + (Number(currentDir) + 1) + ' ', currentDest);
}

function runMainFirmware() {

    triggerUpdate({
        type: 'special-code',
        code: currentSvc
    });

    setInterval(() => {
        if (currentState === 'home')
            paintHome();
    }, 20);
}

function performStartup() {
    var textSets = [
        ['IPL', 'USB Initializing'],
        ['IPL: D99610', 'APL: D90913'],
        ['SBS Transit', 'LED Destination']
    ];

    textSets.forEach((lines, index) => {
        setTimeout(() => {
            renderText(lines[0], lines[1]);
        }, index * 2000);
    });

    setTimeout(() => {
        currentState = 'home';
        runMainFirmware();
    }, (textSets.length) * 2000);
}

function main() {
    console.log('lecip controller started')
    setTimeout(() => {
        performStartup();
    }, 1500);

    for (let keynum = 0; keynum < 10; keynum++) {
        let element = document.getElementById('keypad-' + keynum);
        element.addEventListener('click', () => {
            registerKeyPress(keynum);
        });
    }

    document.getElementById('keypad-ent').addEventListener('click', onEntPressed);
    document.getElementById('keypad-clr').addEventListener('click', onClrPressed);
    document.getElementById('keypad-f4').addEventListener('click', onF4Pressed);
    document.getElementById('keypad-f3').addEventListener('click', onF3Pressed);
    document.getElementById('keypad-up').addEventListener('click', onUpPressed);
    document.getElementById('keypad-down').addEventListener('click', onDownPressed);
}

window.addEventListener('load', main);



Object.defineProperty(XMLHttpRequest.prototype, 'responseJSON', {
    get: function() {
        try {
            return JSON.parse(this.responseText);
        } catch (e) {
            return undefined;
        }
    },
    enumerable: false
});

function ajax(options, callback) {
    var xhr = new XMLHttpRequest();
    xhr.addEventListener('load', function() {
        callback(xhr.responseJSON || xhr.responseXML || xhr.responseText);
    });
    xhr.open(options.method || 'GET', options.url || location.toString());
    if (options.data) {
        xhr.setRequestHeader('Content-Type', 'application/json');
    }
    xhr.send(JSON.stringify(options.data));
}
