Router.configure({
    // layoutTemplate: 'Main'
});
Router.onAfterAction(function() {
    $(document).foundation(); // activamos la parte JavaScript de foundation despues de cargar cada página
});
Router.map(function() {
    this.route('portada', {
        path: '/'
    });
    this.route('kitchensink', {
        path: '/foundation'
    });
    this.route('newuser', {
        path: '/backend/newuser'
    });
    this.route('autopage', {
        path: '/p/:_pagename',
        data: function() {
            return Autof.findOne({
                name: this.params._pagename,
                state: 'active'
            });
        },
        waitOn: function() {
            // waitOn makes sure that this publication is ready before rendering your template
            return Meteor.subscribe("autof");
        }
    });
    this.route('autoEdit', {
        path: '/backend/autolf/:itemname',
        data: function() {
            vname = this.params.itemname
                //dbg('ir', this.params._itemname)
            datos = {
                name: vname
            }
            return datos
        }
    });
});
