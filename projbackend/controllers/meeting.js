const Meeting = require("../models/meeting")
const Event = require("../models/event")
const formidable = require("formidable")
const _ = require("lodash")
const fs = require("fs")

var nodemailer = require('nodemailer');

exports.createMeeting = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

   

    form.parse(req, (err, fields, file) => {
        if(err) {
            return res.status(400).json({
                error: "ERROR WHILE PARSING MEETING FORM"
            })
        };

        //destructuring the fields
        const {name, 
            meeting_start_time,
            meeting_end_time,
            meeting_organizer, 
            participants, 
            meeting_platform} = fields;

        if(
            !name ||
            !meeting_start_time ||
            !meeting_end_time ||
            !meeting_organizer ||
            !meeting_platform
        ) {
            return res.status(400).json({
                error: "Please include all fields"
            });
        }

        

        //restrictions on field

        var eventDetails = req.event[0]

        var max_meeting_length = eventDetails.max_meeting_length_in_minutes;
        var meeting_start_time_temp = new Date(meeting_start_time)
        var meeting_end_time_temp = new Date(meeting_end_time)
        console.log(meeting_end_time_temp)

        //condition 1 meeting length should not exclude
        if(!isMeetingInTimeLimit(meeting_start_time_temp, meeting_end_time_temp, max_meeting_length)) {
            const errorMessage = "Your meeting time is exceeding the allocated time. The allowed meeting length is only " + max_meeting_length + " minutes"
            return res.status(400).json({ 
                error: errorMessage
            });
        }

        //condition 2 and 5 meeting should be scheduled on valid date

        var currentDate = new Date();
        currentDate.setHours(0,0,0,0);

        var eventStartDate = eventDetails.event_start_date;
        eventStartDate.setHours(0,0,0,0);
        var eventEndDate = eventDetails.event_end_date;
        eventEndDate.setHours(0,0,0,0);


        var eventVisibleStartingDate = (currentDate < eventStartDate) ? eventStartDate : currentDate;
        var eventVisibleEndingDate = addDaysToDate(eventVisibleStartingDate, eventDetails.visible_days_in_calendar_from_today)
        if(eventEndDate < eventVisibleEndingDate) {
            eventVisibleEndingDate = eventEndDate;
        }
        
        var meetingStartDate = meeting_start_time_temp;
        meetingStartDate.setHours(0,0,0,0);
        var meetingEndDate = meeting_end_time_temp;
        meetingEndDate.setHours(0,0,0,0);

    

        if(meetingStartDate < eventVisibleStartingDate) {
            const dateToShow = eventVisibleStartingDate.getFullYear() + "-" + (eventVisibleStartingDate.getMonth()+1) + "-" + eventVisibleStartingDate.getDate()
            const errorMessage = "The meeting cannot be scheduled before the event start date or current date. You can schedule your meeting from " + dateToShow;
            return res.status(400).json({ 
                error: errorMessage
            });
        }

        if(meetingStartDate > eventVisibleEndingDate) {
            const dateToShow = eventVisibleEndingDate.getFullYear() + "-" + (eventVisibleEndingDate.getMonth()+1) + "-" + eventVisibleEndingDate.getDate()
            const errorMessage = "The meeting cannot be scheduled after the visible days in the calendar. You can schedule your meeting before " + dateToShow;
            return res.status(400).json({ 
                error: errorMessage
            });
        }

        if(meetingEndDate < eventVisibleStartingDate) {
            const dateToShow = eventVisibleStartingDate.getFullYear() + "-" + (eventVisibleStartingDate.getMonth()+1) + "-" + eventVisibleStartingDate.getDate()
            const errorMessage = "The meeting cannot be ended before the visible days for the event to start. You can end your meeting after " + dateToShow;
            return res.status(400).json({ 
                error: errorMessage
            });
        }

        if(meetingEndDate > eventVisibleEndingDate) {
            const dateToShow = eventVisibleEndingDate.getFullYear() + "-" + (eventVisibleEndingDate.getMonth()+1) + "-" + eventVisibleEndingDate.getDate()
            const errorMessage = "The meeting cannot be ended after the visible days of the event. You can end your meeting before " + dateToShow;
            return res.status(400).json({ 
                error: errorMessage
            });
        }


        //condition 3,the event should be on valid days as specified 

        const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
        let meetingDay = weekday[meetingStartDate.getDay()];

        eventDays = eventDetails.event_days;
        if(!eventDays.includes(meetingDay)) {
            const errorMessage = "The meeting cannot be scheduled on " + meetingDay + ". You can schedule meetings on " + eventDays;
            return res.status(400).json({ 
                error: errorMessage
            });
        }

        //condition 4, start time and end time

        var eventStartTimePerDay = eventDetails.event_start_time_per_day;
        var eventEndTimePerDay = eventDetails.event_end_time_per_day;

        var meetingStartTime = new Date(meeting_start_time);
        var meetingEndTime = new Date(meeting_end_time);
        //console.log(meetingEndTime)

        var d = new Date();

        eventStartTimePerDay.setDate(d.getDate());
        eventStartTimePerDay.setFullYear(d.getFullYear());
        eventStartTimePerDay.setMonth(d.getMonth());

        eventEndTimePerDay.setDate(d.getDate());
        eventEndTimePerDay.setFullYear(d.getFullYear());
        eventEndTimePerDay.setMonth(d.getMonth());

        meetingStartTime.setDate(d.getDate());
        meetingStartTime.setFullYear(d.getFullYear());
        meetingStartTime.setMonth(d.getMonth());

        meetingEndTime.setDate(d.getDate());
        meetingEndTime.setFullYear(d.getFullYear());
        meetingEndTime.setMonth(d.getMonth());

        var currentDateTime = new Date();
        currentDateTime.setHours(currentDateTime.getHours()+5, currentDateTime.getMinutes()+30, 0,0);

        meetingStartDate = new Date(meeting_start_time);
        console.log("Holaaaaaaaaaa")
        console.log(currentDateTime)
        var differenceInHours = meetingStartDate - currentDateTime;
        differenceInHours = differenceInHours/3600000;

        if(parseInt(differenceInHours) < parseInt(eventDetails.schedule_meeting_after_hours)) {
            {
                const errorMessage = "You have to schedule meeting atleast " + eventDetails.schedule_meeting_after_hours + " hours after";
                return res.status(400).json({ 
                error: errorMessage
        });
            }
        }

       // console.log(d.getDate())

        //console.log(meetingEndTime)
        //console.log(eventEndTimePerDay)


        if(meetingStartTime < eventStartTimePerDay) {
            const dateToShow = (eventStartTimePerDay.getHours()-5) + ":" + (eventStartTimePerDay.getMinutes()-30 )+ ":" + eventStartTimePerDay.getSeconds() + "0"
            const errorMessage = "The meeting cannot be scheduled before the event start time per day. You can schedule your meeting from " + dateToShow;
            return res.status(400).json({ 
                error: errorMessage
            });
        }

        if(meetingStartTime > eventEndTimePerDay) {
            const dateToShow = (eventEndTimePerDay.getHours()-5)+ ":" + (eventEndTimePerDay.getMinutes()-30) + ":" + eventEndTimePerDay.getSeconds() + "0"
            const errorMessage = "The meeting cannot be scheduled after the event end time per day. You can schedule your meeting before " + dateToShow;
            return res.status(400).json({ 
                error: errorMessage
            });
        }

        if(meetingEndTime < eventStartTimePerDay) {
            const dateToShow = (eventStartTimePerDay.getHours()-5) + ":" + (eventStartTimePerDay.getMinutes()-30) + ":" + eventStartTimePerDay.getSeconds() + "0"
            const errorMessage = "The meeting cannot be ended before the the event start time per day. You can end your meeting after " + dateToShow;
            return res.status(400).json({ 
                error: errorMessage
            });
        }

        if(meetingEndTime > eventEndTimePerDay) {
            const dateToShow = (eventEndTimePerDay.getHours()-5) + ":" + (eventEndTimePerDay.getMinutes()-30) + ":" + eventEndTimePerDay.getSeconds() + "0"
            const errorMessage = "The meeting cannot be ended after the after the event end time per day. You can end your meeting before " + dateToShow;
            return res.status(400).json({ 
                error: errorMessage
            });
        }




        // condition 7 meeting should be scheduled before certain hour

        



        // condition 6 restrict user to have only one meeting per day

        //getAllMeetingsInThisEvent = eventDetails.meetings;
        meetingStartTime = meeting_start_time_temp;

        Event.findOne({name: eventDetails.name}).populate('meetings').exec((err, event) => {
            const getAllMeetingsInThisEvent = event.meetings;
            
            getAllMeetingsInThisEvent.forEach(function(meeting_temp) {
                
                if(String(req.profile._id) == String(meeting_temp.meeting_organizer._id)) { 
                    //console.log("holaaaaaa")
                    if(meetingStartTime.getDate() == meeting_temp.meeting_start_time.getDate()
                    ) {
                        const errorMessage = "You are restricted to schedule only one meeting per day";
                        //console.log(errorMessage)
                        return res.status(400).json({ 
                            error: errorMessage
                        });
                    }
                }
                
            })

            // condition 8 meeting should have gap of sometime as defined between two meetings.

        var minimumGapBetweenMeetingsInMinutes = eventDetails.time_gap_between_meetings_in_minutes;

        getAllMeetingsInThisEvent.forEach(function(meeting) {
            var meetingStartDate = new Date(meeting_start_time);
            var differenceInMinutes = meeting.meeting_end_time - meetingStartDate;
            differenceInMinutes = differenceInMinutes/60000;
            console.log("condition 8")
            console.log(meetingStartDate)
            console.log(meeting.meetind_end_time)
            console.log(differenceInMinutes)

            if(parseInt(differenceInMinutes) <= parseInt(minimumGapBetweenMeetingsInMinutes)
                ) {
                    const errorMessage = "You are requested to keep a gap of atleast " + minimumGapBetweenMeetingsInMinutes + " minutes between two meetings";
                    return res.status(400).json({ 
                    error: errorMessage
            });
                }
        })


        let meeting = new Meeting(fields);

        meeting.save((err, meeting) => {
            if(err) {
                res.status(400).json({
                    error: err
                })
            }
            res.json(meeting);

            Event.findOneAndUpdate(
                {_id: eventDetails._id},
                {$push: {meetings: meeting}},
                {new: true},
                (err, meeting) => {
                    if(err){
                        return res.status(400).json({
                            error: "Unable to save purchase list"
                        })
                    }
                }
            )

            //send();
        })


        });


        console.log("Nooooooooooooooo")

        


        // condition 8 meeting should have gap of sometime as defined between two meetings.

        //var minimumGapBetweenMeetingsInMinutes = eventDetails.time_gap_between_meetings_in_minutes;

        /*getAllMeetingsInThisEvent.forEach(function(meeting) {
            var differenceInMinutes = meeting.meeting_end_time - meetingStartDate;
            differenceInMinutes = differenceInMinutes/60000;
            if(parseInt(differenceInMinutes) <= parseInt(minimumGapBetweenMeetingsInMinutes)
                ) {
                    const errorMessage = "You are requested to keep a gap of atleast " + minimumGapBetweenMeetingsInMinutes + " minutes between two meetings";
                    return res.status(400).json({ 
                    error: errorMessage
            });
                }
        })*/
        


        

    })
}

function isMeetingInTimeLimit (meeting_start_time, meeting_end_time, max_meeting_length) {
    
    var difference_ = Math.abs(meeting_end_time-meeting_start_time);
    var difference_in_minutes = (difference_ / 60000);
  
    if(parseInt(difference_in_minutes) <= parseInt(max_meeting_length)) {
        return true;
    }
    return false;
    
}

function addDaysToDate(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

exports.getMeeting = (req, res) => {
    return res.json(req.meeting)
}

exports.getMeetingById = (req, res, next, id) => {
    Meeting.findById(id).exec((err, meeting) => {
        if(err || !meeting) {
            return res.status(400).json({
                error: "NO MEETING FOUND IN DB"
            })
        }

        req.meeting = meeting;
        next();
    })
}


exports.deleteMeeting = (req, res) => {
    let meeting = req.meeting;
    meeting.remove((err, deletedMeeting) => {
        if(err) {
            return res.status(400).json({
                error: "Failed to delete the meeting"
            })
        }
        res.json({
            message: "Delection was a success",
            deletedMeeting
        })
    })
}


exports.updateMeeting = (req, res) => {
    Meeting.findByIdAndUpdate(
        {_id: req.profile._id},
        {$set: req.body},
        {new: true, useFindandModify: false}, 
        (err, meeting) => {
            if(err) {
                return res.status(400).json({
                    error: "UPDATE WAS NOT SUCCESSFUL"
                })
            }
            res.json(meeting);
        }
    )
}




  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAILUSERNAME,
      pass: process.env.GMAILPASSWORD
    }
  });


  var mailOptions = {
    from: process.env.GMAILUSERNAME,
    to: 'saurav.guptadx@gmail.com',
    subject: 'Sending Email using Node.js',
    text: 'That was easy!'
  };

  async function send() {
    const result = await transporter.sendMail({
        from: process.env.GMAILUSERNAME,
    to: 'saurav.guptadx@gmail.com',
    subject: 'Sending Email using Node.js',
    text: 'That was easy!'
    });

    console.log(JSON.stringify(result, null, 4));
}
