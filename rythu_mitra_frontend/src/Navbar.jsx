import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import { useLanguage } from "./context/LanguageContext";
import Hero from "./Components/Hero";
import SearchAssistant from "./Components/SearchAssistant";
import { useNavigate } from "react-router-dom";


import {
    FaArrowRight,
    FaSeedling,
    FaLeaf,
    FaGithub,
    FaEnvelope,
    FaLinkedin,
    FaCloudSun,
    FaRobot,
    FaShieldAlt,
    FaChartLine
} from "react-icons/fa";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

import field1 from "./assets/Sliding_Images/slide_img_1.jpg";
import field2 from "./assets/Sliding_Images/slide_img_2.jpg";
import field3 from "./assets/Sliding_Images/slide_img_3.jpg";
import field4 from "./assets/Sliding_Images/slide_img_4.jpg";
import field5 from "./assets/Sliding_Images/slide_img_5.jpg";
import field6 from "./assets/Sliding_Images/slide_img_6.jpg";



function Navbar() {

    const { language, toggleLanguage, t } = useLanguage();

    const navigate = useNavigate();

    const images = [
        field1,
        field2,
        field3,
        field4,
        field5,
        field6
    ];


    return (

        <div className="navbar-container">

            <nav className="main-navbar">

                <div
                    className="navbar-logo"
                    onClick={() => navigate("/")}
                >

                    <img
                        src="/Images/Rythu_Mitra_Logo_1-removebg-preview.png"
                        alt="Rythu Mitra Logo"
                    />

                    <div className="logo-text">

                        <h3>
                            {t.rythumitraai}
                        </h3>

                        <span>
                            {t.smartfarm}
                        </span>

                    </div>

                </div>


                {/* HORIZONTAL MENU */}

                <div className="nav-menu">


                    <button
                        className="nav-item "
                        onClick={() => navigate("/welcome-page")}
                    >
                        {t.home}
                    </button>


                    <button
                        className="nav-item"
                        onClick={() =>
                            navigate("/dashboard")
                        }
                    >

                        <FaChartLine />

                        {t.farmerdashboard}

                    </button>


                    <button
                        className="nav-item"
                        onClick={() =>
                            document
                                .getElementById("ai-assistant")
                                ?.scrollIntoView({
                                    behavior: "smooth"
                                })
                        }
                    >

                        <FaRobot />

                        {t.aiassistant}

                    </button>


                    <button
                        className="nav-item"
                        onClick={() =>
                            navigate("/crop-registration")
                        }
                    >

                        <FaSeedling />

                        {t.cropregistration}

                    </button>


                    <button
                        className="nav-item"
                        onClick={() =>
                            document
                                .getElementById("contact")
                                ?.scrollIntoView({
                                    behavior: "smooth"
                                })
                        }
                    >

                        {t.contact}

                    </button>


                    {/* LANGUAGE */}

                    <button
                        type="button"
                        className="language-btn"
                        onClick={toggleLanguage}
                    >

                        {language === "en"
                            ? "తెలుగు"
                            : "English"}

                    </button>


                </div>


            </nav>



            {/* =====================================================
                WELCOME SECTION
            ===================================================== */}

            <section className="welcome-section">


                <div className="welcome-content">


                    <span className="welcome-badge">

                        🌾 {t.greetings}! 👋

                    </span>


                    <h1>

                        {t.welcome}

                        <span>
                            {t.rythumitraai} {t.ku}
                        </span>

                    </h1>


                    <h2>

                        {t.yourfarm}
                        <br />

                        <span>
                            {t.yourassistant}
                        </span>

                    </h2>


                    <p>
                        {t.p}
                    </p>


                    <p className="welcome-description">
                        {t.welcomedesc}

                    </p>


                    <div className="welcome-buttons">


                        <button
                            className="primary-home-btn"
                            onClick={() =>
                                navigate("/crop-registration")
                            }
                        >

                            {t.getstarted}

                            <FaArrowRight />

                        </button>


                        <button
                            className="secondary-home-btn"
                            onClick={() =>
                                navigate("/dashboard")
                            }
                        >

                            {t.viewfarm}

                            <FaChartLine />

                        </button>


                    </div>


                    <div className="welcome-points">

                        <span>
                            🌱 {t.growsmart}
                        </span>

                        <span>
                            🌦️ {t.stayalert}
                        </span>

                        <span>
                            🦠 {t.protectcrops}
                        </span>

                        <span>
                            🤖 {t.farmai}
                        </span>

                    </div>


                </div>


            </section>



            {/* =====================================================
                IMAGE SLIDER
                DO NOT CHANGE WIDTH / HEIGHT
            ===================================================== */}

            <div className="sliding-images">

                <Swiper

                    modules={[
                        Autoplay,
                        Pagination,
                        EffectFade
                    ]}

                    effect="fade"

                    autoplay={{
                        delay: 3000,
                        disableOnInteraction: false
                    }}

                    loop={true}

                    pagination={{
                        clickable: true
                    }}

                    className="hero-slider"
                >

                    {images.map((img, index) => (

                        <SwiperSlide key={index}>

                            <img
                                src={img}
                                alt={`Rice field ${index + 1}`}
                            />

                        </SwiperSlide>

                    ))}

                </Swiper>

            </div>



            {/* =====================================================
                HERO
            ===================================================== */}

            <Hero />



            {/* =====================================================
                AI ASSISTANT
            ===================================================== */}

            <div id="ai-assistant">

                <SearchAssistant />

            </div>



            {/* =====================================================
                FEATURES
            ===================================================== */}

            


            {/* =====================================================
                REGISTRATION CTA
            ===================================================== */}

            <section className="registration-box">


                <div className="registration-icon">

                    <FaSeedling />

                </div>


                <h2>
                    {t.smartjourney}
                </h2>


                <p>
                    {t.registersumm}
                </p>


                <button
                    type="button"
                    className="registration-btn"
                    onClick={() =>
                        navigate("/crop-registration")
                    }
                >

                    {t.registercrop}

                    <FaArrowRight />

                </button>


                <div className="registration-tags">

                    <span>
                        🌱 {t.easyregister}
                    </span>

                    <span>
                        🌦️ {t.weathersupport}
                    </span>

                    <span>
                        🤖 {t.aisupport}
                    </span>

                </div>


            </section>



            {/* =====================================================
                FOOTER
            ===================================================== */}

            <footer
                className="footer"
                id="contact"
            >

                <div className="container">


                    <div className="footer-grid">


                        {/* LEFT */}

                        <div className="footer-about">

                            <div className="footer-brand">

                                <FaLeaf />

                                <h3>
                                    {t.rythumitraai}
                                </h3>

                            </div>


                            <p>
                                {t.aisumm}
                            </p>


                            <div className="footer-tagline">

                                🌱 {t.growsmart} •
                                🌦️ {t.stayalert} •
                                🤖 {t.farmai}

                            </div>

                        </div>



                        {/* CENTER */}

                        <div>

                            <h5>
                                {t.links}
                            </h5>


                            <ul className="footer-links">

                                <li
                                    onClick={() =>
                                        navigate("/welcome-page")
                                    }
                                >
                                    {t.home}
                                </li>


                                <li
                                    onClick={() =>
                                        navigate("/farmer-dashboard")
                                    }
                                >
                                    {t.farmerdashboard}
                                </li>


                                <li
                                    onClick={() =>
                                        navigate("/crop-registration")
                                    }
                                >
                                    {t.cropregistration}
                                </li>


                                <li
                                    onClick={() =>
                                        document
                                            .getElementById(
                                                "ai-assistant"
                                            )
                                            ?.scrollIntoView({
                                                behavior: "smooth"
                                            })
                                    }
                                >
                                    {t.aiassistant}
                                </li>

                            </ul>

                        </div>



                        {/* RIGHT */}

                        <div>

                            <h5>
                                {t.contact}
                            </h5>


                            <p className="footer-contact-text">
                                {t.contactsumm}
                            </p>


                            <div className="social-icons">

                                <a href="https://github.com/AppariSivamani" target="blank" className="github"><FaGithub /></a>

                                <a href="https://www.linkedin.com/in/appari-siva-mani-aa3509246/" target="blank" className="linkedin"><FaLinkedin /></a>

                                <a href="" onClick={()=>navigate("/contact")} className="mail"><FaEnvelope /></a>

                            </div>

                        </div>


                    </div>


                    <hr />


                    <div className="copyright1">

                       <img src="/Images/rm_btm_logo.png" className="bottom-logo" alt="" /> © {new Date().getFullYear()}  
                        {" "}{t.rythumitraai}.
                        {t.rights}.

                        <br />

                        <span>
                         {t.authors}
                        </span>

                    </div>


                </div>

            </footer>


        </div>
    );
}


export default Navbar;