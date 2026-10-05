import React, {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

import { translations } from "../data/translations";

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {

    const [language, setLanguage] = useState(
        localStorage.getItem("language") || "en"
    );

    useEffect(() => {
        localStorage.setItem("language", language);
    }, [language]);

    const toggleLanguage = () => {

        setLanguage((currentLanguage) =>
            currentLanguage === "en" ? "te" : "en"
        );

    };

    const t = translations[language];

    return (
        <LanguageContext.Provider
            value={{
                language,
                setLanguage,
                toggleLanguage,
                t
            }}
        >
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {

    const context = useContext(LanguageContext);

    if (!context) {
        throw new Error(
            "useLanguage must be used inside LanguageProvider"
        );
    }

    return context;
}