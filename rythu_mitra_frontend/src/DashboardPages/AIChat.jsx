import React, {
    useEffect,
    useMemo,
    useRef,
    useState
} from "react";
import axios from "axios";

import {
    FaRobot,
    FaLeaf,
    FaSun,
    FaBug,
    FaMoneyBillWave,
    FaFileAlt,
    FaCalendarAlt,
    FaPaperclip,
    FaMicrophone,
    FaPaperPlane,
    FaChevronRight,
    FaCamera,
    FaImage,
    FaCalculator,
    FaClock,
    FaCloudSun,
    FaSeedling,
    FaUpload,
    FaSearch,
    FaTimes
} from "react-icons/fa";

import { getIntegratedAIAnswer } from "../services/aiResponseService";
import { useLanguage } from "../context/LanguageContext";


import CROP_DATA from "../data/cropData";
import API_BASE_URL from "../config";


/* =========================================================
   CATEGORIES
========================================================= */

const categories = [
    "All",
    "Crop",
    "Report",
    "About Disease",
    "Disease Control",
    "Prevention",
    "Weather"
];


/* =========================================================
   SUGGESTED QUESTIONS
========================================================= */

const suggestedQuestions = [

    {
        icon: <FaLeaf />,
        question: "How to control leaf blight in paddy?",
        category: "Disease Control"
    },

    {
        icon: <FaSeedling />,
        question: "Best fertilizer for maize?",
        category: "Crop"
    },

    {
        icon: <FaSun />,
        question: "What is the weather forecast tomorrow?",
        category: "Weather"
    },

    {
        icon: <FaBug />,
        question: "How to prevent pest attack in cotton?",
        category: "Prevention"
    },

    {
        icon: <FaMoneyBillWave />,
        question: "What is the current market price of paddy?",
        category: "Report"
    },

    {
        icon: <FaLeaf />,
        question: "Organic methods to control thrips in chilli?",
        category: "Disease Control"
    },

    {
        icon: <FaFileAlt />,
        question: "Provide crop schedule for paddy.",
        category: "Report"
    },

    {
        icon: <FaCalendarAlt />,
        question: "When should I sow tomato in this season?",
        category: "Crop"
    }

];


/* =========================================================
   POPULAR QUESTIONS
========================================================= */

const popularQuestions = [

    {
        question: "How to increase paddy yield?",
        category: "Crop"
    },

    {
        question: "Natural ways to control pests?",
        category: "Prevention"
    },

    {
        question: "Best crops for summer season?",
        category: "Crop"
    },

    {
        question: "How to use drip irrigation?",
        category: "Crop"
    },

    {
        question: "Symptoms of nitrogen deficiency?",
        category: "About Disease"
    }

];


/* =========================================================
   DEFAULT RECENT CHATS
========================================================= */

const defaultRecentChats = [

    {
        id: 1,
        question: "Treatment for tomato leaf curl",
        time: "2 hours ago"
    },

    {
        id: 2,
        question: "Best fertilizer for cotton",
        time: "1 day ago"
    },

    {
        id: 3,
        question: "Today Weather",
        time: "2 days ago"
    },

    {
        id: 4,
        question: "Market price of paddy",
        time: "3 days ago"
    }

];


/* =========================================================
   NORMALIZE TEXT
========================================================= */

const normalizeText = (text = "") => {

    return text
        .toLowerCase()
        .replace(/_/g, " ")
        .replace(/[.,!?;:'"]/g, " ")
        .replace(/\s+/g, " ")
        .trim();

};


/* =========================================================
   FERTILIZER QUANTITY QUESTION
========================================================= */

const isFertilizerQuantityQuestion = (text = "") => {

    const q = normalizeText(text);

    const keywords = [
        "acre ki entha",
        "acre ki enni",
        "acre ki quantity",
        "how much per acre",
        "how much medicine per acre",
        "how much fertilizer per acre",
        "quantity per acre",
        "dosage per acre",
        "fertilizer quantity",
        "medicine quantity",
        "acre entha mandhu kottali",
        "ఎకరానికి ఎంత",
        "ఎకరానికి ఎన్ని",
        "ఎకరాకు ఎంత",
        "ఎకరాకు ఎన్ని"
    ];

    return keywords.some((word) =>
        q.includes(normalizeText(word))
    );

};


/* =========================================================
   GET TEXT
========================================================= */

const getText = (value, language = "en") => {

    if (!value) {
        return "";
    }

    if (typeof value === "string") {
        return value;
    }

    return (
        value[language] ||
        value.en ||
        value.te ||
        ""
    );

};


/* =========================================================
   FIND CROP
========================================================= */

const findCrop = (question) => {

    const q = normalizeText(question);

    for (const [key, crop] of Object.entries(CROP_DATA)) {

        const names = [

            key,

            crop?.name?.en,

            crop?.name?.te,

            ...(Array.isArray(crop?.aliases)
                ? crop.aliases
                : [])

        ];

        const found = names.some((name) => {

            if (!name) {
                return false;
            }

            return q.includes(
                normalizeText(String(name))
            );

        });

        if (found) {

            return {
                key,
                data: crop
            };

        }

    }

    return null;

};


/* =========================================================
   FIND STAGE
========================================================= */

const findStage = (question) => {

    const q = normalizeText(question);

    // BEFORE CULTIVATION
    if (
        q.includes("before cultivation") ||
        q.includes("before farming") ||
        q.includes("cultivation before") ||
        q.includes("before crop") ||
        q.includes("before") ||
        q.includes("సాగుకు ముందు") ||
        q.includes("పంటకు ముందు") ||
        q.includes("సాగు ముందు")
    ) {
        return "before_cultivation";
    }

    // AFTER CULTIVATION
    if (
        q.includes("after cultivation") ||
        q.includes("after farming") ||
        q.includes("cultivation after") ||
        q.includes("after crop") ||
        q.includes("after") ||
        q.includes("సాగు తర్వాత") ||
        q.includes("సాగు తరువాత") ||
        q.includes("పంట తర్వాత")
    ) {
        return "after_cultivation";
    }

    // FIRST STAGE
    if (
        q.includes("first stage") ||
        q.includes("first_stage") ||
        q.includes("first stage crop") ||
        q.includes("first vidatha") ||
        q.includes("first విడత") ||
        q.includes("first") ||
        q.includes("1st") ||
        q.includes("1st stage") ||
        q.includes("మొదటి దశ") ||
        q.includes("మొదటి విడత") ||
        q.includes("మొదటి స్టేజ్") ||
        q.includes("మొదటి") ||
        q.includes("modhati vidatha") ||
        q.includes("modati vidatha")
    ) {
        return "first_stage";
    }

    // SECOND STAGE
    if (
        q.includes("second stage") ||
        q.includes("second_stage") ||
        q.includes("second stage crop") ||
        q.includes("rendo vidatha") ||
        q.includes("rendava vidatha") ||
        q.includes("second vidatha") ||
        q.includes("second విడత") ||
        q.includes("second") ||
        q.includes("2nd") ||
        q.includes("2nd stage") ||
        q.includes("రెండవ దశ") ||
        q.includes("రెండో దశ") ||
        q.includes("రెండవ విడత") ||
        q.includes("రెండో విడత") ||
        q.includes("రెండవ స్టేజ్") ||
        q.includes("రెండో స్టేజ్")
    ) {
        return "second_stage";
    }

    // THIRD STAGE
    if (
        q.includes("third stage") ||
        q.includes("third_stage") ||
        q.includes("third stage crop") ||
        q.includes("third vidatha") ||
        q.includes("mudava vidatha") ||
        q.includes("mudo vidatha") ||
        q.includes("third విడత") ||
        q.includes("third") ||
        q.includes("3rd") ||
        q.includes("3rd stage") ||
        q.includes("మూడవ దశ") ||
        q.includes("మూడో దశ") ||
        q.includes("మూడవ విడత") ||
        q.includes("మూడో విడత") ||
        q.includes("మూడవ స్టేజ్") ||
        q.includes("మూడో స్టేజ్")
    ) {
        return "third_stage";
    }

    return null;
};


/* =========================================================
   CROP REPORT INTENT
========================================================= */

const isCropReportQuery = (question, category) => {

    const q = normalizeText(question);


    if (category === "Report") {
        return true;
    }


    const reportWords = [

        "crop report",
        "crop schedule",
        "crop details",
        "crop information",
        "crop management",
        "farming schedule",
        "cultivation schedule",
        "complete crop report",
        "complete crop schedule",
        "before cultivation",
        "after cultivation",
        "modhati vidatha",
        "modati vidatha",
        "rendo vidatha",
        "rendava vidatha",
        "mudo vidatha",
        "mudava vidatha",

        "crop stage",
        "report",
        "schedule",
        "stage",

        "పంట రిపోర్ట్",
        "పంట నివేదిక",
        "పంట వివరాలు",
        "పంట షెడ్యూల్",
        "సాగు షెడ్యూల్",
        "సాగు వివరాలు",
        "పంట దశ",
        "రిపోర్ట్",
        "షెడ్యూల్",
        "దశ"

    ];


    return reportWords.some((word) =>
        q.includes(normalizeText(word))
    );

};


/* =========================================================
   CROP REPORT GENERATOR
========================================================= */

const generateCropReport = (
    question,
    language = "en"
) => {

    const cropResult = findCrop(question);


    /* -----------------------------------------------------
       CROP NOT FOUND
    ----------------------------------------------------- */

    if (!cropResult) {

        return {

            type: "crop_report",

            answer:
                language === "te"

                    ? `🌾 పంట రిపోర్ట్ కోసం పంట పేరు చెప్పండి.

ఉదాహరణలు:

• Dalwa crop report
• Sarva crop report
• Sarva first stage
• Dalwa second stage
• Sarva before cultivation`

                    : `🌾 Please mention the crop name for the crop report.

Examples:

• Dalwa crop report
• Sarva crop report
• Sarva first stage
• Dalwa second stage
• Sarva before cultivation`

        };

    }


    const crop = cropResult.data;

    const stage = findStage(question);


    /* =====================================================
       BEFORE CULTIVATION
    ===================================================== */

    if (stage === "before_cultivation") {

        let answer = "";

        if (language === "te") {

            answer +=
                `🌱 ${crop.name.te} — సాగుకు ముందు\n\n`;

            if (crop.before_cultivation?.seed) {

                answer +=
                    `🌾 విత్తనం:\n${getText(
                        crop.before_cultivation.seed,
                        "te"
                    )}\n\n`;

            }

            if (crop.before_cultivation?.dap) {

                answer +=
                    `🧪 ఎరువులు:\n${getText(
                        crop.before_cultivation.dap,
                        "te"
                    )}`;

            }

        } else {

            answer +=
                `🌱 ${crop.name.en} — Before Cultivation\n\n`;

            if (crop.before_cultivation?.seed) {

                answer +=
                    `🌾 Seed:\n${getText(
                        crop.before_cultivation.seed,
                        "en"
                    )}\n\n`;

            }

            if (crop.before_cultivation?.dap) {

                answer +=
                    `🧪 Fertilizers:\n${getText(
                        crop.before_cultivation.dap,
                        "en"
                    )}`;

            }

        }


        return {

            type: "crop_report",

            answer

        };

    }


    /* =====================================================
       STAGE-WISE REPORT
    ===================================================== */

    if (stage) {

        const stageItems =
            Array.isArray(crop.schedule)

                ? crop.schedule.filter(
                    (item) =>
                        item.stage === stage
                )

                : [];


        if (stageItems.length === 0) {

            return {

                type: "crop_report",

                answer:
                    language === "te"

                        ? `🌾 ${crop.name.te} పంటకు ఈ దశలో సమాచారం అందుబాటులో లేదు.`

                        : `🌾 No information is available for this stage of ${crop.name.en}.`

            };

        }


        const stageNames = {

            after_cultivation:
                language === "te"
                    ? "సాగు తర్వాత"
                    : "After Cultivation",

            first_stage:
                language === "te"
                    ? "మొదటి దశ"
                    : "First Stage",

            second_stage:
                language === "te"
                    ? "రెండవ దశ"
                    : "Second Stage",

            third_stage:
                language === "te"
                    ? "మూడవ దశ"
                    : "Third Stage"

        };


        let answer =
            language === "te"

                ? `🌾 ${crop.name.te} — ${stageNames[stage]}\n\n`

                : `🌾 ${crop.name.en} — ${stageNames[stage]}\n\n`;


        stageItems.forEach((item) => {

            if (language === "te") {

                answer +=
                    `📅 రోజు ${item.day}\n`;

                answer +=
                    `🌱 ${getText(
                        item.product,
                        "te"
                    )}\n`;

                answer +=
                    `💊 మోతాదు: ${getText(
                        item.dosage,
                        "te"
                    )}\n\n`;

            } else {

                answer +=
                    `📅 Day: ${item.day}\n`;

                answer +=
                    `🌱 ${getText(
                        item.product,
                        "en"
                    )}\n`;

                answer +=
                    `💊 Dosage:- ${getText(
                        item.dosage,
                        "en"
                    )}\n\n`;

            }

        });


        return {

            type: "crop_report",

            answer

        };

    }


    /* =====================================================
       COMPLETE CROP REPORT
    ===================================================== */

    let answer = "";


    if (language === "te") {

        answer +=
            `🌾 ${crop.name.te} — పూర్తి పంట నివేదిక\n\n`;

        answer +=
            `⏱️ పంట వ్యవధి: ${crop.duration} రోజులు\n\n`;


        /* BEFORE */

        answer +=
            `🌱 సాగుకు ముందు\n\n`;


        if (crop.before_cultivation?.seed) {

            answer +=
                `🌾 ${getText(
                    crop.before_cultivation.seed,
                    "te"
                )}\n`;

        }


        if (crop.before_cultivation?.dap) {

            answer +=
                `🧪 ${getText(
                    crop.before_cultivation.dap,
                    "te"
                )}\n\n`;

        }


        /* SCHEDULE */

        answer +=
            `📋 పంట షెడ్యూల్\n\n`;


        crop.schedule.forEach((item) => {

            answer +=
                `📅 రోజు ${item.day}\n`;

            answer +=
                `🌱 ${getText(
                    item.product,
                    "te"
                )}\n`;

            answer +=
                `💊 మోతాదు: ${getText(
                    item.dosage,
                    "te"
                )}\n\n`;

        });


        answer +=
            `💰 అంచనా బడ్జెట్: ${getText(
                crop.budget,
                "te"
            )}`;

    } else {

        answer +=
            `🌾 ${crop.name.en} — Complete Crop Report\n\n`;

        answer +=
            `⏱️ Crop Duration: ${crop.duration} days\n\n`;


        /* BEFORE */

        answer +=
            `🌱 Before Cultivation\n\n`;


        if (crop.before_cultivation?.seed) {

            answer +=
                `🌾 ${getText(
                    crop.before_cultivation.seed,
                    "en"
                )}\n`;

        }


        if (crop.before_cultivation?.dap) {

            answer +=
                `🧪 ${getText(
                    crop.before_cultivation.dap,
                    "en"
                )}\n\n`;

        }


        /* SCHEDULE */

        answer +=
            `📋 Crop Schedule\n\n`;


        crop.schedule.forEach((item) => {

            answer +=
                `📅 Day ${item.day}\n`;

            answer +=
                `🌱 ${getText(
                    item.product,
                    "en"
                )}\n`;

            answer +=
                `💊 Dosage: ${getText(
                    item.dosage,
                    "en"
                )}\n\n`;

        });


        answer +=
            `💰 Estimated Budget: ${getText(
                crop.budget,
                "en"
            )}`;

    }


    return {

        type: "crop_report",

        answer

    };

};


/* =========================================================
   AI ANSWER
========================================================= */

const getAIAnswer = async (
    question,
    category = "All",
    diseaseContext = null
) => {

    /*
    =====================================================
    STEP 1 — ALWAYS CREATE SAFE QUESTION VARIABLE
    =====================================================
    */

    const userQuestion =
        typeof question === "string"
            ? question
            : "";

    const q =
        normalizeText(userQuestion);

    /*
    If a disease was identified from an uploaded image,
    silently add its name to the lookup question. This keeps
    the existing UI unchanged while allowing questions such as
    "disease control" to use the identified disease data.
    */
    const diseaseContextName =
        typeof diseaseContext === "string"
            ? diseaseContext
            : diseaseContext?.disease ||
              diseaseContext?.class_name ||
              diseaseContext?.label ||
              diseaseContext?.name ||
              "";

    const effectiveQuestion =
        diseaseContextName &&
        !normalizeText(userQuestion).includes(
            normalizeText(diseaseContextName)
        )
            ? `${userQuestion} ${diseaseContextName}`
            : userQuestion;


    console.log(
        "AI Question:",
        userQuestion
    );

    console.log(
        "AI Normalized:",
        q
    );

    /*
    =====================================================
    STEP 2 — CROP + STAGE DETECTION
    =====================================================
    */

    const cropResult =
        findCrop(effectiveQuestion);

    const detectedStage =
        findStage(effectiveQuestion);


    console.log(
        "Detected Crop:",
        cropResult?.key
    );

    console.log(
        "Detected Stage:",
        detectedStage
    );


    /*
    =====================================================
    STEP 3 — WEATHER LOCATION
    =====================================================
    */

    const weatherLocation =
        getWeatherLocation(userQuestion);


    if (
        category === "Weather" ||
        q.includes("weather") ||
        q.includes("rain") ||
        q.includes("temperature") ||
        q.includes("forecast") ||
        q.includes("వాతావరణం") ||
        q.includes("వర్షం") ||
        weatherLocation
    ) {

        try {



            if (weatherLocation) {

                console.log(
                    "Weather Location:",
                    weatherLocation
                );

                return await getWeather(
                    weatherLocation
                );

            }


            /*
            ---------------------------------------------
            Otherwise use integrated weather service
            ---------------------------------------------
            */

            return await getIntegratedAIAnswer(
                userQuestion,
                "Weather",
                "en"
            );

        } catch (error) {

            console.error(
                "Weather AI Error:",
                error
            );

            return `
🌤️ Weather Information

Unable to fetch weather information right now.

Please try again with your location.

Example:
• weather in Razole
• weather in Kunavaram Razole
            `.trim();

        }

    }


    /*
    =====================================================
    STEP 4 — CROP REPORT
    =====================================================
    */

    const isCropQuery =
        isCropReportQuery(
            effectiveQuestion,
            category
        );


    if (isCropQuery) {

        /*
        ---------------------------------------------
        Crop found
        ---------------------------------------------
        */

        if (cropResult) {

            const report =
                generateCropReport(
                    effectiveQuestion,
                    "en"
                );

            return report.answer;

        }


        /*
        ---------------------------------------------
        Crop missing
        ---------------------------------------------
        */

        return `
🌾 Crop Report

Please mention the crop name.

Examples:

• Sarva crop report
• Dalwa crop report
• Sarva first stage
• Sarva second stage
• Dalwa first stage
• Dalwa second stage
• Sarva before cultivation
• Dalwa after cultivation
        `.trim();

    }


    /*
    =====================================================
    STEP 5 — DISEASE QUESTIONS
    =====================================================
    */

    const diseaseKeywords = [

        "disease",
        "leaf",
        "blast",
        "blight",
        "curl",
        "spot",
        "rust",
        "rot",
        "pest",
        "fungus",
        "fungal",
        "infection",
        "control",
        "treatment",
        "prevention",
        "prevent",
        "medicine",
        "fertilizer",
        "dosage",

        "వ్యాధి",
        "తెగులు",
        "నియంత్రణ",
        "చికిత్స",
        "నివారణ",
        "మందు",
        "పురుగు"
    ];


    const isDiseaseQuery =
        diseaseKeywords.some(
            (keyword) =>
                q.includes(
                    normalizeText(keyword)
                )
        );


    if (
        isDiseaseQuery ||
        category === "About Disease" ||
        category === "Disease Control" ||
        category === "Prevention"
    ) {

        try {

            return await getIntegratedAIAnswer(
                effectiveQuestion,
                category,
                "en"
            );

        } catch (error) {

            console.error(
                "Disease AI Error:",
                error
            );

            return `
🌿 Disease Information

Please mention the disease name or upload a clear crop image.

I can provide:

🦠 Disease information
🧪 Disease control
💊 Fertilizer / medicine
📏 Dosage
🛡️ Prevention
            `.trim();

        }

    }


    /*
    =====================================================
    STEP 6 — GENERAL CROP QUESTIONS
    =====================================================
    */

    if (
        category === "Crop" ||
        q.includes("fertilizer") ||
        q.includes("yield") ||
        q.includes("seed") ||
        q.includes("sowing") ||
        q.includes("cultivation") ||
        q.includes("crop")
    ) {

        /*
        ---------------------------------------------
        If crop + stage is available,
        give exact stage information
        ---------------------------------------------
        */

        if (
            cropResult &&
            detectedStage
        ) {

            const report =
                generateCropReport(
                    effectiveQuestion,
                    "en"
                );

            return report.answer;

        }


        return `
🌱 Crop Guidance

Please mention the crop name and stage.

Examples:

• Sarva first stage
• Sarva second stage
• Dalwa first stage
• Dalwa second stage
• Sarva before cultivation
• Dalwa after cultivation
• Sarva crop report
        `.trim();

    }


    /*
    =====================================================
    STEP 7 — MARKET
    =====================================================
    */

    if (
        q.includes("market") ||
        q.includes("price") ||
        q.includes("mandi") ||
        q.includes("market price")
    ) {

        return `
📊 Market Information

Market prices change depending on market arrivals, demand, quality and location.

Please mention:

🌾 Crop name
📍 Market / location

Example:

• Paddy market price in Razole
• Cotton price in Amalapuram
        `.trim();

    }


    /*
    =====================================================
    STEP 8 — DEFAULT RESPONSE
    =====================================================
    */

    return `
I can help you with:

🌱 Crop management
🦠 Disease identification
🧪 Disease control
🛡️ Prevention
💊 Fertilizers and dosage
🌤️ Weather
📊 Market prices
📋 Crop reports and schedules

You can ask like:

• Sarva first stage
• Sarva first vidatha
• సార్వ మొదటి విడత
• Dalwa second stage
• Dalwa crop report
• Sarva before cultivation
• Weather in Razole
• Weather in Kunavaram Razole
• Disease control for leaf blast
    `.trim();

};




const getWeatherLocation = (text) => {

    if (!text) return null;

    let value = text.trim();

    const lower = value.toLowerCase();

    const weatherWords = [
        "weather",
        "temperature",
        "rain",
        "rainfall",
        "climate",
        "forecast",
        "వాతావరణం",
        "వర్షం",
        "ఉష్ణోగ్రత"
    ];

    const hasWeatherWord = weatherWords.some(
        word => lower.includes(word)
    );

    // Example:
    // should also be treated as a location query.

    const locationWords = [
        "mandal",
        "village",
        "district",
        "మండలం",
        "గ్రామం",
        "జిల్లా"
    ];

    const hasLocationWord = locationWords.some(
        word => lower.includes(word)
    );

    if (!hasWeatherWord && !hasLocationWord) {
        return null;
    }

    // Remove weather-related words
    value = value
        .replace(/\bweather\b/gi, "")
        .replace(/\btemperature\b/gi, "")
        .replace(/\brainfall\b/gi, "")
        .replace(/\brain\b/gi, "")
        .replace(/\bclimate\b/gi, "")
        .replace(/\bforecast\b/gi, "")
        .replace(/వాతావరణం/g, "")
        .replace(/వర్షం/g, "")
        .replace(/ఉష్ణోగ్రత/g, "");

    // Remove only the word "mandal/village/district",
    // NOT the actual village or mandal name.
    value = value
        .replace(/\bmandal\b/gi, "")
        .replace(/\bvillage\b/gi, "")
        .replace(/\bdistrict\b/gi, "")
        .replace(/మండలం/g, "")
        .replace(/గ్రామం/g, "")
        .replace(/జిల్లా/g, "");

    value = value
        .replace(/\s+/g, " ")
        .trim();

    return value || null;
};



const getWeather = async (location) => {

    try {

        console.log(
            "Weather location:",
            location
        );

        const response = await axios.get(
            `${API_BASE_URL}/api/weather-by-location/`,
            {
                params: {
                    location: location
                }
            }
        );

        console.log(
            "Weather response:",
            response.data
        );

        const data = response.data;

        if (!data.success) {
            return data.message ||
                "Unable to find weather information.";
        }

        const locationData = data.location;
        const weather = data.weather;

        return `
🌤️ Weather Report

📍 ${locationData.name}, ${locationData.state},

🌡️ Temperature: ${weather.temperature ?? "--"}°C
💧 Humidity: ${weather.humidity ?? "--"}%
💨 Wind: ${weather.wind_speed ?? "--"} km/h
☁️ Condition: ${weather.description ?? "--"}

Spraying Tip:
Avoid pesticide spraying during strong winds or expected rainfall.
        `;

    } catch (error) {

        console.error(
            "Weather API Error:",
            error
        );

        if (error.response) {

            console.error(
                "Weather API Response:",
                error.response.data
            );
        }

        return (
            "Unable to fetch weather information. " +
            "Please check the village and mandal name."
        );
    }
};



/* =========================================================
   MESSAGE FORMATTER
========================================================= */

const renderMessageText = (text = "") => {

    const lines = String(text).split("\n");

    return lines.map((line, lineIndex) => {

        const parts = line.split(/(\*\*[^*]+\*\*)/g);

        return (
            <React.Fragment key={`line-${lineIndex}`}>

                {parts.map((part, partIndex) => {

                    if (
                        part.startsWith("**") &&
                        part.endsWith("**")
                    ) {

                        return (
                            <strong key={`part-${lineIndex}-${partIndex}`}>
                                {part.slice(2, -2)}
                            </strong>
                        );

                    }

                    return (
                        <React.Fragment key={`part-${lineIndex}-${partIndex}`}>
                            {part}
                        </React.Fragment>
                    );

                })}

                {lineIndex < lines.length - 1 && <br />}

            </React.Fragment>
        );

    });
};


/* =========================================================
   AI CHAT COMPONENT
========================================================= */

function AIChat() {
    const { language, toggleLanguage, t } = useLanguage();

    const [messages, setMessages] =
        useState([]);

    const [input, setInput] =
        useState("");

    const [showAttachMenu, setShowAttachMenu] = useState(false);

    const [fertilizerMode, setFertilizerMode] = useState(false);

    const [fertilizerStep, setFertilizerStep] = useState(null);

    const [quantityPerAcre, setQuantityPerAcre] = useState(null);

    const [quantityUnit, setQuantityUnit] = useState(null);

    const [acreQuantity, setAcreQuantity] = useState(null);

    // Disease identified from the latest uploaded plant image.
    // It stays in memory while this AI Chat page is open.
    const [identifiedDisease, setIdentifiedDisease] = useState(null);


    const [selectedCategory, setSelectedCategory] =
        useState("All");

    const [recentChats, setRecentChats] =
        useState(defaultRecentChats);

    const [showAllChats, setShowAllChats] =
        useState(false);

    const [isThinking, setIsThinking] =
        useState(false);

    const [isListening, setIsListening] =
        useState(false);

    const recognitionRef =
        useRef(null);


    /* =====================================================
       VOICE RECOGNITION
    ===================================================== */

    useEffect(() => {

        const SpeechRecognition =
            window.SpeechRecognition ||
            window.webkitSpeechRecognition;


        if (!SpeechRecognition) {

            return;

        }


        const recognition =
            new SpeechRecognition();


        recognition.lang =
            "en-IN";

        recognition.continuous =
            false;

        recognition.interimResults =
            false;


        recognition.onstart = () => {

            setIsListening(true);

        };


        recognition.onend = () => {

            setIsListening(false);

        };


        recognition.onerror = () => {

            setIsListening(false);

        };


        recognition.onresult = (event) => {

            const transcript =
                event.results[0][0].transcript;


            setInput((previous) => {

                if (previous) {

                    return `${previous} ${transcript}`;

                }

                return transcript;

            });

        };


        recognitionRef.current =
            recognition;


        return () => {

            try {

                recognition.stop();

            } catch {

                // ignore

            }

        };

    }, []);


    /* =====================================================
       START VOICE
    ===================================================== */

    const startVoiceInput = () => {

        if (!recognitionRef.current) {

            alert(
                "Voice input is not supported in this browser. Please use Chrome."
            );

            return;

        }


        if (isListening) {

            recognitionRef.current.stop();

            return;

        }


        try {

            recognitionRef.current.start();

        } catch {

            // Browser may throw if recognition
            // is already running.

        }

    };


    /* =====================================================
       ASK AI
    ===================================================== */

    const askAI = (
        question = input,
        category = selectedCategory
    ) => {

        const cleanQuestion =
            question.trim();


        if (
            !cleanQuestion ||
            isThinking
        ) {

            return;

        }


        const now =
            new Date();


        const userMessage = {

            id:
                Date.now(),

            type:
                "user",

            text:
                cleanQuestion,

            time:
                now.toLocaleTimeString(
                    [],
                    {
                        hour: "2-digit",
                        minute: "2-digit"
                    }
                )

        };


        /* USER MESSAGE */

        setMessages((previous) => [

            ...previous,

            userMessage

        ]);


        /* CLEAR INPUT */

        setInput("");


        /* ---------------------------------------------
           START CALCULATOR FROM A NORMAL QUESTION
           --------------------------------------------- */

        if (
            !fertilizerMode &&
            isFertilizerQuantityQuestion(cleanQuestion)
        ) {

            setIsThinking(true);

            setTimeout(() => {

                setFertilizerMode(true);

                setFertilizerStep("quantity");

                setMessages((previous) => [

                    ...previous,

                    {
                        id: Date.now() + 1,
                        type: "ai",
                        text:
                            `💊 ${t.claculator}\n\n` +
                            `${t.calculatorp}\n\n` +
                            `${t.example}`,
                        time: new Date().toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit"
                        })
                    }

                ]);

                setIsThinking(false);

            }, 3000);

            return;

        }


        /* THINKING */

        setIsThinking(true);


        /* ---------------------------------------------
           FERTILIZER CALCULATOR CONTINUATION
           --------------------------------------------- */

        if (fertilizerMode) {

            setTimeout(async () => {

                try {

                    await handleFertilizerInput(
                        cleanQuestion
                    );

                } finally {

                    setIsThinking(false);

                }

            }, 3000);

            return;

        }


        /* RECENT CHAT */

        setRecentChats((previous) => [

            {
                id:
                    Date.now(),

                question:
                    cleanQuestion,

                time:
                    "Just now"
            },

            ...previous

        ]);


        /* =================================================
           3 SECOND AI RESPONSE
        ================================================= */

        setTimeout(async () => {

            try {

                const answer =
                    await getAIAnswer(
                        cleanQuestion,
                        category,
                        identifiedDisease
                    );


                const aiMessage = {

                    id:
                        Date.now() + 1,

                    type:
                        "ai",

                    text:
                        answer,

                    time:
                        new Date().toLocaleTimeString(
                            [],
                            {
                                hour: "2-digit",
                                minute: "2-digit"
                            }
                        )

                };


                setMessages((previous) => [

                    ...previous,

                    aiMessage

                ]);

            } catch (error) {

                console.error(
                    "AI response error:",
                    error
                );


                setMessages((previous) => [

                    ...previous,

                    {

                        id:
                            Date.now() + 1,

                        type:
                            "ai",

                        text:
                            "Sorry, I couldn't process your question right now.",

                        time:
                            new Date().toLocaleTimeString(
                                [],
                                {
                                    hour: "2-digit",
                                    minute: "2-digit"
                                }
                            )

                    }

                ]);

            } finally {

                setIsThinking(false);

            }

        }, 3000);

    };


    /* =====================================================
       ENTER KEY
    ===================================================== */

    const handleKeyDown = (event) => {

        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {

            event.preventDefault();

            askAI();

        }

    };


    /* =====================================================
       SUGGESTED QUESTION
    ===================================================== */

    const handleSuggestedQuestion = (
        question,
        category
    ) => {

        setSelectedCategory(category);

        askAI(
            question,
            category
        );

    };


    /* =====================================================
       FILTER SUGGESTED
    ===================================================== */

    const filteredSuggestedQuestions =
        useMemo(() => {

            if (
                selectedCategory === "All"
            ) {

                return suggestedQuestions;

            }


            return suggestedQuestions.filter(
                (item) =>
                    item.category ===
                    selectedCategory
            );

        }, [selectedCategory]);


    /* =====================================================
       FILTER POPULAR
    ===================================================== */

    const filteredPopularQuestions =
        useMemo(() => {

            if (
                selectedCategory === "All"
            ) {

                return popularQuestions;

            }


            return popularQuestions.filter(
                (item) =>
                    item.category ===
                    selectedCategory
            );

        }, [selectedCategory]);


    const handleDiseaseImage = async (e) => {

        const file = e.target.files?.[0];

        if (!file) return;

        console.log("Disease image selected:", file);

        // A new upload replaces the previous disease context.
        setIdentifiedDisease(null);

        // Close attachment popup
        setShowAttachMenu(false);

        // User message
        setMessages((prev) => [
            ...prev,
            {
                type: "user",
                text: `📷 ${file.name}`,
                time: new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit"
                })
            }
        ]);

        try {

            const formData = new FormData();

            formData.append("image", file);

            // Your existing prediction API
            const response = await axios.post(
                `${API_BASE_URL}/api/predict/`,
                formData
            );

            console.log(
                "Disease prediction:",
                response.data
            );

            const prediction =
                response.data?.predictions?.[0];

            if (!prediction) {

                setMessages((prev) => [
                    ...prev,
                    {
                        type: "ai",
                        text: "Sorry, disease could not be identified.",
                        time: new Date().toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit"
                        })
                    }
                ]);

                return;
            }

            const diseaseName =
                prediction.disease ||
                prediction.class_name ||
                prediction.label ||
                prediction.name ||
                "Unknown Disease";

            // Keep the identified disease available for follow-up
            // questions such as: "disease control" or "prevention".
            setIdentifiedDisease({
                ...prediction,
                disease: diseaseName
            });

            const confidence =
                prediction.confidence ||
                prediction.probability ||
                "";

            const aiAnswer =
                `🦠 Disease Identified\n\n` +
                `🌱 Disease: ${diseaseName}\n` +
                (confidence
                    ? `🎯 Confidence: ${confidence}\n\n`
                    : "\n") +
                `You can now ask me about disease control, prevention, fertilizers and dosage.`;

            setMessages((prev) => [
                ...prev,
                {
                    type: "ai",
                    text: aiAnswer,
                    time: new Date().toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit"
                    })
                }
            ]);

        } catch (error) {

            console.error(
                "Disease image error:",
                error
            );

            setMessages((prev) => [
                ...prev,
                {
                    type: "ai",
                    text: "Unable to identify the disease. Please try another clear plant image.",
                    time: new Date().toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit"
                    })
                }
            ]);

        } finally {

            e.target.value = "";

        }
    };


    const startFertilizerCalculator = () => {

        setShowAttachMenu(false);

        setFertilizerMode(true);

        setFertilizerStep("quantity");

        setQuantityPerAcre(null);

        setQuantityUnit(null);

        setAcreQuantity(null);

        setMessages((prev) => [

            ...prev,

            {
                type: "ai",
                text:
                    `💊 ${t.claculator}\n\n` +
                    `${t.calculatorp}\n\n` +
                    `${t.example}`,
                time: new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit"
                })
            }

        ]);

    };

    const parseQuantity = (text) => {

        const value = text
            .toLowerCase()
            .replace(/,/g, "")
            .trim();

        const match = value.match(
            /(\d+(?:\.\d+)?)\s*(kg|kgs|kilogram|kilograms|g|gm|gms|gram|grams|ml|milliliter|milliliters|l|liter|liters)?/i
        );

        if (!match) {
            return null;
        }

        let amount = Number(match[1]);

        let unit = (match[2] || "")
            .toLowerCase();

        // Convert kg → grams
        if (
            ["kg", "kgs", "kilogram", "kilograms"].includes(unit)
        ) {

            amount = amount * 1000;

            unit = "g";

        }

        // Convert litres → ml
        if (
            ["l", "liter", "liters"].includes(unit)
        ) {

            amount = amount * 1000;

            unit = "ml";

        }

        if (
            ["g", "gm", "gms", "gram", "grams"].includes(unit)
        ) {

            unit = "g";

        }

        if (
            ["ml", "milliliter", "milliliters"].includes(unit)
        ) {

            unit = "ml";

        }

        return {
            amount,
            unit
        };

    };

    const parseAcres = (text) => {

        const value = text
            .toLowerCase()
            .replace(/,/g, "")
            .trim();

        const match = value.match(
            /(\d+(?:\.\d+)?)/
        );

        if (!match) {
            return null;
        }

        return Number(match[1]);

    };


    const handleFertilizerInput = async (userText) => {

        const text = userText.trim();

        if (!text) return;


        // --------------------------------
        // STEP 1
        // Quantity per acre
        // --------------------------------

        if (fertilizerStep === "quantity") {

            const quantity =
                parseQuantity(text);

            if (!quantity) {

                setMessages((prev) => [

                    ...prev,

                    {
                        type: "ai",
                        text:
                            `${t.alertcalc}\n\n` +
                            "Example:\n" +
                            "• 120 g\n" +
                            "• 120 ml\n" +
                            "• 500 grams\n" +
                            "• 250 ml",
                        time: new Date().toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit"
                        })
                    }

                ]);

                return;

            }


            setQuantityPerAcre(quantity.amount);

            setQuantityUnit(quantity.unit);

            setFertilizerStep("acres");


            setMessages((prev) => [

                ...prev,

                {
                    type: "ai",
                    text:
                        `✅ ${quantity.amount} ${quantity.unit} ${t.arerecorded}\n\n` +
                        `${t.enteracre}\n\n` +
                        `${t.exampleacre}`,
                    time: new Date().toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit"
                    })
                }

            ]);

            return;

        }


        // --------------------------------
        // STEP 2
        // Acres
        // --------------------------------

        if (fertilizerStep === "acres") {

            const acres =
                parseAcres(text);

            if (!acres || acres <= 0) {

                setMessages((prev) => [

                    ...prev,

                    {
                        type: "ai",
                        text:
                            "Please enter a valid number of acres.\n\n" +
                            "Example: 2 acres",
                        time: new Date().toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit"
                        })
                    }

                ]);

                return;

            }


            setAcreQuantity(acres);


            const total =
                quantityPerAcre * acres;


            setFertilizerStep(null);

            setFertilizerMode(false);


            setMessages((prev) => [

                ...prev,

                {
                    type: "ai",
                    text:
                        `🧮 ${t.fertiliyresult}\n\n` +

                        `🌱 ${t.Quantityperacre}: ${quantityPerAcre} ${quantityUnit}\n` +

                        `🌾 ${t.Totalacres}: ${acres}\n\n` +

                        `✅ ${t.Totalquantityrequired}: ${total} ${quantityUnit}\n\n` +

                        `Formula:\n` +

                        `${quantityPerAcre} ${quantityUnit} × ${acres} acres = ${total} ${quantityUnit}`,
                    time: new Date().toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit"
                    })
                }

            ]);

            return;

        }

    };


    /* =====================================================
       JSX
    ===================================================== */

    return (

        <div className="ai-chat-page">


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="ai-chat-header">

                <div className="ai-header-left">

                    <div className="ai-header-icon">
                        <FaRobot />
                    </div>

                    <div>

                        <h1>
                            AI Chat
                        </h1>

                        <p>
                            {t.aichatp}
                        </p>

                    </div>

                </div>


                <div className="ai-header-banner">

                    <span>
                        Your Farming
                    </span>

                    <strong>
                        Friend, Always Here
                    </strong>

                </div>


                <div className="ai-header-plant">
                    🌱
                </div>

            </div>


            {/* =================================================
                MAIN LAYOUT
            ================================================= */}

            <div className="ai-chat-layout">


                {/* =================================================
                    LEFT / MAIN
                ================================================= */}

                <main className="ai-main-content">


                    {/* INTRO */}

                    <section className="ai-intro-section">

                        <div className="ai-intro-card">

                            <div className="big-robot">
                                <FaRobot />
                            </div>


                            <div className="intro-content">

                                <h3>
                                    {t.Hello}! 👋
                                </h3>

                                <p>
                                    {t.Im}{" "}
                                    <strong>
                                        {t.rythumitraai}
                                    </strong>
                                    ,{t.yourfarmingassistant}.
                                </p>

                                <p>
                                    {t.aichatp2}
                                </p>

                            </div>

                        </div>


                        <div className="better-question-box">

                            <FaLeaf />

                            <div>

                                <strong>
                                    “{t.BetterQuestions},
                                </strong>

                                <strong>
                                    {t.aichatp3}!”
                                </strong>

                            </div>

                        </div>

                    </section>


                    {/* =================================================
                        FILTER
                    ================================================= */}

                    <div className="question-filter-wrapper">

                        <div className="filter-title">

                            <FaSearch />

                            <span>
                                {t.filterq}
                            </span>

                        </div>


                        <div className="question-filters">

                            {categories.map(
                                (category) => (

                                    <button
                                        key={category}
                                        className={
                                            selectedCategory === category
                                                ? "active-filter"
                                                : ""
                                        }
                                        onClick={() =>
                                            setSelectedCategory(
                                                category
                                            )
                                        }
                                    >

                                        {category}

                                    </button>

                                )
                            )}

                        </div>

                    </div>


                    {/* =================================================
                        TRY ASKING
                    ================================================= */}

                    <section className="question-section">

                        <h3>
                            {t.asksomething}:
                        </h3>


                        <div className="suggested-grid">

                            {filteredSuggestedQuestions.length > 0 ? (

                                filteredSuggestedQuestions.map(
                                    (item, index) => (

                                        <button
                                            key={index}
                                            className="suggested-question"
                                            onClick={() =>
                                                handleSuggestedQuestion(
                                                    item.question,
                                                    item.category
                                                )
                                            }
                                        >

                                            <span className="suggested-icon">

                                                {item.icon}

                                            </span>


                                            <span className="suggested-text">

                                                {item.question}

                                            </span>


                                            <FaChevronRight className="question-arrow" />

                                        </button>

                                    )
                                )

                            ) : (

                                <div className="no-question">

                                    No questions available for this category.

                                </div>

                            )}

                        </div>

                    </section>


                    {/* =================================================
                        CHAT MESSAGES
                    ================================================= */}

                    {messages.length > 0 && (

                        <section className="chat-messages">

                            {messages.map(
                                (message, index) => (

                                    <div
                                        key={message.id || `${message.type || "message"}-${index}`}
                                        className={
                                            message.type === "user"
                                                ? "chat-row user-row"
                                                : "chat-row ai-row"
                                        }
                                    >


                                        {/* AI ICON */}

                                        {message.type === "ai" && (

                                            <div className="chat-avatar ai-avatar">

                                                <FaRobot />

                                            </div>

                                        )}


                                        <div
                                            className={
                                                message.type === "user"
                                                    ? "chat-bubble user-bubble"
                                                    : "chat-bubble ai-bubble"
                                            }
                                        >

                                            <div className="chat-label">

                                                {message.type === "user"
                                                    ? t.you
                                                    : t.RythuMitraAI}

                                            </div>


                                            <p>
                                                {renderMessageText(message.text)}
                                            </p>


                                            <span className="chat-time">

                                                {message.time}

                                            </span>

                                        </div>

                                    </div>

                                )
                            )}


                            {/* THINKING */}

                            {isThinking && (

                                <div className="chat-row ai-row">

                                    <div className="chat-avatar ai-avatar">

                                        <FaRobot />

                                    </div>


                                    <div className="chat-bubble ai-bubble">

                                        <div className="chat-label">

                                            {t.RythuMitraAI}

                                        </div>


                                        <div className="typing">

                                            <span></span>
                                            <span></span>
                                            <span></span>

                                        </div>

                                    </div>

                                </div>

                            )}

                        </section>

                    )}


                    {/* =================================================
                        INPUT
                    ================================================= */}

                    <div className="chat-input-section">

                        <div className="chat-input-box">


                            <button
                                className="attachment-btn"
                                type="button"

                                onClick={() =>
                                    setShowAttachMenu((prev) => !prev)
                                }
                            >

                                <FaPaperclip />

                            </button>

                            <input
                                type="file"
                                accept="image/*"
                                capture="environment"
                                id="cameraInput"
                                style={{ display: "none" }}
                                onChange={handleDiseaseImage}
                            />

                            <input
                                type="file"
                                accept="image/*"
                                id="galleryInput"
                                style={{ display: "none" }}
                                onChange={handleDiseaseImage}
                            />

                            {showAttachMenu && (

                                <div className="attachment-menu" style={{background: "rgba(255, 255, 255, 0.10)"}}>

                                    <button
                                        type="button"
                                        className="attachment-option"
                                        onClick={() => {
                                            setShowAttachMenu(false);
                                            document
                                                .getElementById("galleryInput")
                                                ?.click();
                                        }}
                                    >

                                        <span className="attachment-option-icon image-icon">
                                            <FaImage />
                                        </span>

                                        <span>
                                            <strong>{t.uploadplnimg}</strong>
                                            <small>
                                                {t.selectimg5}
                                            </small>
                                        </span>

                                    </button>


                                    <button
                                        type="button"
                                        className="attachment-option"
                                        onClick={() => {
                                            setShowAttachMenu(false);
                                            document
                                                .getElementById("cameraInput")
                                                ?.click();
                                        }}
                                    >

                                        <span className="attachment-option-icon camera-icon">
                                            <FaCamera />
                                        </span>

                                        <span>
                                            <strong>{t.takephoto}</strong>
                                            <small>
                                                {t.camerap}
                                            </small>
                                        </span>

                                    </button>


                                    <button
                                        type="button"
                                        className="attachment-option"
                                        onClick={startFertilizerCalculator}
                                    >

                                        <span className="attachment-option-icon calculator-icon">
                                            <FaCalculator />
                                        </span>

                                        <span>
                                            <strong>{t.calculator1}</strong>
                                            <small>
                                                {t.cacl3}
                                            </small>
                                        </span>

                                    </button>

                                </div>

                            )}


                            <input
                                type="text"
                                className="ai-chat-search-input"
                                placeholder= {t.placeholder}
                                value={input}
                                onChange={(event) =>
                                    setInput(
                                        event.target.value
                                    )
                                }
                                onKeyDown={handleKeyDown}
                            />


                            <button
                                type="button"
                                className={
                                    isListening
                                        ? "mic-btn listening"
                                        : "mic-btn"
                                }
                                onClick={
                                    startVoiceInput
                                }
                                title="Voice Input"
                            >

                                <FaMicrophone />

                            </button>

                            <button
                            type="button"
                            className="send-chat-btn"
                            onClick={() =>
                                askAI()
                            }
                            disabled={
                                !input.trim() ||
                                isThinking
                            }
                        >

                            <FaPaperPlane />

                        </button>

                        </div>


                        

                    </div>


                    <div className="input-note">

                        {t.engtel}
                        &nbsp; | &nbsp;
                        {t.pai}.

                    </div>

                </main>


                {/* =================================================
                    RIGHT SIDEBAR
                ================================================= */}

                <aside className="ai-sidebar">


                    {/* =================================================
                        QUICK ACTIONS
                    ================================================= */}

                    <section className="side-card">

                        <div className="side-card-title">

                            <span>
                                <FaClock />
                            </span>

                            {t.QuickActions}

                        </div>


                        <div className="quick-actions-grid">


                            <button
                                onClick={() =>
                                    setInput(
                                        "Upload a plant image for disease detection"
                                    )
                                }
                            >

                                <FaUpload />

                                <strong>
                                    {t.uploadplnimg}
                                </strong>

                                <small>
                                    {t.Detectdiseaseinstantly}
                                </small>

                            </button>


                            <button
                                onClick={
                                    startVoiceInput
                                }
                            >

                                <FaMicrophone />

                                <strong>
                                    {t.VoiceInput}
                                </strong>

                                <small>
                                    {t.Speakandask}
                                </small>

                            </button>


                            <button
                                onClick={() =>
                                    setSelectedCategory(
                                        "Crop"
                                    )
                                }
                            >

                                <FaFileAlt />

                                <strong>
                                    {t.askcrop}
                                </strong>

                                <small>
                                    {t.Getguidance}
                                </small>

                            </button>


                            <button
                                onClick={() =>
                                    setSelectedCategory(
                                        "Weather"
                                    )
                                }
                            >

                                <FaCloudSun />

                                <strong>
                                    {t.CheckWeather}
                                </strong>

                                <small>
                                    {t.getupdates}
                                </small>

                            </button>

                        </div>

                    </section>


                    {/* =================================================
                        POPULAR QUESTIONS
                    ================================================= */}

                    <section className="side-card">

                        <div className="side-card-heading">

                            <span>
                                💡 {t.PopularQuestions}
                            </span>


                            <button
                                onClick={() =>
                                    setSelectedCategory(
                                        "All"
                                    )
                                }
                            >

                                {t.viewall} →

                            </button>

                        </div>


                        <div className="popular-list">

                            {filteredPopularQuestions.map(
                                (item, index) => (

                                    <button
                                        key={index}
                                        className="popular-item"
                                        onClick={() =>
                                            handleSuggestedQuestion(
                                                item.question,
                                                item.category
                                            )
                                        }
                                    >

                                        <span className="popular-arrow">
                                            ›
                                        </span>


                                        <span>
                                            {item.question}
                                        </span>


                                        <FaChevronRight />

                                    </button>

                                )
                            )}

                        </div>

                    </section>


                    {/* =================================================
                        RECENT CHATS
                    ================================================= */}

                    <section className="side-card recent-card">

                        <div className="side-card-heading">

                            <span>

                                <FaClock />

                                {t.RecentChats}
                            </span>


                            <button
                                onClick={() =>
                                    setShowAllChats(
                                        true
                                    )
                                }
                            >

                               {t.viewall} →

                            </button>

                        </div>


                        <div className="recent-list">

                            {recentChats
                                .slice(0, 5)
                                .map(
                                    (chat) => (

                                        <button
                                            key={chat.id}
                                            className="recent-chat-item"
                                            onClick={() =>
                                                setInput(
                                                    chat.question
                                                )
                                            }
                                        >

                                            <span className="recent-chat-icon">
                                                💬
                                            </span>


                                            <span className="recent-question">

                                                {chat.question}

                                            </span>


                                            <span className="recent-time">

                                                {chat.time}

                                            </span>

                                        </button>

                                    )
                                )}

                        </div>

                    </section>

                </aside>

            </div>


            {/* =================================================
                ALL CHATS MODAL
            ================================================= */}

            {showAllChats && (

                <div className="all-chats-overlay">

                    <div className="all-chats-modal">


                        <div className="all-chats-header">

                            <div>

                                <h2>
                                    {t.PreviousChats}
                                </h2>

                                <p>
                                    {t.previousp}
                                </p>

                            </div>


                            <button
                                onClick={() =>
                                    setShowAllChats(
                                        false
                                    )
                                }
                            >

                                <FaTimes />

                            </button>

                        </div>


                        <div className="all-chats-list">

                            {recentChats.length === 0 ? (

                                <div className="empty-chats">

                                    No previous chats available.

                                </div>

                            ) : (

                                recentChats.map(
                                    (chat) => (

                                        <button
                                            key={chat.id}
                                            className="all-chat-box"
                                            onClick={() => {

                                                setInput(
                                                    chat.question
                                                );

                                                setShowAllChats(
                                                    false
                                                );

                                            }}
                                        >

                                            <div className="all-chat-icon">

                                                <FaRobot />

                                            </div>


                                            <div className="all-chat-content">

                                                <strong>

                                                    {chat.question}

                                                </strong>


                                                <span>

                                                    {chat.time}

                                                </span>

                                            </div>


                                            <FaChevronRight />

                                        </button>

                                    )
                                )

                            )}

                        </div>

                    </div>

                </div>

            )}

            <footer className="disease-footer">
            
                            <div className="footer-brand">
            
                                <h2>
                                    <FaLeaf />
                                    {t.rythumitraai}
                                </h2>
            
                                <p>
                                    {t.aitech}
                                </p>
            
                            </div>
            
                            <div className="footer-links">
            
                                <h3>{t.links}</h3>
            
                                <span>{t.dashboard}</span>
                                <span>{t.aiassistant}</span>
                                <span>{t.diseasedetection}</span>
            
                            </div>
            
                            <div className="footer-links">
            
                                <h3>{t.farmersupport}</h3>
            
                                <span>{t.smartFarming}</span>
                                <span>{t.cropmonitoring}</span>
                                <span>{t.aiassistant}</span>
            
                            </div>
            
                            <div className="footer-bottom">
                              <img src="/Images/rm_btm_logo.png" className="bottom-logo" alt="" />  © 2026 {t.rythumitraai}. {t.rights}.
                                <br /> {t.authors}
                            </div>
                            
            
                        </footer>
            

        </div>

    );

}


export default AIChat;