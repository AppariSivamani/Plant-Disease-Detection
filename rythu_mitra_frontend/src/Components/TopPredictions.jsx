import React from "react";

import { useLanguage } from "../context/LanguageContext";
import { diseaseData } from "../data/diseaseData";

function TopPredictions({ predictions }) {

  const { language, t } = useLanguage();

  if (!predictions || predictions.length === 0) {
    return null;
  }

  const colors = [
    "#f4b400",
    "#9aa5b1",
    "#d97706",
  ];

  return (
    <div className="prediction-list-card">

      <h4 className="section-title">
        🎯 {t.topPredictions}
      </h4>

      {predictions.map((item, index) => {

        const info = diseaseData[item.disease];

        const diseaseName = info
          ? info.name[language]
          : item.disease.replace(/_/g, " ");

        return (
          <div
            className="prediction-item"
            key={index}
          >

            <div
              className="rank-circle"
              style={{
                background: colors[index] || "#ffffff"
              }}
            >
              {index + 1}
            </div>

            <div className="prediction-content">

              <div className="prediction-header">

                <span
                  className="disease-name"
                  style={{
                    fontSize: "20px",
                    color: "#ffffff"
                  }}
                >
                  {diseaseName}
                </span>

                <span className="confidence">
                  {item.confidence.toFixed(2)}%
                </span>

              </div>

              <div className="progress">

                <div
                  className="progress-bar"
                  style={{
                    width: `${item.confidence}%`,

                    backgroundColor:
                      item.confidence > 80
                        ? "#dc2626"
                        : item.confidence >= 50
                          ? "#f97316"
                          : "#eab308"
                  }}
                />

              </div>

            </div>

          </div>
        );
      })}

    </div>
  );
}

export default TopPredictions;