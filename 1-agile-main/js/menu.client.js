Template.menutree.helpers({
    list: function() {
        return checkRecursivePass(se('menu').main)
    }

});

// Template.sub.helpers({
//     hasSub: function() {
//         dbg("test", this)
//         return this.sub
//     }

// });

//current Ponerle set a los enlaces del menu

Router.map(function() {
    this.route('menutree', {
        path: '/menutree',
        controller: 'BaseController'
    });
});
