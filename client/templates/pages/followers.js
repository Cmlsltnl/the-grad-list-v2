Template.followers.helpers({
    username: function() {
        return Meteor.users.findOne({"_id": this._id}).username;
    },

    image: function() {
        const image_id = Meteor.users.findOne({"_id": this._id}).image;
        return "/cdn/storage/Images/" + image_id + "/original/" + image_id + ".png";
    },

    followers: function() {
        let a = [];
        const followers = Meteor.users.findOne({"_id": this._id}).followed;
        for (var i = 0; i < followers.length; i++) {
            a.push(Meteor.users.findOne({"_id": followers[i]}));
        }
        return a;
    }
});
