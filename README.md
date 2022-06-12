# bookmycalendar_ineuron
This is a MERN stack challenge learning organized by ineuron.

### The description of what the project is and its execution is very well explained in the video link given below
### I will suggest to first go through the video for better understanding and working of the project
## https://youtu.be/QBU81PgII70

Due to covid, we have shifted most of our works to online platform. These includes classes, meetings and other stuff as well. Book My Calendar is an application which helps in booking the calendar of the owner of the event so that you can schedule meetings with the event organizer. The event organizer sets certain condition that needs to be met for the meeting to take place. If the meeting scheduler meets all the requirements of the meetings then the meeting scheduler can schedule a meeting with the event organizer. This helps in booking the calendar in advance.

We have mainly three models namely 
  - **User**
  - **Event**
  - **Meeting**
  
### In User model, we store the information about the user.
It contains
  - **name:**                   the name of the user
  - **lastname:**                the last name of the user
  - **email:**                   the email of the user
  - **encry_password:**          the password stored in encrypted way and not as normal text
  - **salt:**                    string used in converting password to encry_password
  - **my_events:**               list of events created by the user
  - **events_shared_with_me:**   list of events shared by other users with this user
  - **meetings:**                list of meetings scheduled by the user

The APIs that are currently used are

The API for **signup using POST request** is
```
http://localhost:8000/api/signup
```

The API for **signin using POST request** is
```
http://localhost:8000/api/signup
```

The API for **getting a user from the database using GET request** is
```
http://localhost:8000/api/user/:userId

For example:
http://localhost:8000/api/user/629b65ac86918efe044f39f7
```

The API for **updating  user information using PUT request** is
```
http://localhost:8000/api/user/:userId

For example:
http://localhost:8000/api/user/629b65ac86918efe044f39f7
```

### In Event model, we store the following information about the event

It contains
  - **name:** the name of the event
  - **max_meeting_length_in_minutes:**  the maximum length of the meeting
  - **event_start_date:**  the start date of the event
  - **event_end_date:**  the end date of the event
  - **event_days:**  the days of the week when the event will occur
  - **event_start_time_per_day:**  the start time of the event on a day
  - **event_end_time_per_day:**  the end time of the event on a day
  - **visible_days_in_calendar_from_today:**  the visible days in calendar in which the meeting scheduler can schedule the meeting
  - **schedule_meeting_after_hours:**  the meetings should be scheduled the given amount of hours later than the current time
  - **time_gap_between_meetings_in_minutes:**  the time gap between two consecutive meetings
  - **event_creator:**               the id of the user who created the event
  - **event_shared_with_users:**   list of users with whom the event is shared so that they can schedule a meeting
  - **meetings:**                list of meetings scheduled under this event

The APIs that are currently used are

The API for **creating an event using POST request**  is
```
http://localhost:8000/api/event/create/:userId

For example:
http://localhost:8000/api/event/create/629b65ac86918efe044f39f7
```

The API for **getting an event from the database using GET request**  is
```
http://localhost:8000/api/event/:eventName/:userId

For example:
http://localhost:8000/api/event/Discussion With Saurav/629b65ac86918efe044f39f7
```

The API for **updating an event from the database using PUT request**  is
```
http://localhost:8000/api/event/:eventName/:userId

For example:
http://localhost:8000/api/event/62a0a7ec59429f3e017e58f7/629b65ac86918efe044f39f7
```

The API for **deleting an event from the database using DELETE request**  is
```
http://localhost:8000/api/event/:eventName/:userId

For example:
http://localhost:8000/api/event/62a0a7ec59429f3e017e58f7/629b65ac86918efe044f39f7
```


### In Meeting model, we store the following information about the meeting

It contains
  - **name:** the name of the meeting
  - **meeting_start_time:**  the start date and time of the meeting
  - **meeting_end_time:**  the end date and time of the meeting
  - **meeting_organizer:**  the user who scheduled the meeting
  - **participants:**  the users who are invited to the meeting
  - **meeting_platform:**  the platform where the meeting will take place

The APIs that are currently used are

The API for **scheduling a meeting using POST request** is
```
http://localhost:8000/api/:eventName/meeting/create/:userId

For example:
http://localhost:8000/api/Discussion With Saurav/meeting/create/629b65ac86918efe044f39f7
```

The API for **getting a meeting from the database using GET request** is
```
http://localhost:8000/api/:eventName/meeting/:meetingId/:userId

For example:
http://localhost:8000/api/Discussion With Saurav/meeting/62a0554f019536207c778c5b/629b65ac86918efe044f39f7
```


The API for **updating a meeting using PUT request** is
```
http://localhost:8000/api/:eventName/meeting/:meetingId/:userId

For example:
http://localhost:8000/api/Discussion With Saurav/meeting/62a0554f019536207c778c5b/629b65ac86918efe044f39f7
```

The API for **deleting a meeting using DELETE request** is
```
http://localhost:8000/api/:eventName/meeting/:meetingId/:userId

For example:
http://localhost:8000/api/Discussion With Saurav/meeting/62a0554f019536207c778c5b/629b65ac86918efe044f39f7
```


