import React from "react";
import {
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  FaHome,
  FaSeedling,
  FaCamera,
  FaRobot,
  FaCalendarAlt,
  FaArrowLeft,
  FaTimes,
  FaGlobe,
  FaBars,
  FaLeaf,
  FaUser
} from "react-icons/fa";

import "./FarmerLayout.css";
import { useLanguage } from "../context/LanguageContext";




function FarmerLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const { toggleLanguage, t } = useLanguage();

  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const menuItems = [
    {
      name: t.Dashboard3,
      icon: <FaHome />,
      path: "/dashboard",
      exact: true,
    },
    {
      name: t.mycrops,
      icon: <FaSeedling />,
      path: "/dashboard/my-crops",
    },
    {
      name: t.diseasedetection,
      icon: <FaCamera />,
      path: "/dashboard/disease-detection",
    },
    {
      name: t.AIChat,
      icon: <FaRobot />,
      path: "/dashboard/ai-chat",
    },

    {
      name: t.CropSchedule,
      icon: <FaCalendarAlt />,
      path: "/dashboard/crop-schedule",
      disabled: true,
    },

    {
      name: t.CropReport,
      icon: <FaLeaf />,
      path: "/dashboard/crop-report",
    },

    {
      name: t.cropregistration,
      icon: <FaSeedling />,
      path: "/crop-registration",
    },

    {
      name: t.contact,
      icon: <FaUser />,
      path: "/contact",
    },


  ];


  const isActive = (item) => {
    if (item.exact) {
      return location.pathname === item.path;
    }



    return (
      location.pathname === item.path ||
      location.pathname.startsWith(item.path + "/")
    );
  };

  return (
    <div className="farmer-layout">

      {/* ================= SIDEBAR ================= */}

      <aside
        className={`farmer-sidebar ${sidebarOpen ? "sidebar-open" : ""
          }`}
      >

        {/* ================= MOBILE MENU BUTTON ================= */}

        

        <button
          className="mobile-menu-button"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Menu"
        >
          
          {sidebarOpen ? <FaTimes /> : <FaBars />}
          
          {sidebarOpen ? t.Close : t.Menu2}
          
        </button>


        {/* ================= BACK BUTTON ================= */}

        <button
          className="back-btn"
          onClick={() => navigate("/homepage")}
        >
          <FaArrowLeft />
          <span>{t.Back}</span>
        </button>


        {/* ================= LOGO ================= */}

        <div className="sidebar-logo">

          <img
            src="/Images/Rythu_Mitra_Logo_1-removebg-preview.png"
            alt="Rythu Mitra AI"
          />

          <h2 style={{ color: "yellow" }}>
            రైతు మిత్ర <span style={{ color: "white" }}>AI</span>
          </h2>

          <p>
            Smart Farming • Brighter Tomorrow
          </p>

        </div>


        {/* ================= MENU ================= */}

        <div className="sidebar-menu">

          {menuItems.map((item) => (

            <button
              key={item.name}
              disabled={item.disabled}
              className={`
    sidebar-item
    ${isActive(item) ? "active" : ""}
    ${item.disabled ? "disabled" : ""}
  `}
              onClick={() => {
                if (item.disabled) return;
                navigate(item.path);
                setSidebarOpen(false);
              }}
            >

              <span className="sidebar-icon">
                {item.icon}
              </span>

              <span className="sidebar-text">
                {item.name}
              </span>

            </button>

          ))}

        </div>

      </aside>


      {/* ================= MAIN ================= */}

      <div className="farmer-main">

        {/* HEADER */}

        <header className="farmer-header">

          {/* Search 
          <div className="search-box">

            <FaSearch />

            <input
              type="text"
              placeholder="Search crops, diseases, or ask anything..."
            />

          </div>  */}


          {/* Header Right */}
          <div className="header-right">

            {/* Language */}
            <div className="language">

              <FaGlobe />

              <span>
                <button type="button" onClick={() => toggleLanguage("en")}> English </button> { }| <button type="button" onClick={() => toggleLanguage("te")}>తెలుగు</button>
              </span>

            </div>


            {/* Notification 
            <div
              className="header-notification"
              onClick={() =>
                navigate("/dashboard/notifications")
              }
            >

              <FaBell />


            </div>  */}

          </div>

        </header>


        {/* ================= PAGE CONTENT ================= */}

        <main className="farmer-content">

          <Outlet />

        </main>

      </div>

    </div>
  );
}

export default FarmerLayout;