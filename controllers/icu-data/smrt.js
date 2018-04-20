EDSTemplateSet['SMRT'] = {
    standardService: [
        { // Render svc
            variables: {
                serviceNumber: '$serviceNumber'
            },
            font: '$serviceFont',
            format: '<serviceNumber,,0>',
            spaceWidth: 2,
            align: 'right'
        },
        { // Render DEST via ROAD [SVC]
            variables: {
                currentRoad: '$scrolls[]text',
                currentRoadFont: '$scrolls[]font',
                destination: '$destination.text',
                destinationFont: '$destination.font',
                via: '  via',
                viaFont: 'thin'
            },
            font: '$scrolls[]font',
            active: '$scrolls[]showDest{true}',
            format: ['<destination,destinationFont,9><via,viaFont,9>', '<currentRoad,currentRoadFont,0>'],
            yPositions: [9, 0],
            spaceWidth: 1,
            align: 'centre-width[0]'
        },
        { // Render DEST [SVC]
            variables: {
                fullDestination: '$scrolls[]text'
            },
            font: '$scrolls[]font',
            active: '$!scrolls[]showDest{true}',
            format: {
                '$scrolls[]text(array?)': ['<fullDestination[0],,9>', '<fullDestination[1],,0>'], // Render multiline dest
                '$!scrolls[]text(array?)': ['<fullDestination,,1>'] // Render singleline dest
            },
            spaceWidth: 1,
            align: 'centre-width[0]'
        }
    ],
    '190-variant': [
        { // Render svc
            variables: {
                serviceNumber: '$serviceNumber'
            },
            font: '$serviceFont',
            format: '<serviceNumber,,0>',
            spaceWidth: 3,
            align: 'right'
        },
        { // Render DEST via ROAD [SVC]
            variables: {
                currentRoad: '$scrolls[]text',
                currentRoadFont: '$scrolls[]font',
                destination: '$destination.text',
                destinationFont: '$destination.font',
                via: '  via',
                viaFont: 'thin'
            },
            font: '$scrolls[]font',
            active: '$scrolls[]showDest{true}',
            format: ['<destination,destinationFont,9><via,viaFont,9>', '<currentRoad,currentRoadFont,0>'],
            yPositions: [9, 0],
            spaceWidth: 1,
            align: 'centre-width[0]'
        },
        { // Render DEST [SVC]
            variables: {
                fullDestination: '$scrolls[]text'
            },
            font: '$scrolls[]font',
            active: '$!scrolls[]showDest{true}',
            format: {
                '$scrolls[]text(array?)': ['<fullDestination[0],,9>', '<fullDestination[1],,0>'], // Render multiline dest
                '$!scrolls[]text(array?)': ['<fullDestination,,1>'] // Render singleline dest
            },
            spaceWidth: 1,
            align: 'centre-width[0]'
        }
    ],
    full: [
        {
            variables: {
                text: '$text'
            },
            font: 'full',
            format: '<text,,0>',
            spaceWidth: 1,
            align: 'centre'
        }
    ],
    big: [
        {
            variables: {
                text: '$text'
            },
            font: 'big',
            format: '<text,,1>',
            spaceWidth: 1,
            align: 'centre'
        }
    ]
}

EDSDataSet['SMRT'] = {
    1: {
        renderType: 'full',
        text: 'CHARTERED'
    },
    2: {
        renderType: 'full',
        text: 'ANG MO KIO DEPOT'
    },
    3: {
        renderType: 'full',
        text: 'KRANJI DEPOT'
    },
    4: {
        renderType: 'full',
        text: 'SMRT BUSES'
    },
    5: {
        renderType: 'big',
        text: 'OFF SERVICE'
    },
    6: {
        renderType: 'full',
        text: 'WOODLANDS DEPOT'
    },
    7: {
        renderType: 'big',
        text: 'OFF SERVICE'
    },
    8: {
        renderType: 'big',
        text: 'OFF SERVICE'
    },
    9: {
        renderType: 'full',
        text: 'ON DRIVING TEST'
    },
    10: {
        renderType: 'full',
        text: 'FERRY SERVICE'
    },
    11: {
        renderType: 'full',
        text: 'MRT SHUTTLE'
    },
    13: {
        renderType: 'full',
        text: 'TRAINING BUS'
    },
    14: {
        renderType: 'full',
        text: 'MoBi 190418'
    },
    16: {
        renderType: 'full',
        text: 'PULAU TEKONG'
    },
    18: {
        renderType: 'full',
        text: 'LRT SHUTTLE A'
    },
    19: {
        renderType: 'full',
        text: 'LRT SHUTTLE B'
    },
    469: {
        renderType: 'standardService',
        serviceNumber: '172',
        serviceFont: 'full',
        destination: {
            text: 'BOON LAY',
            font: 'thin'
        },
        scrolls: [
            {
                text: ['BOON LAY', 'INT / MRT'],
                font: 'thick',
                showDest: false
            },
            {
                text: 'CHOA CHU KANG DRIVE',
                font: 'thin'
            },
            {
                text: 'CHOA CHU KANG AVE 1, 3',
                font: 'thin'
            },
            {
                text: 'CHOA CHU KANG RD',
                font: 'thin'
            },
            {
                text: 'BRICKLAND ROAD',
                font: 'thin'
            },
            {
                text: 'JALAN BEHAR',
                font: 'thin'
            }
        ]
    },
    475: {
        renderType: 'standardService',
        serviceNumber: '188',
        serviceFont: 'full',
        destination: {
            text: 'HARBOURFRONT',
            font: 'thin'
        },
        scrolls: [
            {
                text: 'HARBOURFRONT',
                font: 'big',
                showDest: false
            },
            {
                text: 'CHOA CHU KANG WAY',
                font: 'thin'
            },
            {
                text: 'B. B WEST AVE 4, 2',
                font: 'thin'
            },
            {
                text: 'TOH GUAN ROAD',
                font: 'thin'
            },
            {
                text: 'BOON LAY WAY',
                font: 'thin'
            },
            {
                text: 'AYE, CLEMENTI RD',
                font: 'thin'
            } //Missing data oh noeses!!
        ]
    },
    497: {
        renderType: 'standardService',
        serviceNumber: '61',
        serviceFont: 'full',
        destination: {
            text: 'BUKIT BATOK',
            font: 'thin'
        },
        scrolls: [
            {
                text: ['BUKIT BATOK', 'INT / MRT'],
                font: 'thick',
                showDest: false
            },
            {
                text: 'UBI AVE 2',
                font: 'thin'
            },
            {
                text: 'MACPHERSON RD',
                font: 'thin'
            },
            {
                text: 'KALLANG BAHRU',
                font: 'thin'
            },
            {
                text: 'NORTH BRIDGE RD',
                font: 'thin'
            },
            {
                text: 'SOUTH BRIDGE RD',
                font: 'thin'
            },
            {
                text: 'TELOK BLANGAH RD',
                font: 'thin'
            },
            {
                text: 'HOLLAND RD',
                font: 'thin'
            },
            {
                text: 'CLEMENTI RD',
                font: 'thin'
            }

        ]
    },
    611: {
        renderType: 'standardService',
        serviceNumber: '176',
        serviceFont: 'full',
        destination: {
            text: 'BUKIT PANJANG',
            font: 'thin'
        },
        scrolls: [
            {
                text: 'BUKIT PANJANG',
                font: 'big',
                showDest: false
            },
            {
                text: 'TELOK BLANGAH RD',
                font: 'thin'
            },
            {
                text: 'JURONG TOWN HALL',
                font: 'thin'
            },
            {
                text: 'BT BATOK CTR/ MRT',
                font: 'thin'
            },
            {
                text: 'HILLVIEW AVENUE',
                font: 'thick'
            },
            {
                text: 'UPP BUKIT TIMAH RD',
                font: 'thin'
            }
        ]
    },
    529: {
        renderType: 'standardService',
        serviceNumber: '985',
        serviceFont: 'full',
        destination: {
            text: 'GEYLANG LOR 1',
            font: 'thin'
        },
        scrolls: [
            {
                text: ['GEYLANG LOR 1', '/KALLANG MRT'],
                font: 'thick',
                showDest: false
            }
        ]
    },
    1901: {
        renderType: '190-variant',
        serviceNumber: '190',
        serviceFont: 'full',
        destination: {
            text: 'KAMPONG BAHRU TER',
            font: '190-thin'
        },
        scrolls: [
            {
                text: ['KAMPONG BAHRU', 'TERMINAL'],
                font: 'thick',
                showDest: false
            },
            {
                text: 'BT PANJANG RD',
                font: '190-thick'
            },
            {
                text: '??',
                font: '190-thick'
            },
            {
                text: '??',
                font: '190-thick'
            },
            {
                text: 'STEVENS RD',
                font: '190-thick'
            },
            {
                text: 'ORCHARD RD',
                font: '190-thick'
            },
            {
                text: 'HILL STREET',
                font: '190-thick'
            },
            {
                text: 'CHINATOWN',
                font: '190-thick'
            }
        ]
    }
}
