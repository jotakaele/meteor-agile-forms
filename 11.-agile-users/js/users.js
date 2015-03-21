T9n.setLanguage('es');
Router.map(function(post) {
    this.route('home', {
        path: '/',
        controller: 'BaseController',
    });
});
if (Meteor.isClient) {
    Router.plugin('ensureSignedIn', {
        except: ['home', 'atSignIn', 'atSignUp', 'atForgotPassword']
    });
    /* Accounts.ui.config({
         passwordSignupFields: 'USERNAME_AND_EMAIL'
     });*/
    Meteor.subscribe("userData");
    //Regitramos un helper global para usar user en cualquier lado
    Template.registerHelper('user', function() {
            var u = Meteor.user()
            obj = {}
            if (u.profile) {
                obj.name = u.profile.name
            }
            if (u.emails) {
                obj.email = Meteor.user().emails[0].address
            } else if (u.services) {
                if (u.services.google) {
                    obj.email = u.services.google.email
                    obj.picture = u.services.google.picture
                } else if (u.services.facebook) {
                    obj.email = u.services.facebook.email
                } else if (u.services.twitter) {
                    //obj.email = u.services.twitter.email //todo Twitter no descarga el email. Buscar solucion
                    obj.picture = u.services.twitter.profile_image_url
                }
            }
            return obj
        })
        // 
        // accounts config
 } 
  //Routes
AccountsTemplates.configureRoute('changePwd');
AccountsTemplates.configureRoute('enrollAccount');
AccountsTemplates.configureRoute('forgotPwd');
AccountsTemplates.configureRoute('resetPwd');
AccountsTemplates.configureRoute('signIn');
AccountsTemplates.configureRoute('signUp');
AccountsTemplates.configureRoute('verifyEmail');

// Options
AccountsTemplates.configure({
    //defaultLayout: 'emptyLayout',
    showForgotPasswordLink: true,
    overrideLoginErrors: true,
    enablePasswordChange: true,
    sendVerificationEmail: false,

    //enforceEmailVerification: true,
    //confirmPassword: true,
    //continuousValidation: false,
    //displayFormLabels: true,
    //forbidClientAccountCreation: false,
    //formValidationFeedback: true,
    //homeRoutePath: '/',
    //showAddRemoveServices: false,
    //showPlaceholders: true,

    negativeValidation: true,
    positiveValidation:true,
    negativeFeedback: false,
    positiveFeedback:true,

    // Privacy Policy and Terms of Use
    //privacyUrl: 'privacy',
    //termsUrl: 'terms-of-use',
});

