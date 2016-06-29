var currentTab = 'sign_up';

Template.authentication.events({
    'click #sign-in-btn': function(event, err) {
        if (currentTab == 'sign_in') {
            callback_signin();
        }
        currentTab = 'sign_in';
    },

    'click #sign-up-btn': function(event) {
        if (currentTab == 'sign_up') {
            callback_signup();
        }
        currentTab = 'sign_up';
    },

    'click #facebook-login': function(event) {
        Meteor.loginWithFacebook({}, function(err) {
            Meteor.call("loginFacebook", Meteor.userId());
            if (err) {
                throw new Meteor.Error("Facebook login failed");
            }
        });
    },

    'submit form': function(event) {
        event.preventDefault();
        console.log(currentTab);
    },

    'keypress input#password-input': function(evt, template) { //to do -> password input algo exists in sign up and enter shouldn't work there
        if (evt.which === 13) {
            callback_signin();
        }
    },

    'keypress input#password-confirm-input': function(evt, template) {
        if (evt.which === 13) {
            callback_signup();
        }
        currentTab = 'sign_up';
    },

    'submit #forgotPasswordForm': function(e, t) {
        e.preventDefault();
        var forgotPasswordForm = $(e.currentTarget),
            email = trimInput(forgotPasswordForm.find('#forgotPasswordEmail').val().toLowerCase());
        if (isNotEmpty(email) && isEmail(email)) {
            Accounts.forgotPassword({
                email: email
            }, function(err) {
                if (err) {
                    if (err.message === 'User not found [403]') {
                        console.log('This email does not exist.');
                    } else {
                        console.log('We are sorry but something went wrong.');
                    }
                } else {
                    console.log('Email Sent. Check your mailbox.');
                }
            });
        }
        return false;
    }
});

var callback_signin = function() {
    Meteor.loginWithPassword($('#sign-in-tab').find('#username-input').val(), $('#sign-in-tab').find('#password-input').val(), function(err) {
        if (err && err.reason !== "Match failed") {
            sAlert.error('Username or password incorrect', {
                effect: 'slide',
                position: 'bottom-right',
                timeout: 'none',
                onRouteClose: false,
                stack: false,
                offset: '80px'
            });
            console.log(err);
        }
    });
};

var callback_signup = function() {
    var name = $('#sign-up-tab').find('#username-input').val();
    Meteor.call('doesUserExist', name, function(error, result) {
        if (result === true) {
            sAlert.error('Username already exists', {
                effect: 'slide',
                position: 'bottom-right',
                timeout: 'none',
                onRouteClose: false,
                stack: false,
                offset: '80px'
            });
        }
    });
    var pass = $('#sign-up-tab').find('#password-input').val();
    var confirm_pass = $('#sign-up-tab').find('#password-confirm-input').val();
    if (pass === confirm_pass) {
        Accounts.createUser({username: $('#sign-up-tab').find('#username-input').val(), email: $('#sign-up-tab').find('#email-input').val(), password: $('#sign-up-tab').find('#password-input').val()});
        Meteor.call("defaultPicture", Meteor.userId());
    } else {
        sAlert.error('Passwords do not match', {
            effect: 'slide',
            position: 'bottom-right',
            timeout: 'none',
            onRouteClose: false,
            stack: false,
            offset: '80px'
        });
    }
};
