Meteor.publish("userData", function() {
    if (this.userId) {
        return Meteor.users.find({
            _id: this.userId
        }, {
            fields: {
                profile: 1,
                services: 1
            }
        });
    } else {
        this.ready();
    }
});
