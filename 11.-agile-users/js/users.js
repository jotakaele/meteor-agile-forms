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
    Accounts.ui.config({
        passwordSignupFields: 'USERNAME_AND_EMAIL'
    });
    Meteor.subscribe("userData");
    //Regitramos un helper global para usar en cualquier lado
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
    AccountsTemplates.configure({
        // Behaviour
        confirmPassword: true,
        enablePasswordChange: true,
        // forbidClientAccountCreation: false,
        overrideLoginErrors: true,
        sendVerificationEmail: false,
        lowercaseUsername: false,
        // Appearance
        showAddRemoveServices: false,
        showForgotPasswordLink: false,
        showLabels: true,
        showPlaceholders: true,
        // Client-side Validation
        continuousValidation: true,
        negativeFeedback: false,
        negativeValidation: true,
        positiveValidation: true,
        positiveFeedback: true,
        showValidating: true,
        // Privacy Policy and Terms of Use
        privacyUrl: 'privacy',
        termsUrl: 'terms-of-use',
        // Redirects
        homeRoutePath: '/home',
        redirectTimeout: 4000,
        // Hooks
        // onLogoutHook: myLogoutFunc,
        // onSubmitHook: mySubmitFunc,
        // Texts
        texts: {
            button: {
                signUp: "Register Now!"
            },
            socialSignUp: "Register",
            socialIcons: {
                "meteor-developer": "fa fa-rocket"
            },
            title: {
                forgotPwd: "Recover Your Passwod"
            },
        },
    });
}
