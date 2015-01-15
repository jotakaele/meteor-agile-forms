Template.alf.events({
    'click a#addrecord': function(ev) {
        $('#newdiv').html('')
        var f = {
            div: 'newdiv',
            mode: 'new',
            name: $('div#newdiv').attr('form')
        }
        cargaForm(f)
    },
    'click a[edit]': function(ev) {
        var $ln = $(ev.target)
        $('#editdiv').html('')
        var f = {
            div: 'editdiv',
            mode: 'edit',
            name: $('div#editdiv').attr('form'),
            doc: $ln.attr('edit')
        }
        cargaForm(f)
    },
    'mouseover a[edit]': function(ev) {
        var $ln = $(ev.target)
        $ln.attr('data-reveal-id', 'edit')
    }
});
Template.alf.rendered = function() {
    Meteor.setTimeout(function() {
        cargaList($('#alf-template #list').attr('list'), 'list')
    }, 0)
};
