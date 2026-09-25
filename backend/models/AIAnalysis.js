const mongoose = require("mongoose");

const aiAnalysisSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        vulnerabilityId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Vulnerability",
            required: false
        },

        project: {
            type: String,
            required: true
        },

        vulnerability: {
            type: String,
            required: true
        },

        severity: {
            type: String,
            required: true
        },

        risk: {
            type: String,
            required: true
        },

        impact: {
            type: String,
            required: true
        },

        recommendation: {
            type: String,
            required: true
        },

        analyzedAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "AIAnalysis",
    aiAnalysisSchema
);