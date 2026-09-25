const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        reportName: {
            type: String,
            required: true
        },

        type: {
            type: String,
            enum: [
                "Security",
                "Pipeline",
                "Cloud",
                "AI"
            ],
            required: true
        },

        status: {
            type: String,
            enum: [
                "Generated",
                "Failed"
            ],
            default: "Generated"
        },

        generatedAt: {
            type: Date,
            default: Date.now
        }
    },

    {
        timestamps: true
    }
);

module.exports =
    mongoose.model("Report", reportSchema);