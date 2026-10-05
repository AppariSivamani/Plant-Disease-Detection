import React from "react";
import "./Hero.css";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

const Hero = () => {

  const navigate = useNavigate();

   const { t } = useLanguage();

  return (
    <section className="hero">
      <div className="hero-overlay1"></div>

      <div className="hero-content1">

        <div className="hero-badge">
          🌾 {t.heroBadge}
        </div>

        <h1>
          {t.prot}
          <br />
          {t.with} <span>{t.ai}  {t.with1}</span> 
        </h1>

        <p>
          {t.homeDesc}
        </p>

        <div className="hero-buttons">
          <button className="primary-btn" onClick={()=> navigate("/dashboard/disease-detection")}>
            {t.detectBtn}  
          </button>

          <button className="secondary-btn">
            {t.learnMore}
          </button>
        </div>

        <div className="hero-stats1">

          <div className="stat1">
            <h2>50+</h2>
            <span>{t.Disease}</span>
          </div>

          <div className="stat1">
            <h2>92%</h2>
            <span>{t.accuracy}</span>
          </div>

          <div className="stat1">
            <h2>AI</h2>
            <span>{t.powered}</span>
          </div>

        </div>

      </div>
    </section>
  );
};

export default Hero;