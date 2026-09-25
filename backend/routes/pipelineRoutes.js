const express = require("express");
const Pipeline = require("../models/Pipeline");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// ==================================================
// CREATE PIPELINE
// ==================================================

router.post("/", authMiddleware, async (req, res) => {

    try {

        const {
            project,
            branch,
            commitId,
            triggeredBy
        } = req.body;

        if (!project) {
            return res.status(400).json({
                message: "Project name is required"
            });
        }

        const pipeline = await Pipeline.create({

            userId: req.user.userId,

            project: project,

            branch: branch || "main",

            commitId: commitId || "",

            triggeredBy: triggeredBy || "Manual",

            status: "Pending"

        });

        res.status(201).json({
            message: "Pipeline created successfully",
            pipeline: pipeline
        });

    } catch (error) {

        console.error("Create Pipeline Error:", error);

        res.status(500).json({
            message: "Server error",
            error: error.message
        });

    }

});


// ==================================================
// GET USER PIPELINES
// ==================================================

router.get("/", authMiddleware, async (req, res) => {

    try {

        const pipelines = await Pipeline.find({
            userId: req.user.userId
        }).sort({
            createdAt: -1
        });

        res.status(200).json({
            message: "Pipelines fetched successfully",
            count: pipelines.length,
            pipelines: pipelines
        });

    } catch (error) {

        console.error("Get Pipelines Error:", error);

        res.status(500).json({
            message: "Server error",
            error: error.message
        });

    }

});


// ==================================================
// UPDATE PIPELINE
// ==================================================

router.put("/:id", authMiddleware, async (req, res) => {

    try {

        const pipeline = await Pipeline.findOne({
            _id: req.params.id,
            userId: req.user.userId
        });

        if (!pipeline) {

            return res.status(404).json({
                message: "Pipeline not found"
            });

        }

        const {
            project,
            branch,
            status,
            commitId,
            triggeredBy,
            endTime,
            duration
        } = req.body;


        // Update only provided fields

        if (project !== undefined) {
            pipeline.project = project;
        }

        if (branch !== undefined) {
            pipeline.branch = branch;
        }

        if (status !== undefined) {
            pipeline.status = status;
        }

        if (commitId !== undefined) {
            pipeline.commitId = commitId;
        }

        if (triggeredBy !== undefined) {
            pipeline.triggeredBy = triggeredBy;
        }

        if (endTime !== undefined) {
            pipeline.endTime = endTime;
        }

        if (duration !== undefined) {
            pipeline.duration = duration;
        }


        await pipeline.save();


        res.status(200).json({

            message: "Pipeline updated successfully",

            pipeline: pipeline

        });

    } catch (error) {

        console.error("Update Pipeline Error:", error);

        res.status(500).json({

            message: "Server error",

            error: error.message

        });

    }

});


// ==================================================
// DELETE PIPELINE
// ==================================================

router.delete("/:id", authMiddleware, async (req, res) => {

    try {

        const pipeline = await Pipeline.findOneAndDelete({

            _id: req.params.id,

            userId: req.user.userId

        });


        if (!pipeline) {

            return res.status(404).json({

                message: "Pipeline not found"

            });

        }


        res.status(200).json({

            message: "Pipeline deleted successfully",

            pipeline: pipeline

        });

    } catch (error) {

        console.error("Delete Pipeline Error:", error);

        res.status(500).json({

            message: "Server error",

            error: error.message

        });

    }

});


module.exports = router;