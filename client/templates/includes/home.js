Template.home.helpers({
  user: function(){

      return Meteor.users.find({
      	$and:
      	[{"_id": { $nin: Meteor.user().follows}},
      	{"_id": { $ne: Meteor.userId() }}]
      	});
  },

  friends_of_friends: function(){
  	var friends = Meteor.user().follows;
  	var friends_of_friends = [];
  	for (var i = 0; i < friends.length; i++) {
  		friends_of_friends.push(Meteor.users.findOne({"_id": friends[i]}).follows);
  	}
  	var a = [];
  	for (var i = 0; i < friends_of_friends.length; i++) { 
  		for (var j = 0; j < friends_of_friends[i].length; j++) {
  			a.push(Meteor.users.findOne({"_id":friends_of_friends[i][j]}));
  		}
  	}
  	return a;
  }
})
