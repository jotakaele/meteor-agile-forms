if (Meteor.isServer) {
    Meteor.methods({
        jadeRender: function (jadeString, options) {
            options = options || {
                debug: true,
                compileDebug: true
            }
            var jade = Meteor.npmRequire('jade')
            return jade.render(jadeString)
        }
    });
}
// if (Meteor.isClient) {
//     jadeProcess = function (src) {
//         return Meteor.wrapAsync(Meteor.call('jadeRender', function (err, res) {
//             if (!err) {
//                 return res
//             }
//         }))
//     }
// }
