// In your server code: define a method that the client can call
Meteor.methods({
    sendEmail: function(to, from, subject, text) {
        check([to, from, subject, text], [String]);

        // Let other method calls from the same client start running,
        // without waiting for the email sending to complete.
        this.unblock();

        Email.send({
            to: to,
            from: from,
            subject: subject,
            text: text
        });
        Meteor.call('setLog', 'email-log', {
            to: to,
            from: from,
            subjetc: subject,
            text: text
        })

        return {
            to: to,
            subject: subject
        };



        // return {
        //     to: to,
        //     subject: subject
        // };

    }
});


//Configurando las opciones globales
PrettyEmail.options = {
    from: 'info@oeneele.com',
    logoUrl: 'https://lh4.googleusercontent.com/-UtBpVsssGl4/VRFIS5hdUCI/AAAAAAABrGA/0052Egs6TfY/w65-h105-no/oeneele.png',
    companyName: 'oeneele',
    companyUrl: 'http://mycompany.com',
    companyAddress: 'Travesía de los depósitos, 8 4º d',
    companyTelephone: '+34 647605231',
    companyEmail: 'juan.chamizo+soporte@gmail.com',
    siteName: 'mycompany'
}
