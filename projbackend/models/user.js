const mongoose = require("mongoose")
const crypto = require('crypto')
const uuid = require('uuid')
const {ObjectId} = mongoose.Schema;


var userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength:  32, 
        trim: true
    },
    lastname: {
        type: String,
        maxlength: 32,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    userinfo: {
        type: String,
        trim: true
    },
    encry_password: {
        type: String, 
        required: true
    },
    salt: String,
    my_events: [{
        type: ObjectId,
        ref: "Event"
    }],
    events_shared_with_me: [{
        type: ObjectId,
        ref: "Event"
    }],
    meetings: [{
        type: ObjectId,
        ref: "Meeting"
    }]
}, 
{timestamps: true}
);

userSchema.virtual("password")
    .set(function(password){
        this._password = password
        this.salt = uuid.v1();
        this.encry_password = this.securePassword(password);
    })
    .get(function(){
        return this._password
    })

userSchema.methods = {

    authenticate: function(plainpassword) {
        return this.securePassword(plainpassword) === this.encry_password
    },


    securePassword: function(plainpassword) {
        if(!plainpassword)
            return "";
        try {
            return crypto.createHmac("sha256", this.salt)
            .update(plainpassword)
            .digest("hex")
        } catch (error) {
            
        }
    }
}

module.exports = mongoose.model("User", userSchema)  