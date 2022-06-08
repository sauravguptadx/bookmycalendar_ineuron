const mongoose = require("mongoose")

const {ObjectId} = mongoose.Schema;

var meetingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    meeting_start_time: {
        type: Date,
        required: true
    },
    meeting_end_time: {
        type: Date,
        required: true
    },
    meeting_organizer: {
        type: ObjectId,
        ref: "User"
    },
    participants: [{
        type: ObjectId,
        ref: "User"
    }],
    meeting_platform: {
        type: String,
      default: "Microsoft Teams",
      enum: ["Microsoft Teams", "Google Meet"]  
    }
},
{timestamps: true}
)

module.exports = mongoose.model("Meeting", meetingSchema)