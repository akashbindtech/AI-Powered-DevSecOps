require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/database");

const authRoutes = require("./routes/authRoutes");
const protectedRoutes = require("./routes/protectedRoutes");
const pipelineRoutes = require("./routes/pipelineRoutes");
const vulnerabilityRoutes = require("./routes/vulnerabilityRoutes");
const aiAnalysisRoutes = require("./routes/aiAnalysisRoutes");
const monitoringRoutes = require("./routes/monitoringRoutes");
const reportRoutes = require("./routes/reportRoutes");

const app = express();

const PORT = process.env.PORT || 5000;


// ==================================================
// DATABASE
// ==================================================

connectDB();


// ==================================================
// MIDDLEWARE
// ==================================================

app.use(cors());

app.use(express.json());


// ==================================================
// ROUTES
// ==================================================

app.use(
    "/api/auth",
    authRoutes
);

app.use(
    "/api/protected",
    protectedRoutes
);

app.use(
    "/api/pipelines",
    pipelineRoutes
);

app.use(
    "/api/vulnerabilities",
    vulnerabilityRoutes
);

app.use(
    "/api/ai-analysis",
    aiAnalysisRoutes
);

app.use(
    "/api/monitoring",
    monitoringRoutes
);

app.use(
    "/api/reports",
    reportRoutes
);


// ==================================================
// HOME ROUTE
// ==================================================

app.get("/", (req, res) => {

    res.json({

        message:
            "AI DevSecOps Backend is Running!"

    });

});


// ==================================================
// START SERVER
// ==================================================

app.listen(PORT, () => {

    console.log(
        `Server running on http://localhost:${PORT}`
    );

});