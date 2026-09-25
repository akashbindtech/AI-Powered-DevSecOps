const mongoose = require("mongoose");

const pipelineSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        project: {
            type: String,
            required: true
        },

        branch: {
            type: String,
            default: "main"
        },

        status: {
            type: String,
            enum: ["Pending", "Running", "Success", "Failed"],
            default: "Pending"
        },

        commitId: {
            type: String,
            default: ""
        },

        triggeredBy: {
            type: String,
            default: "Manual"
        },

        startTime: {
            type: Date,
            default: Date.now
        },

        endTime: {
            type: Date,
            default: null
        },

        duration: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Pipeline", pipelineSchema);