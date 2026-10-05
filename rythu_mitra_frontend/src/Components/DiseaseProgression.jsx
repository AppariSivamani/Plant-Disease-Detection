import React from "react";
import {
    FaLeaf,
    FaExclamationTriangle,
    FaChartLine
} from "react-icons/fa";

import { useLanguage } from "../context/LanguageContext";
import { diseaseData } from "../data/diseaseData";


const progressionData = {

    Bacterial_Leaf_Blight: {
        en: [
            "Water-soaked lesions begin along leaf margins.",
            "Lesions become yellowish or whitish and start spreading.",
            "Severely affected leaves may dry from the tip downward."
        ],
        te: [
            "ఆకు అంచుల వెంట నీటితో తడిసినట్లుగా మచ్చలు ప్రారంభమవుతాయి.",
            "మచ్చలు పసుపు లేదా తెలుపు రంగులోకి మారి వ్యాప్తి చెందుతాయి.",
            "తీవ్రంగా సోకిన ఆకులు కొన భాగం నుండి కింది వైపుకు ఎండిపోవచ్చు."
        ]
    },

    Brown_Spot: {
        en: [
            "Small circular or oval brown spots appear on the leaves.",
            "The spots gradually enlarge and become more noticeable.",
            "Severe infection can cause affected leaf areas to dry."
        ],
        te: [
            "ఆకులపై చిన్న గుండ్రని లేదా అండాకారపు గోధుమ మచ్చలు కనిపిస్తాయి.",
            "మచ్చలు క్రమంగా పెద్దవిగా మారి స్పష్టంగా కనిపిస్తాయి.",
            "తీవ్రమైన ఇన్ఫెక్షన్ వల్ల ప్రభావిత ఆకు భాగాలు ఎండిపోవచ్చు."
        ]
    },

    Healthy: {
        en: [
            "No significant disease symptoms are detected.",
            "The leaf remains generally healthy.",
            "Continue regular monitoring and good crop management."
        ],
        te: [
            "ఎటువంటి ముఖ్యమైన వ్యాధి లక్షణాలు గుర్తించబడలేదు.",
            "ఆకు సాధారణంగా ఆరోగ్యంగా ఉంటుంది.",
            "క్రమం తప్పకుండా పర్యవేక్షణ మరియు మంచి పంట నిర్వహణ కొనసాగించండి."
        ]
    },

    Insect_Damage: {
        en: [
            "Small feeding marks, holes or scraped areas may appear.",
            "Damage can increase as insect activity continues.",
            "Severe infestation can cause irregular and extensive leaf damage."
        ],
        te: [
            "ఆకులపై చిన్న తినే గుర్తులు, రంధ్రాలు లేదా గీసుకుపోయిన భాగాలు కనిపించవచ్చు.",
            "కీటకాల చర్య కొనసాగితే నష్టం పెరుగుతుంది.",
            "తీవ్రమైన ఉధృతి వల్ల ఆకులకు ఎక్కువ మరియు క్రమరహిత నష్టం కలగవచ్చు."
        ]
    },

    Leaf_Blast: {
        en: [
            "Small diamond or spindle-shaped lesions begin appearing.",
            "Lesions develop gray or whitish centers with darker margins.",
            "Severe infection can cause extensive leaf drying."
        ],
        te: [
            "చిన్న వజ్రాకార లేదా కదురు ఆకారపు మచ్చలు ఏర్పడటం ప్రారంభమవుతుంది.",
            "మచ్చల మధ్య భాగం బూడిద లేదా తెలుపుగా, అంచులు ముదురుగా మారతాయి.",
            "తీవ్రమైన ఇన్ఫెక్షన్ వల్ల ఆకులు ఎక్కువగా ఎండిపోవచ్చు."
        ]
    },

    Leaf_Folder: {
        en: [
            "Leaves begin to fold or roll.",
            "Whitish scraped areas appear inside the folded leaf.",
            "Continued feeding can cause significant loss of green leaf tissue."
        ],
        te: [
            "ఆకులు ముడుచుకోవడం లేదా చుట్టుకోవడం ప్రారంభమవుతుంది.",
            "ముడుచుకున్న ఆకు లోపల తెల్లటి గీతలు లేదా దెబ్బతిన్న భాగాలు కనిపిస్తాయి.",
            "కీటకాల ఆహార చర్య కొనసాగితే ఆకులోని పచ్చని కణజాలం ఎక్కువగా దెబ్బతింటుంది."
        ]
    },

    Leaf_Scald: {
        en: [
            "Brown or gray lesions begin near leaf tips or margins.",
            "Lesions gradually enlarge across affected areas.",
            "Severe development causes affected portions of leaves to dry."
        ],
        te: [
            "ఆకు చివర్లు లేదా అంచుల వద్ద గోధుమ లేదా బూడిద మచ్చలు ప్రారంభమవుతాయి.",
            "మచ్చలు క్రమంగా పెద్దవిగా మారుతాయి.",
            "తీవ్రంగా అభివృద్ధి చెందితే ప్రభావిత ఆకు భాగాలు ఎండిపోతాయి."
        ]
    },

    Leaf_Smut: {
        en: [
            "Small dark or black spots begin appearing on leaves.",
            "Spots become more visible as infection develops.",
            "Increasing infection can affect the healthy leaf area."
        ],
        te: [
            "ఆకులపై చిన్న ముదురు లేదా నల్లని మచ్చలు కనిపించడం ప్రారంభమవుతుంది.",
            "ఇన్ఫెక్షన్ అభివృద్ధి చెందే కొద్దీ మచ్చలు మరింత స్పష్టంగా కనిపిస్తాయి.",
            "ఇన్ఫెక్షన్ పెరిగితే ఆరోగ్యకరమైన ఆకు భాగం ప్రభావితమవుతుంది."
        ]
    },

    Leaf_Stripes: {
        en: [
            "Long narrow stripes or streaks begin appearing on leaves.",
            "Affected areas may gradually turn yellow or brown.",
            "Continued damage can reduce the healthy green leaf area."
        ],
        te: [
            "ఆకులపై పొడవైన సన్నని చారలు లేదా గీతలు కనిపించడం ప్రారంభమవుతుంది.",
            "ప్రభావిత ప్రాంతాలు క్రమంగా పసుపు లేదా గోధుమ రంగులోకి మారవచ్చు.",
            "నష్టం కొనసాగితే ఆరోగ్యకరమైన ఆకుపచ్చ ఆకు భాగం తగ్గుతుంది."
        ]
    },

    Narrow_Brown_Leaf_Spot: {
        en: [
            "Narrow elongated brown lesions begin appearing.",
            "Lesions become more visible and reduce healthy green leaf area.",
            "Severe development can cause considerable leaf damage."
        ],
        te: [
            "ఇరుకైన పొడవైన గోధుమ రంగు మచ్చలు కనిపించడం ప్రారంభమవుతుంది.",
            "మచ్చలు స్పష్టంగా మారి ఆరోగ్యకరమైన ఆకుపచ్చ భాగాన్ని తగ్గిస్తాయి.",
            "తీవ్రంగా అభివృద్ధి చెందితే ఆకుకు గణనీయమైన నష్టం కలగవచ్చు."
        ]
    },

    Rice_Hispa: {
        en: [
            "Small white scraped patches or streaks appear on leaves.",
            "Feeding damage increases as adults and larvae continue feeding.",
            "Severe damage can significantly reduce healthy leaf tissue."
        ],
        te: [
            "ఆకులపై చిన్న తెల్లటి గీతలు లేదా గీసుకుపోయిన భాగాలు కనిపిస్తాయి.",
            "ప్రౌఢ పురుగులు మరియు లార్వాలు ఆహారం తీసుకోవడం వల్ల నష్టం పెరుగుతుంది.",
            "తీవ్రమైన నష్టం వల్ల ఆరోగ్యకరమైన ఆకు కణజాలం గణనీయంగా తగ్గుతుంది."
        ]
    },

    Sheath_Blight: {
        en: [
            "Oval or irregular lesions begin on the leaf sheath.",
            "Lesions enlarge and spread upward toward the leaves.",
            "Severe disease may spread to neighboring plants."
        ],
        te: [
            "ఆకు తొడుగుపై అండాకార లేదా అనియత మచ్చలు ప్రారంభమవుతాయి.",
            "మచ్చలు పెద్దవిగా మారి పైకి ఆకుల వైపు వ్యాపిస్తాయి.",
            "తీవ్రమైన వ్యాధి పక్కనే ఉన్న మొక్కలకు కూడా వ్యాపించవచ్చు."
        ]
    },

    Tungro: {
        en: [
            "Leaves begin showing yellow to orange-yellow discoloration.",
            "Plant growth becomes stunted and tillering may decrease.",
            "Severe infection can significantly affect crop growth."
        ],
        te: [
            "ఆకులు పసుపు నుండి నారింజ-పసుపు రంగులోకి మారడం ప్రారంభమవుతుంది.",
            "మొక్క ఎదుగుదల కుంటుపడి పిలకలు తగ్గవచ్చు.",
            "తీవ్రమైన ఇన్ఫెక్షన్ పంట ఎదుగుదలను గణనీయంగా ప్రభావితం చేయవచ్చు."
        ]
    }
};


function DiseaseProgression({ prediction }) {

    const { language } = useLanguage();

    if (!prediction) return null;

    const info = diseaseData[prediction.disease];

    const diseaseName = info
        ? info.name[language]
        : prediction.disease.replace(/_/g, " ");

    const stages =
        progressionData[prediction.disease] ||
        {
            en: [
                info?.symptoms?.en || "Disease symptoms detected.",
                info?.causes?.en || "Disease progression may continue.",
                info?.prevention?.en || "Follow recommended crop management."
            ],
            te: [
                info?.symptoms?.te || "వ్యాధి లక్షణాలు గుర్తించబడ్డాయి.",
                info?.causes?.te || "వ్యాధి మరింత అభివృద్ధి చెందవచ్చు.",
                info?.prevention?.te || "సిఫార్సు చేసిన పంట నిర్వహణను పాటించండి."
            ]
        };

    const content = stages[language] || stages.en;

    const stageNames =
        language === "te"
            ? ["ప్రారంభ దశ", "మధ్యస్థ దశ", "తీవ్ర దశ"]
            : ["Initial Stage", "Moderate Stage", "Severe Stage"];

    return (
        <div className="disease-progression-card">

            <div className="progression-title">

                <div className="progression-title-icon">
                    <FaChartLine />
                </div>

                <div>
                    <h3>
                        Disease Progression
                    </h3>

                    <span>
                        {diseaseName}
                    </span>
                </div>

            </div>


            <div className="progression-stages">

                {content.map((text, index) => (

                    <div
                        className="progression-stage"
                        key={index}
                    >

                        <div className="stage-number">
                            {index + 1}
                        </div>

                        <div className="stage-content">

                            <strong>
                                {stageNames[index]}
                            </strong>

                            <p>
                                {text}
                            </p>

                        </div>

                    </div>

                ))}

            </div>

        </div>
    );
}

export default DiseaseProgression;