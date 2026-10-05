import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useLanguage } from "../context/LanguageContext";


import {
  FaSeedling,
  FaCalendarAlt,
  FaBookOpen,
  FaChevronDown,
  FaThLarge,
  FaList,
  FaPlus,
  FaLeaf,
  FaCheckCircle,
  FaExclamationCircle,
  FaHourglassHalf,
  FaShoppingBasket,
  FaArrowUp,
  FaArrowRight,
  FaEllipsisV,
  FaEdit,
} from "react-icons/fa";

import "./DashboardPages.css";


const API_BASE_URL = "http://127.0.0.1:8000";


// --------------------------------------------------
// Crop images
// Put these images inside public/Images/
// --------------------------------------------------

const cropImages = {
  paddy: "/Images/Crop_Images/paddy.jpg",
  tomato: "/Images/tomato.png",
  chilli: "/Images/chilli.png",
  maize: "/Images/maize.png",
  cotton: "/Images/cotton.png",
};


// --------------------------------------------------
// Crop duration
// --------------------------------------------------

const cropDurations = {
  paddy: {
    Sarva: 145,
    Dalwa: 135,
  },
  tomato: 90,
  chilli: 100,
  maize: 110,
  cotton: 150,
  other: 120,
};




const normalizeCropName = (name) => {
  if (!name) return "other";

  const value = name.toString().trim().toLowerCase();

  if (value.includes("paddy") || value.includes("rice")) {
    return "paddy";
  }

  if (value.includes("tomato")) {
    return "tomato";
  }

  if (
    value.includes("chilli") ||
    value.includes("chili") ||
    value.includes("mirchi")
  ) {
    return "chilli";
  }

  if (value.includes("maize") || value.includes("corn")) {
    return "maize";
  }

  if (value.includes("cotton")) {
    return "cotton";
  }

  return "other";
};


const getCropDuration = (crop) => {
  const cropType = normalizeCropName(crop.crop_name);

  if (cropType === "paddy") {
    return cropDurations.paddy[crop.crop_season] || 145;
  }

  return cropDurations[cropType] || 120;
};


const calculateAge = (cultivationDate) => {
  if (!cultivationDate) return 0;

  const start = new Date(cultivationDate);

  if (Number.isNaN(start.getTime())) {
    return 0;
  }

  const today = new Date();

  const difference =
    today.getTime() - start.getTime();

  const age = Math.floor(
    difference / (1000 * 60 * 60 * 24)
  );

  return Math.max(age, 0);
};


const formatDate = (date) => {
  if (!date) return "-";

  const value = new Date(date);

  if (Number.isNaN(value.getTime())) {
    return date;
  }

  return value.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};


const getCropStatus = (crop) => {
  const age = calculateAge(crop.cultivation_date);
  const duration = getCropDuration(crop);

  const progress = Math.min(
    Math.round((age / duration) * 100),
    100
  );

  if (crop.harvest_date) {
    const harvestDate = new Date(crop.harvest_date);
    const today = new Date();

    if (harvestDate <= today) {
      return "Harvest Ready";
    }
  }

  if (progress >= 90) {
    return "Harvest Ready";
  }

  if (progress >= 75) {
    return "Needs Attention";
  }

  return "Growing Well";
};


const getProgress = (crop) => {
  const age = calculateAge(crop.cultivation_date);
  const duration = getCropDuration(crop);

  return Math.min(
    Math.round((age / duration) * 100),
    100
  );
};


// --------------------------------------------------
// Main Component
// --------------------------------------------------

const MyCrops = () => {
  const navigate = useNavigate();

  const [crops, setCrops] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [activeFilter, setActiveFilter] = useState("all");

  const [season, setSeason] = useState("All Seasons");

  const [viewMode, setViewMode] = useState("grid");

  const [searchText, setSearchText] = useState("");

  const [notificationCount, setNotificationCount] =
    useState(0);

  const { t } = useLanguage();



  // --------------------------------------------------
  // Fetch crops
  // --------------------------------------------------

  useEffect(() => {
    fetchCrops();
  }, []);


  const fetchCrops = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${API_BASE_URL}/api/my-crop/`
      );

      console.log("My crops API:", response.data);

      let cropData = response.data;

      // Handle different possible API response formats

      if (Array.isArray(cropData)) {
        setCrops(cropData);
      } else if (Array.isArray(cropData.crops)) {
        setCrops(cropData.crops);
      } else if (Array.isArray(cropData.data)) {
        setCrops(cropData.data);
      } else if (cropData.crop_name) {
        setCrops([cropData]);
      } else {
        setCrops([]);
      }

    } catch (err) {
      console.error("Failed to fetch crops:", err);

      setError(
        "Unable to load your crops. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };


  // --------------------------------------------------
  // Search
  // --------------------------------------------------

  const searchedCrops = useMemo(() => {
    if (!searchText.trim()) {
      return crops;
    }

    const search = searchText.toLowerCase();

    return crops.filter((crop) => {
      return (
        crop.crop_name?.toLowerCase().includes(search) ||
        crop.village?.toLowerCase().includes(search) ||
        crop.district?.toLowerCase().includes(search)
      );
    });
  }, [crops, searchText]);


  // --------------------------------------------------
  // Season filter
  // --------------------------------------------------

  const seasonFilteredCrops = useMemo(() => {
    if (season === "All Seasons") {
      return searchedCrops;
    }

    return searchedCrops.filter(
      (crop) =>
        crop.crop_season?.toLowerCase() ===
        season.toLowerCase()
    );
  }, [searchedCrops, season]);


  // --------------------------------------------------
  // Status filter
  // --------------------------------------------------

  const filteredCrops = useMemo(() => {
    if (activeFilter === "all") {
      return seasonFilteredCrops;
    }

    return seasonFilteredCrops.filter((crop) => {
      const status = getCropStatus(crop);

      if (activeFilter === "growing") {
        return status === "Growing Well";
      }

      if (activeFilter === "harvest") {
        return status === "Harvest Ready";
      }

      if (activeFilter === "attention") {
        return status === "Needs Attention";
      }

      if (activeFilter === "completed") {
        return status === "Completed";
      }

      return true;
    });
  }, [
    seasonFilteredCrops,
    activeFilter,
  ]);


  // --------------------------------------------------
  // Statistics
  // --------------------------------------------------

  const totalCrops = crops.length;

  const activeCrops = crops.filter((crop) => {
    const status = getCropStatus(crop);

    return (
      status === "Growing Well" ||
      status === "Needs Attention"
    );
  }).length;


  const attentionCrops = crops.filter(
    (crop) =>
      getCropStatus(crop) ===
      "Needs Attention"
  ).length;


  const harvestReadyCrops = crops.filter(
    (crop) =>
      getCropStatus(crop) ===
      "Harvest Ready"
  ).length;


  // Expected yield placeholder based on acres.
  // Can later be connected to backend yield API.

  const expectedYield = crops.reduce(
    (total, crop) => {
      const acres = Number(crop.acres || 0);

      return total + acres * 2;
    },
    0
  );


  // --------------------------------------------------
  // Filter counts
  // --------------------------------------------------

  const growingCount = crops.filter(
    (crop) =>
      getCropStatus(crop) ===
      "Growing Well"
  ).length;


  const attentionCount = attentionCrops;

  const harvestCount = harvestReadyCrops;


  // --------------------------------------------------
  // Crop card
  // --------------------------------------------------

  const renderCropCard = (crop) => {
    const cropType =
      normalizeCropName(crop.crop_name);

    const image =
      cropImages[cropType] ||
      "/Images/Crop_Images/paddy.jpg";

    const age =
      calculateAge(crop.cultivation_date);

    const duration =
      getCropDuration(crop);

    const progress =
      getProgress(crop);

    const status =
      getCropStatus(crop);


    let statusClass = "growing";

    if (status === "Needs Attention") {
      statusClass = "attention";
    }

    if (status === "Harvest Ready") {
      statusClass = "harvest";
    }

    


    return (
      <div
        className={`crop-card ${
          viewMode === "list"
            ? "crop-card-list"
            : ""
        }`}
        key={crop.id}
      >

        {/* Crop image */}

        <div className="crop-image-wrapper">

          <img
            src={image}
            alt={crop.crop_name}
            className="crop-image"
            onError={(e) => {
              e.currentTarget.src =
                "/Images/Crop_Images/paddy.jpg";
            }}
          />

          <div
            className={`crop-status ${statusClass}`}
          >
            {status === "Growing Well" && (
              <FaLeaf />
            )}

            {status === "Needs Attention" && (
              <FaExclamationCircle />
            )}

            {status === "Harvest Ready" && (
              <FaCheckCircle />
            )}

            <span>{status}</span>
          </div>

        </div>


        {/* Crop content */}

        <div className="crop-card-content">

          <div className="crop-title-row">

            <h3>
              {crop.crop_name || "Crop"}
            </h3>

            <button className="more-button">
              <FaEllipsisV />
            </button>

          </div>


          {/* Sowing date */}

          <div className="crop-info-row">

            <FaCalendarAlt />

            <span>
              {t.sown}:{" "}
              {formatDate(
                crop.cultivation_date
              )}
            </span>

          </div>


          {/* Age */}

          <div className="crop-info-row">

            <FaLeaf />

            <span>
              {t.age}: {age} {t.days}
            </span>

          </div>


          {/* Progress */}

          <div className="crop-progress-row">

            <div className="progress-track">

              <div
                className={`progress-fill ${statusClass}`}
                style={{
                  width: `${progress}%`,
                }}
              />

            </div>

            <div className="progress-text">

              <span>
                {age} / {duration} {t.days}
              </span>

              <strong>
                {progress}%
              </strong>

            </div>

          </div>


          {/* Buttons */}

          
        </div>

      </div>
    );
  };


  // --------------------------------------------------
  // Loading
  // --------------------------------------------------

  if (loading) {
    return (
      <div className="my-crops-page">

        

        <main className="my-crops-main">

          <div className="loading-container">

            <div className="loading-spinner"></div>

            <p>
              Loading your crops...
            </p>

          </div>

        </main>

      </div>
    );
  }


  // --------------------------------------------------
  // Main UI
  // --------------------------------------------------

  return (
    <div className="my-crops-page">


      {/* =========================
          SIDEBAR
      ========================== */}

      


      {/* =========================
          MAIN
      ========================== */}

      <main className="my-crops-main">


        {/* =========================
            TOP HEADER
        ========================== */}

        


        {/* =========================
            PAGE HERO
        ========================== */}

        <section className="page-hero">

          <div className="hero-title">

            <h1>
              <FaSeedling />
              {t.mycrops}
            </h1>

            <p>
              {t.mycropsp}
            </p>

          </div>
        </section>


        {/* =========================
            ERROR
        ========================== */}

        {error && (
          <div className="error-box">
            {error}

            <button
              onClick={fetchCrops}
            >
              Retry
            </button>
          </div>
        )}


        {/* =========================
            STAT CARDS
        ========================== */}

        <section className="stats-grid">


          {/* Total Crops */}

          <div className="stat-card green-card">

            <div className="stat-icon">
              <FaSeedling />
            </div>

            <div>

              <span>
                {t.totalcrops}
              </span>

              <strong>
                {totalCrops}
              </strong>

              <small>
                +{totalCrops > 0 ? totalCrops : 0} {t.thisseason}
                <FaArrowUp />
              </small>

            </div>

          </div>


          {/* Active Crops */}

          <div className="stat-card yellow-card">

            <div className="stat-icon">
              <FaLeaf />
            </div>

            <div>

              <span>
                {t.activecrops}
              </span>

              <strong>
                {activeCrops}
              </strong>

              <small>
                <FaCheckCircle />
                {t.growingwell}
              </small>

            </div>

          </div>


          {/* Attention */}

          <div className="stat-card red-card">

            <div className="stat-icon">
              <FaHourglassHalf />
            </div>

            <div>

              <span>
                {t.needatten}
              </span>

              <strong>
                {attentionCrops}
              </strong>

              <small>
                {t.checknow}
                <FaArrowRight />
              </small>

            </div>

          </div>


          {/* Expected Yield */}

          <div className="stat-card blue-card">

            <div className="stat-icon">
              <FaShoppingBasket />
            </div>

            <div>

              <span>
                {t.excepted}
              </span>

              <strong>
                {expectedYield.toFixed(1)} {t.quint}
              </strong>

              <small>
                +12% {t.fromlast}
                <FaArrowUp />
              </small>

            </div>

          </div>

        </section>


        {/* =========================
            FILTER BAR
        ========================== */}

        <section className="filter-section">


          <div className="filter-tabs">


            <button
              className={
                activeFilter === "all"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setActiveFilter("all")
              }
            >
              {t.totalcrops} ({totalCrops})
            </button>


            <button
              className={
                activeFilter === "growing"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setActiveFilter("growing")
              }
            >
              {t.growing} ({growingCount})
            </button>


            <button
              className={
                activeFilter === "harvest"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setActiveFilter("harvest")
              }
            >
              {t.harvsttoday} ({harvestCount})
            </button>


            <button
              className={
                activeFilter === "attention"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setActiveFilter("attention")
              }
            >
              {t.needatten} ({attentionCount})
            </button>


            <button
              className={
                activeFilter === "completed"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setActiveFilter("completed")
              }
            >
              {t.completed} (0)
            </button>

          </div>


          <div className="filter-right">

            <label>
              {t.season}
            </label>

            <div className="season-select">

              <FaCalendarAlt />

              <select
                value={season}
                onChange={(e) =>
                  setSeason(
                    e.target.value
                  )
                }
              >

                <option>
                  {t.allseasons}
                </option>

                <option value="Sarva">
                  {t.sarva}
                </option>

                <option value="Dalwa">
                  {t.dalwa}
                </option>

              </select>

              <FaChevronDown />

            </div>


            <button
              className={
                viewMode === "grid"
                  ? "view-toggle active"
                  : "view-toggle"
              }
              onClick={() =>
                setViewMode("grid")
              }
            >
              <FaThLarge />
            </button>


            <button
              className={
                viewMode === "list"
                  ? "view-toggle active"
                  : "view-toggle"
              }
              onClick={() =>
                setViewMode("list")
              }
            >
              <FaList />
            </button>

          </div>

        </section>


        {/* =========================
            CROPS GRID
        ========================== */}

        <section
          className={`crops-grid ${
            viewMode === "list"
              ? "list-view"
              : ""
          }`}
        >

          {filteredCrops.map(
            renderCropCard
          )}


          {/* Add New Crop */}

          <div
            className="add-crop-card"
            onClick={() =>
              navigate(
                "/crop-registration"
              )
            }
            style={{backgroundImage: "url('/Images/Crop_Images/plant.jpeg')",
            backgroundSize: 'cover',backgroundPosition: 'center'}}
          >

            <div className="add-icon">
              <FaPlus />
            </div>

            <h3 style={{fontWeight: "bold", color: "white"}}>
              {t.addnewcrop}
            </h3>

            <p style={{color: "white", fontWeight: "800"}}>
              {t.addnewp}
            </p>

            <div className="add-crop-image" ></div>

          </div>

        </section>


        {/* Empty state */}

        {filteredCrops.length === 0 && (
          <div className="empty-state">

            <FaSeedling />

            <h3>
              No crops found
            </h3>

            <p>
              Register a crop to start
              tracking its growth.
            </p>

            <button
              onClick={() =>
                navigate(
                  "/crop-registration"
                )
              }
            >
              <FaPlus />
              {t.addnewcrop}
            </button>

          </div>
        )}


        {/* =========================
            BOTTOM BANNER
        ========================== */}

        <section className="management-banner">

          <div className="management-icon">
            <FaSeedling />
          </div>

          <div className="management-text">

            <h3>
              {t.managementp1}
            </h3>

            <p>
              {t.managementp2}
            </p>

          </div>

          <button
            onClick={() =>
              navigate("")
            }
          >
            <FaBookOpen />
            {t.learncropmanage}
          </button>

        </section>

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


      </main>

      

    </div>
  );
};


export default MyCrops;