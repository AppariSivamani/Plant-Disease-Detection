import React from "react";
import { useLanguage } from "../context/LanguageContext";

function Navbar() {

    const { language, toggleLanguage } = useLanguage();
    

    return (
        <nav className="disease-navbar">

            {/* LEFT SIDE */}
            <div className="nav-left">

               

                <img
                    src="/Images/Rythu_Mitra_Logo_1-removebg-preview.png"
                    alt="Rythu Mitra Logo"
                    className="leaf-logo"
                />

                <div>
                    <h2>
                        Plant Disease Detection
                    </h2>

                    <p>
                        AI Powered Disease Detection for Healthy Crops
                    </p>
                </div>

            </div>

            <button
                type="button"
                className="language-btn"
                onClick={toggleLanguage}
            >
                {language === "en" ? "తెలుగు" : "English"}
            </button>



            {/* RIGHT SIDE */}
            <div className="nav-right">

                {/* LANGUAGE BUTTON */}


                <img
                    src="/Images/Rythu_Mitra_Logo_1-removebg-preview.png"
                    alt="Rythu Mitra Logo"
                    className="small-logo"
                />

                <div>
                    <h3>
                        Rythu Mitra AI
                    </h3>

                    <span>
                        Smart Farming
                    </span>
                </div>

            </div>

        </nav>
    );
}

export default Navbar;