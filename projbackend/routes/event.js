const express = require("express")
const router = express.Router();

const {isSignedIn, isAuthenticated} = require("../controllers/auth");
const {getUserById} = require("../controllers/user");
const {createEvent, getEventById, getEvent, getEventByName, deleteEvent, updateEvent} = require("../controllers/event")

//all of params
router.param("userId", getUserById);
router.param("eventId", getEventById);
router.param("eventName", getEventByName);


//all of routes

// create event
router.post("/event/create/:userId", isSignedIn, isAuthenticated, createEvent);

// get event
//router.get("/event/:eventId/:userId", isSignedIn, isAuthenticated, getEvent);

router.get("/event/:eventName/:userId", isSignedIn, isAuthenticated, getEvent);

//delete event
router.delete("/event/:meetingId/:userId", isSignedIn, isAuthenticated, deleteEvent);

//update event
router.put("/event/:meetingId/:userId", isSignedIn, isAuthenticated, updateEvent);

module.exports = router; 