const express = require("express");
const Monitoring = require("../models/Monitoring");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// ==================================================
// CREATE MONITORING SERVICE
// ==================================================

router.post("/", authMiddleware, async (req, res) => {

    try {

        const {
            service,
            status,
            uptime,
            responseTime
        } = req.body;


        if (!service) {

            return res.status(400).json({
                message: "Service name is required"
            });

        }


        const monitoring =
            await Monitoring.create({

                userId:
                    req.user.userId,

                service:
                    service,

                status:
                    status || "Online",

                uptime:
                    uptime !== undefined
                        ? uptime
                        : 100,

                responseTime:
                    responseTime !== undefined
                        ? responseTime
                        : 0,

                lastChecked:
                    new Date()

            });


        res.status(201).json({

            message:
                "Monitoring service created successfully",

            monitoring:
                monitoring

        });


    } catch (error) {

        console.error(
            "Create Monitoring Error:",
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
// GET MONITORING SERVICES
// ==================================================

router.get("/", authMiddleware, async (req, res) => {

    try {

        const monitoring =
            await Monitoring.find({

                userId:
                    req.user.userId

            }).sort({

                createdAt: -1

            });


        res.status(200).json({

            message:
                "Monitoring data fetched successfully",

            count:
                monitoring.length,

            monitoring:
                monitoring

        });


    } catch (error) {

        console.error(
            "Get Monitoring Error:",
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
// UPDATE MONITORING SERVICE
// ==================================================

router.put("/:id", authMiddleware, async (req, res) => {

    try {

        const monitoring =
            await Monitoring.findOne({

                _id:
                    req.params.id,

                userId:
                    req.user.userId

            });


        if (!monitoring) {

            return res.status(404).json({

                message:
                    "Monitoring service not found"

            });

        }


        const {
            service,
            status,
            uptime,
            responseTime
        } = req.body;


        if (service !== undefined) {

            monitoring.service =
                service;

        }


        if (status !== undefined) {

            monitoring.status =
                status;

        }


        if (uptime !== undefined) {

            monitoring.uptime =
                uptime;

        }


        if (responseTime !== undefined) {

            monitoring.responseTime =
                responseTime;

        }


        monitoring.lastChecked =
            new Date();


        await monitoring.save();


        res.status(200).json({

            message:
                "Monitoring service updated successfully",

            monitoring:
                monitoring

        });


    } catch (error) {

        console.error(
            "Update Monitoring Error:",
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
// DELETE MONITORING SERVICE
// ==================================================

router.delete("/:id", authMiddleware, async (req, res) => {

    try {

        const monitoring =
            await Monitoring.findOneAndDelete({

                _id:
                    req.params.id,

                userId:
                    req.user.userId

            });


        if (!monitoring) {

            return res.status(404).json({

                message:
                    "Monitoring service not found"

            });

        }


        res.status(200).json({

            message:
                "Monitoring service deleted successfully",

            monitoring:
                monitoring

        });


    } catch (error) {

        console.error(
            "Delete Monitoring Error:",
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