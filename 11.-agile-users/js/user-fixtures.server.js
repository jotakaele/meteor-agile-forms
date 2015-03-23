if (masterConnection.config.find().count() === 0) {


    var obj = {
        name: 'roles',
        create_date: new Date(),
        content: {
            "roles": {
                "admin": [
                    "juan.chamizo@gmail.com"
                ],
                "manager": [
                    "gestor1@gmail.com",
                    "gestor2@gmail.com"
                ],
                "operator": [
                    "operator1@gmail.com",
                    "operator2@gmail.com",
                    "operator3@gmail.com"
                ]
            }
        }
    }

    masterConnection.config.insert(obj)
    dbg('Creando config.roles')
}







if (Meteor.users.find().count() === 0) {

    var nu = [{
        "_id": "PoF335eMKMGauBcs5",
        "createdAt": "2015-03-23T08:27:17.958Z",
        "services": {
            "password": {
                "bcrypt": "$2a$10$v4LEhln1Ety8VCStn.Ac3OUskDdPbFMyup.aDNHKlkCRZqR.8WcEa"
            },
            "resume": {
                "loginTokens": []
            }
        },
        "emails": [{
            "address": "operador2@gmail.com",
            "verified": false
        }]
    }, {
        "_id": "PeXTfPPKWTCMAL3Lq",
        "createdAt": "2015-03-23T08:27:37.465Z",
        "services": {
            "password": {
                "bcrypt": "$2a$10$2wUYBZKDajD6pHVPiyXWDOTePjHvFRxwH/DT/5R265hCC6cLF2IKi"
            },
            "resume": {
                "loginTokens": []
            }
        },
        "emails": [{
            "address": "operador3@gmail.com",
            "verified": false
        }]
    }, {
        "_id": "hi4fJ8zt8F4vYY3E9",
        "createdAt": "2015-03-23T09:07:52.160Z",
        "services": {
            "password": {
                "bcrypt": "$2a$10$8xQMUgTSkdR5u5RWJ4h9bOV7JwewB0FRMXYV/iuvYhie3O55KuRxG"
            },
            "resume": {
                "loginTokens": []
            }
        },
        "emails": [{
            "address": "admin1@gmail.com",
            "verified": false
        }]
    }, {
        "_id": "yaZrtvdDfCPWzTtcC",
        "createdAt": "2015-03-23T09:08:10.686Z",
        "services": {
            "password": {
                "bcrypt": "$2a$10$eplBaRy950aXEBgrq9AxJOP5BnGtAQ2fC1DMWfnAleWEjFve43UZy"
            },
            "resume": {
                "loginTokens": [{
                    "when": "2015-03-23T09:08:10.771Z",
                    "hashedToken": "eG02qsbNe+sZD9fOH4aMVfe14RW3v54xuO2duE5mRzM="
                }]
            }
        },
        "emails": [{
            "address": "admin2@gmail.com",
            "verified": false
        }]
    }, {
        "_id": "piDuq4SBSabuLbRFe",
        "createdAt": "2015-03-23T08:25:49.146Z",
        "services": {
            "password": {
                "bcrypt": "$2a$10$TuhtR8JvUXpbmfzBIHNE9eq7yr/rHzKzsxazvNteLF6oICD5Ka8ce"
            },
            "resume": {
                "loginTokens": [{
                    "when": "2015-03-23T08:27:59.440Z",
                    "hashedToken": "cW7PPzWXbu3gxA79v0dY6CHphTcgWg2v6h+fv+4WDuY="
                }]
            }
        },
        "emails": [{
            "address": "gestor@gmail.com",
            "verified": false
        }]
    }, {
        "_id": "5mRi697FCbiHmW7nu",
        "createdAt": "2015-03-23T08:26:17.898Z",
        "services": {
            "password": {
                "bcrypt": "$2a$10$vg1pfzsda5n9OJwifKHGe.u0HofDNMbHMtI3nRmJOIMq7Nas5cyPO"
            },
            "resume": {
                "loginTokens": []
            }
        },
        "emails": [{
            "address": "gestor1@gmail.com",
            "verified": false
        }]
    }, {
        "_id": "aCrBFHqxiPvdP9K5P",
        "createdAt": "2015-03-23T08:26:32.799Z",
        "services": {
            "password": {
                "bcrypt": "$2a$10$9D4BAqVFIyyhazmuThqTouISe84tGS9ymz/tpdi9VKl82Q.NeI.46"
            },
            "resume": {
                "loginTokens": []
            }
        },
        "emails": [{
            "address": "gestor2@gmail.com",
            "verified": false
        }]
    }, {
        "_id": "eekNaPy2sDrnBEbNj",
        "createdAt": "2015-03-23T08:26:55.610Z",
        "services": {
            "password": {
                "bcrypt": "$2a$10$EoVoMQ.afmM4UjRvuCk94uaZjjpBhw8lG709DerHCxzfI2HJjn3O6"
            },
            "resume": {
                "loginTokens": []
            }
        },
        "emails": [{
            "address": "operador1@gmail.com",
            "verified": false
        }]
    }]


    console.log('Creando usuarios base')

    _.each(nu, function(theNewUser) {
        Meteor.users.insert(theNewUser)
        console.log('Creando usuario ' + theNewUser.emails[0].address)
    })
}
