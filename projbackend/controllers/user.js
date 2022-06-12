const User = require("../models/user");
//const Order = require("../models/order")


exports.getUserById = (req, res, next, id) => {
    User.findById(id).exec((err, user) => {
        if(err || !user) {
            return res.status(400).json({
                error: "No user was found in DB"
            })
        }

        req.profile = user;
        next();
    })

}

exports.getUser = (req, res) => {
    //TODO: GET HERE FOR PASSWORD
    req.profile.salt = undefined; // this will not show at all
    req.profile.encry_password = ""; //this will show as empty
    return res.json(req.profile)
}

exports.getAllUsers = (req, res) => {
    User.find().exec((err, users) => {
        if(err || !users) {
            return res.status(400).json({
                error: "NO USERS FOUND"
            });
        }
        res.json(users)
    })
}

 exports.updateUser = (req, res) => {
    User.findByIdAndUpdate(
        {_id: req.profile._id},
        {$set: req.body},
        {new: true, useFindandModify: false}, 
        (err, user) => {
            if(err) {
                return res.status(400).json({
                    error: "UPDATE WAS NOT SUCCESSFUL"
                })
            }
            user.salt = undefined;
            user.encry_password = undefined;
            res.json(user);
        }
    )
}