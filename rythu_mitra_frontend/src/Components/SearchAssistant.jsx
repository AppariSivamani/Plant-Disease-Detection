import React, { useState } from "react";
import axios from "axios";
import { Typewriter } from 'react-simple-typewriter'

import {
    FaSearch,
    FaMicrophone,
    FaStop,
} from "react-icons/fa";

import { VscChatSparkle } from "react-icons/vsc";

import { useLanguage } from "../context/LanguageContext";


function SearchAssistant() {

    const { language } = useLanguage();

    const [question, setQuestion] = useState("");
    const [listening, setListening] = useState(false);

    const [answer, setAnswer] = useState(null);
    const [searching, setSearching] = useState(false);


    // ==========================================
    // VOICE SEARCH
    // ==========================================

    const startVoice = () => {

        const SpeechRecognition =
            window.SpeechRecognition ||
            window.webkitSpeechRecognition;

        if (!SpeechRecognition) {

            alert(
                language === "te"
                    ? "ఈ బ్రౌజర్‌లో వాయిస్ గుర్తింపు అందుబాటులో లేదు."
                    : "Voice recognition is not supported in this browser."
            );

            return;
        }


        const recognition =
            new SpeechRecognition();


        recognition.lang =
            language === "te"
                ? "te-IN"
                : "en-IN";


        recognition.continuous = false;

        recognition.interimResults = false;


        recognition.onstart = () => {

            setListening(true);

        };


        recognition.onresult = (event) => {

            const text =
                event.results[0][0].transcript;

            console.log("Voice Text:", text);

            setQuestion(text);

        };


        recognition.onerror = (event) => {

            console.error(
                "Speech Error:",
                event
            );

            setListening(false);

        };


        recognition.onend = () => {

            setListening(false);

        };


        recognition.start();

    };


    // ==========================================
    // SEARCH
    // ==========================================

    const handleSearch = async () => {

        if (!question.trim()) {

            alert(
                language === "te"
                    ? "దయచేసి మీ ప్రశ్నను నమోదు చేయండి."
                    : "Please enter your question."
            );

            return;
        }


        try {

            setSearching(true);

            setAnswer(null);


            const response = await axios.post(

                "https://plant-disease-detection-1-xjj3.onrender.com/api/assistant/",

                {
                    question: question.trim(),

                    language: language,
                }

            );





            if (response.data.success) {

                setAnswer(response.data);

            } else {

                setAnswer({
                    notFound: true,

                    message:
                        response.data.error ||
                        (
                            language === "te"
                                ? "సమాచారం అందుబాటులో లేదు."
                                : "Information not available."
                        ),
                });

            }


        } catch (error) {

            console.error(
                "Assistant Error:",
                error
            );


            setAnswer({

                notFound: true,

                message:
                    language === "te"
                        ? "సర్వర్‌తో కనెక్ట్ అవ్వడంలో సమస్య వచ్చింది."
                        : "Unable to connect to the server.",

            });


        } finally {

            setSearching(false);

        }

    };

    const getText = (value) => {
    if (!value) return "";

    if (typeof value === "string") {
        return value;
    }

    return value[language] || value.en || "";
};


    return (

        <section className="search-assistant">


            {/* ==================================
                HEADER
            ================================== */}

            <div className="search-assistant-header">

                <span className="ai-badge">
                    🌱 AI
                </span>


                <h2>

                    {language === "te"
                        ? "రైతు మిత్రను ఏదైనా అడగండి"
                        : "Ask Rythu Mitra Anything"}

                </h2>


                <p>

                    {language === "te"
                        ? "మీ పంటలు, వ్యాధులు, ఎరువులు మరియు పురుగుల గురించి అడగండి"
                        : "Ask about crops, diseases, fertilizers and pests"}

                </p>

            </div>


            {/* ==================================
                SEARCH BOX
            ================================== */}

            <div className="search-box1">


                <VscChatSparkle  className="search-icon" />


                <input

                    type="text" id="crop-question"
                    name="crop-question"

                    value={question}

                    onChange={(e) =>
                        setQuestion(e.target.value)
                    }

                    placeholder={
                        language === "te"
                            ? "మీ పంట గురించి అడగండి..."
                            : "Ask about your crop . . ."
                    }

                    onKeyDown={(e) => {

                        if (e.key === "Enter") {

                            handleSearch();

                        }

                    }}

                />


                {/* MIC */}

                <button

                    type="button"

                    className={
                        `mic-btn ${listening
                            ? "listening"
                            : ""
                        }`
                    }

                    onClick={startVoice}

                >

                    {listening
                        ? <FaStop />
                        : <FaMicrophone />
                    }

                </button>


                {/* ASK */}

                <button

                    type="button"

                    className="ask-btn"

                    onClick={handleSearch}

                    disabled={searching}

                >

                    {searching

                        ? (
                            language === "te"
                                ? "వెతుకుతోంది..."
                                : "Searching..."
                        )

                        : (
                            language === "te"
                                ? "అడగండి"
                                : "Ask"
                        )

                    }

                </button>


            </div>


            {/* ==================================
                QUICK QUESTIONS
            ================================== */}

            <div className="quick-questions">


                <span>

                    {language === "te"
                        ? "ఉదాహరణలు:"
                        : "Try asking:"}

                </span>


                <button

                    onClick={() =>
                        setQuestion(

                            language === "te"

                                ? "వరిలో ఆకు మాడి తెగులు వస్తే ఏం చేయాలి?"

                                : "What should I do for leaf blast in rice?"

                        )
                    }

                >

                    🌾 {
                        language === "te"
                            ? "వరి వ్యాధులు"
                            : "Rice diseases"
                    }

                </button>


                <button

                    onClick={() =>
                        setQuestion(

                            language === "te"

                                ? "ఎకరానికి ఎంత ఎరువు వేయాలి?"

                                : "How much fertilizer per acre?"

                        )
                    }

                >

                    🧪 {
                        language === "te"
                            ? "ఎరువులు"
                            : "Fertilizers"
                    }

                </button>


                <button

                    onClick={() =>
                        setQuestion(

                            language === "te"

                                ? "వరిలో పురుగులు వస్తే ఏం చేయాలి?"

                                : "What should I do for Leaf Folder?"

                        )
                    }

                >

                    🐛 {
                        language === "te"
                            ? "పురుగులు"
                            : "Pests"
                    }

                </button>


            </div>


            {/* ==================================
                LOADING
            ================================== */}

            {searching && (

                <div className="assistant-loading">

                    🌱

                    <span>

                        {language === "te"
                            ? "సమాధానం వెతుకుతోంది..."
                            : "Finding the best answer..."}

                    </span>

                </div>

            )}


            {/* ==================================
                ANSWER
            ================================== */}

            {answer &&
                answer.type === "disease" &&
                answer.found === true &&
                answer.data && (

                    <div className="assistant-answer">


                        <div className="answer-header">

                            <span className="answer-icon">
                                🌿
                            </span>


                            <div>

                                <small>

                                    {language === "te"
                                        ? "వ్యాధి సమాచారం"
                                        : "Disease Information"}

                                </small>


                                <h2>

                                    {answer.data.name?.[language] || answer.data.name?.en}

                                </h2>

                            </div>

                        </div>


                        <div className="answer-grid">


                            {/* SYMPTOMS */}

                            <div className="answer-card">

                                <h3>

                                    🔴 {
                                        language === "te"
                                            ? "లక్షణాలు"
                                            : "Symptoms"
                                    }

                                </h3>


                                <p>

                                    {answer.data.symptoms}

                                </p>

                            </div>


                            {/* CAUSES */}

                            <div className="answer-card">

                                <h3>

                                    🦠 {
                                        language === "te"
                                            ? "కారణాలు"
                                            : "Causes"
                                    }

                                </h3>


                                <p>

                                    {answer.data.causes}

                                </p>

                            </div>


                            {/* PREVENTION */}

                            <div className="answer-card">

                                <h3>

                                    🛡️ {
                                        language === "te"
                                            ? "నివారణ"
                                            : "Prevention"
                                    }

                                </h3>


                                <p>

                                    {answer.data.prevention}

                                </p>

                            </div>



                            {/* CHEMICAL */}

                            <div className="answer-card chemical-answer">

                                <h3>
                                    🧪 {
                                        language === "te"
                                            ? "రసాయన చికిత్స"
                                            : "Chemical Treatment"
                                    }
                                </h3>


                                <h4>
                                    1️⃣ {
                                        language === "te"
                                            ? "మొదటి ప్రయోగం"
                                            : "First Application"
                                    }
                                </h4>


                                <p>
                                    <strong>
                                        {language === "te" ? "ఉత్పత్తి:" : "Product:"}
                                    </strong>{" "}

                                    {
                                        answer.data.chemicalTreatment
                                            .firstApplication.product
                                    }
                                </p>


                                <p>
                                    <strong>
                                        {language === "te" ? "మోతాదు:" : "Dosage:"}
                                    </strong>{" "}

                                    {
                                        answer.data.chemicalTreatment
                                            .firstApplication.dosage
                                    }
                                </p>


                                <p>
                                    <strong>
                                        {language === "te"
                                            ? "ఎకరానికి మోతాదు:"
                                            : "Dosage Per Acre:"}
                                    </strong>{" "}

                                    {
                                        answer.data.chemicalTreatment
                                            .firstApplication.dosagePerAcre
                                    }
                                </p>


                                <p>
                                    <strong>
                                        {language === "te" ? "సమయం:" : "Timing:"}
                                    </strong>{" "}

                                    {
                                        answer.data.chemicalTreatment
                                            .firstApplication.timing
                                    }
                                </p>


                                <hr />


                                <h4>
                                    2️⃣ {
                                        language === "te"
                                            ? "తదుపరి ప్రయోగం"
                                            : "Follow-up Application"
                                    }
                                </h4>


                                <p>
                                    <strong>
                                        {language === "te" ? "ఉత్పత్తి:" : "Product:"}
                                    </strong>{" "}

                                    {
                                        answer.data.chemicalTreatment
                                            .followUpApplication.product
                                    }
                                </p>


                                <p>
                                    <strong>
                                        {language === "te" ? "మోతాదు:" : "Dosage:"}
                                    </strong>{" "}

                                    {
                                        answer.data.chemicalTreatment
                                            .followUpApplication.dosage
                                    }
                                </p>


                                <p>
                                    <strong>
                                        {language === "te"
                                            ? "ఎకరానికి మోతాదు:"
                                            : "Dosage Per Acre:"}
                                    </strong>{" "}

                                    {
                                        answer.data.chemicalTreatment
                                            .followUpApplication.dosagePerAcre
                                    }
                                </p>


                                <p>
                                    <strong>
                                        {language === "te" ? "సమయం:" : "Timing:"}
                                    </strong>{" "}

                                    {
                                        answer.data.chemicalTreatment
                                            .followUpApplication.timing
                                    }
                                </p>

                            </div>


                            {/* NATURAL */}

                            <div className="answer-card natural-answer">

                                <h3>
                                    🌱 {
                                        language === "te"
                                            ? "సహజ / సేంద్రియ చికిత్స"
                                            : "Natural / Organic Treatment"
                                    }
                                </h3>


                                <h4>
                                    1️⃣ {
                                        language === "te"
                                            ? "మొదటి ప్రయోగం"
                                            : "First Application"
                                    }
                                </h4>


                                <p>
                                    <strong>
                                        {language === "te" ? "ఉత్పత్తి:" : "Product:"}
                                    </strong>{" "}

                                    {
                                        answer.data.naturalTreatment
                                            .firstApplication.product
                                    }
                                </p>


                                <p>
                                    <strong>
                                        {language === "te" ? "మోతాదు:" : "Dosage:"}
                                    </strong>{" "}

                                    {
                                        answer.data.naturalTreatment
                                            .firstApplication.dosage
                                    }
                                </p>


                                <p>
                                    <strong>
                                        {language === "te"
                                            ? "ఎకరానికి మోతాదు:"
                                            : "Dosage Per Acre:"}
                                    </strong>{" "}

                                    {
                                        answer.data.naturalTreatment
                                            .firstApplication.dosagePerAcre
                                    }
                                </p>


                                <p>
                                    <strong>
                                        {language === "te" ? "సమయం:" : "Timing:"}
                                    </strong>{" "}

                                    {
                                        answer.data.naturalTreatment
                                            .firstApplication.timing
                                    }
                                </p>


                                <hr />


                                <h4>
                                    2️⃣ {
                                        language === "te"
                                            ? "తదుపరి ప్రయోగం"
                                            : "Follow-up Application"
                                    }
                                </h4>


                                <p>
                                    <strong>
                                        {language === "te" ? "ఉత్పత్తి:" : "Product:"}
                                    </strong>{" "}

                                    {
                                        answer.data.naturalTreatment
                                            .followUpApplication.product
                                    }
                                </p>


                                <p>
                                    <strong>
                                        {language === "te" ? "మోతాదు:" : "Dosage:"}
                                    </strong>{" "}

                                    {
                                        answer.data.naturalTreatment
                                            .followUpApplication.dosage
                                    }
                                </p>


                                <p>
                                    <strong>
                                        {language === "te"
                                            ? "ఎకరానికి మోతాదు:"
                                            : "Dosage Per Acre:"}
                                    </strong>{" "}

                                    {
                                        answer.data.naturalTreatment
                                            .followUpApplication.dosagePerAcre
                                    }
                                </p>


                                <p>
                                    <strong>
                                        {language === "te" ? "సమయం:" : "Timing:"}
                                    </strong>{" "}

                                    {
                                        answer.data.naturalTreatment
                                            .followUpApplication.timing
                                    }
                                </p>

                            </div>                        </div>

                    </div>

                )
            }

            {answer &&
                answer.type === "crop" &&
                answer.found === true &&
                answer.data && (

                    <div className="crop-answer">

                        {/* =========================================
            CROP HEADER
        ========================================= */}

                        <div className="answer-header" style={{ color: "black"}}>

                            <span className="answer-icon">
                                🌾
                            </span>

                            <div>

                                <small>
                                    {language === "te"
                                        ? "పంట సమాచారం"
                                        : "Crop Information"}
                                </small>

                                <h2>
                                    {answer.data.name?.[language] ||
                                        answer.data.name?.en}
                                </h2>

                            </div>

                        </div>


                        {/* =========================================
            BEFORE CULTIVATION
        ========================================= */}

                        {answer.data.before_cultivation &&
                            Object.keys(
                                answer.data.before_cultivation
                            ).length > 0 && (

                                <div className="crop-stage-card">

                                    <div className="stage-title">

                                        🌱

                                        <h3 style={{color: "black"}}>
                                            {language === "te"
                                                ? "సాగు ప్రారంభానికి ముందు:-"
                                                : "Before Cultivation:-"}
                                        </h3>

                                    </div>


                                    <div className="stage-items" style={{color: "white"}}>

                                        {Object.entries(
                                            answer.data.before_cultivation
                                        ).map(([key, item]) => (

                                            <div
                                                className="stage-item"
                                                key={key}
                                            >

                                                <span className="item-icon">
                                                    📌
                                                </span>

                                                <div>

                                                    <strong>
                                                        {item?.[language] || item?.en}
                                                    </strong>

                                                </div>

                                            </div>

                                        ))}

                                    </div>

                                </div>

                            )}

                            {answer.data.after_cultivation &&
                            Object.keys(
                                answer.data.after_cultivation
                            ).length > 0 && (

                                <div className="crop-stage-card">

                                    <div className="stage-title">

                                        🌱

                                        <h3 style={{color: "black"}}>
                                            {language === "te"
                                                ? "సాగు తర్వాత:-"
                                                : "After Cultivation:-"}
                                        </h3>

                                    </div>


                                    <div className="stage-items" style={{color: "white"}}>

                                        {Object.entries(
                                            answer.data.after_cultivation
                                        ).map(([key, item]) => (

                                            <div
                                                className="stage-item"
                                                key={key}
                                            >

                                                <span className="item-icon">
                                                    📌
                                                </span>

                                                <div>

                                                    <strong>
                                                        {item?.[language] || item?.en}
                                                    </strong>

                                                </div>

                                            </div>

                                        ))}

                                    </div>

                                </div>

                            )}




                        {/* =========================================
            FIRST STAGE
        ========================================= */}

                        {answer.data.first_stage &&
                            answer.data.first_stage.length > 0 && (

                                <div className="crop-stage-card">

                                    <div className="stage-title">

                                        <span className="stage-number">
                                            1
                                        </span>

                                        <h3>
                                            {language === "te"
                                                ? "మొదటి దశ:-"
                                                : "First Stage:-"}
                                        </h3>

                                    </div>


                                    <div className="stage-items">

                                        {answer.data.first_stage.map(
                                            (item, index) => (

                                                <div
                                                    className="stage-item"
                                                    key={index}
                                                >

                                                    <span className="item-icon">
                                                        💊
                                                    </span>


                                                    <div>

                                                        <strong className="red">
                                                            {item.product?.[language] || item.product?.en}
                                                        </strong>


                                                        <p>

                                                            <span>
                                                                💧
                                                            </span>

                                                            <span className="black">
                                                                {language === "te"
                                                                ? " మోతాదు: "
                                                                : " Dosage: "}
                                                            </span>

                                                            {item.dosage?.[language] || item.dosage?.en}

                                                        </p>

                                                    </div>

                                                </div>

                                            ))}

                                    </div>

                                </div>

                            )}


                        {/* =========================================
            SECOND STAGE
        ========================================= */}

                        {answer.data.second_stage &&
                            answer.data.second_stage.length > 0 && (

                                <div className="crop-stage-card">

                                    <div className="stage-title">

                                        <span className="stage-number">
                                            2
                                        </span>

                                        <h3>
                                            {language === "te"
                                                ? "రెండో దశ:-"
                                                : "Second Stage:-"}
                                        </h3>

                                    </div>


                                    <div className="stage-items">

                                        {answer.data.second_stage.map(
                                            (item, index) => (

                                                <div
                                                    className="stage-item"
                                                    key={index}
                                                >

                                                    <span className="item-icon">
                                                        💊
                                                    </span>


                                                    <div>

                                                        <strong className="red">
                                                            {item.product[language]}
                                                        </strong>


                                                        <p>

                                                            💧

                                                            <span className="black">
                                                                {language === "te"
                                                                ? " మోతాదు: "
                                                                : " Dosage: "}
                                                            </span>

                                                            {item.dosage[language]}

                                                        </p>

                                                    </div>

                                                </div>

                                            ))}

                                    </div>

                                </div>

                            )}


                        {/* =========================================
            THIRD STAGE
        ========================================= */}

                        {answer.data.third_stage &&
                            answer.data.third_stage.length > 0 && (

                                <div className="crop-stage-card">

                                    <div className="stage-title">

                                        <span className="stage-number">
                                            3
                                        </span>

                                        <h3>
                                            {language === "te"
                                                ? "మూడో దశ:-"
                                                : "Third Stage:-"}
                                        </h3>

                                    </div>


                                    <div className="stage-items">

                                        {answer.data.third_stage.map(
                                            (item, index) => (

                                                <div
                                                    className="stage-item"
                                                    key={index}
                                                >

                                                    <span className="item-icon">
                                                        💊
                                                    </span>


                                                    <div>

                                                        <strong className="red">
                                                            {item.product[language]}
                                                        </strong>


                                                        <p>

                                                            💧

                                                            <span className="black">
                                                                {language === "te"
                                                                ? " మోతాదు: "
                                                                : " Dosage: "}
                                                            </span>

                                                            {item.dosage[language]}

                                                        </p>

                                                    </div>

                                                </div>

                                            ))}

                                    </div>

                                </div>

                            )}


                        {/* =========================================
            BUDGET
        ========================================= */}

                        {answer.data.budget &&
                            answer.data.budget[language] && (

                                <div className="crop-budget" style={{color: "black"}}>

                                    💰

                                    <strong>

                                        {language === "te"
                                            ? " అంచనా బడ్జెట్: "
                                            : " Estimated Budget: "}

                                    </strong>

                                    <span style={{color: "white"}}>
                                        {answer.data.budget?.[language] ||
                                        answer.data.budget?.en}
                                    </span>

                                </div>

                            )}

                    </div>

                )}

            {/* ==================================
                NOT FOUND / ERROR
            ================================== */}

            {answer && answer.found === false && (

                <div className="assistant-not-found">

                    <div className="not-found-icon">
                        ⚠️
                    </div>

                    <div className="not-found-content">

                        <h3>
                            {language === "te"
                                ? "ప్రశ్నను అర్థం చేసుకోలేకపోయాము"
                                : "Question Not Understood"}
                        </h3>

                        <p>
                            {answer.message}
                        </p>

                    </div>

                </div>

            )}


        </section>

    );

}


export default SearchAssistant;