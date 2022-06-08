var express = require('express')
var router = express.Router()
const {check} = require("express-validator")

const {signout, signup, signin, isSignedIn} = require("../controllers/auth")

router.post("/signup", [
    check("name","password should be at least 3 character").isLength({min:3}),
    check("email", "email is required").isEmail(),
    check("password", "password should be at least 3 character").isLength({min: 3})
], signup);

router.post("/signin", [
    check("email", "email field is required").isEmail(),
    check("password", "password field should be at least 3 character").isLength({min: 3})
], signin);

router.post("/signout", signout);

router.get("/testroute",isSignedIn, (req, res) => {
    res.json(req.auth);
})

module.exports = router;
