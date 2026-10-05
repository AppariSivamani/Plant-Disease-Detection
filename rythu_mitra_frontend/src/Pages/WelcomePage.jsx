import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
    FaSeedling,
    FaCloudSun,
    FaBug,
    FaLightbulb,
    FaChartLine,
    FaWhatsapp,
    FaArrowRight,
    FaLeaf,
} from "react-icons/fa";

import { useLanguage } from "../context/LanguageContext";



function Welcome() {
    const navigate = useNavigate();

    const { language, toggleLanguage, t } = useLanguage();

    const [showLanguageCard, setShowLanguageCard] = useState(true);

    const features = [
        {
            icon: <FaSeedling />,
            title: t.registercrops,
            text: t.registercropsdesc,
        },
        {
            icon: <FaCloudSun />,
            title: t.weatheralert,
            text: t.weatheralertdesc,
        },
        {
            icon: <FaBug />,
            title: t.detectpalntsisease,
            text: t.detectinfo,
        },
        {
            icon: <FaLightbulb />,
            title: t.smartguidence,
            text: t.guidenceinfo,
        },
        {
            icon: <FaChartLine />,
            title: t.monitorgrowth,
            text: t.monitorinfo,
        },
        {
            icon: <FaWhatsapp />,
            title: t.whatsapp,
            text: t.whatsappinfo,
        },
    ];

    return (
        <div className="welcome-page">

            {showLanguageCard && (
                <div className="language-overlay">
                    <div className="language-card">
                        <h2>Choose Your Language</h2>
                        <p>మీ భాషను ఎంచుకోండి</p>

                        <div className="language-buttons">
                            <button
                                className={language === "te" ? "language-option active" : "language-option"}
                                onClick={() => {
                                    if (language !== "te") toggleLanguage();
                                    setShowLanguageCard(false);
                                }}
                            >
                                తెలుగు
                            </button>

                            <button
                                className={language === "en" ? "language-option active" : "language-option"}
                                onClick={() => {
                                    if (language !== "en") toggleLanguage();
                                    setShowLanguageCard(false);
                                }}
                            >
                                English
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <nav className="welcome-navbar">

                <div className="welcome-logo">
                    <div className="logo-icon">
                        <FaLeaf />
                    </div>

                    <span>
                        {t.rythumitraai}
                    </span>
                </div>

                <button
                    className="nav-get-started"
                    onClick={() => navigate("/homepage")}
                >
                   {t.getstarted}
                    <FaArrowRight />
                </button>

            </nav>


            {/* =========================================
          HERO SECTION
      ========================================= */}

            <section className="welcome-hero">

                <div className="hero-content1">

                    <div className="hero-greeting">
                        🌾 {t.greetings}! 👋🌾
                    </div>

                    <div className="hero-small-title">
                        {t.welcome}
                    </div>

                    <h1>
                        {t.rythuMitra} <span>AI </span> {t.ku}
                    </h1>

                    <h2>
                        {t.yourfarm1}.
                        <br />
                        {t.yourcrops}.
                        <br />
                        {t.yourassistant}
                    </h2>

                    <p className="hero-description">
                        {t.herodesc1} <strong>{t.herodesc2}</strong>
                    </p>

                    <p className="hero-description secondary">
                     {t.herodesc3}
                    </p>

                    <div className="hero-highlights">

                        <span>🌱 {t.growsmart}</span>
                        <span>🌦️ {t.stayalert}</span>
                        <span>🦠 {t.protectcrops}</span>
                        <span>🤖 {t.farmai}</span>

                    </div>

                    <button
                        className="hero-button"
                        onClick={() => navigate("/crop-registration")}
                    >
                        {t.getstarted}
                        <FaArrowRight />
                    </button>

                </div>

            </section>


            {/* =========================================
          FEATURES SECTION
      ========================================= */}

            <section className="features-section">

                <div className="section-heading">

                    <span>{t.smartFarming}</span>

                    <h2>
                        🌱 {t.aicando}
                    </h2>

                    <p>
                        {t.allinone}
                    </p>

                </div>


                <div className="features-grid">

                    {features.map((feature, index) => (

                        <div
                            className="feature-card"
                            key={index}
                        >

                            <div className="feature-icon">
                                {feature.icon}
                            </div>

                            <h3>
                                {feature.title}
                            </h3>

                            <p>
                                {feature.text}
                            </p>

                        </div>

                    ))}

                </div>

            </section>


            {/* =========================================
          SMART FARMING SECTION
      ========================================= */}

            <section className="smart-section">

                <div className="smart-content">

                    <div className="smart-icon">
                        🌱
                    </div>

                    <span className="smart-label">
                        {t.smartfarmai}
                    </span>

                    <h2>
                        {t.yourfarm1},
                        <br />
                        <span>{t.smartereveryday}.</span>
                    </h2>

                    <p>
                        {t.guesswork}
                    </p>

                    <div className="smart-points">

                        <div>
                            <span>✓</span>
                            {t.getinfo}
                        </div>

                        <div>
                            <span>✓</span>
                            {t.understandcrop}
                        </div>

                        <div>
                            <span>✓</span>
                            {t.prepareweather}
                        </div>

                        <div>
                            <span>✓</span>
                            {t.takeaction}
                        </div>

                    </div>

                    <div className="smart-tagline">

                        <span>🌱 {t.growsmart}</span>

                        <span>🌦️ {t.stayalert}</span>

                        <span>🦠 {t.protectcrops}</span>

                        <span>🤖 {t.farmai}</span>

                    </div>

                    <button
                        className="smart-button"
                        onClick={() => navigate("/homepage")}
                    >
                        {t.startfarm}
                        <FaArrowRight />
                    </button>

                </div>

            </section>


            {/* =========================================
          FOOTER
      ========================================= */}

            <footer className="welcome-footer">

                <div className="footer-logo">

                    <FaLeaf />

                    <span>
                        {t.rythumitraai}
                    </span>

                </div>

                <p>
                    {t.smarttechnology}
                </p>

                <div className="footer-line"></div>

                <small>
                    © {new Date().getFullYear()} {t.rythumitraai}.
                   {} {t.rights}. <br /> {t.authors}
                </small>

            </footer>

        </div>
    );
}

export default Welcome;