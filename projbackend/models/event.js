const mongoose = require("mongoose")

const {ObjectId} = mongoose.Schema;

var eventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    max_meeting_length_in_minutes: {
        type: Number,
        required: true
    },
    event_start_date: {
        type: Date,
        required: true
    },
    event_end_date: {
        type: Date,
        required: true
    },
    event_days: {
        type: Array,
        required: true
    },
    event_start_time_per_day: {
        type: Date,
        required: true
    },
    event_end_time_per_day: {
        type: Date,
        required: true
    },
    visible_days_in_calendar_from_today: {
        type: Number,
        required: true
    },
    schedule_meeting_after_hours: {
        type: Number,
        required: true
    },
    time_gap_between_meetings_in_minutes: {
        type: Number,
        required: true
    },
    event_creator: {
        type: ObjectId,
        ref: "User"
    },
    event_shared_with_users: [{
        type: ObjectId,
        ref: "User"
    }],
    meetings: [{
        type: ObjectId,
        ref: "Meeting"
    }]
},
{timestamps: true}
);

function getDateFromDateTime (v) {
    console.log(v)
    let d = v.toString().substring(0, 10);
    console.log(d)
    return d;
}

function getTimeFromDateTime (datetime) {
    return datetime.substring(11, 19);
}

module.exports = mongoose.model("Event", eventSchema)  