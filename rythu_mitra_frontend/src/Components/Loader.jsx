import React from "react";

function Loader() {
  return (
    <div className="loader-container">

      <div className="loader-circle"></div>

      <h3>AI is Analyzing the Rice Leaf...</h3>

      <p>
        Please wait while our deep learning model predicts the disease.
      </p>

    </div>
  );
}

export default Loader;