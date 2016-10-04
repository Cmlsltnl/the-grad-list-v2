Template.followers.helpers({
    username: function() {
        return Meteor.users.findOne({"_id": this._id}).username;
    },

    image: function() {
        var image_id = Meteor.users.findOne({"_id": this._id}).image;
        return Images.collection.findOne({"_id": image_id});
    },

    hasProfilePicture: function() {
        if (Meteor.users.findOne({"_id": this._id}).image == 'grad.png') {
            return false;
        } else {
            return true;
        }
    },

    srcProfilePicture: function() {
        if (Meteor.users.findOne({"_id": this._id}).facebook_login === false) {
            return "/grad.png";
        } else {
            return "http://graph.facebook.com/" + Meteor.users.findOne({"_id": this._id}).services.facebook.id + "/picture/?type=large";
        }
    },

    followers: function() {
        var a = [];
        var followers = Meteor.users.findOne({"_id": this._id}).followed;
        for (var i = 0; i < followers.length; i++) {
            a.push(Meteor.users.findOne({"_id": followers[i]}));
        }
        return a;
    }
});
