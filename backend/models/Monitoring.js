const mongoose = require("mongoose");

const monitoringSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        service: {
            type: String,
            required: true
        },

        status: {
            type: String,
            enum: ["Online", "Warning", "Offline"],
            default: "Online"
        },

        uptime: {
            type: Number,
            default: 100
        },

        responseTime: {
            type: Number,
            default: 0
        },

        lastChecked: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "Monitoring",
    monitoringSchema
);