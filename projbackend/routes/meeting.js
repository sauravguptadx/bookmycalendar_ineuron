const express = require("express")
const router = express.Router();

const {isSignedIn, isAuthenticated} = require("../controllers/auth");
const {getUserById} = require("../controllers/user");
const {getEventById, getEventByName} = require("../controllers/event")
const {createMeeting} = require("../controllers/meeting")

//all of params
router.param("userId", getUserById);
router.param("eventId", getEventById);
router.param("eventName", getEventByName);

//all of routes

//create meeting
router.post("/:eventName/meeting/create/:userId", isSignedIn, isAuthenticated, createMeeting);

module.exports = router; 