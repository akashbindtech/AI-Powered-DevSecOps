const express = require("express");
const AIAnalysis = require("../models/AIAnalysis");
const Vulnerability = require("../models/Vulnerability");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// ==================================================
// CREATE AI ANALYSIS
// ==================================================

router.post("/", authMiddleware, async (req, res) => {

    try {

        const {
            vulnerabilityId
        } = req.body;


        if (!vulnerabilityId) {

            return res.status(400).json({
                message: "Vulnerability ID is required"
            });

        }


        const vulnerability =
            await Vulnerability.findOne({

                _id: vulnerabilityId,

                userId: req.user.userId

            });


        if (!vulnerability) {

            return res.status(404).json({
                message: "Vulnerability not found"
            });

        }


        // ==================================================
        // BASIC AI-STYLE ANALYSIS
        // ==================================================

        let risk = "";
        let impact = "";
        let recommendation = "";


        if (vulnerability.severity === "Critical") {

            risk = "Very High";

            impact =
                "This vulnerability may cause serious security damage and can expose sensitive application data.";

            recommendation =
                "Fix this vulnerability immediately. Review the affected code, validate user input and apply proper security controls.";

        }

        else if (vulnerability.severity === "High") {

            risk = "High";

            impact =
                "This vulnerability can significantly affect application security if it is exploited.";

            recommendation =
                "Prioritize fixing this vulnerability. Validate inputs, apply secure coding practices and test the affected functionality.";

        }

        else if (vulnerability.severity === "Medium") {

            risk = "Medium";

            impact =
                "This vulnerability may create a security weakness that could be exploited under certain conditions.";

            recommendation =
                "Review the affected code and apply appropriate security validation and protection.";

        }

        else {

            risk = "Low";

            impact =
                "This vulnerability has a relatively low security impact but should still be monitored.";

            recommendation =
                "Fix the issue during regular security maintenance and follow secure coding practices.";

        }


        const analysis =
            await AIAnalysis.create({

                userId: req.user.userId,

                vulnerabilityId:
                    vulnerability._id,

                project:
                    vulnerability.project,

                vulnerability:
                    vulnerability.vulnerability,

                severity:
                    vulnerability.severity,

                risk:
                    risk,

                impact:
                    impact,

                recommendation:
                    recommendation

            });


        res.status(201).json({

            message:
                "AI analysis generated successfully",

            analysis:
                analysis

        });


    } catch (error) {

        console.error(
            "AI Analysis Error:",
            error
        );

        res.status(500).json({

            message:
                "Server error",

            error:
                error.message

        });

    }

});


// ==================================================
// GET ALL AI ANALYSIS
// ==================================================

router.get("/", authMiddleware, async (req, res) => {

    try {

        const analyses =
            await AIAnalysis.find({

                userId:
                    req.user.userId

            }).sort({

                createdAt: -1

            });


        res.status(200).json({

            message:
                "AI analysis fetched successfully",

            count:
                analyses.length,

            analyses:
                analyses

        });


    } catch (error) {

        console.error(
            "Get AI Analysis Error:",
            error
        );

        res.status(500).json({

            message:
                "Server error",

            error:
                error.message

        });

    }

});


module.exports = router;