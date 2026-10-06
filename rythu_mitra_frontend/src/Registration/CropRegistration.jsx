import React, {
    useState,
    useEffect,
    useRef,
} from "react";

import axios from "axios";

import {
    FaUser,
    FaPhone,
    FaMapMarkerAlt,
    FaRulerCombined,
    FaSeedling,
    FaCalendarAlt,
    FaLeaf,
    FaArrowRight,
    FaArrowLeft,
    FaGithub,
    FaLinkedin,
    FaEnvelope,
    FaChartLine,
    FaRobot
} from "react-icons/fa";

import "./Registration.css";

import { useLanguage } from "../context/LanguageContext";
import { useNavigate } from "react-router-dom";


// =====================================================
// CUSTOM DROPDOWN
// =====================================================

function CustomDropdown({
    label,
    icon,
    value,
    options,
    placeholder,
    onChange,
    disabled = false,
}) {

    const [open, setOpen] = useState(false);

    // -------------------------------------------------
    // IMPORTANT REFS
    // -------------------------------------------------

    const buttonRef = useRef(null);

    const menuRef = useRef(null);


    // -------------------------------------------------
    // MENU POSITION
    // -------------------------------------------------

    const [menuPosition, setMenuPosition] = useState({
        top: 0,
        left: 0,
        width: 0,
    });


    // -------------------------------------------------
    // SELECTED OPTION
    // -------------------------------------------------

    const selectedOption = options.find(
        (option) =>
            option.value === value
    );


    // =================================================
    // UPDATE MENU POSITION
    // =================================================

    const updatePosition = () => {

        if (!buttonRef.current) {
            return;
        }


        const rect =
            buttonRef.current.getBoundingClientRect();


        setMenuPosition({

            top:
                rect.bottom + 8,

            left:
                rect.left,

            width:
                rect.width,

        });

    };


    // =================================================
    // TOGGLE DROPDOWN
    // =================================================

    const toggleDropdown = () => {

        // Disabled dropdown cannot open
        if (disabled) {
            return;
        }


        if (!open) {

            updatePosition();

        }


        setOpen(
            (prev) => !prev
        );

    };


    // =================================================
    // OUTSIDE CLICK
    // =================================================

    useEffect(() => {

        const handleOutsideClick = (event) => {

            if (
                buttonRef.current &&
                !buttonRef.current.contains(
                    event.target
                ) &&
                menuRef.current &&
                !menuRef.current.contains(
                    event.target
                )
            ) {

                setOpen(false);

            }

        };


        document.addEventListener(
            "mousedown",
            handleOutsideClick
        );


        return () => {

            document.removeEventListener(
                "mousedown",
                handleOutsideClick
            );

        };

    }, []);


    // =================================================
    // UPDATE ON SCROLL / RESIZE
    // =================================================

    useEffect(() => {

        if (!open) {
            return;
        }


        const handleScroll = () => {

            updatePosition();

        };


        const handleResize = () => {

            updatePosition();

        };


        window.addEventListener(
            "scroll",
            handleScroll,
            true
        );


        window.addEventListener(
            "resize",
            handleResize
        );


        return () => {

            window.removeEventListener(
                "scroll",
                handleScroll,
                true
            );


            window.removeEventListener(
                "resize",
                handleResize
            );

        };

    }, [open]);



    // =================================================
    // RENDER
    // =================================================

    return (

        <div className={`form-group custom-dropdown-group ${open ? "dropdown-is-open" : ""
            }`}>

            {/* LABEL */}

            <label style={{ color: "#279447" }}>
                {label}
            </label>


            {/* BUTTON */}

            <button
                ref={buttonRef}
                type="button"
                disabled={disabled}
                className={`
                    custom-dropdown-button
                    ${open ? "dropdown-open" : ""}
                    ${disabled ? "dropdown-disabled" : ""}
                `}
                onClick={toggleDropdown}
            >

                <span className="dropdown-left">

                    <span className="dropdown-icon" style={{ background: "rgba(255, 255, 255, 0.1)" }}>

                        {selectedOption?.icon || icon}

                    </span>


                    <span
                        style={{ color: "white" }}
                        className={
                            selectedOption
                                ? "selected-text"
                                : "placeholder-text"
                        }
                    >

                        {selectedOption
                            ? selectedOption.label
                            : placeholder}

                    </span>

                </span>


                {/* ARROW */}

                {!disabled && (

                    <span
                        className={`
                            dropdown-arrow
                            ${open ? "arrow-up" : ""}
                        `}
                    >

                        ▾

                    </span>

                )}

            </button>


            {/* =================================================
                DROPDOWN MENU
            ================================================= */}

            {open && (
                <div
                    ref={menuRef}
                    className="custom-dropdown-menu-fixed"
                    style={{
                        position: "fixed",
                        top: `${menuPosition.top}px`,
                        left: `${menuPosition.left}px`,
                        width: `${menuPosition.width}px`,
                        background: "rgba(255, 255, 255, 0.1)"
                    }}
                >
                    {options.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            className={`custom-dropdown-option ${value === option.value
                                ? "active-option"
                                : ""
                                }`}
                            onClick={() => {
                                onChange(option.value);
                                setOpen(false);
                            }}

                            style={{ background: "rgba(255, 255, 255, 0.1)" }}
                        >
                            <span className="option-icon">
                                {option.icon || "🌱"}
                            </span>

                            <span className="option-label" style={{ background: "rgba(255, 255, 255, 0.1)" }}>
                                {option.label}
                            </span>

                            {value === option.value && (
                                <span className="check-mark">
                                    ✓
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            )}


        </div>

    );

}


// =====================================================
// HELPER
// ADD DAYS TO DATE
// =====================================================

function addDaysToDate(
    dateString,
    days
) {

    if (!dateString) {
        return "";
    }


    const date =
        new Date(
            `${dateString}T00:00:00`
        );


    date.setDate(
        date.getDate() + days
    );


    const year =
        date.getFullYear();


    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, "0");


    const day =
        String(
            date.getDate()
        ).padStart(2, "0");


    return `${year}-${month}-${day}`;

}


// =====================================================
// REGISTRATION
// =====================================================

function Registration() {

    const [formData, setFormData] =
        useState({

            name: "",

            ph_num: "",

            village: "",

            acres: "",

            crop_name: "",

            crop_season: "",

            farming_stage: "",

            cultivation_date: "",

            harvest_date: "",

            district: "",

        });


    const [loading, setLoading] =
        useState(false);


    const [message, setMessage] =
        useState({

            type: "",

            text: "",

        });


    // =================================================
    // NORMAL INPUT CHANGE
    // =================================================

    const handleChange = (e) => {

        const {
            name,
            value,
        } = e.target;


        setFormData(
            (prev) => ({

                ...prev,

                [name]: value,

            })
        );

    };


    // =================================================
    // CROP CHANGE
    // =================================================

    const handleCropChange = (
        value
    ) => {

        setFormData(
            (prev) => ({

                ...prev,

                crop_name: value,

                // Only Paddy has season
                crop_season:
                    value === "Paddy"
                        ? prev.crop_season
                        : "",

                // Only Maize has manual harvest date
                harvest_date:
                    value === "Maize"
                        ? prev.harvest_date
                        : "",

            })
        );

    };


    // =================================================
    // CULTIVATION DATE CHANGE
    // =================================================

    const handleCultivationDateChange = (e) => {
        const date = e.target.value;

        setFormData((prev) => {
            let harvestDate = prev.harvest_date;

            // Paddy
            if (prev.crop_name === "Paddy") {

                let days = 0;

                if (prev.crop_season === "Sarva") {
                    days = 145;
                }

                if (prev.crop_season === "Dalwa") {
                    days = 135;
                }

                if (days > 0) {
                    harvestDate = addDaysToDate(date, days);
                } else {
                    harvestDate = "";
                }
            }

            // Maize → manual harvest date
            if (prev.crop_name === "Maize") {
                harvestDate = prev.harvest_date;
            }

            // Other crops
            if (
                prev.crop_name !== "Paddy" &&
                prev.crop_name !== "Maize"
            ) {
                harvestDate = "";
            }

            return {
                ...prev,
                cultivation_date: date,
                harvest_date: harvestDate,
            };
        });
    };

    // =================================================
    // SEASON CHANGE
    // =================================================

    const handleSeasonChange = (value) => {

        setFormData((prev) => {

            let harvestDate = prev.harvest_date;

            if (
                prev.crop_name === "Paddy" &&
                prev.cultivation_date
            ) {

                let days = 0;

                if (value === "Sarva") {
                    days = 145;
                }

                if (value === "Dalwa") {
                    days = 135;
                }

                harvestDate = addDaysToDate(
                    prev.cultivation_date,
                    days
                );
            }

            return {
                ...prev,
                crop_season: value,
                harvest_date: harvestDate,
            };

        });

    };


    // =================================================
    // FARMING STAGE CHANGE
    // =================================================

    const handleStageChange = (
        value
    ) => {

        setFormData(
            (prev) => ({

                ...prev,

                farming_stage:
                    value,

            })
        );

    };


    // =================================================
    // SUBMIT
    // =================================================

    const handleSubmit = async (
        e
    ) => {

        e.preventDefault();


        setMessage({

            type: "",

            text: "",

        });


        // =================================================
        // REQUIRED FIELDS
        // =================================================

        if (

            !formData.name.trim() ||

            !formData.ph_num.trim() ||

            !formData.village.trim() ||

            !formData.acres ||

            !formData.crop_name ||

            !formData.farming_stage ||

            !formData.cultivation_date ||

            !formData.district.trim()

        ) {

            setMessage({

                type: "error",

                text:
                    "Please fill all the required fields.",

            });

            return;

        }


        // =================================================
        // PHONE VALIDATION
        // =================================================

        if (
            !/^[0-9]{10}$/.test(
                formData.ph_num
            )
        ) {

            setMessage({

                type: "error",

                text:
                    "Please enter a valid 10 digit phone number.",

            });

            return;

        }


        // =================================================
        // PADDY SEASON
        // =================================================

        if (

            formData.crop_name ===
            "Paddy" &&

            !formData.crop_season

        ) {

            setMessage({

                type: "error",

                text:
                    "Please select Paddy season: Sarva or Dalwa.",

            });

            return;

        }


        // =================================================
        // MAIZE HARVEST DATE
        // =================================================

        if (

            formData.crop_name ===
            "Maize" &&

            !formData.harvest_date

        ) {

            setMessage({

                type: "error",

                text:
                    "Please select the expected harvest date for Maize.",

            });

            return;

        }


        // =================================================
        // MAIZE DATE VALIDATION
        // =================================================

        if (

            formData.crop_name ===
            "Maize" &&

            formData.harvest_date <=
            formData.cultivation_date

        ) {

            setMessage({

                type: "error",

                text:
                    "Harvest date must be after cultivation date.",

            });

            return;

        }


        // =================================================
        // PREPARE DATA
        // =================================================

        const submitData = {

            name:
                formData.name.trim(),

            ph_num:
                formData.ph_num.trim(),

            village:
                formData.village.trim(),

            district:
                formData.district.trim(),

            acres:
                formData.acres,

            crop_name:
                formData.crop_name,

            crop_season:
                formData.crop_name ===
                    "Paddy"
                    ? formData.crop_season
                    : null,

            farming_stage:
                formData.farming_stage,

            cultivation_date:
                formData.cultivation_date,

            harvest_date:
                formData.crop_name ===
                    "Paddy" ||
                    formData.crop_name ===
                    "Maize"
                    ? formData.harvest_date
                    : null,

        };


        console.log(
            "REGISTRATION DATA:",
            submitData
        );


        // =================================================
        // API
        // =================================================

        try {

            setLoading(true);
            const token = localStorage.getItem("token");


            const response =
                await axios.post(

                    "https://plant-disease-detection-1-xjj3.onrender.com/api/crop-registration/",

                    submitData,

                    {
                        headers: {
                            Authorization: `Token ${token}`,
                            "Content-Type": "application/json",
                        },
                    }

                );


            console.log(
                "Registration Response:",
                response.data
            );


            if (
                response.data.success
            ) {

                setMessage({

                    type: "success",

                    text:
                        "Crop registered successfully!",

                });


                // Clear form

                setFormData({

                    name: "",

                    ph_num: "",

                    village: "",

                    acres: "",

                    crop_name: "",

                    crop_season: "",

                    farming_stage: "",

                    cultivation_date: "",

                    harvest_date: "",

                    district: "",

                });

            }

        } catch (error) {

            console.error(
                "Registration Error:",
                error
            );


            let errorMessage =
                "Unable to register crop.";


            if (
                error.response?.data
                    ?.errors
            ) {

                const errors =
                    error.response
                        .data.errors;


                errorMessage =
                    Object.values(
                        errors
                    )
                        .flat()
                        .join(" ");

            }


            setMessage({

                type: "error",

                text:
                    errorMessage,

            });

        } finally {

            setLoading(false);

        }

    };

    const { t, language, toggleLanguage, } = useLanguage();
    const navigate = useNavigate();



    // =====================================================
    // RENDER
    // =====================================================

    return (

        <div className="registration-page">

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
                        className="nav-item"
                        onClick={() =>
                            navigate("/dashboard")
                        } style={{ border: "1px solid rgba(74, 222, 128, 0.35)" }}
                    >

                        <FaArrowLeft />

                        Back

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


            <div className="registration-wrapper">


                {/* =================================================
                    LEFT
                ================================================= */}

                <div className="registration-intro">


                    <div className="intro-badge">

                        <FaLeaf />

                        {t.rythuMitra}

                    </div>


                    <h1>

                        {t.growbetter}

                        <br />

                        <span>
                            {t.farmsmatter}
                        </span>

                    </h1>


                    <p>
                        {t.rmsummary}
                    </p>


                    <div className="intro-features">


                        <div>

                            <FaSeedling />

                            <span>
                                {t.croptrack}
                            </span>

                        </div>


                        <div>

                            <FaCalendarAlt />

                            <span>
                                {t.farmshedule}
                            </span>

                        </div>


                        <div>

                            <FaLeaf />

                            <span>
                                {t.cropadvisory}
                            </span>

                        </div>


                    </div>

                </div>


                {/* =================================================
                    FORM CARD
                ================================================= */}

                <div className="registration-card">


                    {/* HEADER */}

                    <div className="registration-card-header">

                        <div className="registration-icon">

                            <FaSeedling />

                        </div>


                        <div>

                            <h2>
                                {t.cropregistration}
                            </h2>

                            <p>
                                {t.tell}
                            </p>

                        </div>

                    </div>


                    {/* MESSAGE */}

                    {message.text && (

                        <div
                            className={
                                message.type ===
                                    "success"
                                    ? "registration-message success"
                                    : "registration-message error"
                            }
                        >

                            {message.type ===
                                "success"
                                ? "✓ "
                                : "⚠ "}

                            {message.text}

                        </div>

                    )}


                    <form
                        onSubmit={
                            handleSubmit
                        }
                    >


                        {/* =================================================
                            SECTION 01
                        ================================================= */}

                        <div className="form-section-title">

                            <span>
                                01
                            </span>


                            <div>

                                <h3>
                                    {t.farmerdetails}
                                </h3>

                                <p>
                                    {t.basicinfo}
                                </p>

                            </div>

                        </div>


                        <div className="form-grid">


                            {/* NAME */}

                            <div className="input-group">

                                <label>
                                    {t.fname}
                                </label>


                                <div className="input-wrapper">

                                    <FaUser />

                                    <input
                                        name="name"
                                        type="text"
                                        value={
                                            formData.name
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder={t.enterfname}
                                    />

                                </div>

                            </div>


                            {/* PHONE */}

                            <div className="input-group">

                                <label>
                                    {t.pnum}
                                </label>


                                <div className="input-wrapper">

                                    <FaPhone />

                                    <input
                                        name="ph_num"
                                        type="tel"
                                        value={
                                            formData.ph_num
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder={t.enterpnum}
                                        maxLength={
                                            10
                                        }
                                        inputMode="numeric"
                                    />

                                </div>

                            </div>

                        </div>


                        {/* =================================================
                            SECTION 02
                        ================================================= */}

                        <div className="form-section-title">

                            <span>
                                02
                            </span>


                            <div>

                                <h3>
                                    {t.flocat}
                                </h3>

                                <p>
                                    {t.farmlocated}
                                </p>

                            </div>

                        </div>


                        <div className="form-grid">


                            {/* VILLAGE */}

                            <div className="input-group">

                                <label>
                                    {t.village}
                                </label>


                                <div className="input-wrapper">

                                    <FaMapMarkerAlt />

                                    <input
                                        name="village"
                                        type="text"
                                        value={
                                            formData.village
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder={t.entervillage}
                                    />

                                </div>

                            </div>


                            {/* DISTRICT */}

                            <div className="input-group">

                                <label>
                                    {t.dist}
                                </label>


                                <div className="input-wrapper">

                                    <FaMapMarkerAlt />

                                    <input
                                        name="district"
                                        type="text"
                                        value={
                                            formData.district
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder={t.enterdist}
                                    />

                                </div>

                            </div>

                        </div>


                        {/* =================================================
                            SECTION 03
                        ================================================= */}

                        <div className="form-section-title">

                            <span>
                                03
                            </span>


                            <div>

                                <h3>
                                    {t.cropdetails}
                                </h3>

                                <p>
                                    {t.tellcropdetail}
                                </p>

                            </div>

                        </div>


                        <div className="form-grid">


                            {/* ACRES */}

                            <div className="input-group">

                                <label>
                                    {t.noofacre}
                                </label>


                                <div className="input-wrapper">

                                    <FaRulerCombined />

                                    <input
                                        name="acres"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={
                                            formData.acres
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="e.g. 2.5"
                                    />

                                </div>

                            </div>


                            {/* CROP TYPE */}

                            <CustomDropdown

                                label={t.croptype}

                                icon="🌱"

                                value={
                                    formData.crop_name
                                }

                                placeholder={t.selectcrop}

                                onChange={
                                    handleCropChange
                                }

                                options={[

                                    {
                                        value:
                                            "Paddy",

                                        label:
                                            t.paddy,

                                        icon:
                                            "🌾",
                                    },

                                    {
                                        value:
                                            "Chilli",

                                        label:
                                            t.chilli,

                                        icon:
                                            "🌶️",
                                    },

                                    {
                                        value:
                                            "Maize",

                                        label:
                                            t.maize,

                                        icon:
                                            "🌽",
                                    },

                                    {
                                        value:
                                            "Cotton",

                                        label:
                                            t.cotton,

                                        icon:
                                            "🌿",
                                    },

                                    {
                                        value:
                                            "Other",

                                        label:
                                            t.other,

                                        icon:
                                            "🌱",
                                    },

                                ]}

                            />


                            {/* CROP SEASON */}

                            <div className="season">

                                <CustomDropdown

                                    label={t.cropseason}

                                    icon="🌾"

                                    value={
                                        formData.crop_season
                                    }

                                    placeholder={

                                        formData.crop_name ===
                                            "Paddy"

                                            ? t.selectseason

                                            : t.notapplicable

                                    }

                                    disabled={

                                        formData.crop_name !==
                                        "Paddy"

                                    }

                                    onChange={
                                        handleSeasonChange
                                    }

                                    options={

                                        formData.crop_name ===
                                            "Paddy"

                                            ? [

                                                {
                                                    value:
                                                        "Sarva",

                                                    label:
                                                        t.sarva,

                                                    icon:
                                                        "🌾",
                                                },

                                                {
                                                    value:
                                                        "Dalwa",

                                                    label:
                                                        t.dalwa,

                                                    icon:
                                                        "🌱",
                                                },

                                            ]

                                            : []

                                    }

                                /> </div>


                            {/* FARMING STAGE */}

                            <CustomDropdown

                                label={t.farmingstage}

                                icon="🌿"

                                value={
                                    formData.farming_stage
                                }

                                placeholder={t.selectstage}

                                onChange={
                                    handleStageChange
                                }

                                options={[


                                    {
                                        value:
                                            "Cultivating",

                                        label:
                                            t.cultivating,

                                        icon:
                                            "🚜",
                                    },

                                    {
                                        value:
                                            "Growing",

                                        label:
                                            t.growing,

                                        icon:
                                            "🌿",
                                    },

                                    {
                                        value:
                                            "Flowering",

                                        label:
                                            t.flowering,

                                        icon:
                                            "🌼",
                                    },

                                    {
                                        value:
                                            "Fruiting",

                                        label:
                                            t.fruting,

                                        icon:
                                            "🍃",
                                    },

                                    {
                                        value:
                                            "Harvesting",

                                        label:
                                            t.harvesting,

                                        icon:
                                            "🌾",
                                    },

                                ]}

                            />


                            {/* CULTIVATION DATE */}

                            <div className="input-group">

                                <label>
                                    {t.cultivationdate}
                                </label>


                                <div className="input-wrapper">

                                    <FaCalendarAlt />

                                    <input
                                        name="cultivation_date"
                                        type="date"
                                        value={
                                            formData.cultivation_date
                                        }
                                        onChange={
                                            handleCultivationDateChange
                                        }
                                    />

                                </div>

                            </div>


                            {/* =================================================
                                MAIZE HARVEST DATE
                            ================================================= */}

                            {formData.crop_name ===
                                "Maize" && (

                                    <div className="input-group">

                                        <label>
                                            {t.expectedharvest}
                                        </label>


                                        <div className="input-wrapper">

                                            <FaCalendarAlt />

                                            <input
                                                name="harvest_date"
                                                type="date"
                                                value={
                                                    formData.harvest_date
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                min={
                                                    formData.cultivation_date
                                                }
                                            />

                                        </div>

                                    </div>

                                )}

                        </div>


                        {/* =================================================
                            PADDY INFO
                        ================================================= */}

                        {formData.crop_name ===
                            "Paddy" && (

                                <div
                                    className="crop-info-box paddy-info"
                                >

                                    🌾

                                    <strong>
                                        {t.paddycycle}:
                                    </strong>

                                    <span>
                                        {formData.crop_season === "Sarva"
                                            ? "145"
                                            : formData.crop_season === "Dalwa"
                                                ? "135"
                                                : "--"}{" "}
                                        {t.days}.
                                    </span>

                                    <br />

                                    {t.expectedharvest}:

                                    <strong>
                                        {" "}
                                        {formData.harvest_date ||
                                            t.willcalculate}
                                    </strong>

                                </div>

                            )}


                        {/* =================================================
                            MAIZE INFO
                        ================================================= */}

                        {formData.crop_name ===
                            "Maize" && (

                                <div
                                    className="crop-info-box maize-info"
                                >

                                    🌽

                                    <strong>
                                        {t.maize}:
                                    </strong>

                                    <span>
                                        {t.pleaseexpected}
                                    </span>

                                </div>

                            )}


                        {/* =================================================
                            OTHER CROP INFO
                        ================================================= */}

                        {(
                            formData.crop_name ===
                            "Chilli" ||
                            formData.crop_name ===
                            "Cotton" ||
                            formData.crop_name ===
                            "Other"
                        ) && (

                                <div
                                    className="crop-info-box ongoing-info"
                                >

                                    🌱

                                    <strong>
                                        {t.cropmonitoring}:
                                    </strong>

                                    <span>
                                        {t.monitorsummary}
                                    </span>

                                </div>

                            )}


                        {/* =================================================
                            SUBMIT
                        ================================================= */}

                        <button
                            type="submit"
                            className="registration-submit"
                            disabled={loading}
                        >

                            {loading ? (

                                "Registering..."

                            ) : (

                                <>

                                    {t.submit}

                                    <FaArrowRight />

                                </>

                            )}

                        </button>


                    </form>

                </div>

            </div>

            <footer className="footer" id="contact" style={{ background: "transparent" }}>

                <div className="container" id="">

                    <div className="row">

                        {/* Left */}

                        <div className="col-lg-5">

                            <div className="footer-brand">

                                <FaLeaf className="footer-logo" />

                                <h3>Rythu Mitra AI</h3>

                            </div>

                            <p className="footer-text" style={{ color: "gray" }}>

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

                    <div className="copyright1">

                      <img src="/Images/rm_btm_logo.png" className="bottom-logo" alt="" />  © {new Date().getFullYear()} {t.rythumitraai}.
                        {t.rights}. <br />

                        <div>
                            {t.authors}
                        </div>

                    </div>

                </div>

            </footer>


        </div>

    );

}


export default Registration;