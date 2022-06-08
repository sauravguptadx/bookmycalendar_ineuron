# bookmycalendar_ineuron
The is a MERN stack challenge learning organized by ineuron.

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

The API for signup is
```
http://localhost:8000/api/signup
```

The API for signin is
```
http://localhost:8000/api/signup
```

The API for getting a user from the database is
```
http://localhost:8000/api/user/:userId

For example:
http://localhost:8000/api/user/629b65ac86918efe044f39f7
```

### In Event model, we store the following information about the event
  


