Template.listshow.rendered = function () {
    var config = this.data
    config.type = 'list'
    Meteor.setTimeout(function () {
        doSnippet(config)
    }, 100)
}
Template.pageList.rendered = function () {
    var config = this.data
    config.div = 'listdest'
    config.type = 'list'
    Meteor.setTimeout(function () {
        doSnippet(config)
    }, 500)
}
/*Template.list.helpers({
    table: function () {
        a = {
            src: sanitizeObjectNameKeys(masterConnection.list.findOne({
                name: this.name
            }).content),
            type: 'list'
        }
        return doSnippet(a)
    }
});
Template.list.rendered = function () {
    setTimeout(function () {
        $('.autol:not(.datatable)').DataTable()
    }, 100);
};

*/