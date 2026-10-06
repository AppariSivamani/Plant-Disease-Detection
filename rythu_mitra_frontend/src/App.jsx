import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './Navbar'
import CropRegistration from './Registration/CropRegistration'
import FarmerDashboard from './Registration/FarmerDashboard '
import PageTransition from './Pages/PageTransition'
import WelcomePage from './Pages/WelcomePage'
import Contact from './Pages/Contact'
import Login from './Pages/Login'
import MyCrops from './DashboardPages/MyCrops'
import FarmerLayout from './layouts/FarmerLayout'
import DiseaseDetection from './DashboardPages/DiseaseDetection'
import AIChat from './DashboardPages/AIChat'
import CropSchedule from './DashboardPages/CropSchedule'
import CropReport from './DashboardPages/CropReport'

function App() {

  return (
    <div>

      <PageTransition>
        <Routes>

          <Route path="/" element={<Login />} />

          <Route path='/homepage' element={<Navbar />} />

          <Route path="/welcome-page" element={<WelcomePage />} />

          <Route path='/disease-info/:disease' element={<DiseaseInfo />} />

          <Route path='/crop-registration' element={<CropRegistration />} />

          <Route path="/contact" element={<Contact />} />

          <Route
            path="/dashboard"
            element={<FarmerLayout />}
          >

            {/* 
              /dashboard
              Default page
            */}
            <Route
              index
              element={<FarmerDashboard />}
            />


            {/* 
              /dashboard/my-crops
            */}
            <Route
              path="my-crops"
              element={<MyCrops />}
            />


            {/* 
              /dashboard/disease-detection
            */}
            <Route
              path="disease-detection"
              element={<DiseaseDetection />}
            />

            <Route
              path="ai-chat"
              element={<AIChat />}
            />

            <Route
              path="crop-schedule"
              element={<CropSchedule />}
            />

            <Route
              path="crop-report"
              element={<CropReport />}
            />






            

          </Route>


        </Routes>
      </PageTransition>



    </div>


  )
}

export default App
