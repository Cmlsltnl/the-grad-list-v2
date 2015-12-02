Template.postSubmit.events({
	'submit form': function(e) {
            e.preventDefault();
            var post = {
		title: $(e.target).find('[name=title]').val(),
		image: $(e.target).find('[name=image]').val(),
		owner: Meteor.userId(),
		username: Meteor.user().username || Meteor.user().profile.name,
		comments: [],
		date: new Date(),
                completed: false,
                imagesOfCompletion:[],
                witnessedBy: [],
                dateOfCompletion: {}
            };
            post._id = Posts.insert(post);
            Router.go('postPage', post);
        }
});

