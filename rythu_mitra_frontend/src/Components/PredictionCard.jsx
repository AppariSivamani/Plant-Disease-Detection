import React from "react";
import {
    FaCheckCircle,
    FaChartLine,
    FaLeaf
} from "react-icons/fa";

import { useLanguage } from "../context/LanguageContext";
import { diseaseData } from "../data/diseaseData";

function PredictionCard({ prediction }) {

    if (!prediction) return null;

    const { t, language } = useLanguage();

    const info = diseaseData[prediction.disease];

    const diseaseName = info
        ? info.name[language]
        : prediction.disease.replace(/_/g, " ");

    return (

        <div className="prediction-card">

            <div className="prediction-header">

                <FaLeaf className="leaf-icon" />

                <h2>{t.predRes}</h2>

            </div>

            <div className="prediction-body">

                <h1 className="disease-name">

                    {diseaseName}

                </h1>

                <div className="confidence-box">

                    <FaChartLine />

                    <span>

                        Confidence : {prediction.confidence.toFixed(2)}%

                    </span>

                </div>

                <div className="progress">

                    <div
                        className="progress-bar"
                        role="progressbar"
                        style={{
                            width: `${prediction.confidence}%`,
                            backgroundColor:
                                prediction.confidence > 80
                                    ? "#dc2626"
                                    : prediction.confidence >= 70
                                        ? "#f97316"
                                        : "#eab308",

                        }}
                    >
                        {prediction.confidence.toFixed(1)}%
                    </div>

                </div>

                <div className="success-msg">

                    <FaCheckCircle />

                    <span>

                        {t.aiAnalyse}

                    </span>

                </div>

            </div>

        </div>

    );

}

export default PredictionCard;