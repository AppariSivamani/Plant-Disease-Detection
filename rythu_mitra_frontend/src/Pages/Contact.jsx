import React from 'react';
import styled from 'styled-components';
import {
  FaArrowLeft,
  FaChartLine,
} from "react-icons/fa";
import { useLanguage } from "../context/LanguageContext";
import { useNavigate } from 'react-router-dom';


const Form = () => {
  const navigate = useNavigate();
  const { t, language, toggleLanguage, } = useLanguage();

return (
  <StyledWrapper>

    {/* ================= NAVBAR ================= */}
    <nav className="main-navbar" id="dashboard-nav">

      <div
        className="navbar-logo"
        onClick={() => navigate("/")}
      >
        <img
          src="/Images/Rythu_Mitra_Logo_1-removebg-preview.png"
          alt="Rythu Mitra Logo"
        />

        <div className="logo-text">
          <h3>{t.rythumitraai}</h3>
          <span>{t.smartfarm}</span>
        </div>
      </div>

      <div className="nav-menu">

        <button
          className="nav-item"
          onClick={() => navigate("/dashboard")}
        >
          <FaArrowLeft />
          <span onClick={() => navigate("/dashboard")}>Back</span>
        </button>

        <button
          className="nav-item"
          onClick={() => navigate("/dashboard")}
        >
          <FaChartLine />
          <span>{t.farmerdashboard}</span>
        </button>

        

        <button
          type="button"
          className="language-btn"
          onClick={toggleLanguage}
        >
          {language === "en" ? "తెలుగు" : "English"}
        </button>

      </div>

    </nav>


    {/* ================= CONTENT ================= */}
    <div className="contact-content">

      {/* LEFT MATTER */}
      <div className="left-content">

        <h1>
          {t.LetConnect} {t.WithUs1}<br />
          <span>{t.WithUs} {t.LetConnect1}</span>
        </h1>

        <p>
          {t.contactp}
        </p>

        <h2>{t.Whycontact}</h2>

        <div className="contact-points">
          <div>🌱 {t.contactpoint1}</div>
          <div>💬 {t.contactpoint2}</div>
          <div>🤝 {t.contactpoint3}</div>
          <div>🚜 {t.contactpoint4}</div>
        </div>

        <h3>
          {t.happyjourn}
        </h3>

      </div>


      {/* RIGHT CONTACT FORM */}
      <div className="form-container">

        <div className="form">

          <span className="heading">
           {t.Gettouch}
          </span>

          <form
            action="https://formspree.io/f/xqazondd"
            method="POST"
            target="_blank"
          >

            <input
              placeholder={t.YourName}
              type="text"
              className="input"
              name="Name"
              id='name'
            />

            <input
              placeholder={t.YourPhone}
              type="number"
              className="input"
              name="Phone Number"
              id='number'
            />

            <input
              placeholder={t.YourVillage}
              type="text"
              className="input"
              name="Village"
              id='village'
            />

            <div className="button-container">
              <button
                type="submit"
                className="send-button"
              >
                {t.Send}
              </button>
            </div>

          </form>

        </div>

      </div>

      

    </div>

  </StyledWrapper>
);
};


const StyledWrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  padding: 40px 6%;
  box-sizing: border-box;

  background:
        radial-gradient(
            circle at 20% 10%,
            rgba(34, 197, 94, 0.14),
            transparent 30%
        ),
        radial-gradient(
            circle at 85% 40%,
            rgba(22, 163, 74, 0.12),
            transparent 30%
        ),
        linear-gradient(
            135deg,
            #06140b,
            #0b2515 50%,
            #06140b
        );

  /* ================= LEFT MATTER ================= */

  .left-content {
    flex: 1;
    max-width: 600px;
  }

  .left-content h1 {
    color: white;
    font-size: 48px;
    line-height: 1.3;
    font-weight: 800;
    margin: 0 0 25px;
  }

  .left-content h1 span {
    color: green;
  }

  .left-content p {
    color: #52636c;
    font-size: 18px;
    line-height: 1.7;
    max-width: 550px;
    margin: 0 0 30px;
  }

  .left-content h2 {
    color: white;
    font-size: 24px;
    margin: 0 0 18px;
  }

  .contact-points {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .contact-points div {
    color: white;
    font-size: 16px;
    font-weight: 600;
    padding: 11px 15px;
    border-left: 4px solid lightgreen;
    background:  rgba(255, 255, 255, 0.10);
    width: fit-content;
    max-width: 100%;
    box-sizing: border-box;
  }

  .left-content h3 {
    color: gray;
    font-size: 17px;
    line-height: 1.5;
    margin: 30px 0 0;
  }


  /* ================= CONTACT FORM ================= */

  .form-container {
    flex: 1;
    width: 100%;
    max-width: 700px;
    box-sizing: border-box;

    background-color: #001925;
    padding: 40px;

    border-left: 5px solid green;

    clip-path: polygon(
      0 0,
      100% 0,
      100% calc(100% - 20px),
      calc(100% - 20px) 100%,
      0 100%
    );
  }

  .heading {
    display: block;
    color: white;
    font-size: 1.7rem;
    font-weight: 800;
    margin-bottom: 25px;
  }

  .form-container .form {
    width: 100%;
  }

  .form-container .form .input {
    color: #87a4b6;
    width: 100%;
    box-sizing: border-box;

    background-color: #002733;
    border: none;
    outline: none;

    padding: 15px;
    margin-bottom: 20px;

    font-weight: bold;
    font-size: 16px;

    transition: all 0.2s ease-in-out;
    border-left: 1px solid transparent;
  }

  .form-container .form .input:focus {
    border-left: 5px solid green;
  }

  .form-container .form .textarea {
    width: 100%;
    box-sizing: border-box;

    padding: 15px;
    border: none;
    outline: none;

    background-color: #013747;
    color: #ff7a01;

    font-weight: bold;
    font-size: 16px;

    resize: vertical;
    min-height: 150px;
    max-height: 250px;

    margin-bottom: 20px;

    border-left: 1px solid transparent;
    transition: all 0.2s ease-in-out;
  }

  .form-container .form .textarea:focus {
    border-left: 5px solid #ff7a01;
  }

  /* ================= BUTTONS ================= */

  .form-container .form .button-container {
    display: flex;
    gap: 14px;
    width: 100%;
  }

  .form-container .form .button-container .send-button {
    flex-basis: 100%;
    background: transparent;

    padding: 14px;

    color: white;
    text-align: center;
    font-weight: bold;

    border: 1px solid white;
    transition: all 0.2s ease-in-out;
    cursor: pointer;
  }

  .form-container .form .button-container .send-button:hover {
    background: transparent;
    border: 1px solid green;
  }



  .form-container
    .form
    .button-container
    .reset-button-container
    .reset-button {
    position: relative;

    text-align: center;
    padding: 14px;

    color: #ff7a01;
    font-weight: bold;

    background: #001925;

    clip-path: polygon(
      0 0,
      100% 0,
      100% calc(100% - 10px),
      calc(100% - 10px) 100%,
      0 100%
    );

    transition: all 0.2s ease-in-out;
    cursor: pointer;
  }

  .form-container
    .form
    .button-container
    .reset-button-container
    .reset-button:hover {
    background: #ff7a01;
    color: #001925;
  }


  /* ================= TABLET ================= */

  @media (max-width: 1000px) {
    padding: 40px 5%;
    gap: 40px;

    .left-content h1 {
      font-size: 40px;
    }

    .left-content p {
      font-size: 16px;
    }

    .form-container {
      padding: 30px;
    }
  }


  /* ================= MOBILE ================= */

  @media (max-width: 768px) {
    min-height: auto;
    padding: 35px 20px;

    flex-direction: column;

    align-items: stretch;
    justify-content: flex-start;

    gap: 40px;


    /* First matter */
    .left-content {
      width: 100%;
      max-width: 100%;
      order: 1;
    }

    .left-content h1 {
      font-size: 36px;
      margin-bottom: 20px;
    }

    .left-content p {
      font-size: 16px;
      line-height: 1.6;
    }

    .left-content h2 {
      font-size: 22px;
    }

    .contact-points div {
      width: 100%;
      font-size: 15px;
    }

    .left-content h3 {
      font-size: 16px;
      margin-top: 25px;
    }


    /* Then form */
    .form-container {
      width: 100%;
      max-width: 100%;
      order: 2;

      padding: 25px;

      border-left: 4px solid #ff7a01;
    }

    .heading {
      font-size: 1.5rem;
    }

    .form-container .form .input {
      padding: 13px;
      font-size: 15px;
    }

    .form-container .form .textarea {
      padding: 13px;
      min-height: 130px;
    }

    .form-container .form .button-container {
      flex-direction: column;
      gap: 10px;
    }

    .form-container .form .button-container .send-button,
    .form-container
      .form
      .button-container
      .reset-button-container {
      flex-basis: auto;
      width: 100%;
    }
  }


  /* ================= SMALL MOBILE ================= */

  @media (max-width: 480px) {
    padding: 25px 15px;

    .left-content h1 {
      font-size: 30px;
    }

    .left-content p {
      font-size: 15px;
    }

    .contact-points div {
      font-size: 14px;
      padding: 10px 12px;
    }

    .form-container {
      padding: 20px;
    }

    .heading {
      font-size: 1.35rem;
    }
  }

  /* ================= NAVBAR ================= */

.main-navbar {
  width: 100%;
  min-height: 78px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 12px 0;
  box-sizing: border-box;

  border-bottom: 1px solid rgba(74, 222, 128, 0.15);

  position: relative;
  z-index: 100;
}


/* LOGO */

.navbar-logo {
  display: flex;
  align-items: center;
  gap: 12px;

  cursor: pointer;
}

.navbar-logo img {
  width: 55px;
  height: 55px;
  object-fit: contain;
}

.logo-text {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.logo-text h3 {
  margin: 0;
  color: white;
  font-size: 20px;
  font-weight: 800;
}

.logo-text span {
  color: #4ade80;
  font-size: 12px;
  margin-top: 2px;
}


/* NAV MENU */

.nav-menu {
  display: flex;
  align-items: center;
  justify-content: flex-end;

  gap: 12px;
}


/* NAV ITEMS */

.nav-item,
.language-btn {
  height: 42px;

  display: flex;
  align-items: center;
  justify-content: center;

  gap: 8px;

  padding: 0 16px;

  border: 1px solid rgba(74, 222, 128, 0.25);
  border-radius: 8px;

  background: rgba(255, 255, 255, 0.05);

  color: white;

  font-size: 14px;
  font-weight: 600;

  cursor: pointer;

  transition: all 0.25s ease;
}

.nav-item:hover,
.language-btn:hover {
  background: rgba(74, 222, 128, 0.12);
  border-color: #4ade80;
  color: white;
}

.language-btn {
  min-width: 90px;
}


/* ================= CONTENT ================= */

.contact-content {
  width: 100%;
  max-width: 1500px;

  margin: 0 auto;
  padding-top: 70px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 80px;
}

@media (max-width: 768px) {

  .main-navbar {
    min-height: auto;

    flex-direction: column;
    align-items: stretch;

    gap: 15px;

    padding: 15px 0;
  }

  .navbar-logo {
    justify-content: center;
  }

  .nav-menu {
    width: 100%;

    display: grid;
    grid-template-columns: 1fr 1fr;

    gap: 8px;
  }

  .nav-item,
  .language-btn {
    width: 100%;
    padding: 0 10px;
    font-size: 13px;
  }

  .contact-content {
    padding-top: 40px;

    flex-direction: column;
    align-items: stretch;

    gap: 40px;
  }

  .left-content {
    width: 100%;
    max-width: 100%;
  }

  .form-container {
    width: 100%;
    max-width: 100%;
  }
}

@media (max-width: 480px) {

  .navbar-logo img {
    width: 48px;
    height: 48px;
  }

  .logo-text h3 {
    font-size: 17px;
  }

  .logo-text span {
    font-size: 10px;
  }

  .nav-menu {
    grid-template-columns: 1fr 1fr;
  }

  .nav-item,
  .language-btn {
    height: 38px;
    font-size: 12px;
  }

  .contact-content {
    padding-top: 30px;
  }
}
`;

export default Form;