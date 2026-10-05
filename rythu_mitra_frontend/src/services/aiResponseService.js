import axios from "axios";
import { diseaseData } from "../data/diseaseData";
import CROP_DATA from "../data/cropData";
import API_BASE_URL from "../config";


// =====================================================
// TEXT HELPER
// =====================================================

const getText = (value, language = "en") => {

    if (!value) {
        return "";
    }

    if (typeof value === "string") {
        return value;
    }

    return (
        value[language] ||
        value.en ||
        value.te ||
        ""
    );
};


// =====================================================
// FIND DISEASE
// =====================================================

const findDisease = (question) => {

    const q = question
        .toLowerCase()
        .replace(/_/g, " ");

    for (const key of Object.keys(diseaseData)) {

        const disease = diseaseData[key];

        const names = [

            key,

            disease?.name?.en,

            disease?.name?.te,

            disease?.aliases?.en,

            disease?.aliases?.te

        ];

        const flattened = [];

        names.forEach((item) => {

            if (Array.isArray(item)) {

                flattened.push(...item);

            } else if (item) {

                flattened.push(item);

            }

        });

        const found = flattened.some((name) => {

            if (!name) return false;

            return q.includes(
                String(name)
                    .toLowerCase()
                    .replace(/_/g, " ")
            );

        });

        if (found) {

            return {
                key,
                data: disease
            };

        }
    }

    return null;
};


// =====================================================
// FIND CROP
// =====================================================

const findCrop = (question) => {

    const q = question.toLowerCase();

    for (const key of Object.keys(CROP_DATA)) {

        const crop = CROP_DATA[key];

        const names = [
            key,
            crop?.name?.en,
            crop?.name?.te,
            ...(crop?.aliases || [])
        ];

        const found = names.some((name) => {

            if (!name) return false;

            return q.includes(
                String(name).toLowerCase()
            );

        });

        if (found) {

            return {
                key,
                data: crop
            };

        }
    }

    return null;
};


// =====================================================
// DISEASE CONTROL RESPONSE
// =====================================================

const diseaseControlAnswer = (
    disease,
    language = "en"
) => {

    const name = getText(
        disease.data?.name,
        language
    );

    const treatment =
        disease.data?.chemicalTreatment;

    let answer =
        `🌿 ${name}\n\n`;

    answer +=
        language === "te"
            ? "వ్యాధి నియంత్రణ:\n"
            : "Disease Control:\n";

    if (treatment?.firstApplication) {

        const first =
            treatment.firstApplication;

        answer +=
            `\n1. ${getText(first.product, language)}`;

        if (first.dosage) {

            answer +=
                `\n   Dosage: ${getText(
                    first.dosage,
                    language
                )}`;

        }

        if (first.dosagePerAcre) {

            answer +=
                `\n   Per Acre: ${getText(
                    first.dosagePerAcre,
                    language
                )}`;

        }

        if (first.timing) {

            answer +=
                `\n   Timing: ${getText(
                    first.timing,
                    language
                )}`;

        }

    }

    if (treatment?.followUpApplication) {

        const follow =
            treatment.followUpApplication;

        answer +=
            `\n\n2. ${getText(
                follow.product,
                language
            )}`;

        if (follow.dosage) {

            answer +=
                `\n   Dosage: ${getText(
                    follow.dosage,
                    language
                )}`;

        }

        if (follow.dosagePerAcre) {

            answer +=
                `\n   Per Acre: ${getText(
                    follow.dosagePerAcre,
                    language
                )}`;

        }

        if (follow.timing) {

            answer +=
                `\n   Timing: ${getText(
                    follow.timing,
                    language
                )}`;

        }

    }

    if (disease.data?.prevention) {

        answer +=
            `\n\n🛡️ ${
                language === "te"
                    ? "నివారణ"
                    : "Prevention"
            }:\n`;

        answer += getText(
            disease.data.prevention,
            language
        );

    }

    return answer;
};


// =====================================================
// ABOUT DISEASE
// =====================================================

const diseaseInfoAnswer = (
    disease,
    language = "en"
) => {

    const data = disease.data;

    let answer =
        `🌿 ${getText(
            data.name,
            language
        )}\n\n`;

    if (data.symptoms) {

        answer +=
            `🔎 ${
                language === "te"
                    ? "లక్షణాలు"
                    : "Symptoms"
            }:\n`;

        answer +=
            `${getText(
                data.symptoms,
                language
            )}\n\n`;

    }

    if (data.causes) {

        answer +=
            `🦠 ${
                language === "te"
                    ? "కారణం"
                    : "Cause"
            }:\n`;

        answer +=
            `${getText(
                data.causes,
                language
            )}\n\n`;

    }

    if (data.prevention) {

        answer +=
            `🛡️ ${
                language === "te"
                    ? "నివారణ"
                    : "Prevention"
            }:\n`;

        answer +=
            getText(
                data.prevention,
                language
            );

    }

    return answer;
};


// =====================================================
// CROP REPORT
// =====================================================

const cropReportAnswer = (
    crop,
    language = "en"
) => {

    const data = crop.data;

    let answer =
        `🌾 ${getText(
            data.name,
            language
        )}\n\n`;

    answer +=
        `Duration: ${data.duration} days\n`;

    answer +=
        `Budget: ${getText(
            data.budget,
            language
        )}\n\n`;

    if (data.before_cultivation) {

        answer +=
            `🌱 Before Cultivation\n\n`;

        answer +=
            `Seed: ${getText(
                data.before_cultivation.seed,
                language
            )}\n`;

        answer +=
            `Fertilizer: ${getText(
                data.before_cultivation.dap,
                language
            )}\n\n`;

    }

    


    // Group schedule by stage

    const stages = {};

    data.schedule.forEach((item) => {

        if (!stages[item.stage]) {

            stages[item.stage] = [];

        }

        stages[item.stage].push(item);

    });


    Object.entries(stages).forEach(
        ([stage, items]) => {

            let stageName =
                stage
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (c) =>
                        c.toUpperCase()
                    );

            answer +=
                `\n━━━━━━━━━━━━━━━━━━\n`;

            answer +=
                `🌿 ${stageName}\n`;

            answer +=
                `━━━━━━━━━━━━━━━━━━\n`;

            items.forEach((item) => {

                answer +=
                    `\nDay ${item.day}\n`;

                answer +=
                    `Product: ${getText(
                        item.product,
                        language
                    )}\n`;

                answer +=
                    `Dosage: ${getText(
                        item.dosage,
                        language
                    )}\n`;

            });

        }
    );

    return answer;
};


// =====================================================
// WEATHER
// =====================================================

const weatherAnswer = async (
    language = "en"
) => {

    try {

        // Get farmer's registered location

        const cropResponse =
            await axios.get(
                `${API_BASE_URL}/api/my-crop/`
            );

        if (
            !cropResponse.data?.success ||
            !cropResponse.data?.data?.length
        ) {

            return language === "te"
                ? "మీ రైతు స్థాన వివరాలు అందుబాటులో లేవు."
                : "Your registered farmer location is not available.";

        }

        const farmer =
            cropResponse.data.data[0];

        const village =
            farmer.village;

        const district =
            farmer.district;

        if (!village || !district) {

            return language === "te"
                ? "మీ గ్రామం లేదా జిల్లా వివరాలు అందుబాటులో లేవు."
                : "Village or district information is not available.";

        }


        // Existing backend weather API

        const response =
            await axios.get(
                `${API_BASE_URL}/api/farmer-weather/`,
                {
                    params: {
                        village,
                        district
                    }
                }
            );


        if (!response.data?.success) {

            return language === "te"
                ? "ప్రస్తుతం వాతావరణ సమాచారం అందుబాటులో లేదు."
                : "Weather information is currently unavailable.";

        }


        const weather =
            response.data.data || {};


        let answer =
            `🌤️ Weather Report\n\n`;

        answer +=
            `📍 ${village}, ${district}\n\n`;


        if (weather.temperature !== undefined) {

            answer +=
                `🌡️ Temperature: ${weather.temperature}°C\n`;

        }

        if (weather.humidity !== undefined) {

            answer +=
                `💧 Humidity: ${weather.humidity}%\n`;

        }

        if (weather.wind_speed !== undefined) {

            answer +=
                `💨 Wind: ${weather.wind_speed} km/h\n`;

        }

        if (weather.description) {

            answer +=
                `☁️ Condition: ${weather.description}\n`;

        }

        if (weather.rainfall !== undefined) {

            answer +=
                `🌧️ Rainfall: ${weather.rainfall}\n`;

        }

        answer +=
            `\nSpraying Tip:\n`;

        answer +=
            `Avoid pesticide spraying during strong winds or expected rainfall.`;

        return answer;

    } catch (error) {

        console.error(
            "AI Weather Error:",
            error
        );

        return language === "te"
            ? "వాతావరణ సమాచారాన్ని పొందలేకపోయాము."
            : "Unable to fetch weather information.";

    }
};


// =====================================================
// MAIN AI RESPONSE
// =====================================================

export const getIntegratedAIAnswer = async (
    question,
    category = "All",
    language = "en"
) => {

    const q =
        question
            .toLowerCase()
            .trim();


    // =================================================
    // WEATHER
    // =================================================

    if (
        category === "Weather" ||
        q.includes("weather") ||
        q.includes("వాతావరణం")
    ) {

        return await weatherAnswer(
            language
        );

    }


    // =================================================
    // DISEASE
    // =================================================

    const disease =
        findDisease(question);


    if (disease) {

        if (
            category === "Disease Control" ||
            q.includes("control") ||
            q.includes("treatment") ||
            q.includes("fertilizer") ||
            q.includes("dosage") ||
            q.includes("medicine") ||
            q.includes("మందు") ||
            q.includes("నియంత్రణ")
        ) {

            return diseaseControlAnswer(
                disease,
                language
            );

        }


        if (
            category === "Prevention" ||
            q.includes("prevent") ||
            q.includes("prevention") ||
            q.includes("నివారణ")
        ) {

            return (
                `🛡️ Prevention for ${getText(
                    disease.data.name,
                    language
                )}\n\n` +
                getText(
                    disease.data.prevention,
                    language
                )
            );

        }


        return diseaseInfoAnswer(
            disease,
            language
        );

    }


    // =================================================
    // CROP REPORT
    // =================================================

    const crop =
        findCrop(question);


    if (
        category === "Report" ||
        q.includes("crop report") ||
        q.includes("report") ||
        q.includes("schedule") ||
        q.includes("stage")
    ) {

        if (crop) {

            return cropReportAnswer(
                crop,
                language
            );

        }

        return (
            "Please mention the crop or season. " +
            "For example: \"Crop report for Dalwa\"."
        );

    }


    // =================================================
    // CROP
    // =================================================

    if (crop) {

        if (
            q.includes("fertilizer") ||
            q.includes("schedule") ||
            q.includes("crop")
        ) {

            return cropReportAnswer(
                crop,
                language
            );

        }

    }


    // =================================================
    // GENERIC
    // =================================================

    return `
🌱 Rythu Mitra AI

I can help you with:

• Disease information
• Disease control and dosage
• Prevention
• Crop reports
• Crop schedules
• Weather based on your registered location

Try:

"How to control Leaf Blast?"

"Crop report for Dalwa"

"What is today's weather?"
`.trim();

};

