import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
    FaSeedling,
    FaMapMarkerAlt,
    FaCalendarAlt,
    FaCloudSun,
    FaBell,
    FaRobot,
    FaCamera,
    FaMicrophone,
    FaWhatsapp,
    FaChevronRight,
    FaTint,
    FaWind,
    FaCloudRain,
    FaSun,
    FaCalendarCheck,
    FaExclamationTriangle,
    FaLeaf
} from "react-icons/fa";

import { useLanguage } from "../context/LanguageContext";



function FarmerDashboard() {

    const navigate = useNavigate();

    const {
        language,
        toggleLanguage, t
    } = useLanguage();


    // =====================================================
    // STATES
    // =====================================================

    const [farmers, setFarmers] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [notifications, setNotifications] = useState({});

    const [notificationCounts, setNotificationCounts] = useState({});

    const [weatherData, setWeatherData] = useState({});

    const [weatherLoading, setWeatherLoading] = useState({});

    const [weatherErrors, setWeatherErrors] = useState({});

    const [weatherAlerts, setWeatherAlerts] = useState({});

    const [sidebarOpen, setSidebarOpen] = useState(false);


    // =====================================================
    // FETCH CROPS
    // =====================================================

    useEffect(() => {

        const fetchCrops = async () => {

            try {

                setLoading(true);

                const response = await axios.get(
                    "https://plant-disease-detection-1-xjj3.onrender.com/api/my-crop/"
                );

                console.log(
                    "ALL CROP DATA:",
                    response.data
                );

                if (response.data.success) {

                    setFarmers(
                        response.data.data || []
                    );

                } else {

                    setError(
                        response.data.message ||
                        "No crop registrations found."
                    );

                }

            } catch (err) {

                console.error(
                    "Dashboard Error:",
                    err
                );

                setError(
                    err.response?.data?.message ||
                    "Unable to load crop details."
                );

            } finally {

                setLoading(false);

            }

        };

        fetchCrops();

    }, []);


    // =====================================================
    // CROP IMAGE
    // =====================================================

    const getCropImage = (cropName) => {

        const crop =
            (cropName || "")
                .toLowerCase()
                .trim();


        if (crop === "paddy") {
            return "/Images/Crop_Images/paddy.jpg";
        }

        if (
            crop === "chilli" ||
            crop === "chili"
        ) {
            return "/Images/chilli.jpg";
        }

        if (crop === "tomato") {
            return "/Images/tomato.jpg";
        }

        if (crop === "maize") {
            return "/Images/maize.jpg";
        }

        if (crop === "cotton") {
            return "/Images/cotton.jpg";
        }

        return "/Images/paddy.jpg";
    };


    // =====================================================
    // FETCH NOTIFICATIONS
    // =====================================================

    const fetchNotificationsForCrop = async (cropId) => {

        if (!cropId) {
            return;
        }

        try {

            const response = await axios.get(
                `https://plant-disease-detection-1-xjj3.onrender.com/api/notifications/${cropId}/`
            );

            if (response.data.success) {

                setNotifications((prev) => ({
                    ...prev,
                    [cropId]:
                        response.data.notifications || []
                }));

                setNotificationCounts((prev) => ({
                    ...prev,
                    [cropId]:
                        response.data.unread_count || 0
                }));

            }

        } catch (err) {

            console.error(
                "Notification error:",
                err
            );

            setNotifications((prev) => ({
                ...prev,
                [cropId]: []
            }));

        }

    };


    // =====================================================
    // FETCH ALL NOTIFICATIONS
    // =====================================================

    useEffect(() => {

        if (!farmers.length) {
            return;
        }

        const fetchAllNotifications = async () => {

            for (const farmer of farmers) {

                await fetchNotificationsForCrop(
                    farmer.id
                );

            }

        };

        fetchAllNotifications();


        const interval = setInterval(
            fetchAllNotifications,
            60000
        );

        return () => {
            clearInterval(interval);
        };

    }, [farmers]);


    // =====================================================
    // WEATHER
    // =====================================================

    const fetchWeatherForFarmer = async (farmer) => {

        if (
            !farmer?.id ||
            !farmer?.village ||
            !farmer?.district
        ) {
            return;
        }

        try {

            setWeatherLoading((prev) => ({
                ...prev,
                [farmer.id]: true
            }));

            const response = await axios.get(
                "https://plant-disease-detection-1-xjj3.onrender.com/api/farmer-weather/",
                {
                    params: {
                        village: farmer.village,
                        district: farmer.district
                    }
                }
            );


            if (response.data.success) {

                setWeatherData((prev) => ({
                    ...prev,
                    [farmer.id]:
                        response.data.data
                }));

            } else {

                setWeatherErrors((prev) => ({
                    ...prev,
                    [farmer.id]:
                        response.data.message ||
                        "Unable to fetch weather."
                }));

            }

        } catch (err) {

            console.error(
                "Weather error:",
                err
            );

            setWeatherErrors((prev) => ({
                ...prev,
                [farmer.id]:
                    "Unable to fetch weather."
            }));

        } finally {

            setWeatherLoading((prev) => ({
                ...prev,
                [farmer.id]: false
            }));

        }

    };


    // =====================================================
    // FETCH WEATHER FOR ALL CROPS
    // =====================================================

    useEffect(() => {

        if (!farmers.length) {
            return;
        }

        const fetchAllWeather = async () => {

            for (const farmer of farmers) {

                await fetchWeatherForFarmer(
                    farmer
                );

            }

        };

        fetchAllWeather();


        const interval = setInterval(
            fetchAllWeather,
            600000
        );

        return () => {
            clearInterval(interval);
        };

    }, [farmers]);


    // =====================================================
    // WEATHER ALERT
    // =====================================================

    const fetchWeatherAlert = async (farmer) => {

        if (
            !farmer?.id ||
            !farmer?.village ||
            !farmer?.district
        ) {
            return;
        }

        try {

            const response = await axios.get(
                "https://plant-disease-detection-1-xjj3.onrender.com/api/farmer-weather-alert/",
                {
                    params: {
                        village: farmer.village,
                        district: farmer.district
                    }
                }
            );


            if (response.data.success) {

                setWeatherAlerts((prev) => ({
                    ...prev,
                    [farmer.id]:
                        response.data
                }));

            }

        } catch (err) {

            console.error(
                "Weather alert error:",
                err
            );

        }

    };


    // =====================================================
    // FETCH ALL WEATHER ALERTS
    // =====================================================

    useEffect(() => {

        if (!farmers.length) {
            return;
        }

        const fetchAlerts = async () => {

            for (const farmer of farmers) {

                await fetchWeatherAlert(
                    farmer
                );

            }

        };

        fetchAlerts();


        const interval = setInterval(
            fetchAlerts,
            1800000
        );

        return () => {
            clearInterval(interval);
        };

    }, [farmers]);


    // =====================================================
    // TOTAL NOTIFICATIONS
    // =====================================================

    const totalNotifications = useMemo(() => {

        return Object.values(
            notificationCounts
        ).reduce(
            (total, count) =>
                total + Number(count || 0),
            0
        );

    }, [notificationCounts]);


    // =====================================================
    // ALL NOTIFICATIONS
    // =====================================================

    const recentNotifications = useMemo(() => {

        const result = [];

        Object.entries(notifications)
            .forEach(([cropId, items]) => {

                items.forEach((item) => {

                    result.push({
                        ...item,
                        cropId
                    });

                });

            });

        return result.slice(0, 5);

    }, [notifications]);


    // =====================================================
    // FIRST FARMER WEATHER
    // =====================================================

    const mainFarmer = farmers[0];

    const mainWeather =
        mainFarmer
            ? weatherData[mainFarmer.id]
            : null;


    // =====================================================
    // UPCOMING TASKS
    // =====================================================

    const upcomingTasks = useMemo(() => {

        const tasks = [];

        farmers.forEach((farmer) => {

            const spraying =
                farmer.future_spraying || [];

            spraying
                .slice(0, 2)
                .forEach((spray) => {

                    tasks.push({
                        crop:
                            farmer.crop_name,
                        product:
                            spray.product?.en ||
                            spray.product ||
                            "Crop Treatment",
                        date:
                            spray.date,
                        days:
                            spray.days_remaining
                    });

                });

        });

        return tasks.slice(0, 4);

    }, [farmers]);


    // =====================================================
    // NAVIGATION
    // =====================================================

    const goTo = (path) => {

        setSidebarOpen(false);

        navigate(path);

    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div className="dashboard-loading">

                <div className="loading-leaf">
                    🌱
                </div>

                <h2>
                    Loading your farm...
                </h2>

                <p>
                    Preparing your farming dashboard
                </p>

            </div>

        );

    }


    // =====================================================
    // ERROR
    // =====================================================

    if (error) {

        return (

            <div className="dashboard-error">

                <div className="error-icon">
                    ⚠️
                </div>

                <h2>
                    Unable to load dashboard
                </h2>

                <p>
                    {error}
                </p>

                <button
                    onClick={() =>
                        window.location.reload()
                    }
                >
                    Try Again
                </button>

            </div>

        );

    }


    // =====================================================
    // DASHBOARD
    // =====================================================

    return (

        <div className="dashboard-content">



            <section
                className="dashboard-hero"
            >




            </section>


            {/* =================================================
                    SUMMARY CARDS
                ================================================= */}

            <section className="summary-grid">


                <div className="summary-card green-card">

                    <div className="summary-icon">
                        <FaSeedling />
                    </div>

                    <div>

                        <span>
                            {t.totalcrops}
                        </span>

                        <strong>
                            {farmers.length}
                        </strong>

                        <button
                            onClick={() =>
                                goTo("/my-crops")
                            }
                        >
                            {t.viewdetails}
                            <FaChevronRight />
                        </button>

                    </div>

                </div>


                <div className="summary-card yellow-card">

                    <div className="summary-icon">
                        <FaCalendarCheck />
                    </div>

                    <div>

                        <span>
                            {t.upcomingtasks}
                        </span>

                        <strong>
                            {upcomingTasks.length}
                        </strong>

                        <button
                            onClick={() =>
                                document
                                    .getElementById(
                                        "upcoming-tasks"
                                    )
                                    ?.scrollIntoView({
                                        behavior: "smooth"
                                    })
                            }
                        >
                            {t.seeshedule}
                            <FaChevronRight />
                        </button>

                    </div>

                </div>


                <div className="summary-card red-card">

                    <div className="summary-icon">
                        <FaBell />
                    </div>

                    <div>

                        <span>
                            {t.notifications}
                        </span>

                        <strong>
                            {totalNotifications}
                        </strong>

                        <button
                            onClick={() =>
                                document
                                    .getElementById(
                                        "recent-notifications"
                                    )
                                    ?.scrollIntoView({
                                        behavior: "smooth"
                                    })
                            }
                        >
                            {t.readall}
                            <FaChevronRight />
                        </button>

                    </div>

                </div>


                <div className="summary-card blue-card">

                    <div className="summary-icon">
                        <FaCloudSun />
                    </div>

                    <div>

                        <span>
                            {t.todayweather}
                        </span>

                        <strong>
                            {mainWeather
                                ? `${Math.round(
                                    mainWeather.temperature
                                )}°C`
                                : "--"}
                        </strong>

                        <small>
                            {mainWeather?.description ||
                                "Weather unavailable"}
                        </small>

                    </div>

                </div>

            </section>


            {/* =================================================
                    CONTENT GRID
                ================================================= */}

            <section className="content-grid">


                {/* =================================================
                        LEFT COLUMN
                    ================================================= */}

                <div className="left-column">


                    {/* MY CROPS */}

                    <div className="dashboard-card">

                        <div className="card-header">

                            <div>
                                <h2>
                                    {t.mycrops}
                                </h2>
                            </div>

                            <button
                                onClick={() =>
                                    goTo("/my-crops")
                                }
                            >
                                {t.viewmore}
                                <FaChevronRight />
                            </button>

                        </div>


                        <div className="my-crops-grid">

                            {farmers.map((farmer) => {

                                const cropName =
                                    farmer.crop_name ||
                                    "Unknown Crop";

                                const image =
                                    getCropImage(
                                        cropName
                                    );

                                const cropAge =
                                    farmer.crop_age ||
                                    0;

                                let duration =
                                    farmer.duration ||
                                    100;


                                if (
                                    cropName
                                        .toLowerCase() ===
                                    "paddy"
                                ) {

                                    if (
                                        farmer.crop_season
                                            ?.toLowerCase() ===
                                        "dalwa"
                                    ) {
                                        duration = 135;
                                    }

                                    if (
                                        farmer.crop_season
                                            ?.toLowerCase() ===
                                        "sarva"
                                    ) {
                                        duration = 145;
                                    }

                                }


                                let progress =
                                    (
                                        cropAge /
                                        duration
                                    ) * 100;


                                if (progress > 100) {
                                    progress = 100;
                                }


                                const isHealthy =
                                    progress < 90;


                                return (

                                    <div
                                        className="my-crop-item"
                                        key={farmer.id}
                                    >

                                        <img
                                            src={image}
                                            alt={cropName}
                                            className="my-crop-image"
                                        />


                                        <div className="my-crop-info">

                                            <div className="crop-name-row">

                                                <h3>
                                                    {cropName}
                                                </h3>

                                                <span
                                                    className={
                                                        isHealthy
                                                            ? "health-badge healthy"
                                                            : "health-badge watch"
                                                    }
                                                >
                                                    {isHealthy
                                                        ? t.healthy1
                                                        : t.watch}
                                                </span>

                                            </div>


                                            {farmer.crop_season && (
                                                <small className="season-text">
                                                    {farmer.crop_season}
                                                </small>
                                            )}


                                            <p>
                                                {t.sown}:{" "}
                                                {farmer.cultivation_date}
                                            </p>

                                            <p>
                                                {t.age}:{" "}
                                                {cropAge} {t.days}
                                            </p>


                                            <div className="crop-progress">

                                                <div
                                                    className="crop-progress-fill"
                                                    style={{
                                                        width:
                                                            `${progress}%`
                                                    }}
                                                />

                                            </div>


                                            <small className="progress-days">

                                                {cropAge} / {duration} {t.days}

                                            </small>

                                        </div>

                                    </div>

                                );

                            })}

                        </div>

                    </div>


                    {/* UPCOMING TASKS */}

                    <div
                        className="dashboard-card"
                        id="upcoming-tasks"
                    >

                        <div className="card-header">

                            <h2>
                                {t.upcomingtasks}
                            </h2>

                            <button>
                                {t.viewmore}
                                <FaChevronRight />
                            </button>

                        </div>


                        {upcomingTasks.length === 0 ? (

                            <div className="empty-task">

                                <FaCalendarCheck />

                                <p>
                                    {t.noupcoming}
                                </p>

                            </div>

                        ) : (

                            <div className="task-list">

                                {upcomingTasks.map(
                                    (task, index) => (

                                        <div
                                            className="task-item"
                                            key={index}
                                        >

                                            <div className="task-icon">
                                                <FaSeedling />
                                            </div>


                                            <div className="task-info">

                                                <strong>
                                                    {task.product}
                                                </strong>

                                                <span>
                                                    {task.crop}
                                                </span>

                                            </div>


                                            <div className="task-date">

                                                <FaCalendarAlt />

                                                {task.date}

                                            </div>


                                            <span
                                                className={
                                                    task.days <= 2
                                                        ? "task-status pending"
                                                        : "task-status upcoming"
                                                }
                                            >
                                                {task.days <= 2
                                                    ? t.pending
                                                    : t.upcoimg}
                                            </span>

                                        </div>

                                    )
                                )}

                            </div>

                        )}

                    </div>

                </div>


                {/* =================================================
                        CENTER COLUMN
                    ================================================= */}

                <div className="center-column">


                    {/* WEATHER */}

                    <div className="dashboard-card weather-dashboard-card">

                        <div className="card-header">

                            <h2>
                                {t.todayweather}
                            </h2>

                            {mainFarmer && (
                                <span className="location-text">

                                    <FaMapMarkerAlt />

                                    {mainFarmer.village},{" "}
                                    {mainFarmer.district}

                                </span>
                            )}

                        </div>


                        {mainWeather ? (

                            <div className="weather-dashboard-content">


                                <div className="big-weather">

                                    <img
                                        src={`https://openweathermap.org/img/wn/${mainWeather.icon}@2x.png`}
                                        alt="weather"
                                    />

                                    <div>

                                        <strong>
                                            {Math.round(
                                                mainWeather.temperature
                                            )}°C
                                        </strong>

                                        <span>
                                            {mainWeather.description}
                                        </span>

                                    </div>

                                </div>


                                <div className="weather-details-grid">


                                    <div>
                                        <FaTint />
                                        <span>
                                            {t.humidity}
                                        </span>
                                        <strong>
                                            {mainWeather.humidity}%
                                        </strong>
                                    </div>


                                    <div>
                                        <FaWind />
                                        <span>
                                            {t.wind}
                                        </span>
                                        <strong>
                                            {mainWeather.wind_speed}
                                            {" "}m/s
                                        </strong>
                                    </div>


                                    <div>
                                        <FaCloudRain />
                                        <span>
                                            {t.clouds}
                                        </span>
                                        <strong>
                                            {mainWeather.clouds}%
                                        </strong>
                                    </div>


                                    <div>
                                        <FaSun />
                                        <span>
                                            {t.preassure}
                                        </span>
                                        <strong>
                                            {mainWeather.pressure}
                                            {" "}hPa
                                        </strong>
                                    </div>

                                </div>

                            </div>

                        ) : (

                            <div className="weather-empty">

                                <FaCloudSun />

                                <p>
                                    {t.noweather}
                                </p>

                            </div>

                        )}

                    </div>


                    {/* MARKET PRICES */}

                    <div className="dashboard-card">

                        <div className="card-header">

                            <h2>
                                {t.marketprices} (₹/{t.quintal})
                            </h2>

                            <button>
                                {t.viewmore}
                                <FaChevronRight />
                            </button>

                        </div>


                        <div className="market-list">


                            <div className="market-item">

                                <span className="market-emoji">
                                    🌾
                                </span>

                                <strong>
                                    Paddy
                                </strong>

                                <b>
                                    ₹ 2,320
                                </b>

                                <span className="market-up">
                                    ↑ 2%
                                </span>

                            </div>


                            <div className="market-item">

                                <span className="market-emoji">
                                    🍅
                                </span>

                                <strong>
                                    Tomato
                                </strong>

                                <b>
                                    ₹ 1,450
                                </b>

                                <span className="market-down">
                                    ↓ 3%
                                </span>

                            </div>


                            <div className="market-item">

                                <span className="market-emoji">
                                    🌶️
                                </span>

                                <strong>
                                    Chilli
                                </strong>

                                <b>
                                    ₹ 12,800
                                </b>

                                <span className="market-up">
                                    ↑ 5%
                                </span>

                            </div>


                            <div className="market-item">

                                <span className="market-emoji">
                                    🌽
                                </span>

                                <strong>
                                    Maize
                                </strong>

                                <b>
                                    ₹ 2,100
                                </b>

                                <span className="market-up">
                                    ↑ 1%
                                </span>

                            </div>

                        </div>

                    </div>

                </div>


                {/* =================================================
                        RIGHT COLUMN
                    ================================================= */}

                <div className="right-column">


                    {/* AI ASSISTANT */}

                    <div className="dashboard-card ai-card">

                        <div className="ai-header">

                            <div className="ai-avatar">
                                🤖
                            </div>

                            <div>

                                <h3>
                                    {t.RythuMitraAI}
                                </h3>

                                <span>
                                    {t.assistant}
                                </span>

                            </div>

                            <div className="online-status">

                                <span />

                                {t.online}

                            </div>

                        </div>


                        <div className="ai-message">

                            {language === "te"
                                ? "మీ పంటల గురించి అడగండి, లేదా ఫోటో పంపండి, నేను సహాయం చేస్తాను!"
                                : "Ask me about your crops or upload a plant image. I'm here to help!"}

                        </div>


                        <button
                            className="ai-green-button"
                            onClick={() =>
                                goTo("/dashboard/ai-chat")
                            }
                        >

                            <FaRobot />

                            {t.chatwithai}

                        </button>


                        <button
                            className="ai-light-button"
                            onClick={() =>
                                goTo("/dashboard/disease-detection")
                            }
                        >

                            <FaCamera />

                            {t.uploadplnimg}

                        </button>


                        <button className="ai-blue-button">

                            <FaMicrophone />

                            {t.voiceassistant} ({t.tel})

                        </button>


                        <button className="ai-whatsapp-button" disabled>

                            <FaWhatsapp />

                            Continue on WhatsApp

                        </button>

                    </div>


                    {/* RECENT NOTIFICATIONS */}

                    <div
                        className="dashboard-card"
                        id="recent-notifications"
                    >

                        <div className="card-header">

                            <h2>
                                {t.recentnotif}
                            </h2>

                            <button>
                                {t.viewmore}
                                <FaChevronRight />
                            </button>

                        </div>


                        {recentNotifications.length === 0 ? (

                            <div className="notification-empty">

                                <FaBell />

                                <p>
                                    {t.nonotif}
                                </p>

                            </div>

                        ) : (

                            <div className="recent-list">

                                {recentNotifications.map(
                                    (notification, index) => (

                                        <div
                                            className="recent-item"
                                            key={
                                                notification.id ||
                                                index
                                            }
                                        >

                                            <div className="recent-icon">

                                                {index === 0
                                                    ? <FaLeaf />
                                                    : index === 1
                                                        ? <FaCloudRain />
                                                        : <FaBell />
                                                }

                                            </div>


                                            <div>

                                                <strong>

                                                    {language === "te"
                                                        ? (
                                                            notification.title_te ||
                                                            notification.title
                                                        )
                                                        : notification.title}

                                                </strong>

                                                <p>

                                                    {language === "te"
                                                        ? (
                                                            notification.message_te ||
                                                            notification.message
                                                        )
                                                        : notification.message}

                                                </p>

                                            </div>

                                        </div>

                                    )
                                )}

                            </div>

                        )}

                    </div>

                </div>

            </section>


            {/* =================================================
                    WEATHER ALERT
                ================================================= */}

            {farmers.some(
                (farmer) =>
                    weatherAlerts[farmer.id]?.alert
            ) && (

                    <section className="weather-alert-banner">

                        <FaExclamationTriangle />

                        <div>

                            <strong>
                                {t.weatheralert}
                            </strong>

                            <p>
                                {t.weatherdesc}
                            </p>

                        </div>

                    </section>

                )}


            {/* =================================================
                    BOTTOM PROMOTIONAL BANNERS
                ================================================= */}

            <section className="bottom-banners">


                <div
                    className="promo-banner disease-banner"
                    style={{
                        backgroundImage:
                            "url('/Images/disease-banner.jpg')"
                    }}
                >

                    <div className="promo-overlay" />

                    <div className="promo-content">

                        <div className="promo-icon">
                            <FaCamera />
                        </div>

                        <div>

                            <h2>
                                {t.prot}
                            </h2>

                            <p>
                                {t.diseasewithai}
                            </p>

                            <button
                                onClick={() =>
                                    goTo("/dashboard/disease-detection")
                                }
                            >
                                {t.uploadimg}
                                <FaChevronRight />
                            </button>

                        </div>

                    </div>

                </div>


                <div
                    className="promo-banner farming-banner"
                    style={{
                        backgroundImage:
                            "url('/Images/farming-banner.jpg')"
                    }}
                >

                    <div className="promo-overlay" />

                    <div className="promo-content">

                        <div className="promo-icon">
                            <FaSeedling />
                        </div>

                        <div>

                            <h2>
                                {t.betterfarm}
                            </h2>

                            <p>
                                {t.greentomm}
                            </p>

                            <small>
                                {t.greenp}
                            </small>

                        </div>

                    </div>

                </div>

            </section>


            {/* =================================================
                    FOOTER
                ================================================= */}

            <footer className="dashboard-footer">

                <div>

                    <div className="footer-brand">

                        <FaLeaf />

                        <strong>
                            {t.rythumitraai}
                        </strong>

                    </div>

                    <p>
                        {t.aitech}
                    </p>

                </div>


                <div>

                    <h4>
                        {t.links}
                    </h4>

                    <button
                        onClick={() =>
                            goTo("/dashboard")
                        }
                    >
                        {t.dashboard}
                    </button>

                    <button
                        onClick={() =>
                            goTo("/ai-chat")
                        }
                    >
                        {t.aiassistant}
                    </button>

                    <button
                        onClick={() =>
                            goTo("/disease-detection")
                        }
                    >
                        {t.diseasedetection}
                    </button>

                </div>


                <div>

                    <h4>
                        {t.farmersupport}
                    </h4>

                    <p>
                        {t.smartFarming}
                    </p>

                    <p>
                        {t.cropmonitoring}
                    </p>

                    <p>
                        {t.aiassistant}
                    </p>

                </div>

            </footer>


            <div className="copyright">

                <img src="/Images/rm_btm_logo.png" className="bottom-logo" alt="" />   © {new Date().getFullYear()}
                {" "}{t.rythumitraai}. {t.rights}. <br />

                <span>
                    {t.authors}
                </span>

            </div>



        </div>
    );
}


export default FarmerDashboard;