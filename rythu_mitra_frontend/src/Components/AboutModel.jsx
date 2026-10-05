import React from "react";
import {
  FaBrain,
  FaChartLine,
  FaDatabase,
  FaClock,
  FaLeaf,
  FaImage,
} from "react-icons/fa";

import { useLanguage } from "../context/LanguageContext";

function AboutModel() {

  const { t } = useLanguage();

  return (
    <section className="about-model mt-5">

      <h2 className="section-heading">
        🤖 About Our AI Model
      </h2>

      <p className="section-subtitle">
        Powered by Deep Learning and trained on thousands of rice leaf images.
      </p>

      <div className="row g-4 mt-2">

        <div className="col-md-4">
          <div className="model-card">
            <FaBrain className="model-icon" />
            <h5>AI Architecture</h5>
            <p>
              EfficientNetB0 Transfer Learning
            </p>
          </div>
        </div>

        <div className="col-md-4">
          <div className="model-card">
            <FaLeaf className="model-icon" />
            <h5>Diseases</h5>
            <p>
              13 Rice Leaf Categories
            </p>
          </div>
        </div>

        <div className="col-md-4">
          <div className="model-card">
            <FaImage className="model-icon" />
            <h5>Image Size</h5>
            <p>
              224 × 224 Pixels
            </p>
          </div>
        </div>

        <div className="col-md-4">
          <div className="model-card">
            <FaDatabase className="model-icon" />
            <h5>Dataset</h5>
            <p>
              8,000+ Augmented Images
            </p>
          </div>
        </div>

        <div className="col-md-4">
          <div className="model-card">
            <FaChartLine className="model-icon" />
            <h5>Training Accuracy</h5>
            <p>
              ~81%
            </p>
          </div>
        </div>

        <div className="col-md-4">
          <div className="model-card">
            <FaClock className="model-icon" />
            <h5>Prediction Time</h5>
            <p>
              Less than 2 Seconds
            </p>
          </div>
        </div>

      </div>

    </section>
  );
}

export default AboutModel;