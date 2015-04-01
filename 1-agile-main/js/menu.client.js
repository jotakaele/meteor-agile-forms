Template.menutree.helpers({
    list: function() {
        return checkRecursivePass(se('menu').main)
    }

});


Router.map(function() {
    this.route('menutree', {
        path: '/menutree',
        controller: 'BaseController'
    });
});



Template.menu.events({

    'click #config-menu a': function(e) {
        //e.preventDefault()

        $a = $(e.target)
        if ($a.attr('href')) {
            return location.href = $a.attr('href')

        }


        $('#config-menu li.active').removeClass('active')
        $a.parent().addClass('active')
        $('article').html('')
            //Si estamos en backend mostramos los elementos en ritem, si no en article
        var $dest = $('<div>', {
            'data-equalizer': 'data-equalizer',
            id: "mainarea"
        })

        if ($('#ritem').length > 0) {
            $dest.appendTo($('#ritem'))
        } else {
            $dest.appendTo($('article'))
        }
        dbg('dest', $dest)

        for (var count = 1; count <= 5; count++) {
            if ($a.attr('area-' + count)) {

                var areaName = 'area-' + count

                var conf = {
                    type: $a.attr(areaName).split('/')[0],
                    name: $a.attr(areaName).split('/')[1],
                    div: areaName
                }
                var $area = $('<div>', {
                    id: areaName,
                    class: $a.attr(areaName).split('/')[2],
                    type: conf.type,
                    name: conf.name
                }).appendTo($dest).addClass('columns snippetarea data-equalizer-watch')
                doSnippet(conf)


                console.log($a.attr('area-' + count))
            }
        }


    }
});
