const Event = require("../models/event")
const formidable = require("formidable")
const _ = require("lodash")
const fs = require("fs")


exports.createEvent = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, (err, fields, file) => {
        if(err) {
            return res.status(400).json({
                error: "ERROR WHILE PARSING FORM"
            })
        };

        //destructuring the fields
        const {name, max_meeting_length_in_minutes,
        event_start_date, event_end_date,
        event_days, 
        event_start_time_per_day, event_end_time_per_day,
        visible_days_in_calendar_from_today, schedule_meeting_after_hours,
        time_gap_between_meetings_in_minutes} = fields;

        if(
            !name ||
            !max_meeting_length_in_minutes ||
            !event_start_date ||
            !event_end_date ||
            !event_days ||
            !event_start_time_per_day ||
            !event_end_time_per_day ||
            !visible_days_in_calendar_from_today ||
            !schedule_meeting_after_hours ||
            !time_gap_between_meetings_in_minutes
        ) {
            return res.status(400).json({
                error: "Please include all fields"
            });
        }

        let event = new Event(fields);

        event.save((err, event) => {
            if(err) {
                res.status(400).json({
                    error: err
                })
            }
            res.json(event);
        })

    })
}

exports.getEventById = (req, res, next, id) => {
    Event.findById(id).exec((err, event) => {
        if(err || !event) {
            return res.status(400).json({
                error: "NO EVENT FOUND IN DB"
            })
        }

        req.event = event;
        next();
    })
}

exports.getEventByName = (req, res, next, name) => {
    Event.find({name: name})
    .exec((err, event) => {
        if(err || !event) {
            return res.status(400).json({
                error: "NO EVENT FOUND IN DB"
            })
        }

        req.event = event;
        next();
    })
}

exports.getEvent = (req, res) => {
    return res.json(req.event)
}

exports.deleteEvent = (req, res) => {
    let event = req.event;
    event.remove((err, deletedEvent) => {
        if(err) {
            return res.status(400).json({
                error: "Failed to delete the meeting"
            })
        }
        res.json({
            message: "Delection was a success",
            deletedEvent
        })
    })
}


exports.updateEvent = (req, res) => {
    Event.findByIdAndUpdate(
        {_id: req.profile._id},
        {$set: req.body},
        {new: true, useFindandModify: false}, 
        (err, event) => {
            if(err) {
                return res.status(400).json({
                    error: "UPDATE WAS NOT SUCCESSFUL"
                })
            }
            res.json(event);
        }
    )
}