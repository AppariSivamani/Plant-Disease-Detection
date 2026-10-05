import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import './index.css'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import { LanguageProvider } from "./context/LanguageContext";

createRoot(document.getElementById('root')).render(
  <BrowserRouter>

    <LanguageProvider>

        <App />

    </LanguageProvider>

</BrowserRouter>
)
