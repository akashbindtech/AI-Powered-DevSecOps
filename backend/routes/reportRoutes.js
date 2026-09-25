const express = require("express");
const PDFDocument = require("pdfkit");

const authMiddleware = require("../middleware/authMiddleware");

const Pipeline = require("../models/Pipeline");
const Vulnerability = require("../models/Vulnerability");
const Monitoring = require("../models/Monitoring");
const AIAnalysis = require("../models/AIAnalysis");
const Report = require("../models/Report");

const router = express.Router();

// Generate Security Report PDF
router.get("/download", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.userId;

        // Get user's data
        const pipelines = await Pipeline.find({ userId });
        const vulnerabilities = await Vulnerability.find({ userId });
        const monitoring = await Monitoring.find({ userId });
        const aiAnalyses = await AIAnalysis.find({ userId });

        // Security counts
        const critical = vulnerabilities.filter(
            v => v.severity === "Critical" && v.status === "Open"
        ).length;

        const high = vulnerabilities.filter(
            v => v.severity === "High" && v.status === "Open"
        ).length;

        const medium = vulnerabilities.filter(
            v => v.severity === "Medium" && v.status === "Open"
        ).length;

        const low = vulnerabilities.filter(
            v => v.severity === "Low" && v.status === "Open"
        ).length;

        // Security score
        let score = 100;

        score -= critical * 25;
        score -= high * 15;
        score -= medium * 10;
        score -= low * 5;

        if (score < 0) {
            score = 0;
        }

        // Create PDF
        const doc = new PDFDocument({
            margin: 50
        });

        res.setHeader(
            "Content-Type",
            "application/pdf"
        );

        res.setHeader(
            "Content-Disposition",
            'attachment; filename="DevSecOps-Security-Report.pdf"'
        );

        doc.pipe(res);

        // Title
        doc
            .fontSize(22)
            .text("AI-Powered DevSecOps", {
                align: "center"
            });

        doc.moveDown();

        doc
            .fontSize(18)
            .text("Security Report", {
                align: "center"
            });

        doc.moveDown(2);

        // Date
        doc
            .fontSize(11)
            .text(`Generated: ${new Date().toLocaleString()}`);

        doc.moveDown();

        // Security Summary
        doc
            .fontSize(16)
            .text("1. Security Summary");

        doc.moveDown(0.5);

        doc
            .fontSize(12)
            .text(`Security Score: ${score}/100`);

        doc.text(`Critical Vulnerabilities: ${critical}`);
        doc.text(`High Vulnerabilities: ${high}`);
        doc.text(`Medium Vulnerabilities: ${medium}`);
        doc.text(`Low Vulnerabilities: ${low}`);

        doc.moveDown();

        // Pipeline Summary
        doc
            .fontSize(16)
            .text("2. Pipeline Summary");

        doc.moveDown(0.5);

        doc
            .fontSize(12)
            .text(`Total Pipelines: ${pipelines.length}`);

        const successfulPipelines = pipelines.filter(
            p => p.status === "Success"
        ).length;

        const failedPipelines = pipelines.filter(
            p => p.status === "Failed"
        ).length;

        const pendingPipelines = pipelines.filter(
            p => p.status === "Pending"
        ).length;

        doc.text(`Successful Pipelines: ${successfulPipelines}`);
        doc.text(`Failed Pipelines: ${failedPipelines}`);
        doc.text(`Pending Pipelines: ${pendingPipelines}`);

        doc.moveDown();

        // Monitoring Summary
        doc
            .fontSize(16)
            .text("3. Cloud Monitoring");

        doc.moveDown(0.5);

        doc
            .fontSize(12)
            .text(`Total Services: ${monitoring.length}`);

        const online = monitoring.filter(
            m => m.status === "Online"
        ).length;

        const warning = monitoring.filter(
            m => m.status === "Warning"
        ).length;

        const offline = monitoring.filter(
            m => m.status === "Offline"
        ).length;

        doc.text(`Online Services: ${online}`);
        doc.text(`Warning Services: ${warning}`);
        doc.text(`Offline Services: ${offline}`);

        doc.moveDown();

        // AI Analysis Summary
        doc
            .fontSize(16)
            .text("4. AI Security Analysis");

        doc.moveDown(0.5);

        doc
            .fontSize(12)
            .text(`Total AI Analyses: ${aiAnalyses.length}`);

        doc.moveDown();

        if (aiAnalyses.length > 0) {
            aiAnalyses.slice(0, 10).forEach((analysis, index) => {
                doc
                    .fontSize(11)
                    .text(
                        `${index + 1}. ${analysis.vulnerability} - Risk: ${analysis.risk}`
                    );
            });
        } else {
            doc.text("No AI analysis records found.");
        }

        doc.moveDown(2);

        // Vulnerability Details
        doc
            .fontSize(16)
            .text("5. Vulnerability Details");

        doc.moveDown(0.5);

        if (vulnerabilities.length > 0) {
            vulnerabilities.slice(0, 15).forEach((vulnerability, index) => {
                doc
                    .fontSize(10)
                    .text(
                        `${index + 1}. ${vulnerability.vulnerability} | Severity: ${vulnerability.severity} | Status: ${vulnerability.status}`
                    );
            });
        } else {
            doc.text("No vulnerabilities found.");
        }

        doc.moveDown(2);

        doc
            .fontSize(10)
            .text(
                "Generated by AI-Powered DevSecOps Security Monitoring System.",
                {
                    align: "center"
                }
            );

        // Save report record
        await Report.create({
            userId,
            reportName: "Security Report",
            type: "Security",
            status: "Generated"
        });

        doc.end();

    } catch (error) {
        console.error("Report Generation Error:", error);

        if (!res.headersSent) {
            res.status(500).json({
                message: "Failed to generate report",
                error: error.message
            });
        }
    }
});

module.exports = router;