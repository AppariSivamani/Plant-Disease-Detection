import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {FaPhone}  from "react-icons/fa";
import { RiLockPasswordLine } from "react-icons/ri";
import { useLanguage } from "../context/LanguageContext";


const Login = () => {

    const { toggleLanguage, t } = useLanguage();
  const navigate = useNavigate();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!phoneNumber || !password) {
      setError(t.ph_alert);
      return;
    }

    if (phoneNumber.length !== 10) {
      setError(t.phdigit_alert);
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://127.0.0.1:8000/api/login/",
        {
          phone_number: phoneNumber,
          password: password,
        }
      );

      if (response.data.success) {
        // No localStorage
        // Backend data is passed to Dashboard through React Router state

        localStorage.setItem("token", response.data.token);

        navigate("/welcome-page", {
          state: {
            token: response.data.token,
            user: response.data.user,
          },
        });
      }
    } catch (err) {
      if (err.response) {
        setError(
          err.response.data.message ||
            "Invalid phone number or password."
        );
      } else {
        setError("Unable to connect to the server.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      {/* ================= LEFT SECTION ================= */}

      <section className="login-hero">

        <div className="hero-overlay"></div>

        <div className="hero-content">

          {/* Logo */}
          <div className="hero-logo">
            <div className="logo-box">🌱</div>

            <div>
              <h2>{t.rythumitraai}</h2>
              <p>{t.smartFarming} • {t.brightertomm}</p>
            </div>
          </div>

          {/* Main heading */}
          <div className="hero-heading">

            <h1>
              {t.EmpoweringFarmers}
              <br />
              {t.withTechnology} <span>🌿</span>
            </h1>

            <h3>
              “మీ పంట.. మా బాధ్యత”
            </h3>

            <p className="quote-author">
              — {t.rythumitraai}
            </p>

          </div>

          {/* Features */}

          <div className="hero-features">

            <div className="hero-feature">
              <div className="feature-icon leaf">
                🌿
              </div>

              <div>
                <h4>{t.AICrop}</h4>
                <p>{t.Getadvice}</p>
              </div>
            </div>

            <div className="hero-feature">
              <div className="feature-icon disease">
                🛡️
              </div>

              <div>
                <h4>{t.diseasedetection}</h4>
                <p>{t.Identifyearly}</p>
              </div>
            </div>

            <div className="hero-feature">
              <div className="feature-icon weather">
                ☁️
              </div>

              <div>
                <h4>{t.WeatherUpdates}</h4>
                <p>{t.WeatherUpdatesp}</p>
              </div>
            </div>

            <div className="hero-feature">
              <div className="feature-icon calendar">
                📅
              </div>

              <div>
                <h4>{t.CropSchedule}</h4>
                <p>{t.cropshedulep}</p>
              </div>
            </div>

          </div>

          

          <div className="hero-stats">

            <div className="stat">
              <span>👥</span>
              <div>
                <strong>10K+</strong>
                <small>{t.FarmersTrust}</small>
              </div>
            </div>

            <div className="stat">
              <span>🌱</span>
              <div>
                <strong>50+</strong>
                <small>{t.CropsSupported}</small>
              </div>
            </div>

            <div className="stat">
              <span>📍</span>
              <div>
                <strong>500+</strong>
                <small>{t.VillagesReached}</small>
              </div>
            </div>

            <div className="stat">
              <span>❤️</span>
              <div>
                <strong>95%</strong>
                <small>{t.FarmerSatisfaction}</small>
              </div>
            </div>

          </div>

        </div>
      </section>


      {/* ================= RIGHT SECTION ================= */}

      <section className="login-section">

        {/* Language */}

        <div className="language-selector">
          <span>🌐</span>
          <button type="button" onClick={() => toggleLanguage("en")}> English </button> { }| <button type="button" onClick={() => toggleLanguage("te")}>తెలుగు</button>
        </div>


        {/* Login Card */}

        <div className="login-card">

          {/* Welcome */}

          <div className="welcome-section">

            <div className="welcome-icon">
              👋
            </div>

            <h1>
              {t.WelcomeBack} <span>🌿</span>
            </h1>

            <p>
              {t.loginintoai}
            </p>

          </div>


          {/* Form */}

          <form onSubmit={handleLogin}>

            {/* Phone */}

            <div className="form-group">

              <label>
                {t.PhoneNumber}
              </label>

              <div className="input-container">

                <span className="input-icon">
                  <FaPhone /> 
                </span>

                <input
                  type="tel"
                  placeholder={t.enterph_num}
                  value={phoneNumber}
                  maxLength={10}
                  onChange={(e) => {
                    const value =
                      e.target.value.replace(/\D/g, "");

                    setPhoneNumber(value);
                  }}
                />

              </div>


            </div>


            {/* Password */}

            <div className="form-group password-group">

              <div className="password-header">

                <label>{t.Password}</label>

                <button
                  type="button"
                  className="forgot-btn"
                >
                  {t.ForgotPassword}
                </button>

              </div>

              <div className="input-container">

                <span className="input-icon">
                  <RiLockPasswordLine />
                </span>

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder={t.enterpass}
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                />

                <button
                  type="button"
                  className="eye-btn"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? "🙈" : "🐵"}
                </button>

              </div>

            </div>


            {/* Error */}

            {error && (
              <div className="error-message">
                ⚠️ {error}
              </div>
            )}


            {/* Login */}

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >

              {loading ? (
                <>
                  <span className="loader"></span>
                  {t.Loggingin}
                </>
              ) : (
                <>
                  {t.Login}
                  <span className="arrow">→</span>
                </>
              )}


            </button>

          </form>


          {/* Security */}

          <div className="security-message">
            <RiLockPasswordLine />
            <span>
              {t.infoprotected}
            </span>
          </div>


          {/* Bottom Quote Card */}

          <div className="login-quote-card">

            <div className="plant-icon">
              🌱
            </div>

            <div className="quote-text">

              <p>
                “{t.techinfield},
                <br />
                {t.prosperhome}”
              </p>

              <span>
                — {t.rythumitraai}
              </span>

            </div>

            <div className="plant-image">
              🌱
            </div>

          </div>


          {/* Footer */}

          <div className="login-footer">

            <div>
              <span>🛡️</span>
              <p>{t.SecureSafe}</p>
            </div>

            <div className="footer-line"></div>

            <div>
              <span>🎧</span>
              <p>24/7 {t.Support}</p>
            </div>

            <div className="footer-line"></div>

            <div>
              <span>👨‍🌾</span>
              <p>{t.TrustedFarmers}</p>
            </div>

          </div>

        </div>

      </section>

    </div>
  );
};

export default Login;