import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
    FaCamera,
    FaCloudUploadAlt,
    FaLeaf,
    FaCheckCircle,
    FaShieldAlt,
    FaUsers,
    FaArrowRight,
    FaChevronDown,
    FaChevronRight,
    FaPlayCircle,
    FaFilePdf,
    FaUserFriends,
    FaUserTie,
    FaTint,
    FaFlask,
    FaSeedling,
    FaWind,
    FaSearch,
    FaRobot,
    FaComments,
    FaTimes,
    FaUpload,
    FaExclamationTriangle,
    FaVirus,
    FaClock
} from "react-icons/fa";

import API_BASE_URL from "../config";
import { useLanguage } from "../context/LanguageContext";
import { diseaseData } from "../data/diseaseData";


function DiseaseDetection() {
    const { language, t } = useLanguage();

    const fileInputRef = useRef(null);
    const videoRef = useRef(null);
    const changeImageInputRef = useRef(null);
    const streamRef = useRef(null);

    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);

    const [prediction, setPrediction] = useState(null);
    const [topPredictions, setTopPredictions] = useState([]);

    const [loading, setLoading] = useState(false);

    const [activeTab, setActiveTab] = useState("solution");

    const [openQuestion, setOpenQuestion] = useState(null);

    const [cameraOpen, setCameraOpen] = useState(false);

    const [selectedInfo, setSelectedInfo] = useState(null);
    const [showDiseaseInfo, setShowDiseaseInfo] = useState(false);

    // ---------------------------------------------------------
    // DISEASE INFORMATION
    // ---------------------------------------------------------

    const diseaseKey = prediction?.disease;

    const info = diseaseKey ? diseaseData[diseaseKey] : null;

    const diseaseName =
        info?.name?.[language] ||
        info?.name?.en ||
        diseaseKey?.replace(/_/g, " ") ||
        "";

    const getText = (value, fallback = "") => {
        if (!value) return fallback;

        if (typeof value === "string") return value;

        return (
            value?.[language] ||
            value?.en ||
            Object.values(value)[0] ||
            fallback
        );
    };

    // ---------------------------------------------------------
    // DEFAULT DATA
    // ---------------------------------------------------------

    const diseaseDescription =
        getText(info?.description) ||
        t.defaulltp;

    const cropName =
        getText(info?.crop) ||
        t.crop;

    const scientificName =
        getText(info?.scientificName) ||
        t.notavailable;

    const severity =
        getText(info?.severity) ||
        t.moderate;

    // ---------------------------------------------------------
    // DISEASE PROGRESSION
    // ---------------------------------------------------------

    const progression = info?.progression || {};

    const progressionData = [
        {
            title: t.initialstage,
            text:
                getText(progression.initial) ||
                `${diseaseName}, ${t.initialp}`
        },
        {
            title: t.moderatestage,
            text:
                getText(progression.moderate) ||
                ` ${diseaseName} ${t.moderatep}`,
        },
        {
            title: t.severestage,
            text:
                getText(progression.severe) ||
                `${t.severep}`,
        },
    ];

    // ---------------------------------------------------------
    // SOLUTIONS
    // ---------------------------------------------------------

    const solutions =
        info?.solutions ||
        [
            {
                icon: t.spray,
                title: t.fungicidespray,
                description: t.spraydesc,
                frequency: t.frequency1,
            },
            {
                icon: t.leaf,
                title: t.leaftitile,
                description: t.leafdesc,
                frequency: t.frequency2,
            },
            {
                icon: t.water,
                title: t.watertitle,
                description: t.waterdesc,
                frequency: t.frequency3,
            },
            {
                icon: t.air,
                title: t.airtitle,
                description: t.airdesc,
                frequency: t.frequency4,
            },
        ];

    // ---------------------------------------------------------
    // PREVENTION
    // ---------------------------------------------------------

    const prevention =
        info?.prevention || [
            t.prev1,
            t.prev2,
            t.prev3,
            t.prev4,
            t.prev5,
            t.prev6,
        ];


    const normalizeList = (value) => {
        if (Array.isArray(value)) {
            return value;
        }

        if (typeof value === "string") {
            return [value];
        }

        if (value && typeof value === "object") {
            return Object.values(value);
        }

        return [];
    };

    const preventionList = normalizeList(prevention);

    // ---------------------------------------------------------
    // RELATED QUESTIONS
    // ---------------------------------------------------------

    const genericQuestions = [
        t.genericQ1,
        t.genericQ2,
        t.genericQ3,
        t.genericQ4,
    ];

    const diseaseQuestions =
        prediction && diseaseName
            ? language === "te"
                ? [
                    `${diseaseName} అంటే ఏమిటి?`,
                    `${diseaseName} ను ${t.diseaseQ2}?`,
                    `${diseaseName} కు ${t.diseaseQ3}?`,
                    `${diseaseName} వ్యాప్తిని ఎలా నివారించాలి?`,
                ]
                : [
                    `${t.diseaseQ1} ${diseaseName}?`,
                    `${t.diseaseQ2} ${diseaseName}?`,
                    `${t.diseaseQ3} ${diseaseName}?`,
                    `${t.diseaseQ4} ${diseaseName} ${t.diseaseQ5}`,
                ]
            : genericQuestions;

    const getAnswer = (index) => {
        if (!prediction) {
            const answers = [
                t.ans1,
                t.ans2,
                t.ans3,
                t.ans4,
            ];

            return answers[index];
        }

        const answers =
            language === "te"
                ? [
                    diseaseDescription,

                    `${diseaseName} ను ${t.tocontrol}, ${t.ans5}`,

                    `${diseaseName} కు ${t.treatmentfor} ${t.ans6}`,

                    `${diseaseName} ${t.toprevent} ${t.ans7}`,
                ]
                : [
                    diseaseDescription,

                    `${t.tocontrol} ${diseaseName}, ${t.ans5}`,

                    `${t.treatmentfor} ${diseaseName} ${t.ans6}`,

                    `${t.toprevent} ${diseaseName} ${t.ans7}`,
                ];

        return answers[index];
    }

    // ---------------------------------------------------------
    // LOCAL STORAGE
    // ---------------------------------------------------------

    useEffect(() => {
        const savedPreview = sessionStorage.getItem(
            "diseaseDetectionPreview"
        );

        const savedPrediction = sessionStorage.getItem(
            "diseaseDetectionPrediction"
        );

        const savedTopPredictions = sessionStorage.getItem(
            "diseaseDetectionTopPredictions"
        );

        if (savedPreview) {
            setPreview(savedPreview);
        }

        if (savedPrediction) {
            try {
                setPrediction(JSON.parse(savedPrediction));
            } catch (error) {
                console.log(error);
            }
        }

        if (savedTopPredictions) {
            try {
                setTopPredictions(
                    JSON.parse(savedTopPredictions)
                );
            } catch (error) {
                console.log(error);
            }
        }
    }, []);

    // ---------------------------------------------------------
    // FILE -> BASE64
    // ---------------------------------------------------------

    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onloadend = () => {
                resolve(reader.result);
            };

            reader.onerror = reject;

            reader.readAsDataURL(file);
        });
    };

    // ---------------------------------------------------------
    // IMAGE SELECT
    // ---------------------------------------------------------

    const handleImage = async (event) => {

        const file = event.target.files?.[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert("Please select an image file.");
            event.target.value = "";
            return;
        }

        // New image
        setImage(file);

        // New preview
        const previewUrl = URL.createObjectURL(file);
        setPreview(previewUrl);

        // Remove previous prediction
        setPrediction(null);
        setTopPredictions([]);

        sessionStorage.removeItem(
            "diseaseDetectionPrediction"
        );

        sessionStorage.removeItem(
            "diseaseDetectionTopPredictions"
        );

        // Save preview
        try {

            const base64 = await fileToBase64(file);

            sessionStorage.setItem(
                "diseaseDetectionPreview",
                base64
            );

        } catch (error) {

            console.log(
                "Image save failed:",
                error
            );

        }

        // Reset input
        event.target.value = "";
    };    // ---------------------------------------------------------
    // CAMERA
    // ---------------------------------------------------------

    const openCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: "environment",
                },
                audio: false,
            });

            streamRef.current = stream;

            setCameraOpen(true);

            setTimeout(() => {
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            }, 100);
        } catch (error) {
            console.log(error);

            alert(
                "Camera permission denied or camera is not available."
            );
        }
    };

    const closeCamera = () => {
        if (streamRef.current) {
            streamRef.current
                .getTracks()
                .forEach((track) => track.stop());

            streamRef.current = null;
        }

        setCameraOpen(false);
    };

    const capturePhoto = async () => {
        if (!videoRef.current) return;

        const video = videoRef.current;

        const canvas = document.createElement("canvas");

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const context = canvas.getContext("2d");

        context.drawImage(
            video,
            0,
            0,
            canvas.width,
            canvas.height
        );

        canvas.toBlob(async (blob) => {
            if (!blob) return;

            const file = new File(
                [blob],
                "plant-camera-image.jpg",
                {
                    type: "image/jpeg",
                }
            );

            setImage(file);

            const base64 = canvas.toDataURL("image/jpeg");

            setPreview(base64);

            sessionStorage.setItem(
                "diseaseDetectionPreview",
                base64
            );

            setPrediction(null);
            setTopPredictions([]);

            sessionStorage.removeItem(
                "diseaseDetectionPrediction"
            );

            sessionStorage.removeItem(
                "diseaseDetectionTopPredictions"
            );

            closeCamera();
        }, "image/jpeg", 0.9);
    };

    // ---------------------------------------------------------
    // PREDICT
    // ---------------------------------------------------------

    const predictDisease = async () => {
        if (!image) {
            alert("Please upload or capture a plant image.");
            return;
        }

        try {
            setLoading(true);

            const formData = new FormData();

            formData.append("image", image);

            const response = await axios.post(
                `${API_BASE_URL}/api/predict/`,
                formData
            );

            console.log(
                "Django prediction:",
                response.data
            );

            const firstPrediction =
                response.data?.predictions?.[0];

            const allPredictions =
                response.data?.predictions || [];

            if (!firstPrediction) {
                alert("Disease prediction was not received.");
                return;
            }

            setPrediction(firstPrediction);

            setTopPredictions(allPredictions);

            sessionStorage.setItem(
                "diseaseDetectionPrediction",
                JSON.stringify(firstPrediction)
            );

            sessionStorage.setItem(
                "diseaseDetectionTopPredictions",
                JSON.stringify(allPredictions)
            );

            setActiveTab("solution");
        } catch (error) {
            console.log("Prediction error:", error);

            if (error.response) {
                console.log(
                    "Backend:",
                    error.response.data
                );
            }

            alert(
                "Prediction failed. Please check your Django backend."
            );
        } finally {
            setLoading(false);
        }
    };

    // ---------------------------------------------------------
    // TAB CONTENT
    // ---------------------------------------------------------

    const renderSolutionIcon = (icon) => {
        if (icon === "water")
            return <FaTint />;

        if (icon === "air")
            return <FaWind />;

        if (icon === "leaf")
            return <FaLeaf />;

        return <FaFlask />;
    };

    const renderTabContent = () => {
        if (activeTab === "solution") {
            return (
                <div className="tab-content-list">
                    {solutions.map((item, index) => (
                        <div
                            className="solution-row"
                            key={index}
                        >
                            <div className="solution-icon">
                                {renderSolutionIcon(item.icon)}
                            </div>

                            <div className="solution-text">
                                <h4>{getText(item.title)}</h4>

                                <p>
                                    {getText(item.description)}
                                </p>
                            </div>

                            <div className="solution-frequency">
                                <FaCheckCircle />
                                <span>
                                    {getText(item.frequency)}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            );
        }

        if (activeTab === "prevention") {
            return (
                <div className="tab-prevention-content">
                    {preventionList.map((item, index) => (
                        <div
                            className="prevention-row"
                            key={index}
                        >
                            <FaCheckCircle />
                            <span>{getText(item)}</span>
                        </div>
                    ))}
                </div>
            );
        }

        if (activeTab === "similar") {
            const similar =
                info?.similarDiseases || [
                    t.leafspot5,
                    t.bacteria,
                    t.powedry,
                ];

            return (
                <div className="similar-disease-list">
                    {similar.map((item, index) => (
                        <div
                            className="similar-item"
                            key={index}
                        >
                            <FaSearch />

                            <span>
                                {getText(item)}
                            </span>

                            <FaChevronRight />
                        </div>
                    ))}
                </div>
            );
        }

        return (
            <div className="ask-ai-content">
                <FaRobot />

                <div>
                    <h4>{t.askaiabt} {diseaseName}</h4>

                    <p>
                        {t.askaip}
                    </p>
                </div>
            </div>
        );
    };

    // ---------------------------------------------------------
    // RELATED INFORMATION
    // ---------------------------------------------------------

    const relatedInfo = [
        {
            type: "video",
            icon: <FaPlayCircle />,
            title: t.videoguide,
            subtitle: t.videosubtitle,
            content:
                info?.videoGuide ||
                `${t.videocontent} ${diseaseName}.`,
        },
        {
            type: "pdf",
            icon: <FaFilePdf />,
            title: t.pdfguide,
            subtitle: t.pdfsubtitle,
            content:
                info?.pdfGuide ||
                `${t.pdfcontent1} ${diseaseName} ${t.pdfcontent2}`,
        },
        {
            type: "farmer",
            icon: <FaUserFriends />,
            title: t.farmerexp,
            subtitle: t.farmersubtitle,
            content:
                info?.farmerExperiences ||
                `${t.farmercontent} ${diseaseName}.`,
        },
        {
            type: "expert",
            icon: <FaUserTie />,
            title: t.expertadvice,
            subtitle: t.expertsubtitle,
            content:
                info?.expertAdvice ||
                `${t.farmercontent} ${diseaseName}.`,
        },
    ];

    // ---------------------------------------------------------
    // RETURN
    // ---------------------------------------------------------

    return (
        <div className="disease-page">

            {/* =====================================================
          HEADER
      ===================================================== */}

            <section className="disease-header">

                <div>
                    <h1>{t.header}</h1>

                    <p>
                        {t.hp}
                    </p>
                </div>

                <div className="header-message">
                    <i>
                        {t.healthy}...
                        <br />
                        {t.farmers}...!
                    </i>
                </div>

                <div className="header-telugu">
                    “పంట ఆరోగ్యం
                    <br />
                    రైతు సంపద”
                </div>

            </section>

            {/* Disease Detection Announcements */}

            <div className="disease-announcements">

                {/* Announcement 1 */}
                <div className="disease-marquee paddy-notice">
                    <div className="marquee-text">
                        <span>
                            🌾 {t.paddyOnlyNotice}
                        </span>
                    </div>
                </div>

                {/* Announcement 2 */}
                <div className="disease-marquee image-notice">
                    <div className="marquee-text">
                        <span>
                            📸 {t.clearImageNotice}
                        </span>
                    </div>
                </div>

            </div>

            {/* =====================================================
          FOUR STEPS
      ===================================================== */}

            <section className="steps-bar">

                <div className="step-item">
                    <div className="step-circle">
                        <FaCamera />
                    </div>

                    <div>
                        <strong>
                            1&nbsp; {t.uploadplnimg}
                        </strong>

                        <small>
                            {t.selectimg}
                        </small>
                    </div>

                    <FaArrowRight className="step-arrow" />
                </div>

                <div className="step-item">
                    <div className="step-circle">
                        <FaLeaf />
                    </div>

                    <div>
                        <strong>
                            2&nbsp; {t.analysis}
                        </strong>

                        <small>
                            {t.ourmodel}
                        </small>
                    </div>

                    <FaArrowRight className="step-arrow" />
                </div>

                <div className="step-item">
                    <div className="step-circle">
                        <FaCheckCircle />
                    </div>

                    <div>
                        <strong>
                            3&nbsp; {t.getresult}
                        </strong>

                        <small>
                            {t.disease_sol}
                        </small>
                    </div>

                    <FaArrowRight className="step-arrow" />
                </div>

                <div className="step-item last-step">
                    <div className="step-circle">
                        <FaUsers />
                    </div>

                    <div>
                        <strong>
                            4&nbsp; {t.takeaction}
                        </strong>

                        <small>
                            {t.prot}
                        </small>
                    </div>
                </div>

            </section>

            {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

            <main className="disease-main">

                {/* ===================================================
            LEFT + CENTER
        =================================================== */}

                <div className="disease-left">

                    {/* ===============================================
              UPLOAD CARD
          =============================================== */}

                    {/* =====================================================
    DISEASE INFORMATION CARD
===================================================== */}

                    {showDiseaseInfo && info && (
                        <div className="disease-info-overlay">

                            <div className="disease-info-popup">

                                {/* CLOSE BUTTON */}

                                <button
                                    type="button"
                                    className="disease-info-close"
                                    onClick={() => setShowDiseaseInfo(false)}
                                >
                                    <FaTimes />
                                </button>


                                {/* HEADER */}

                                <div className="disease-info-popup-header">

                                    <div className="disease-info-title-icon">
                                        <FaLeaf />
                                    </div>

                                    <div>
                                        <span className="disease-info-label">
                                            {t.plantInfo}
                                        </span>

                                        <h2>
                                            {info.name?.[language] ||
                                                info.name?.en ||
                                                diseaseName}
                                        </h2>

                                        <p>
                                            {t.plantDetails}
                                        </p>
                                    </div>

                                </div>


                                {/* BASIC INFORMATION */}

                                <div className="disease-info-basic-grid">

                                    {/* SYMPTOMS */}

                                    <div className="disease-info-small-card symptoms-info">

                                        <div className="disease-info-small-title">
                                            <FaExclamationTriangle />
                                            <h3>{t.symptoms}</h3>
                                        </div>

                                        <p>
                                            {getText(info.symptoms)}
                                        </p>

                                    </div>


                                    {/* CAUSES */}

                                    <div className="disease-info-small-card causes-info">

                                        <div className="disease-info-small-title">
                                            <FaVirus />
                                            <h3>{t.causes}</h3>
                                        </div>

                                        <p>
                                            {getText(info.causes)}
                                        </p>

                                    </div>


                                    {/* PREVENTION */}

                                    <div className="disease-info-small-card prevention-info">

                                        <div className="disease-info-small-title">
                                            <FaShieldAlt />
                                            <h3>{t.prevention}</h3>
                                        </div>

                                        <p>
                                            {getText(info.prevention)}
                                        </p>

                                    </div>

                                </div>


                                {/* CHEMICAL TREATMENT */}

                                {info.chemicalTreatment && (
                                    <section className="popup-treatment-section">

                                        <div className="popup-section-heading">

                                            <div className="popup-section-icon chemical">
                                                <FaFlask />
                                            </div>

                                            <div>
                                                <h3>{t.chemicalTreatment}</h3>

                                                <p>
                                                    {t.recomm}
                                                </p>
                                            </div>

                                        </div>


                                        <div className="popup-treatment-grid">

                                            {/* FIRST APPLICATION */}

                                            {info.chemicalTreatment.firstApplication && (
                                                <div className="popup-treatment-card">

                                                    <div className="popup-application-number">
                                                        01
                                                    </div>

                                                    <h4>
                                                        {t.firstApplication}
                                                    </h4>

                                                    <div className="popup-treatment-row">
                                                        <strong>{t.product}</strong>

                                                        <span>
                                                            {getText(
                                                                info.chemicalTreatment
                                                                    .firstApplication.product
                                                            )}
                                                        </span>
                                                    </div>

                                                    <div className="popup-treatment-row">
                                                        <strong>{t.dosage}</strong>

                                                        <span>
                                                            {getText(
                                                                info.chemicalTreatment
                                                                    .firstApplication.dosage
                                                            )}
                                                        </span>
                                                    </div>

                                                    <div className="popup-treatment-row">
                                                        <strong>{t.dosagePerAcre}</strong>

                                                        <span>
                                                            {getText(
                                                                info.chemicalTreatment
                                                                    .firstApplication
                                                                    .dosagePerAcre
                                                            )}
                                                        </span>
                                                    </div>

                                                    <div className="popup-treatment-row">
                                                        <strong>{t.timing}</strong>

                                                        <span>
                                                            <FaClock />
                                                            {getText(
                                                                info.chemicalTreatment
                                                                    .firstApplication.timing
                                                            )}
                                                        </span>
                                                    </div>

                                                </div>
                                            )}


                                            {/* FOLLOW UP */}

                                            {info.chemicalTreatment.followUpApplication && (
                                                <div className="popup-treatment-card">

                                                    <div className="popup-application-number">
                                                        02
                                                    </div>

                                                    <h4>
                                                        {t.followUpApplication}
                                                    </h4>

                                                    <div className="popup-treatment-row">
                                                        <strong>{t.product}</strong>

                                                        <span>
                                                            {getText(
                                                                info.chemicalTreatment
                                                                    .followUpApplication.product
                                                            )}
                                                        </span>
                                                    </div>

                                                    <div className="popup-treatment-row">
                                                        <strong>{t.dosage}</strong>

                                                        <span>
                                                            {getText(
                                                                info.chemicalTreatment
                                                                    .followUpApplication.dosage
                                                            )}
                                                        </span>
                                                    </div>

                                                    <div className="popup-treatment-row">
                                                        <strong>{t.dosagePerAcre}</strong>

                                                        <span>
                                                            {getText(
                                                                info.chemicalTreatment
                                                                    .followUpApplication
                                                                    .dosagePerAcre
                                                            )}
                                                        </span>
                                                    </div>

                                                    <div className="popup-treatment-row">
                                                        <strong>{t.timing}</strong>

                                                        <span>
                                                            <FaClock />
                                                            {getText(
                                                                info.chemicalTreatment
                                                                    .followUpApplication.timing
                                                            )}
                                                        </span>
                                                    </div>

                                                </div>
                                            )}

                                        </div>

                                    </section>
                                )}


                                {/* NATURAL TREATMENT */}

                                {info.naturalTreatment && (
                                    <section className="popup-treatment-section natural-popup-section">

                                        <div className="popup-section-heading">

                                            <div className="popup-section-icon natural">
                                                <FaSeedling />
                                            </div>

                                            <div>
                                                <h3>{t.naturalTreatment}</h3>

                                                <p>
                                                    {t.naturalDesc}
                                                </p>
                                            </div>

                                        </div>


                                        <div className="popup-treatment-grid">

                                            {/* FIRST */}

                                            {info.naturalTreatment.firstApplication && (
                                                <div className="popup-treatment-card natural-treatment-card">

                                                    <div className="popup-application-number">
                                                        01
                                                    </div>

                                                    <h4>
                                                        {t.firstApplication}
                                                    </h4>

                                                    <div className="popup-treatment-row">
                                                        <strong>{t.product}</strong>

                                                        <span>
                                                            {getText(
                                                                info.naturalTreatment
                                                                    .firstApplication.product
                                                            )}
                                                        </span>
                                                    </div>

                                                    <div className="popup-treatment-row">
                                                        <strong>{t.dosage}</strong>

                                                        <span>
                                                            {getText(
                                                                info.naturalTreatment
                                                                    .firstApplication.dosage
                                                            )}
                                                        </span>
                                                    </div>

                                                    <div className="popup-treatment-row">
                                                        <strong>{t.dosagePerAcre}</strong>

                                                        <span>
                                                            {getText(
                                                                info.naturalTreatment
                                                                    .firstApplication
                                                                    .dosagePerAcre
                                                            )}
                                                        </span>
                                                    </div>

                                                    <div className="popup-treatment-row">
                                                        <strong>{t.timing}</strong>

                                                        <span>
                                                            <FaClock />
                                                            {getText(
                                                                info.naturalTreatment
                                                                    .firstApplication.timing
                                                            )}
                                                        </span>
                                                    </div>

                                                </div>
                                            )}


                                            {/* FOLLOW UP */}

                                            {info.naturalTreatment.followUpApplication && (
                                                <div className="popup-treatment-card natural-treatment-card">

                                                    <div className="popup-application-number">
                                                        02
                                                    </div>

                                                    <h4>
                                                        {t.followUpApplication}
                                                    </h4>

                                                    <div className="popup-treatment-row">
                                                        <strong>{t.product}</strong>

                                                        <span>
                                                            {getText(
                                                                info.naturalTreatment
                                                                    .followUpApplication.product
                                                            )}
                                                        </span>
                                                    </div>

                                                    <div className="popup-treatment-row">
                                                        <strong>{t.dosage}</strong>

                                                        <span>
                                                            {getText(
                                                                info.naturalTreatment
                                                                    .followUpApplication.dosage
                                                            )}
                                                        </span>
                                                    </div>

                                                    <div className="popup-treatment-row">
                                                        <strong>{t.dosagePerAcre}</strong>

                                                        <span>
                                                            {getText(
                                                                info.naturalTreatment
                                                                    .followUpApplication
                                                                    .dosagePerAcre
                                                            )}
                                                        </span>
                                                    </div>

                                                    <div className="popup-treatment-row">
                                                        <strong>{t.timing}</strong>

                                                        <span>
                                                            <FaClock />
                                                            {getText(
                                                                info.naturalTreatment
                                                                    .followUpApplication.timing
                                                            )}
                                                        </span>
                                                    </div>

                                                </div>
                                            )}

                                        </div>

                                    </section>
                                )}

                            </div>

                        </div>
                    )}

                    <section className="upload-card-new">

                        <div className="upload-title">
                            <FaCamera />

                            <div>
                                <h2>{t.uploadplnimg}</h2>

                                <p>
                                    {t.uploadimgp}
                                </p>
                            </div>
                        </div>

                        {!preview ? (
                            <div className="upload-area">

                                <FaCloudUploadAlt className="upload-big-icon" />

                                <h3>
                                    {t.uploadplnimg}
                                </h3>

                                <p>
                                    {t.uploadimg2}
                                </p>

                                <span className="upload-format">
                                    JPG, PNG, WEBP | Max 10MB
                                </span>

                                <div className="upload-buttons">

                                    <button
                                        onClick={() =>
                                            fileInputRef.current?.click()
                                        }
                                    >
                                        <FaUpload />
                                        {t.uploadimg}
                                    </button>

                                    <span>OR</span>

                                    <button
                                        className="take-photo-btn"
                                        onClick={openCamera}
                                    >
                                        <FaCamera />
                                        {t.takephoto}
                                    </button>

                                    <button
                                        className="gallery-btn"
                                        onClick={() =>
                                            fileInputRef.current?.click()
                                        }
                                    >
                                        <FaUpload />
                                        {t.gallery}
                                    </button>

                                </div>

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    hidden
                                    onChange={handleImage}
                                />

                            </div>
                        ) : (
                            <div className="uploaded-preview-area">

                                <div className="preview-image-wrapper">

                                    <img
                                        src={preview}
                                        alt="Uploaded plant"
                                    />

                                    <button
                                        type="button"
                                        className="change-image-btn"
                                        onClick={() => {
                                            changeImageInputRef.current?.click();
                                        }}
                                    >
                                        <FaCamera />
                                        {t.changeimg}
                                    </button>

                                    <input
                                        ref={changeImageInputRef}
                                        type="file"
                                        accept="image/*"
                                        style={{ display: "none" }}
                                        onChange={handleImage}
                                    />
                                </div>

                                {!prediction && (
                                    <div className="predict-container">

                                        <button
                                            className="predict-main-btn"
                                            onClick={predictDisease}
                                            disabled={loading}
                                        >
                                            <FaLeaf />

                                            {loading
                                                ? "Analysing..."
                                                : "Predict Disease"}
                                        </button>

                                    </div>
                                )}

                            </div>
                        )}

                    </section>

                    {/* ===============================================
              RESULT AREA
              ONLY AFTER DISEASE IDENTIFIED
          =============================================== */}

                    {prediction && (
                        <>

                            {/* ==========================================
                  PREDICTION + PROGRESSION
              ========================================== */}

                            <section className="result-top-grid">

                                {/* PREDICTION */}

                                <div className="prediction-result-card">

                                    <div className="result-image-box">

                                        {preview && (
                                            <img
                                                src={preview}
                                                alt="Plant leaf"
                                            />
                                        )}

                                    </div>

                                    <div className="prediction-details">

                                        <div className="detected-label">
                                            {t.diseasedetected}
                                        </div>

                                        <div className="prediction-name-row">

                                            <h2>
                                                {diseaseName}
                                            </h2>

                                            <span className="confidence-badge">
                                                {prediction.confidence?.toFixed(
                                                    0
                                                )}
                                                % {t.Confidence}
                                            </span>

                                        </div>

                                        <div className="crop-detail">
                                            <strong>{t.crop2}</strong>
                                            <span>{cropName}</span>
                                        </div>

                                        <div className="crop-detail">
                                            <strong>{t.scientificname}</strong>
                                            <span>{scientificName}</span>
                                        </div>

                                        <div className="crop-detail">
                                            <strong>{t.Severity}</strong>

                                            <span className="severity-badge">
                                                {severity}
                                            </span>
                                        </div>

                                        <p className="disease-description">
                                            {diseaseDescription}
                                        </p>

                                        <button
                                            type="button"
                                            className="view-disease-info-btn"
                                            onClick={() => setShowDiseaseInfo(true)}
                                        >
                                            <FaLeaf />
                                            {t.viewDiseaseInfo}
                                        </button>

                                    </div>

                                </div>

                                {/* PROGRESSION */}

                                <div className="progression-card">

                                    <h3>
                                        {t.DiseaseProgression}
                                    </h3>

                                    <div className="progression-list">

                                        {progressionData.map(
                                            (stage, index) => (
                                                <div
                                                    className="progression-item"
                                                    key={index}
                                                >

                                                    <div className="progression-number">
                                                        {index + 1}
                                                    </div>

                                                    <div>
                                                        <h4>
                                                            {stage.title}
                                                        </h4>

                                                        <p>
                                                            {stage.text}
                                                        </p>
                                                    </div>

                                                </div>
                                            )
                                        )}

                                    </div>

                                </div>

                            </section>

                            {/* ==========================================
                  LOWER CONTENT
              ========================================== */}

                            <section className="lower-result-grid">

                                {/* LEFT */}

                                <div className="treatment-column">

                                    {/* TABS */}

                                    <div className="result-tabs">

                                        <button
                                            className={
                                                activeTab === "solution"
                                                    ? "active"
                                                    : ""
                                            }
                                            onClick={() =>
                                                setActiveTab("solution")
                                            }
                                        >
                                            <FaLeaf />
                                            {t.SolutionTreatment}
                                        </button>

                                        <button
                                            className={
                                                activeTab === "prevention"
                                                    ? "active"
                                                    : ""
                                            }
                                            onClick={() =>
                                                setActiveTab("prevention")
                                            }
                                        >
                                            <FaShieldAlt />
                                            {t.PreventiveMeasures}
                                        </button>

                                        <button
                                            className={
                                                activeTab === "similar"
                                                    ? "active"
                                                    : ""
                                            }
                                            onClick={() =>
                                                setActiveTab("similar")
                                            }
                                        >
                                            <FaSearch />
                                            {t.SimilarDiseases}
                                        </button>

                                        <button
                                            className={
                                                activeTab === "ask"
                                                    ? "active"
                                                    : ""
                                            }
                                            onClick={() =>
                                                setActiveTab("ask")
                                            }
                                        >
                                            <FaComments />
                                            {t.AskAINow}
                                        </button>

                                    </div>

                                    {/* TAB PANEL */}

                                    <div className="tab-panel">

                                        <h3>
                                            {activeTab === "solution" &&
                                                "Solution & Treatment"}

                                            {activeTab === "prevention" &&
                                                "Preventive Measures"}

                                            {activeTab === "similar" &&
                                                "Similar Diseases"}

                                            {activeTab === "ask" &&
                                                "Ask AI"}
                                        </h3>

                                        {renderTabContent()}

                                    </div>

                                </div>

                                {/* RIGHT */}

                                <div className="right-result-column">

                                    {/* PREVENTION */}

                                    <div className="prevention-card">

                                        <div className="prevention-heading">

                                            <FaShieldAlt />

                                            <h3>
                                                {t.PreventionTips}
                                            </h3>

                                        </div>

                                        <div className="prevention-list">

                                            {preventionList.map((item, index) => (
                                                <div
                                                    key={index}
                                                    className="prevention-item"
                                                >
                                                    <FaCheckCircle />

                                                    <span>
                                                        {getText(item)}
                                                    </span>
                                                </div>
                                            ))}

                                        </div>

                                    </div>

                                </div>

                            </section>

                        </>
                    )}

                </div>

                {/* ===================================================
            RIGHT SIDEBAR
        =================================================== */}

                <aside className="disease-sidebar">

                    {/* ===============================================
              AI ASSISTANT
          =============================================== */}

                    <div className="ai-assistant-card">

                        <div className="ai-header">

                            <div className="ai-title">

                                <div className="robot-icon">
                                    <FaRobot />
                                </div>

                                <strong>
                                    {t.aiassistant}
                                </strong>

                            </div>

                            <span className="online">
                                <i></i>
                                {t.online}
                            </span>

                        </div>

                        <p className="ai-intro">
                            {prediction
                                ? `Ask anything about ${diseaseName}.`
                                : "Do you have any questions about this disease? Ask me in Telugu or English."}
                        </p>

                        <div className="ai-questions">

                            {diseaseQuestions.map(
                                (question, index) => {

                                    const isOpen =
                                        openQuestion === index;

                                    return (
                                        <div
                                            className={`ai-question ${isOpen ? "open" : ""
                                                }`}
                                            key={index}
                                        >

                                            <button
                                                onClick={() =>
                                                    setOpenQuestion(
                                                        isOpen
                                                            ? null
                                                            : index
                                                    )
                                                }
                                            >

                                                <span>
                                                    <FaChevronRight />
                                                    {question}
                                                </span>

                                                <FaChevronDown
                                                    className={
                                                        isOpen
                                                            ? "rotate"
                                                            : ""
                                                    }
                                                />

                                            </button>

                                            {isOpen && (
                                                <div className="ai-answer">
                                                    {getAnswer(index)}
                                                </div>
                                            )}

                                        </div>
                                    );
                                }
                            )}

                        </div>

                        <button
                            className="ask-ai-now"
                            onClick={() =>
                                setActiveTab("ask")
                            }
                        >
                            <FaComments />
                            {t.AskAINow}
                        </button>

                    </div>

                    {/* ===============================================
              RELATED INFORMATION
          =============================================== */}

                    <div className="related-card">

                        <h3>
                            {t.RelatedInformation}
                        </h3>

                        {relatedInfo.map(
                            (item, index) => (
                                <button
                                    className={`related-item ${item.type}`}
                                    key={index}
                                    onClick={() =>
                                        setSelectedInfo(item)
                                    }
                                >

                                    <div className="related-icon">
                                        {item.icon}
                                    </div>

                                    <div>
                                        <strong>
                                            {item.title}
                                        </strong>

                                        <span>
                                            {item.subtitle}
                                        </span>
                                    </div>

                                </button>
                            )
                        )}

                    </div>

                </aside>

            </main>

            {/* =====================================================
          INFO MODAL
      ===================================================== */}

            {selectedInfo && (
                <div className="info-modal-overlay">

                    <div className="info-modal">

                        <button
                            className="modal-close"
                            onClick={() =>
                                setSelectedInfo(null)
                            }
                        >
                            <FaTimes />
                        </button>

                        <div className="modal-icon">
                            {selectedInfo.icon}
                        </div>

                        <h2>
                            {selectedInfo.title}
                        </h2>

                        <p>
                            {selectedInfo.content}
                        </p>

                        <button
                            className="modal-ok"
                            onClick={() =>
                                setSelectedInfo(null)
                            }
                        >
                            {t.Close}
                        </button>

                    </div>

                </div>
            )}

            {/* =====================================================
          CAMERA MODAL
      ===================================================== */}

            {cameraOpen && (
                <div className="camera-overlay">

                    <div className="camera-modal">

                        <button
                            className="camera-close"
                            onClick={closeCamera}
                        >
                            <FaTimes />
                        </button>

                        <h2>
                            {t.TakePlantPhoto}
                        </h2>

                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            className="camera-video"
                        />

                        <button
                            className="capture-btn"
                            onClick={capturePhoto}
                        >
                            <FaCamera />
                            {t.CapturePhoto}
                        </button>

                    </div>

                </div>
            )}

            {/* Update Notice */}

            {/* Disease Detection Announcements */}

            <div className="disease-announcements">



                <div className="disease-marquee image-notice">
                    <div className="marquee-text">
                        <span style={{ color: 'black' }}>
                            🔔 {t.lastmarquee}
                        </span>
                    </div>
                </div>

            </div>

            {/* =====================================================
          FOOTER
      ===================================================== */}

            <footer className="disease-footer">

                <div className="footer-brand">

                    <h2>
                        <FaLeaf />
                        {t.rythumitraai}
                    </h2>

                    <p>
                        {t.aitech}
                    </p>

                </div>

                <div className="footer-links">

                    <h3>{t.links}</h3>

                    <span>{t.dashboard}</span>
                    <span>{t.aiassistant}</span>
                    <span>{t.diseasedetection}</span>

                </div>

                <div className="footer-links">

                    <h3>{t.farmersupport}</h3>

                    <span>{t.smartFarming}</span>
                    <span>{t.cropmonitoring}</span>
                    <span>{t.aiassistant}</span>

                </div>

                <div className="footer-bottom">
                  <img src="/Images/rm_btm_logo.png" className="bottom-logo" alt="" />  © 2026 {t.rythumitraai}. {t.rights}.
                    <br /> {t.authors}
                </div>
                

            </footer>

        </div>
    );
}

export default DiseaseDetection;