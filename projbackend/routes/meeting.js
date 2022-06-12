const express = require("express")
const router = express.Router();

const {isSignedIn, isAuthenticated} = require("../controllers/auth");
const {getUserById} = require("../controllers/user");
const {getEventById, getEventByName} = require("../controllers/event")
const {createMeeting, deleteMeeting, updateMeeting, getMeetingById, getMeeting} = require("../controllers/meeting")

//all of params
router.param("userId", getUserById);
router.param("eventId", getEventById);
router.param("eventName", getEventByName);
router.param("meetingId", getMeetingById);

//all of routes

//create meeting
router.post("/:eventName/meeting/create/:userId", isSignedIn, isAuthenticated, createMeeting);

//get meeting
router.get("/:eventName/meeting/:meetingId/:userId", isSignedIn, isAuthenticated, getMeeting);


//delete meeting
router.delete("/:eventName/meeting/:meetingId/:userId", isSignedIn, isAuthenticated, deleteMeeting);

//update meeting
router.put("/:eventName/meeting/:meetingId/:userId", isSignedIn, isAuthenticated, updateMeeting);

module.exports = router; 