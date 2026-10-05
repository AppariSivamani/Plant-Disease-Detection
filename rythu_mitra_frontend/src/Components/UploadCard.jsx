import React from "react";
import axios from "axios";
import {
  FaCloudUploadAlt,
  FaCheckCircle,
  FaArrowLeft
} from "react-icons/fa";
import { GiPlantRoots } from "react-icons/gi";
import API_BASE_URL from "../config";

import { useLanguage } from "../context/LanguageContext";
import { useNavigate } from "react-router-dom";


function UploadCard({
  image,
  preview,
  setImage,
  setPreview,
  setPrediction,
  setTopPredictions,
  loading,
  setLoading,
}) {

  const handleImage = (e) => {

    const file = e.target.files[0];
    console.log(file);

    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));

  };

  const predictDisease = async () => {

    if (!image) {
      alert("Please upload an image");
      return;
    }

    console.log("Selected image:", image);

    const formData = new FormData();
    formData.append("image", image);

    try {

      setLoading(true);

      console.log("Sending request to Django...");

      const response = await axios.post(
        `${API_BASE_URL}/api/predict/`,
        formData
      );

      console.log("Django response:", response.data);

      setPrediction(response.data.predictions[0]);
      setTopPredictions(response.data.predictions);

    } catch (error) {

      console.log("FULL ERROR:", error);

      if (error.response) {
        console.log("STATUS:", error.response.status);
        console.log("DATA:", error.response.data);
      } else if (error.request) {
        console.log("REQUEST ERROR:", error.request);
      } else {
        console.log("ERROR MESSAGE:", error.message);
      }

      alert("Prediction Failed - Check Console");

    } finally {

      setLoading(false);

    }
  };

  const { t } = useLanguage();
  const navigate = useNavigate();




  return (
    <>

      <button
        className="back-btn"
        onClick={() => navigate("/")}
        style={{ color: "white" }}
      >
        <FaArrowLeft />
        Back
      </button>

      <div className="card upload-card1">



        <div className="card-header-custom1">

          <span className="step2">1</span>

          <h3>{t.uploadLeafImage}</h3>

        </div>

        <p className="upload-text1">
          {t.uploadDescription}
        </p>

        <label className="upload-box1">

          <FaCloudUploadAlt className="upload-icon1" />

          <h4>{t.chooseImage}</h4>

          <span style={{ color: "white" }}>{t.clickToUpload}</span>

          <input
            type="file"
            accept="image/*"
            hidden
            onChange={handleImage}
          />

        </label>

        {preview && (

          <div className="selected-file1">

            <span>{t.imageSelected}</span>

            <FaCheckCircle color="#16a34a" size={20} />

          </div>

        )}

        <button
          className="predict-btn1"
          onClick={predictDisease}
          disabled={loading}
        >
          {loading ? "Predicting..." : t.predictdisease}
        </button>

      </div>

      {preview && (

        <div className="card preview-card">

          <h3>{t.uploadedImage}</h3>

          <img
            src={preview}
            alt="Preview"
            className="preview-image"
          />

          <div className="tip-box">

            <GiPlantRoots className="tip-icon" />

            <div>

              <h4>{t.tip}</h4>

              <p>
                {t.tipDesc}
              </p>

            </div>

          </div>

        </div>

      )}

    </>
  );
}

export default UploadCard;