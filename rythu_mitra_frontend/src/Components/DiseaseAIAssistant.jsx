import React from "react";
import {
    FaRobot,
    FaCircle,
    FaArrowRight
} from "react-icons/fa";

import { useLanguage } from "../context/LanguageContext";
import { diseaseData } from "../data/diseaseData";


function DiseaseAIAssistant({ prediction, onAskAI }) {

    const { language } = useLanguage();

    if (!prediction) return null;

    const info = diseaseData[prediction.disease];

    const diseaseName = info
        ? info.name[language]
        : prediction.disease.replace(/_/g, " ");


    const questions = language === "te"
        ? [
            `${diseaseName} ఎందుకు వచ్చింది?`,
            `${diseaseName} ను ఎలా నియంత్రించాలి?`,
            `ఈ వ్యాధి ఇతర మొక్కలకు వ్యాపిస్తుందా?`,
            `పంటను ఎలా రక్షించాలి?`
        ]
        : [
            `Why did ${diseaseName} occur?`,
            `How can I control ${diseaseName}?`,
            `Can this disease spread to other plants?`,
            `How can I protect my crop?`
        ];


    const intro = language === "te"
        ? `${diseaseName} గురించి మీకు ఏమైనా ప్రశ్నలు ఉన్నాయా? నేను సహాయం చేస్తాను.`
        : `I can help you understand ${diseaseName} and how to manage it.`;


    return (
        <div className="disease-ai-card">

            {/* Header */}

            <div className="disease-ai-header">

                <div className="disease-ai-avatar">
                    <FaRobot />
                </div>

                <div>

                    <h3>
                        AI Assistant
                    </h3>

                    <span>
                        <FaCircle />
                        Online
                    </span>

                </div>

            </div>


            {/* Disease */}

            <div className="ai-disease-label">

                <strong>
                    {diseaseName}
                </strong>

            </div>


            {/* Message */}

            <div className="disease-ai-message">

                {intro}

            </div>


            {/* Questions */}

            <div className="ai-question-list">

                {questions.map((question, index) => (

                    <button
                        key={index}
                        onClick={() =>
                            onAskAI?.(question)
                        }
                    >

                        <FaArrowRight />

                        <span>
                            {question}
                        </span>

                    </button>

                ))}

            </div>


            <button
                className="ask-ai-now"
                onClick={() =>
                    onAskAI?.(
                        language === "te"
                            ? `${diseaseName} గురించి వివరంగా చెప్పండి`
                            : `Tell me more about ${diseaseName}`
                    )
                }
            >
                <FaRobot />

                {language === "te"
                    ? "ఇప్పుడే AI ని అడగండి"
                    : "Ask AI Now"}
            </button>

        </div>
    );
}

export default DiseaseAIAssistant;