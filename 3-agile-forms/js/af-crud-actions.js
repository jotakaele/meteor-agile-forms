Meteor.methods({
    'saveAfRecord': function(formName, formResults) {
        var theForm = Autof.findOne({
            name: formName
        }).content.form
        dbg('theForm', theForm)

        var theSave = {}

        theSave.collection = theForm.collection
        theSave.data = formResults
        theSave.dataIsOk = true
        theSave.info = []
        _.each(theSave.data, function(value, key) {

            //check require

            dbg('check-require ' + key, theForm.fields[key].required == false ? false : true)

            if (theForm.fields[key].required == false ? false : true) {
                if (!value || value == '') {
                    theSave.dataIsOk = false
                    theSave.info.push('Field ' + key + ' required')

                }

            }

            //

        })

        var autoData = {
            autouser: Meteor.userId || 'unuser',
            autodate: new Date()
        }

        return o2S(theSave)

    }
});
