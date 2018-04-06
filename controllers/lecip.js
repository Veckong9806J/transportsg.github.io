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

    let variant = '';
    if (svc.endsWith('A') || svc.endsWith('B') || svc.endsWith('C')) {
        variant = svc.slice(-1);
        svc = svc.slice(0, -1);
    }

    console.log(svc, variant)

    ajax({url: 'https://transportsg.me/eds/' + svc}, data => {
        if (data !== 'error!') {
            if (data.operator === 'SBST' || true) {
                dests[svc] = {
                    interchanges: data.interchanges.map(int => {
                        int = '> ' + int.toUpperCase().replace(/ TEMP/, '').replace(/BUSINESS/, 'BIZ');
                        if (int === '> BEACH STATION BUS TERMINAL')
                            int = '> SENTOSA';
                        if (int === '> BT MERAH INT')
                            int = '> BUKIT MERAH INT';
                        if (int === '> S\'GOON INT')
                            int = '> SERANGOON INT';
                        return int;
                    }).filter((e, i, a) => a.indexOf(e) === i),
                    routeType: data.routeType,
                    loopPoint: data.loopPoint
                };

                if (variant && SWTs[svc + variant]) {
                    let terminalData = SWTs[svc + variant].split(';');

                    dests[svc + variant] = {
                        roadName: terminalData[0],
                        busStopName: terminalData[1],
                        routeType: 'SWT'
                    }
                }
            }
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
    19: {
        interchanges: ['> TAMPINES INT', '> CHANGI AIRFREIGHT CTR'],
        routeType: 'TRUNK',
        loopPoint: ''
    },
    21: {
        interchanges: ['> ST MICHAEL\'S TER', '> PASIR RIS INT'],
        routeType: 'TRUNK',
        loopPoint: ''
    },
    23: {
        interchanges: ['> TAMPINES INT'],
        routeType: 'TRUNK',
        loopPoint: 'Rochor'
    },
    29: {
        interchanges: ['>TAMPINES INT'],
        routeType: 'TRUNK',
        loopPoint: 'Changi Village'
    },
    35: {
         interchanges: ['> ALPS AVE', '> BEDOK INT'],
         routeType: 'TRUNK',
         loopPoint: ''
    },
    36: {
        interchanges: ['> TOMLINSON RD', '> CHANGI AIRPORT'],
        routeType: 'TRUNK',
        loopPoint: ''
    },
    '43M': {
        interchanges: ['> PUNGGOL INT'],
        routeType: 'TRUNK',
        loopPoint: 'S\'goon Ctrl'
    },
    45: {
        interchanges: ['> UPP EAST COAST TER', '> ANG MO KIO DEPOT'],
        routeType: 'TRUNK',
        loopPoint: ''
    },
    69: {
        interchanges: ['> BEDOK INT', '> TAMPINES INT'],
        routeType: 'TRUNK',
        loopPoint: ''
    },
    81: {
        interchanges: ['> TAMPINES INT'],
        routeType: 'TRUNK',
        loopPoint: 'S\'goon Ctrl'
    },
    82: {
        interchanges: ['> PUNGGOL INT'],
        routeType: 'TRUNK',
        loopPoint: 'S\'goon Ctrl'
    },
    83: {
        interchanges: ['> PUNGGOL INT'],
        routeType: 'TRUNK',
        loopPoint: 'Sengkang SQ'
    },
    89: {
        interchanges: ['> HOUGANG CENTRAL    ', 'CHANGI AIRFREIGHT CTR'],
        routeType: 'TRUNK',
        loopPoint: ''
    },
    '107M': {
        interchanges: ['> HOUGANG INT'],
        routeType: 'TRUNK',
        loopPoint: 'Marina Ctr'
    },
    125: {
        interchanges: ['> SIMS AVE', '> ST MICHAEL\'S TER'],
        routeType: 'TRUNK',
        loopPoint: ''
    },
    181: {
        interchanges: ['> BOON LAY INT'],
        routeType: 'TRUNK',
        loopPoint: 'Jurong West.'
    },
    179: {
        interchanges: ['> BOON LAY INT'],
        routeType: 'TRUNK',
        loopPoint: 'NTU'
    },
    200: {
        interchanges: ['> KENT RIDGE TER', '> BUONA VISTA TER'],
        routeType: 'TRUNK',
        loopPoint: ''
    },
    291: {
        interchanges: [''],
        routeType: 'TOWNLINK',
        loopPoint: 'Tampines St 83&33'
    },
    293: {
        interchanges: [''],
        routeType: 'TOWNLINK',
        loopPoint: 'Tampines St 71&Ave 7'
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
    '811E': {

    },
    812: {
        interchanges: ['> YISHUN INT'],
        routeType: 'TOWNLINK',
        loopPoint: 'Yishun Ave 4&3'
    },
    860: {
        interchanges: ['> YIO CHU KANG INT', '> YISHUN INT'],
        routeType: 'TRUNK',
        loopPoint: ''
    },

    CT8: {
        interchanges: ['> ANG MO KIO AVE 9   ', '> NEW BRIDGE RD TER'],
        routeType: 'TRUNK',
        loopPoint: ''
    },
    CT18: {
        interchanges: ['> BEDOK NTH AVE 3   ', '> NEW BRIDGE RD TER'],
        routeType: 'TRUNK',
        loopPoint: ''
    },
    CT28: {
        interchanges: ['> CLEMENTI AVE 4   ', '> NEW BRIDGE RD TER'],
        routeType: 'TRUNK',
        loopPoint: ''
    },

    609: {
        interchanges: ['> CHINATOWN', '> BUKIT PANJANG'],
        routeType: 'TRUNK',
        loopPoint: ''
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

        if (currentSvc === '1O6W') {
            triggerUpdate({
                type: '106-easter'
            });

            currentDest = 'Wong Tai Sin';

            svcBeingInputted = [0,0,0,0];
            currentState = 'home';
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

        if (currentSvc === '814') currentSvc = 'CT8';
        if (currentSvc === '815') currentSvc = 'CT18';
        if (currentSvc === '816') currentSvc = 'CT28';

        loadEDSData(currentSvc, () => {
            if (!currentSvc) currentSvc = '0';

            svcBeingInputted = [0,0,0,0];

            currentDir = 0;
            if (dests[currentSvc]) {
                let routeType = dests[currentSvc].routeType;

                if (routeType !== 'SWT') {
                    if (routeType === 'CITY_LINK') {
                        currentDest = 'CITY DIRECT';
                    } else if (routeType.includes('FLAT FARE')) {
                        currentDest = 'PREMIUM';
                    } else if (routeType === 'NIGHT SERVICE') {
                        currentDest = 'NITE OWL';
                    } else if (routeType === 'EXPRESS') {
                        currentDest = 'EXPRESS';
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
                } else {
                    currentDest = currentSvc;

                    triggerUpdate({
                        type: 'set-swt',
                        svc: currentSvc,
                        roadName: dests[currentSvc].roadName,
                        busStopName: dests[currentSvc].busStopName
                    });
                }
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
        if (svcBeingInputted.join('') === '0000') {
            currentState = 'home';
        } else {
            svcBeingInputted = [0,0,0,0];
            registerKeyPress(0);
        }
    }
}

function onF4Pressed() {
    if (currentState === 'home') {
        if (!(currentSvc in dests)) return;
        if (!dests[currentSvc].interchanges) return; // SWT
        if (currentDest === 'PREMIUM' || currentDir === 'NIGHT OWL' || currentDest === 'CITY DIRECT' || dests[currentSvc].routeType === 'EXPRESS') return;
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
