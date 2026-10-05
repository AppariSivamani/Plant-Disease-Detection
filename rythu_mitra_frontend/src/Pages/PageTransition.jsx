import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./PageTransition.css";

function PageTransition({ children }) {

    const location = useLocation();

    const [showTransition, setShowTransition] = useState(false);
    const [firstLoad, setFirstLoad] = useState(true);

    useEffect(() => {

        // Don't show video when application loads
        if (firstLoad) {

            setFirstLoad(false);

            return;

        }

        // Show transition whenever route changes
        setShowTransition(true);

    }, [location.pathname]);

    const handleVideoEnd = () => {

        setShowTransition(false);

    };

    return (

        <>

            {/* =========================================
                PAGE CONTENT
            ========================================= */}

            <div
                className={
                    showTransition
                        ? "page-content page-blurred"
                        : "page-content"
                }
            >

                {children}

            </div>


            {/* =========================================
                VIDEO TRANSITION
            ========================================= */}

            {showTransition && (

                <div className="page-transition-overlay">

                    <div className="page-transition-video-container">

                        <video
                            className="page-transition-video"
                            src="/videos/vid.webm"
                            autoPlay
                            muted
                            playsInline
                            onLoadedMetadata={(e) => {
                                e.currentTarget.playbackRate = 2;
                            }}
                            onEnded={handleVideoEnd}
                        />

                    </div>

                </div>

            )}

        </>

    );

}

export default PageTransition;