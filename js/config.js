define([
    'jquery'
], function(
    $
) {
    var BACKEND_TEST_TYPE_TO_FRONTEND_TEST_TYPE = {
            'accuplex'                                  : 'accuplex',
            'Accuplex 4'                                : 'accuplex',
            'CBC'                                       : 'cbc',
            'cbc_32'                                    : 'cbc',
            'superchemistry'                            : 'chemistry',
            'Wellness Chemistries'                      : 'chemistry',
            'SuperChem'                                 : 'chemistry',
            'Complete Chemistry Panel'                  : 'chemistry',
            'fiv'                                       : 'fiv',
            'FIV Antibody'                              : 'fiv',
            'felv'                                      : 'felv',
            'FeLV Antigen (ELISA)'                      : 'felv',
            'Heartworm Antigen'                         : 'heartworm',
            'Heartworm Antibody (Feline)'               : 'heartworm',
            'Heartworm Antigen (Feline)'                : 'heartworm',
            'heartworm1'                                : 'heartworm',
            'ova'                                       : 'ova',
            'Ova & Parasite/Giardia (ELISA)'            : 'ova',
            'Ova and Parasites With Centrifugation'     : 'ova',
            'Giardia and Ova w/ Centrifugation'         : 'ova',
            't4'                                        : 'thyroxine',
            'Total T4'                                  : 'thyroxine',
            'Urinalysis'                                : 'urine',
            'urine1'                                    : 'urine'
        },

        TEST_TYPE_TO_TEST_MODEL_MODULE_PATH_MAPPING = {
            'accuplex'          : 'model/test/Accuplex',
            'cbc'               : 'model/test/CompleteBloodCount',
            'chemistry'         : 'model/test/SuperChemistry',
            'fiv'               : 'model/test/Fiv',
            'felv'              : 'model/test/Felv',
            'heartworm'         : 'model/test/HeartwormAntigen',
            'ova'               : 'model/test/OvaParasite',
            'thyroxine'         : 'model/test/Thyroxine',
            'urine'             : 'model/test/UrineAnalysis'
        },

        TEST_TYPE_TO_TEST_VIEW_MODULE_PATH_MAPPING = {
            'accuplex'          : 'view/test/Accuplex',
            'cbc'               : 'view/test/CompleteBloodCount',
            'chemistry'         : 'view/test/SuperChemistry',
            'felv-fiv'          : 'view/test/FelvFiv',
            'heartworm'         : 'view/test/HeartwormAntigen',
            'ova'               : 'view/test/OvaParasite',
            'thyroxine'         : 'view/test/Thyroxine',
            'urine'             : 'view/test/UrineAnalysis'
        },

        URINE_COLORS = [
            {
                "id": "COLORLESS",
                "type": "colorless",
                "label": "Colorless",
                "description": "This color usually means the urine is very dilute.",
                "isBad": false
            },
            {
                "id": "LIGHT YELLOW",
                "type": "light-yellow",
                "label": "Light Yellow",
                "description": "This is the normal color of urine with varying degrees of intensity based on its concentration. See Specific Gravity.",
                "isBad": false
            },
            {
                "id": "YELLOW",
                "type": "yellow",
                "label": "Yellow",
                "description": "This is the normal color of urine with varying degrees of intensity based on its concentration. See Specific Gravity.",
                "isBad": false
            },
            {
                "id": "DARK YELLOW",
                "type": "dark-yellow",
                "label": "Dark Yellow",
                "description": "This is the normal color of urine with varying degrees of intensity based on its concentration. See Specific Gravity.",
                "isBad": false
            },
            {
                "id": "LIGHT ORANGE",
                "type": "light-orange",
                "label": "Light Orange",
                "description": "This color usually results from certain medications or diet.",
                "isBad": false
            },
            {
                "id": "ORANGE",
                "type": "orange",
                "label": "Orange",
                "description": "This color usually results from certain medications or diet.",
                "isBad": false
            },
            {
                "id": "DARK ORANGE",
                "type": "dark-orange",
                "label": "Dark Orange",
                "description": "This color usually results from certain medications or diet.",
                "isBad": false
            },
            {
                "id": "LIGHT BROWN",
                "type": "light-brown",
                "label": "Light Brown",
                "description": "This color usually results from bleeding or increased levels of bilirubin from the liver. This color can also result from diet",
                "isBad": false
            },
            {
                "id": "BROWN",
                "type": "brown",
                "label": "Brown",
                "description": "This color usually results from bleeding or high levels of bilirubin from the liver. This color can also result from diet.",
                "isBad": true
            },
            {
                "id": "DARK BROWN",
                "type": "dark-brown",
                "label": "Dark Brown",
                "description": "This color usually results from bleeding or high levels of bilirubin from the liver. This color can also result from diet.",
                "isBad": true
            },
            {
                "id": "",
                "type": "light-red",
                "label": "Light Red",
                "description": "This color usually results from blood in the urine – a sign of inflammation and maybe infection.",
                "isBad": true
            },
            {
                "id": "RED",
                "type": "red",
                "label": "Red",
                "description": "This color usually results from blood in the urine – a sign of inflammation and maybe infection.",
                "isBad": true
            },
            {
                "id": "DARK RED",
                "type": "dark-red",
                "label": "Dark Red",
                "description": "This color usually results from blood in the urine – a sign of inflammation and maybe infection.",
                "isBad": true
            },
            {
                "id": "LIGHT GREEN",
                "type": "light-green",
                "label": "Light Green",
                "description": "This color usually results from certain medications or diet.",
                "isBad": true
            },
            {
                "id": "GREEN",
                "type": "green",
                "label": "Green",
                "description": "This color usually results from certain medications or diet.",
                "isBad": true
            },
            {
                "id": "DARK GREEN",
                "type": "dark-green",
                "label": "Dark Green",
                "description": "This color usually results from certain medications or diet.",
                "isBad": true
            }
        ],

        URINE_APPEARANCES = [
            {
                "id": "CLEAR",
                "type": "clear",
                "label": "Clear",
                "description": "Urine is a solution whose color may vary, but a normal urine sample should be clear.",
                "isBad": false
            },
            {
                "id": "CLEAR WITH PARTICLES",
                "type": "clear-with-particles",
                "label": "Clear with Particles",
                "description": "Urine is a solution and should be clear. If it contains insoluble material (called “sediment”), it’s no longer a solution – it’s a suspension. A “Clear with particles” sample contains some insoluble material, and an analysis of the sediment will determine what’s in it.",
                "isBad": false
            },
            {
                "id": "SLIGHTLY HAZY",
                "type": "slightly-hazy",
                "label": "Slightly Hazy",
                "description": "Urine is a solution and should be clear. If it contains insoluble material (called “sediment”), it’s no longer a solution – it’s a suspension. A slightly hazy appearance means the sample is a slight suspension. An analysis of the sediment will determine what’s in it.",
                "isBad": false
            },
            {
                "id": "HAZY",
                "type": "hazy",
                "label": "Hazy",
                "description": "Urine is a solution and should be clear. If it contains insoluble material (called “sediment”), it’s no longer a solution – it’s a suspension. A hazy appearance means the sample is a slight suspension. An analysis of the sediment will determine what’s in it.",
                "isBad": false
            },
            {
                "id": "SLIGHTLY CLOUDY",
                "type": "slightly-cloudy",
                "label": "Slightly Cloudy",
                "description": "Urine is a solution and should be clear. If it contains insoluble material (called “sediment”), it’s no longer a solution – it’s a suspension. A slightly cloudy appearance means the sample is a slight suspension. An analysis of the sediment will determine what’s in it.",
                "isBad": false
            },
            {
                "id": "CLOUDY",
                "type": "cloudy",
                "label": "Cloudy",
                "description": "Urine is a solution and should be clear. If it contains insoluble material (called “sediment”), it’s no longer a solution – it’s a suspension. A cloudy appearance means the sample is a moderate suspension. An analysis of the sediment will determine what’s in it.",
                "isBad": true
            },
            {
                "id": "TURBID",
                "type": "turbid",
                "label": "Turbid",
                "description": "Urine is a solution and should be clear. If it contains insoluble material (called “sediment”), it’s no longer a solution – it’s a suspension. A turbid appearance means the sample is a heavy suspension. An analysis of the sediment will determine what’s in it.",
                "isBad": true
            },
            {
                "id": "OPAQUE",
                "type": "opaque",
                "label": "Opaque",
                "description": "Urine is a solution and should be clear. If it contains insoluble material (called “sediment”), it’s no longer a solution – it’s a suspension. Opaque urine has the least clear appearance, and an analysis of the sediment will determine what’s in it.",
                "isBad": true
            },
            {
                "id": "BLOODY",
                "type": "bloody",
                "label": "Bloody",
                "description": "Blood in the urine results from inflammation and it’s a sure sign that something is not right.",
                "isBad": true
            }
        ];

    return {
        getFrontendTestTypeByBackendType: function(backendType) {
            var frontendType = BACKEND_TEST_TYPE_TO_FRONTEND_TEST_TYPE[backendType];

            if (!frontendType) {
                throw new Error('Backend test type (' + backendType + ') not mapped to a frontend type.');
            }

            return frontendType;
        },

        getModelTestModuleByTestType: function(type) {
            var path = TEST_TYPE_TO_TEST_MODEL_MODULE_PATH_MAPPING[type];

            if (!path) {
                throw new Error('Test type (' + type + ') not mapped to a test model module.');
            }

            return path;
        },

        getModelViewModuleByTestType: function(type) {
            var path = TEST_TYPE_TO_TEST_VIEW_MODULE_PATH_MAPPING[type];

            if (!path) {
                throw new Error('Test type (' + type + ') not mapped to a test view module.');
            }

            return path;
        },

        getUrineColorInfoById: function(id) {
            var i;

            for(i = 0; i < URINE_COLORS.length; i++) {
                if (URINE_COLORS[i].id == id) {
                    return URINE_COLORS[i];
                }
            }

            throw new Error('Failed to find urine color info by id: ' + id);
        },

        getUrineAppearanceInfoById: function(id) {
            var i;

            for(i = 0; i < URINE_APPEARANCES.length; i++) {
                if (URINE_APPEARANCES[i].id == id) {
                    return URINE_APPEARANCES[i];
                }
            }

            throw new Error('Failed to find urine appearance info by id: ' + id);
        },

        parseDate: function(dateString) {
            var parts = dateString.match(/(\d\d)/g),
                year,
                month,
                day;

            if (parts.length != 3) {
                throw new Error('Unable to parse date: ' + dateString);
            }

            year = parseInt(parts[2]);
            year = (year >= 0)
                ? year + 2000
                : year + 1900;

            month = parseInt(parts[0]);
            day = parseInt(parts[1]);

            return new Date(year, month - 1, day);
        },

        /**
         * Detects whether the user agent is a mobile device.
         * @see http://detectmobilebrowsers.com/
         */
        isMobile: function() {
            var a = navigator.userAgent||navigator.vendor||window.opera;
            return /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4));
        }
    }
});
