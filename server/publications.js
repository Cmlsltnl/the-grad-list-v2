Meteor.startup(function() {
    if (Images.collection.findOne({name: 'logo.png'}) === undefined) {
        Images.load('https://image.freepik.com/free-icon/graduation-student-black-cap_318-56675.jpg', {
            fileName: 'logo.png',
            meta: {}
        });
    }
});

Meteor.publish("posts", function() {
    return Posts.find({}, {
        sort: {
            date: -1
        }
    });
});

Meteor.publish("comments", function() {
    return Comments.find({}, {
        sort: {
            date: -1
        }
    });
});

Meteor.publish("tags", function() {
    return Tags.find({}, {
        sort: {
            date: -1
        }
    });
});

Meteor.publish("usersData", function() {
    if (this.userId) {
        return Meteor.users.find({}, {
            fields: {
                "username": true,
                "email": true,
                _id: true,
                follows: true,
                followed: true,
                'services.facebook.name': true,
                'services.facebook.id': true,
                'bio': true,
                'country': true,
                'university': true,
                'picture': true,
                'image': true,
                'medals': true
            }
        });
    } else {
        this.ready();
    }
});

Meteor.publish("files.images.all", function() {
    return Images.collection.find({});
});

ServiceConfiguration.configurations.remove({service: 'facebook'});

ServiceConfiguration.configurations.insert({service: 'facebook', appId: process.env.FACEBOOK_APP_ID, secret: process.env.FACEBOOK_SECRET});
