Template.main.rendered = function() {
    // dbg('pageList')
    // activateFormLinks()
    $('body').on('mousemove', function() {
        activateFormLinks()
    })
}
Template.registerHelper('default', function(defaultName) {
    return se(defaultName)
})
