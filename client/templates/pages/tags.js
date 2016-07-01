Template.tags.helpers({
    title: function() {
        var url = Router.current().location.get().path.slice(6);
        if (Posts.find({tags: url}).count() !== 0) {
            return "[ Posts with the tag ]";
        } else {
            return "[ There are no posts with the tag ]";
        }
    },

    postsByTags: function() {
        var url = Router.current().location.get().path.slice(6);
        return Posts.find({tags: url});
    },

    tag: function() {
        return Router.current().location.get().path.slice(6);
    }
});
