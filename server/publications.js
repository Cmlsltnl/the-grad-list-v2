Meteor.publish("posts", function()
{
	return Posts.find({}, {sort: {date: -1}});
});

Meteor.publish("comments", function()
{
	return Comments.find({}, {sort: {date: -1}});
});

Meteor.publish("usersData", function() {
  if (this.userId) {
    return Meteor.users.find({}, {fields: {"username" :true, _id: true, follows: true} });
  } else {
    this.ready();
  }
});
