import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

import Navbar from "../components/Navbar";
import UploadCard from "../components/UploadCard";
import PredictionCard from "../components/PredictionCard";
import TopPredictions from "../components/TopPredictions";
import Footer from "../components/Footer";
import Loader from "../components/Loader";


import { useLanguage } from "../context/LanguageContext";


function DiseasePage() {

    

    const { t } = useLanguage();


    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);

    const [prediction, setPrediction] = useState(null);
    const [topPredictions, setTopPredictions] = useState([]);

    const [loading, setLoading] = useState(false);


    const navigate = useNavigate();

    
    return (

        <div className="disease-page" id="background">

            {/* Header */}

            <Navbar />

            <div className="container py-5" >

                <div className="row g-4">

                    {/* LEFT */}

                    <div className="col-lg-5">

                        <UploadCard
                            image={image}
                            preview={preview}
                            setImage={setImage}
                            setPreview={setPreview}
                            prediction={prediction}
                            setPrediction={setPrediction}
                            topPredictions={topPredictions}
                            setTopPredictions={setTopPredictions}
                            loading={loading}
                            setLoading={setLoading}
                        />

                    </div>

                    {/* RIGHT */}

                    <div className="col-lg-7">

                        {loading ? (

                            <Loader />

                        ) : (

                            prediction && (

                                <>

                                    <PredictionCard
                                        prediction={prediction}
                                    />

                                    <TopPredictions
                                        predictions={topPredictions}
                                    />

                                    <button className="disease-info-btn"
                                        onClick={() => navigate(`/disease-info/${prediction.disease}`)}>
                                        <span>{t.viewDiseaseInfo}</span>
                                        <FaArrowRight className="info-arrow" />
                                    </button>

                                </>

                            )

                        )}

                    </div>

                </div>


            </div>

            <Footer />

        </div>

    );

}

export default DiseasePage;