import React from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    FaArrowLeft,
    FaLeaf,
    FaExclamationTriangle,
    FaVirus,
    FaShieldAlt,
    FaFlask,
    FaSeedling,
    FaClock,
} from "react-icons/fa";

import { diseaseData } from "../data/diseaseData";

import { useLanguage } from "../context/LanguageContext";

function DiseaseInfo() {

    const { disease } = useParams();
    const navigate = useNavigate();

    const info = diseaseData[disease];

    const { t } = useLanguage();

    const { language, toggleLanguage } = useLanguage();

    // If disease is not found
    if (!info) {

        return (
            <div className="disease-info-page">

                <div className="not-found-card">

                    <FaExclamationTriangle />

                    <h2>Disease Information Not Available</h2>

                    <p>
                        We don't have information for this disease yet.
                    </p>

                    <button onClick={() => navigate(-1)}>
                        ← Back
                    </button>

                </div>

            </div>
        );
    }

    return (

        <div className="disease-info-page">

            {/* ================= HEADER ================= */}

            <div className="disease-details-header">

                <button
                    className="back-btn"
                    onClick={() => navigate(-1)}
                >
                    <FaArrowLeft />
                    {t.backToPrediction}
                </button>

                <button
                    className="language-btn"
                    onClick={toggleLanguage}
                    style={{float: "right"}}
                >
                    {language === "en" ? "తెలుగు" : "English"}
                </button>

                <div className="disease-title">

                    <div className="title-icon">
                        <FaLeaf />
                    </div>

                    <div>
                        <span>{t.plantInfo}</span>

                        <h1>{info.name[language]}</h1>

                        <p>
                            {t.plantDetails}
                        </p>
                    </div>

                </div>

            </div>


            {/* ================= BASIC INFORMATION ================= */}

            <div className="disease-info-grid">

                {/* Symptoms */}

                <div className="detail-card symptoms-card">

                    <div className="detail-card-header">

                        <div className="detail-icon">
                            <FaExclamationTriangle />
                        </div>

                        <h2>{t.symptoms}</h2>

                    </div>

                    <p>
                        {info.symptoms[language]}
                    </p>

                </div>


                {/* Causes */}

                <div className="detail-card causes-card">

                    <div className="detail-card-header">

                        <div className="detail-icon">
                            <FaVirus />
                        </div>

                        <h2>{t.causes}</h2>

                    </div>

                    <p>
                        {info.causes[language]}
                    </p>

                </div>


                {/* Prevention */}

                <div className="detail-card prevention-card">

                    <div className="detail-card-header">

                        <div className="detail-icon">
                            <FaShieldAlt />
                        </div>

                        <h2>{t.prevention}</h2>

                    </div>

                    <p>
                        {info.prevention[language]}
                    </p>

                </div>

            </div>


            {/* ================= CHEMICAL TREATMENT ================= */}

            <section className="treatment-section">

                <div className="section-heading">

                    <div className="section-heading-icon chemical-icon">
                        <FaFlask />
                    </div>

                    <div>
                        <h2>{t.chemicalTreatment}</h2>

                        <p>
                            {t.recomm}
                        </p>
                    </div>

                </div>


                <div className="treatment-grid">

                    {/* First Application */}

                    <div className="treatment-card">

                        <div className="application-number">
                            01
                        </div>

                        <div className="application-title">

                            <h3>
                                {t.firstApplication}
                            </h3>

                            <span>
                                {t.initial}
                            </span>

                        </div>


                        <div className="treatment-details">

                            <div className="treatment-row">

                                <strong>{t.product}</strong>

                                <span>
                                    {
                                        info.chemicalTreatment
                                            .firstApplication
                                            .product[language]
                                    }
                                </span>

                            </div>


                            <div className="treatment-row">

                                <strong>{t.dosage}</strong>

                                <span>
                                    {
                                        info.chemicalTreatment
                                            .firstApplication
                                            .dosage[language]
                                    }
                                </span>

                            </div>


                            <div className="treatment-row">

                                <strong>{t.dosagePerAcre}</strong>

                                <span>
                                    {
                                        info.chemicalTreatment
                                            .firstApplication
                                            .dosagePerAcre[language]
                                    }
                                </span>

                            </div>


                            <div className="treatment-row">

                                <strong>{t.timing}</strong>

                                <span>
                                    <FaClock />
                                    {
                                        info.chemicalTreatment
                                            .firstApplication
                                            .timing[language]
                                    }
                                </span>

                            </div>

                        </div>

                    </div>


                    {/* Follow Up */}

                    <div className="treatment-card">

                        <div className="application-number">
                            02
                        </div>

                        <div className="application-title">

                            <h3>
                                {t.followUpApplication}
                            </h3>

                            <span>
                                {t.diseasecont}
                            </span>

                        </div>


                        <div className="treatment-details">

                            <div className="treatment-row">

                                <strong>{t.product}</strong>

                                <span>
                                    {
                                        info.chemicalTreatment
                                            .followUpApplication
                                            .product[language]
                                    }
                                </span>

                            </div>


                            <div className="treatment-row">

                                <strong>{t.dosage}</strong>

                                <span>
                                    {
                                        info.chemicalTreatment
                                            .followUpApplication
                                            .dosage[language]
                                    }
                                </span>

                            </div>


                            <div className="treatment-row">

                                <strong>{t.dosagePerAcre}</strong>

                                <span>
                                    {
                                        info.chemicalTreatment
                                            .followUpApplication
                                            .dosagePerAcre[language]
                                    }
                                </span>

                            </div>


                            <div className="treatment-row">

                                <strong>{t.timing}</strong>

                                <span>
                                    <FaClock />
                                    {
                                        info.chemicalTreatment
                                            .followUpApplication
                                            .timing[language]
                                    }
                                </span>

                            </div>

                        </div>

                    </div>

                </div>

            </section>


            {/* ================= NATURAL TREATMENT ================= */}

            <section className="treatment-section natural-section">

                <div className="section-heading">

                    <div className="section-heading-icon natural-icon">
                        <FaSeedling />
                    </div>

                    <div>
                        <h2>{t.naturalTreatment}</h2>

                        <p>
                            {t.naturalDesc}
                        </p>
                    </div>

                </div>


                <div className="treatment-grid">

                    {/* First Natural Application */}

                    <div className="treatment-card natural-card">

                        <div className="application-number">
                            01
                        </div>

                        <div className="application-title">

                            <h3>
                                {t.firstApplication}
                            </h3>

                            <span>
                                {t.early}
                            </span>

                        </div>


                        <div className="treatment-details">

                            <div className="treatment-row">

                                <strong>{t.product}</strong>

                                <span>
                                    {
                                        info.naturalTreatment
                                            .firstApplication
                                            .product[language]
                                    }
                                </span>

                            </div>


                            <div className="treatment-row">

                                <strong>{t.dosage}</strong>

                                <span>
                                    {
                                        info.naturalTreatment
                                            .firstApplication
                                            .dosage[language]
                                    }
                                </span>

                            </div>


                            <div className="treatment-row">

                                <strong>{t.dosagePerAcre}</strong>

                                <span>
                                    {
                                        info.naturalTreatment
                                            .firstApplication
                                            .dosagePerAcre[language]
                                    }
                                </span>

                            </div>


                            <div className="treatment-row">

                                <strong>{t.timing}</strong>

                                <span>
                                    <FaClock />
                                    {
                                        info.naturalTreatment
                                            .firstApplication
                                            .timing[language]
                                    }
                                </span>

                            </div>

                        </div>

                    </div>


                    {/* Follow Up Natural */}

                    <div className="treatment-card natural-card">

                        <div className="application-number">
                            02
                        </div>

                        <div className="application-title">

                            <h3>
                                {t.followUpApplication}
                            </h3>

                            <span>
                                {t.diseasePer}
                            </span>

                        </div>


                        <div className="treatment-details">

                            <div className="treatment-row">

                                <strong>{t.product}</strong>

                                <span>
                                    {
                                        info.naturalTreatment
                                            .followUpApplication
                                            .product[language]
                                    }
                                </span>

                            </div>


                            <div className="treatment-row">

                                <strong>{t.dosage}</strong>

                                <span>
                                    {
                                        info.naturalTreatment
                                            .followUpApplication
                                            .dosage[language]
                                    }
                                </span>

                            </div>


                            <div className="treatment-row">

                                <strong>{t.dosagePerAcre}</strong>

                                <span>
                                    {
                                        info.naturalTreatment
                                            .followUpApplication
                                            .dosagePerAcre[language]
                                    }
                                </span>

                            </div>


                            <div className="treatment-row">

                                <strong>{t.timing}</strong>

                                <span>
                                    <FaClock />
                                    {
                                        info.naturalTreatment
                                            .followUpApplication
                                            .timing[language]
                                    }
                                </span>

                            </div>

                        </div>

                    </div>

                </div>

            </section>


            {/* ================= SAFETY NOTE ================= */}

            <div className="treatment-warning">

                <FaExclamationTriangle />

                <div>

                    <h4>{t.note}</h4>

                    <p>
                        {t.treatmentWarning}
                    </p>

                </div>

            </div>


            {/* ================= FOOTER ================= */}

            <div className="disease-details-footer">

                <FaLeaf />

                <span>
                    {t.rythuMitra} AI • {t.smartFarming}
                </span>

            </div>

        </div>
    );
}

export default DiseaseInfo;