Template.postItem.helpers({
	
	isCurrentUser:function() {
		return Meteor.userId() == this.owner;	
	},

	isOwner: function(){
      return this.owner === Meteor.userId();
    },

    isNotCompleted: function() {
    	return this.completed === false;
    },

    isForked: function() {
    	return this.hasOwnProperty("forkedFrom");
    },

    forkedFrom: function() {
    	return this.forkedFrom;
    },
    
    isLoggedIn: function() {
    	var user = Meteor.user()
    	if(user) {
    		return true;
    	}
    },
    
    isNotOwner: function() {
    	return this.owner !== Meteor.userId();
    },

    checkLike: function () {
        var a = this.likes;
        var obj = Meteor.userId();
        for (var i = 0; i < a.length; i++) {
            if (a[i] === obj) {
                return false;
            }
        }
        return true;
    },

    ownerUsername: function() {
      return Meteor.users.findOne({"_id": this.owner}).username;
    },

    profilePicture: function() {
    	console.log(Meteor.users.findOne({"_id": this.owner}).picture);
    	if (Meteor.users.findOne({"_id": this.owner}).picture != '[object Object]')
    		return Meteor.users.findOne({"_id": this.owner}).picture;
    },

});


Template.postItem.events({

	'click .like': function() {
		Meteor.call("likePost", this._id);
	},

    'click .dislike': function() {
        Meteor.call("dislikePost", this._id);
    },

	'click .delete': function() {
		Meteor.call("deletePost", this._id);
	},

	'click .fork': function() {
		Meteor.call("forkPost", this._id);
	},
	'submit .new-comment' : function(event) {
		event.preventDefault();

		var text = event.target.comment.value;

		var commentId = Comments.insert( {
			text: text,
			createdAt: new Date(),
			owner: Meteor.userId()
		});

		Meteor.call("addCommentToPost", this._id, commentId);
		
		event.target.comment.value = "";
	}
});
