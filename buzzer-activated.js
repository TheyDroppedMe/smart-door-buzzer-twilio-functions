/**
 *  Simple call box routine
 *
 *  This function is meant for the apartment building callbox
 *  It gives the user a couple of seconds to produce the password
 *    Then dials all the residents to grant manual entry
 */
exports.handler = function (context, event, callback) {

    let twiml = new Twilio.twiml.VoiceResponse();

    if (context.ENABLED.toLowerCase() == 'true') {
        // Gather both speech and digit entry from user
        twiml.gather({
            action: '/door-open',
            hints: context.PASSPHRASE,
            input: 'speech dtmf',
            numDigits: '4',
            speechTimeout: 'auto',
            timeout: 10,
        })
            .say({voice: 'man'}, 'What is the secret password?')
    }

    twiml.redirect('/call-residents')
    callback(null, twiml)
}