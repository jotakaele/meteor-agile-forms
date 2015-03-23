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


    /**
     * Devuelve información de usuario ampliada.
     * @return {object} Devuelve un objeto con las claves email, label, mode y si existen picture del usuario
     */
    userInfo = function() {
            if (!Meteor.user()) {
                return {
                    label: 'unlogin'
                }
            }

            var u = Meteor.user()

            obj = {}
            if (u.profile) {
                obj.name = u.profile.name
            }
            if (u.services) {
                if (u.services.google) {
                    obj.email = u.services.google.email
                    obj.picture = u.services.google.picture
                    obj.loginMode = 'google'
                } else if (u.services.facebook) {
                    obj.email = u.services.facebook.email
                    obj.loginMode = 'facebook'
                } else if (u.services.twitter) {
                    //obj.email = u.services.twitter.email //todo Twitter no descarga el email. Buscar solucion
                    obj.picture = u.services.twitter.profile_image_url
                    obj.loginMode = 'twitter'
                } else if (u.services.password) {
                    //obj.email = u.services.twitter.email //todo Twitter no descarga el email. Buscar solucion
                    obj.loginMode = 'password'
                    obj.email = u.emails[0].address
                }
            }


            obj.label = obj.name || obj.email
            return obj
        }
        //Regitramos un helper global para usar user en cualquier lado
    Template.registerHelper('user', function() {
        return userInfo()

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
    positiveValidation: true,
    negativeFeedback: false,
    positiveFeedback: true,

    // Privacy Policy and Terms of Use
    //privacyUrl: 'privacy',
    //termsUrl: 'terms-of-use',
});
