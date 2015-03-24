Meteor.methods({
    //Guardamos información en el log, lo que necesitemos
    'setLog': function(theType, objContent) {
        if (se('log') == true) {
            return Logs.insert({
                autouser: Meteor.userId || 'unuser',
                autodate: new Date(),
                type: theType,
                content: objContent,
                expiredate: moment().add(se('log_expire').insert_record).toDate()
            })
        }
    }
});
