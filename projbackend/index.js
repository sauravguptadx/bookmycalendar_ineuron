require('dotenv').config();

const mongoose = require("mongoose");
const express = require("express")
const app = express();

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

//My Routes
const authRoutes = require("./routes/auth")
const userRoutes = require("./routes/user")
const eventRoutes = require("./routes/event")
const meetingRoutes = require("./routes/meeting")

//DB Connections
mongoose.connect( process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log("DB CONNECTED");
})

//Middlewares
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

//My Routes
app.use("/api", authRoutes)
app.use("/api", userRoutes)
app.use("/api", eventRoutes);
app.use("/api", meetingRoutes)

//PORT
const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`app is running at ${port}`)
})