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
/*
// in this we are using order model to get all the orders of a user. ie search by user id.
exports.userPurchaseList = (req, res) => {
    Order.find({user: req.profile._id})
    .populate("user", "_id name")
    .exec((err, order) => {
        if(err) {
            return res.status(400).json({
                error: "NO ORDER IN THIS ACCOUNT"
            });
        }
        return res.json(order);
    })
};


exports.pushOrderInPurchaseList = (req, res, next) =>{
    let purchases = []
    req.body.order.products.forEach(product => {
        purchases.push({
            _id: product._id,
            name: product.name, 
            description: product.description,
            category: product.category,
            quantity: product.quantity,
            amount: req.body.order.amount,
            transaction_id: req.body.order.transaction_id
        });
    });

    //store this in DB
    User.findOneAndUpdate(
        {_id: req.profile._id},
        {$push: {purchases: purchases}},
        {new: true},
        (err, purchases) => {
            if(err){
                return res.status(400).json({
                    error: "Unambe to save purchase list"
                })
            }
            next();
        }
    )
    
} */