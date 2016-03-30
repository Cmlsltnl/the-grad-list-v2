Router.configure({
    layoutTemplate: "layout",
    loadingTemplate: "loading",
    waitOn: function () {
        return Meteor.subscribe("posts") && Meteor.subscribe("usersData") && Meteor.subscribe("comments");
    },
    notFoundTemplate: "notFound"
});

Router.route('/', {name: 'main', layoutTemplate: ''});

Router.onBeforeAction(function () {
    if (Meteor.userId()) { // user logged in
        this.layout("layout");
    }
    this.next();
});

//The :_id is a parameter passed to the route and can be retrived by this.params.
Router.route("/posts/:_id", {
    name: "postPage",
    data: function () {
        return Posts.findOne(this.params._id);
    }
});

Router.route("/tags/:tags", {
    name: "tags",
    data: function() {
        return Posts.find({tags: this.params.tags });
    }
});

Router.route("/user/:username", {
    name: "userPosts",
    data: function () {
        return Meteor.users.findOne({username: this.params.username});
    }
});

Router.route("/completed/:_id", {
    name: "postComplete",
    data: function () {
        return Posts.findOne({_id: this.params._id});
    }
});

Router.route("/submit", {name: "postSubmit"});

Router.route("/feed", {name: "feed"});

Router.route("/Book/:username", {
    name: "postBook",
    data: function () {
        return Meteor.users.findOne({username: this.params.username});
    }
});

Router.route("/:username/EditProfile", {
    name: 'editProfile',
});

var requireLogin = function () {
    if (!Meteor.user()) {
        if (Meteor.loggingIn()) {
            this.render(this.loadingemplate);
        }
        else {
            this.render("accessDenied");
        }
    }
    else {
        this.next();
    }
};

Router.onBeforeAction("dataNotFound", {only: "postPage"});
Router.onBeforeAction(requireLogin, {only: "postSubmit"});
