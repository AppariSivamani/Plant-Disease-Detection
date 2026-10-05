import React, { useState } from "react";
import {
    FaCalendarAlt,
    FaLeaf,
    FaTractor,
    FaSeedling,
    FaCheckCircle,
    FaLightbulb
} from "react-icons/fa";
import { useLanguage } from "../context/LanguageContext";



function CropReport() {
    const { t } = useLanguage();

    const [selectedSeason, setSelectedSeason] = useState("Sarva");


    const PADDY_REPORT_DATA = {
        Sarva: {
            duration: `${145} ${t.days}`,

            beforeCultivation: [
                {
                    product: t.PaddySeed,
                    dosage: t.psd
                },
                {
                    product: t.dap,
                    dosage: t.dapd
                },

            ],

            afterCultivation: [
                {
                    product: t.aftercultp,
                    dosage: t.aftercultd
                },


            ],

            firstStage: {
                days: `${t.day4} ${20}, ${25} ${t.day6}`,
                subtitle: t.fsp,

                products: [
                    {
                        product: t.firstsp,
                        dosage: t.firstsd
                    },
                    {
                        product: t.firstsp2,
                        dosage: t.aftercultd
                    }

                ]
            },

            secondStage: {
                days: `${t.day4}  ${40} ${t.day6}`,
                subtitle: t.ssp,

                products: [
                    {
                        product: t.secondsp,
                        dosage: t.secondsd
                    },

                ]
            },

            thirdStage: {
                days: `${t.day4}  ${50} ${t.day6}`,
                subtitle: t.tsd,

                products: [
                    {
                        product: t.thirdsp,
                        dosage: t.thirdsd
                    },

                ]
            }
        },

        Dalwa: {
            duration: `${135} ${t.days}`,

            beforeCultivation: [
                {
                    product: t.PaddySeed,
                    dosage: t.psd
                },
                {
                    product: t.dap,
                    dosage: t.dapd
                },

            ],

            afterCultivation: [
                {
                    product: t.aftercultp,
                    dosage: t.aftercultd
                },


            ],

            firstStage: {
                days: `${t.day4} ${15}, ${20}, ${30} ${t.day6}`,
                subtitle: t.fsp,

                products: [
                    {
                        product: t.firstsp,
                        dosage: t.firstsd
                    },
                    {
                        product: t.firstsp2,
                        dosage: t.aftercultd
                    },
                    {
                        product: t.firstsp2,
                        dosage: t.firstsp2d
                    }
                ]
            },

            secondStage: {
                days: `${t.day4} ${32}, ${36}, ${45}, ${50}, ${70} ${t.day6}`,
                subtitle: t.ssp,

                products: [
                    {
                        product: t.urea,
                        dosage: t.ud
                    },
                    {
                        product: t.secondsp2,
                        dosage: t.secondsp2d
                    },
                    {
                        product: t.secondsp,
                        dosage: t.secondsd
                    },
                    {
                        product: t.secondsp3,
                        dosage: t.secondsp3d
                    },
                    {
                        product: t.secondsp4,
                        dosage: t.secondsp4d
                    }
                ]
            },

            thirdStage: {
                days: `${t.day4} ${90}, ${100}, ${120} ${t.day6}`,
                subtitle: t.tsd,

                products: [
                    {
                        product: t.thirdsp2,
                        dosage: t.secondsp2d
                    },
                    {
                        product: t.thirdsp3,
                        dosage: t.thirdsp3d
                    },
                    {
                        product: t.thirdsp4,
                        dosage: t.thirdsp4d
                    }
                ]
            }
        }
    };

    function ProductTable({ products, type = "green" }) {

        return (
            <div className={`product-table ${type}`}>

                <div className="product-table-header">
                    <span>{t.product}</span>
                    <span>{t.dosage}</span>
                </div>

                {products.map((item, index) => (
                    <div
                        className="product-table-row"
                        key={`${item.product}-${index}`}
                    >
                        <span>{item.product}</span>
                        <span>{item.dosage}</span>
                    </div>
                ))}

            </div>
        );
    }

    const report = PADDY_REPORT_DATA[selectedSeason];







    return (
        <div className="crop-report-page">


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="crop-report-header">



                <div className="crop-report-title">

                    <div className="title-leaf">
                        <FaLeaf />
                    </div>

                    <div>
                        <h1>{t.CropReport}</h1>

                        <p>
                            {t.crp}
                        </p>
                    </div>

                </div>

            </div>


            {/* =================================================
                CROP INFORMATION
            ================================================= */}

            <div className="crop-information-card">


                {/* LEFT */}

                <div className="crop-information-left">

                    <div className="paddy-image-box">
                        <img
                            src="/Images/Crop_Report/third_satge.jpeg"
                            alt="Paddy"
                        />


                    </div>


                    <div className="crop-information-content">

                        <h2>
                            {t.paddy} (Rice)
                        </h2>


                        {/* =====================================
                            SARVA / DALWA BUTTONS
                        ===================================== */}

                        <div className="season-buttons">

                            <button
                                type="button"
                                className={
                                    selectedSeason === "Sarva"
                                        ? "season-button active"
                                        : "season-button"
                                }
                                onClick={() =>
                                    setSelectedSeason("Sarva")
                                }
                            >
                                🌾 {t.sarva}
                            </button>


                            <button
                                type="button"
                                className={
                                    selectedSeason === "Dalwa"
                                        ? "season-button active"
                                        : "season-button"
                                }
                                onClick={() =>
                                    setSelectedSeason("Dalwa")
                                }
                            >
                                🌾 {t.dalwa}
                            </button>

                        </div>


                        {/* META */}

                        <div className="crop-meta">

                            <span>
                                <FaCalendarAlt />
                                {report.duration}
                            </span>

                            <span className="meta-separator">
                                |
                            </span>

                            <span>
                                <FaLeaf />
                                {t.FieldCrop}
                            </span>

                        </div>

                    </div>

                </div>


                {/* RIGHT */}

                

            </div>


            {/* =================================================
                REPORT CARDS
            ================================================= */}

            <div className="crop-report-grid">


                {/* =================================================
                    1. LAND PREPARATION
                ================================================= */}

                <div className="report-card land-preparation-card">

                    <div className="stage-round-icon">
                        <FaTractor />
                    </div>

                    <h3>
                        {t.LandPreparation}
                    </h3>

                    <p className="stage-description">
                        {t.lpp}
                    </p>


                    <div className="stage-image">

                        <img
                            src="/Images/Crop_Report/land_cultivation.jpeg"
                            alt="Land Preparation"
                        />

                    </div>


                    <div className="activities-box">

                        <h4>
                            {t.KeyActivities}
                        </h4>


                        <div className="activity-item">

                            <FaCheckCircle />

                            <span>
                                {t.lpp2}
                            </span>

                        </div>


                        <div className="activity-item">

                            <FaCheckCircle />

                            <span>
                                {t.lpp3}
                            </span>

                        </div>


                        <div className="activity-item">

                            <FaCheckCircle />

                            <span>
                                {t.lpp4}
                            </span>

                        </div>

                    </div>

                </div>


                {/* =================================================
                    2. BEFORE CULTIVATION
                ================================================= */}

                <div className="report-card before-cultivation-card">

                    <div className="stage-round-icon">
                        <FaSeedling />
                    </div>

                    <h3>
                        {t.BeforeCultivation}
                    </h3>

                    <p className="stage-description">
                        {t.bcp}
                    </p>


                    <div className="stage-image">

                        <img
                            src="/Images/Crop_Report/before_cultivation.jpeg"
                            alt="Before Cultivation"
                        />

                    </div>


                    <ProductTable
                        products={report.beforeCultivation}
                        type="blue"
                    />

                </div>


                {/* =================================================
                    3. AFTER CULTIVATION
                ================================================= */}

                <div className="report-card after-cultivation-card">

                    <div className="stage-round-icon">
                        <FaSeedling />
                    </div>

                    <h3>
                        {t.AfterCultivation}
                    </h3>

                    <div className="days">{t.day4}  3 {t.day6}</div>

                    <p className="stage-description">
                        {t.afp}
                    </p>


                    <div className="stage-image">

                        <img
                            src="/Images/Crop_Report/after_cultivaton.jpeg"
                            alt="After Cultivation"
                        />

                    </div>


                    <ProductTable
                        products={report.afterCultivation}
                        type="blue"
                    />
                </div>


                {/* =================================================
                    4. FIRST STAGE
                ================================================= */}

                <div className="report-card first-stage-card">

                    <div className="stage-round-icon">
                        <FaSeedling />
                    </div>

                    <h3>
                        {t.FirstStage}
                    </h3>

                    <div className="stage-days">
                        {report.firstStage.days}
                    </div>

                    <p className="stage-subtitle">
                        ({report.firstStage.subtitle})
                    </p>


                    <div className="stage-image">

                        <img
                            src="/Images/Crop_Report/first_stage.jpeg"
                            alt="First Stage"
                        />

                    </div>


                    <ProductTable
                        products={report.firstStage.products}
                        type="pink"
                    />

                </div>


                {/* =================================================
                    5. SECOND STAGE
                ================================================= */}

                <div className="report-card second-stage-card">

                    <div className="stage-round-icon">
                        <FaSeedling />
                    </div>

                    <h3>
                        {t.SecondStage}
                    </h3>

                    <div className="stage-days">
                        {report.secondStage.days}
                    </div>

                    <p className="stage-subtitle">
                        ({report.secondStage.subtitle})
                    </p>


                    <div className="stage-image">

                        <img
                            src="/Images/Crop_Report/second_stage.jpeg"
                            alt="Second Stage"
                        />

                    </div>


                    <ProductTable
                        products={report.secondStage.products}
                        type="purple"
                    />

                </div>


                {/* =================================================
                    6. THIRD STAGE
                ================================================= */}

                <div className="report-card third-stage-card">

                    <div className="stage-round-icon grain-icon">
                        🌾
                    </div>

                    <h3>
                        {t.ThirdStage}
                    </h3>

                    <div className="stage-days">
                        {report.thirdStage.days}
                    </div>

                    <p className="stage-subtitle">
                        ({report.thirdStage.subtitle})
                    </p>


                    <div className="stage-image">

                        <img
                            src="/Images/Crop_Report/third_satge.jpeg"
                            alt="Third Stage"
                        />

                    </div>


                    <ProductTable
                        products={report.thirdStage.products}
                        type="teal"
                    />

                </div>

            </div>


            {/* =================================================
                PRO TIP
            ================================================= */}

            <div className="crop-pro-tip">

                <div className="pro-tip-icon">
                    <FaLightbulb />
                </div>

                <strong>
                    {t.ProTip}:
                </strong>

                <span>
                    {t.protipsp}
                </span>

            </div>

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


export default CropReport;