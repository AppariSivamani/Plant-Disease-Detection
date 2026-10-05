import React, {
    useEffect,
    useMemo,
    useState
} from "react";

import axios from "axios";

import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";


import {
    FaCalendarAlt,
    FaChevronDown,
    FaChevronLeft,
    FaChevronRight,
    FaTractor,
    FaSeedling,
    FaFlask,
    FaBug,
    FaTint,
    FaCheckCircle,
    FaClock,
    FaCircle
} from "react-icons/fa";

import API_BASE_URL from "../config";

import CROP_DATA from "../data/cropData";


function CropSchedule() {
    const { t } = useLanguage();

    const navigate = useNavigate();


    // =========================================================
    // STATES
    // =========================================================

    const [crops, setCrops] = useState([]);

    const [selectedCropId, setSelectedCropId] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [activeFilter, setActiveFilter] =
        useState("All Activities");


    // =========================================================
    // FETCH FARMER REGISTERED CROPS
    // =========================================================

    useEffect(() => {

        const fetchCrops = async () => {

            try {

                setLoading(true);

                setError("");


                const response = await axios.get(
                    `${API_BASE_URL}/api/my-crop/`
                );


                const data =
                    response.data?.data ||
                    response.data ||
                    [];


                setCrops(data);


                if (data.length > 0) {

                    setSelectedCropId(
                        data[0].id
                    );

                }


            } catch (err) {

                console.error(
                    "Crop Schedule API Error:",
                    err
                );


                setError(
                    "Unable to load your registered crops."
                );


            } finally {

                setLoading(false);

            }

        };


        fetchCrops();

    }, []);


    // =========================================================
    // SELECTED CROP
    // =========================================================

    const selectedCrop = useMemo(() => {

        return crops.find(
            crop =>
                crop.id === selectedCropId
        );

    }, [
        crops,
        selectedCropId
    ]);


    // =========================================================
    // NORMALIZE CROP NAME
    // =========================================================

    const cropName = useMemo(() => {

        if (!selectedCrop?.crop_name) {

            return "";

        }


        return selectedCrop.crop_name
            .trim()
            .toLowerCase();

    }, [
        selectedCrop
    ]);


    // =========================================================
    // GET SEASON
    // =========================================================

    const season = useMemo(() => {

        if (
            cropName === "paddy" ||
            cropName === "rice" ||
            cropName === "వరి"
        ) {

            return (
                selectedCrop?.crop_season ||
                ""
            );

        }


        return "";

    }, [
        cropName,
        selectedCrop
    ]);


    // =========================================================
    // GET CROP REPORT
    // =========================================================

    const cropReport = useMemo(() => {

        if (!selectedCrop) {

            return null;

        }


        // -----------------------------------------------------
        // PADDY → DALWA / SARVA
        // -----------------------------------------------------

        if (
            cropName === "paddy" ||
            cropName === "rice"
        ) {

            if (
                season === "Dalwa"
            ) {

                return CROP_DATA.Dalwa;

            }


            if (
                season === "Sarva"
            ) {

                return CROP_DATA.Sarva;

            }

        }


        return null;

    }, [
        selectedCrop,
        cropName,
        season
    ]);


    // =========================================================
    // DATE FORMAT
    // =========================================================

    const formatDate = (
        dateValue
    ) => {

        if (!dateValue) {

            return "";

        }


        const date =
            new Date(dateValue);


        if (
            Number.isNaN(
                date.getTime()
            )
        ) {

            return "";

        }


        return date.toLocaleDateString(
            "en-GB",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );

    };


    // =========================================================
    // ADD DAYS
    // =========================================================

    const addDays = (
        dateValue,
        days
    ) => {

        if (!dateValue) {

            return null;

        }


        const date =
            new Date(dateValue);


        date.setDate(
            date.getDate() + days
        );


        return date;

    };


    // =========================================================
    // ACTIVITY STATUS
    // =========================================================

    const getActivityStatus = (
        dateValue
    ) => {

        // No date
        // Example: Land Preparation / Irrigation
        if (!dateValue) {

            return "Completed";

        }


        const activityDate =
            new Date(dateValue);


        const today =
            new Date();


        // Compare only date
        activityDate.setHours(
            0,
            0,
            0,
            0
        );

        today.setHours(
            0,
            0,
            0,
            0
        );


        if (
            activityDate <= today
        ) {

            return "Completed";

        }


        return "Upcoming";

    };


    // =========================================================
    // GET STAGE NAME
    // =========================================================

    const getStageName = (
        stage
    ) => {

        switch (stage) {

            case "after_cultivation":

                return "After Cultivation";


            case "first_stage":

                return "First Stage";


            case "second_stage":

                return "Second Stage";


            case "third_stage":

                return "Third Stage";


            default:

                return "";

        }

    };


    // =========================================================
    // GET STAGE TELUGU
    // =========================================================

    const getStageTelugu = (
        stage
    ) => {

        switch (stage) {

            case "after_cultivation":

                return "సాగు తర్వాత";


            case "first_stage":

                return "మొదటి విధత";


            case "second_stage":

                return "రెండో విధత";


            case "third_stage":

                return "మూడో విధత";


            default:

                return "";

        }

    };


    // =========================================================
    // BUILD ACTIVITIES
    // =========================================================

    const activities = useMemo(() => {

        if (!selectedCrop) {

            return [];

        }


        const result = [];


        // =====================================================
        // 1. LAND PREPARATION
        // =====================================================

        result.push({

            id: "land-preparation",

            title:  t.LandPreparation,

            description:
                t.lpd,

            // Farmer does not provide this date
            date: null,

            relative:
                t.Beforesowing,

            status:
                "Completed",

            stage:
                "before_cultivation",

            icon:
                <FaTractor />

        });


        // =====================================================
        // 2. SOWING / CULTIVATION
        // =====================================================

        result.push({

            id: "sowing",

            title: t.Sowing2,

            description:
                t.sp,

            // From crop registration
            date:
                selectedCrop.cultivation_date,

            relative:
                "Cultivation date",

            status:
                getActivityStatus(
                    selectedCrop.cultivation_date
                ),

            stage:
                "sowing",

            icon:
                <FaSeedling />

        });


        // =====================================================
        // 3. CROP REPORT SCHEDULE
        // =====================================================

        if (
            cropReport?.schedule
        ) {

            cropReport.schedule.forEach(
                (item, index) => {

                    const scheduledDate =
                        addDays(
                            selectedCrop.cultivation_date,
                            item.day
                        );


                    result.push({

                        id:
                            `${item.stage}-${item.day}-${index}`,

                        title:
                            item.product?.en ||
                            "Crop Activity",

                        description:
                            item.dosage?.en ||
                            "",

                        date:
                            scheduledDate,

                        relative:
                            `${item.day} ${t.dayscult}`,

                        // Dynamic according to today
                        status:
                            getActivityStatus(
                                scheduledDate
                            ),

                        stage:
                            item.stage,

                        stageLabel:
                            getStageName(
                                item.stage
                            ),

                        stageTelugu:
                            getStageTelugu(
                                item.stage
                            ),

                        icon:
                            item.stage ===
                                "after_cultivation"

                                ? (
                                    <FaFlask />
                                )

                                : item.stage ===
                                    "first_stage"

                                    ? (
                                        <FaSeedling />
                                    )

                                    : item.stage ===
                                        "second_stage"

                                        ? (
                                            <FaBug />
                                        )

                                        : (
                                            <FaSeedling />
                                        )

                    });

                }
            );

        }


        // =====================================================
        // 4. IRRIGATION
        // =====================================================
        // IMPORTANT:
        // This is OUTSIDE cropReport.schedule.forEach()
        // so it appears only once.
        // =====================================================

        result.push({

            id:
                "irrigation",

            title:
                t.Irrigation,

            description:
                t.id,

            // Irrigation is as needed
            date:
                null,

            relative:
                "As needed",

            status:
                "Ongoing",

            stage:
                "irrigation",

            icon:
                <FaTint />

        });


        // =====================================================
        // 5. HARVEST
        // =====================================================
        // Harvest date comes from crop registration/backend.
        // =====================================================

        result.push({

            id:
                "harvest",

            title:
                t.Harvest,

            description:
                t.hd,

            date:
                selectedCrop.harvest_date,

            relative:
                selectedCrop.harvest_date
                    ? `${cropReport?.duration || ""} ${t.dayscult}`
                    : "",

            // Automatically Completed / Upcoming
            status:
                getActivityStatus(
                    selectedCrop.harvest_date
                ),

            stage:
                "harvest",

            icon:
                <FaSeedling />

        });


        return result;

    }, [
        selectedCrop,
        cropReport
    ]);


    // =========================================================
    // FILTER ACTIVITIES
    // =========================================================

    const filteredActivities =
        useMemo(() => {

            // -------------------------------------------------
            // ALL
            // -------------------------------------------------

            if (
                activeFilter ===
                "All Activities"
            ) {

                return activities;

            }


            // -------------------------------------------------
            // LAND PREPARATION
            // -------------------------------------------------

            if (
                activeFilter ===
                "Land Preparation"
            ) {

                return activities.filter(
                    item =>
                        item.stage ===
                        "before_cultivation"
                );

            }


            // -------------------------------------------------
            // FERTILIZATION
            // -------------------------------------------------

            if (
                activeFilter ===
                "Fertilization"
            ) {

                return activities.filter(
                    item => {

                        const title =
                            item.title
                                .toLowerCase();


                        return (
                            title.includes(
                                "fertilizer"
                            ) ||

                            title.includes(
                                "urea"
                            ) ||

                            title.includes(
                                "potassium"
                            ) ||

                            title.includes(
                                "10.26.26"
                            ) ||

                            title.includes(
                                "dap"
                            )
                        );

                    }
                );

            }


            // -------------------------------------------------
            // PEST & DISEASE CONTROL
            // -------------------------------------------------

            if (
                activeFilter ===
                "Pest & Disease Control"
            ) {

                return activities.filter(
                    item => {

                        const title =
                            item.title
                                .toLowerCase();


                        return (
                            item.stage ===
                                "second_stage" ||

                            item.stage ===
                                "third_stage" ||

                            title.includes(
                                "herbicide"
                            ) ||

                            title.includes(
                                "fungicide"
                            ) ||

                            title.includes(
                                "insecticide"
                            ) ||

                            title.includes(
                                "spray"
                            ) ||

                            title.includes(
                                "beam"
                            ) ||

                            title.includes(
                                "incipio"
                            )

                        );

                    }
                );

            }


            // -------------------------------------------------
            // IRRIGATION
            // -------------------------------------------------

            if (
                activeFilter ===
                "Irrigation"
            ) {

                return activities.filter(
                    item =>
                        item.stage ===
                        "irrigation"
                );

            }


            // -------------------------------------------------
            // HARVEST
            // -------------------------------------------------

            if (
                activeFilter ===
                "Harvest"
            ) {

                return activities.filter(
                    item =>
                        item.stage ===
                        "harvest"
                );

            }


            return activities;

        }, [
            activities,
            activeFilter
        ]);


    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {

        return (

            <div
                className=
                    "crop-schedule-loading"
            >

                Loading your crop schedule...

            </div>

        );

    }


    // =========================================================
    // ERROR
    // =========================================================

    if (error) {

        return (

            <div
                className=
                    "crop-schedule-error"
            >

                {error}

            </div>

        );

    }


    // =========================================================
    // NO CROP
    // =========================================================

    if (!selectedCrop) {

        return (

            <div
                className=
                    "crop-schedule-empty"
            >

                <FaSeedling />

                <h3>
                    No registered crop found
                </h3>

                <p>
                    Please register a crop first.
                </p>

            </div>

        );

    }


    // =========================================================
    // DISPLAY CROP NAME
    // =========================================================

    const displayCropName =
        selectedCrop.crop_name ||
        "Crop";


    // =========================================================
    // HARVEST DATE
    // =========================================================

    const harvestDate =
        selectedCrop.harvest_date ||
        null;


    // =========================================================
    // CALENDAR MONTH
    // =========================================================

    const calendarMonth =
        selectedCrop.cultivation_date
            ? new Date(
                selectedCrop.cultivation_date
            ).toLocaleDateString(
                "en-US",
                {
                    month: "long",
                    year: "numeric"
                }
            )
            : "";


    // =========================================================
    // RENDER
    // =========================================================

    return (

        <div
            className=
                "crop-schedule-page"
        >


            {/* =================================================
                HEADER
            ================================================= */}

            <div
                className=
                    "schedule-header"
            >

                <div
                    className=
                        "schedule-title"
                >

                    <div
                        className=
                            "schedule-title-icon"
                    >

                        <FaCalendarAlt />

                    </div>


                    <div>

                        <h1>
                            {t.CropSchedule}
                        </h1>

                        <p>
                            {t.csp}
                        </p>

                    </div>

                </div>

            </div>


            {/* =================================================
                TOP INFORMATION
            ================================================= */}

            <div
                className=
                    "schedule-top-grid"
            >


                {/* =================================================
                    SELECT CROP
                ================================================= */}

                <div
                    className=
                        "crop-selector-card"
                >

                    <span
                        className=
                            "small-label"
                    >

                       {t.selectcrop}

                    </span>


                    <div
                        className=
                            "crop-selector"
                    >


                        <div
                            className=
                                "crop-thumb"
                        >

                            <img
                                src={
                                    cropName ===
                                        "paddy" ||

                                    cropName ===
                                        "rice"

                                        ? "/Images/Crop_Images/paddy_1.jpg"

                                        : `/Images/${cropName}.jpg`
                                }

                                alt={
                                    displayCropName
                                }

                                onError={
                                    (e) => {

                                        e.currentTarget.style.display =
                                            "none";

                                    }
                                }
                            />

                        </div>


                        <div
                            className=
                                "crop-name-area"
                        >

                            <strong>
                                {displayCropName}
                            </strong>


                            {season && (

                                <small>
                                    {season}
                                </small>

                            )}

                        </div>


                        <select
                            value={
                                selectedCropId ||
                                ""
                            }

                            onChange={
                                (e) =>
                                    setSelectedCropId(
                                        Number(
                                            e.target.value
                                        )
                                    )
                            }
                        >

                            {crops.map(
                                crop => (

                                    <option
                                        key={
                                            crop.id
                                        }

                                        value={
                                            crop.id
                                        }
                                    >

                                        {crop.crop_name}

                                        {crop.crop_season
                                            ? ` - ${crop.crop_season}`
                                            : ""}

                                    </option>

                                )
                            )}

                        </select>


                        <FaChevronDown />

                    </div>

                </div>


                {/* =================================================
                    SOWING DATE
                ================================================= */}

                <div
                    className=
                        "summary-card"
                >

                    <div
                        className=
                            "summary-icon green"
                    >

                        <FaSeedling />

                    </div>


                    <div>

                        <span>
                            {t.cultivationdate}
                        </span>

                        <strong>

                            {
                                formatDate(
                                    selectedCrop.cultivation_date
                                ) ||
                                "—"
                            }

                        </strong>

                    </div>

                </div>


                {/* =================================================
                    EXPECTED HARVEST
                ================================================= */}

                <div
                    className=
                        "summary-card"
                >

                    <div
                        className=
                            "summary-icon orange"
                    >

                        <FaSeedling />

                    </div>


                    <div>

                        <span>
                            {t.expectedharvest}
                        </span>

                        <strong>

                            {
                                harvestDate

                                    ? formatDate(
                                        harvestDate
                                    )

                                    : "—"
                            }

                        </strong>

                    </div>

                </div>


                {/* =================================================
                    ADD NEW CROP
                ================================================= */}

                <div
                    className=
                        "add-crop-card"

                    onClick={
                        () =>
                            navigate(
                                "/crop-registration"
                            )
                    }
                >

                    <div
                        className=
                            "add-icon"
                    >

                        +

                    </div>


                    <strong>
                       {t.addnewcrop}
                    </strong>

                </div>

            </div>


            {/* =================================================
                FILTERS
            ================================================= */}

            <div
                className=
                    "schedule-filters"
            >

                {[
                    "All Activities",
                    "Land Preparation",
                    "Fertilization",
                    "Pest & Disease Control",
                    "Irrigation",
                    "Harvest"
                ].map(
                    filter => (

                        <button
                            key={
                                filter
                            }

                            className={
                                activeFilter ===
                                    filter

                                    ? "active"

                                    : ""
                            }

                            onClick={
                                () =>
                                    setActiveFilter(
                                        filter
                                    )
                            }
                        >

                            {filter}

                        </button>

                    )
                )}

            </div>


            {/* =================================================
                MAIN CONTENT
            ================================================= */}

            <div
                className=
                    "schedule-content-grid"
            >


                {/* =================================================
                    TIMELINE
                ================================================= */}

                <div
                    className=
                        "timeline-card"
                >

                    <div
                        className=
                            "timeline"
                    >

                        {filteredActivities.map(
                            (item) => (

                                <div
                                    className=
                                        "timeline-row"

                                    key={
                                        item.id
                                    }
                                >


                                    {/* =================================
                                        TIMELINE LINE
                                    ================================= */}

                                    <div
                                        className=
                                            "timeline-line"
                                    >

                                        <div
                                            className={
                                                `timeline-dot ${item.stage}`
                                            }
                                        >

                                            <FaCircle />

                                        </div>

                                    </div>


                                    {/* =================================
                                        ACTIVITY ICON
                                    ================================= */}

                                    <div
                                        className=
                                            "activity-icon"
                                    >

                                        {item.icon}

                                    </div>


                                    {/* =================================
                                        ACTIVITY INFORMATION
                                    ================================= */}

                                    <div
                                        className=
                                            "activity-info"
                                    >

                                        <h3>
                                            {item.title}
                                        </h3>


                                        <p>
                                            {item.description}
                                        </p>


                                        {item.stageLabel && (

                                            <small
                                                className=
                                                    "stage-label"
                                            >

                                                {item.stageLabel}

                                                <span>

                                                    {" • "}

                                                    {
                                                        item.stageTelugu
                                                    }

                                                </span>

                                            </small>

                                        )}

                                    </div>


                                    {/* =================================
                                        DATE
                                    ================================= */}

                                    <div
                                        className=
                                            "activity-date"
                                    >

                                        <div>

                                            <FaCalendarAlt />

                                            <span>

                                                {
                                                    item.date
                                                        ? formatDate(
                                                            item.date
                                                        )
                                                        : ""
                                                }

                                            </span>

                                        </div>


                                        <small>

                                            {
                                                item.relative
                                            }

                                        </small>

                                    </div>


                                    {/* =================================
                                        STATUS
                                    ================================= */}

                                    <div
                                        className={
                                            `activity-status ${item.status.toLowerCase()}`
                                        }
                                    >

                                        {
                                            item.status ===
                                                "Completed"

                                                ? "Completed"

                                                : item.status ===
                                                    "Ongoing"

                                                    ? "Ongoing"

                                                    : "Upcoming"
                                        }

                                    </div>

                                </div>

                            )
                        )}

                    </div>

                </div>


                {/* =================================================
                    RIGHT SIDE
                ================================================= */}

                <div
                    className=
                        "schedule-right"
                >


                    {/* =================================================
                        CALENDAR
                    ================================================= */}

                    <div
                        className=
                            "calendar-card"
                    >

                        <div
                            className=
                                "calendar-header"
                        >

                            <button>
                                <FaChevronLeft />
                            </button>


                            <strong>
                                {calendarMonth}
                            </strong>


                            <button>
                                <FaChevronRight />
                            </button>

                        </div>


                        <div
                            className=
                                "calendar-week"
                        >

                            {[
                                "Sun",
                                "Mon",
                                "Tue",
                                "Wed",
                                "Thu",
                                "Fri",
                                "Sat"
                            ].map(
                                day => (

                                    <span
                                        key={
                                            day
                                        }
                                    >

                                        {day}

                                    </span>

                                )
                            )}

                        </div>


                        <div
                            className=
                                "calendar-note"
                        >

                            <FaCheckCircle />


                            <span>

                                {t.Cultivation}:
                                {" "}

                                {
                                    formatDate(
                                        selectedCrop.cultivation_date
                                    )
                                }

                            </span>

                        </div>

                    </div>


                    {/* =================================================
                        TODAY'S TASK
                    ================================================= */}

                    <div
                        className=
                            "today-task-card"
                    >

                        <div
                            className=
                                "side-card-title"
                        >

                            <FaSeedling />

                            <strong>
                                Today's Task
                            </strong>

                        </div>


                        <h4>
                            No tasks for today
                        </h4>


                        <p>
                            Enjoy your day and keep
                            monitoring your crop!
                        </p>

                    </div>


                    {/* =================================================
                        FARMING TIPS
                    ================================================= */}

                    <div
                        className=
                            "tips-card"
                    >

                        <div
                            className=
                                "side-card-title"
                        >

                            <FaSeedling />

                            <strong>
                                {t.FarmingTips}
                            </strong>


                            <span>
                                {t.viewall} →
                            </span>

                        </div>


                        <div
                            className=
                                "tip-item"
                        >

                            <FaCheckCircle />

                            {t.ft1}

                        </div>


                        <div
                            className=
                                "tip-item"
                        >

                            <FaCheckCircle />

                            {t.ft2}

                        </div>


                        <div
                            className=
                                "tip-item"
                        >

                            <FaCheckCircle />

                            {t.ft3}

                        </div>


                        <div
                            className=
                                "tip-item"
                        >

                            <FaCheckCircle />

                            {t.ft4}

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}


export default CropSchedule;