import React from "react";
import {
  FaGithub,
  FaLinkedin,
  FaEnvelope,
  FaLeaf,
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";


function Footer() {

  const navigate = useNavigate();

  return (
    <footer className="footer" style={{ background: "transparent" }}>

      <div className="container">

        <div className="row">

          {/* Left */}

          <div className="col-lg-5">

            <div className="footer-brand">

              <FaLeaf className="footer-logo" />

              <h3>Rythu Mitra AI</h3>

            </div>

            <p className="footer-text">

              AI Powered Plant Disease Detection System

              helping farmers identify plant leaf diseases

              quickly and accurately.

            </p>

          </div>

          {/* Center */}

          <div className="col-lg-3">

            <h5>Quick Links</h5>

            <ul className="footer-links">

              <li onClick={() => navigate("/")}>Home</li>

              <li onClick={() => navigate("/")}>AI Assistant</li>

              <li>About AI</li>

            </ul>

          </div>

          {/* Right */}

          <div className="col-lg-4">

            <h5>Contact</h5>

            <div className="social-icons">

              <a href="https://github.com/AppariSivamani" target="blank" className="github"><FaGithub /></a>

              <a href="https://www.linkedin.com/in/appari-siva-mani-aa3509246/" target="blank" className="linkedin"><FaLinkedin /></a>

              <a href="" onClick={() => navigate("/contact")} className="mail"><FaEnvelope /></a>
            </div>

          </div>

        </div>

        <hr />

        <p className="copyright">

          © {new Date().getFullYear()} Rythu Mitra AI.
          All Rights are Reserved. <br />

          <p>
            Designed and Developed by Siva & Narasimha.
          </p>

        </p>

      </div>

    </footer>
  );
}

export default Footer;