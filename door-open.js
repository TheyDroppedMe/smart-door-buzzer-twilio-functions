exports.handler = function (context, event, callback) {
    let twiml = new Twilio.twiml.VoiceResponse();

    // Get rid of random non-alphabetical chars and put to lower case
    var cleanString;
    if (event.SpeechResult) {
        cleanString = event.SpeechResult
            .replace(/[^\w\s]|_/g, "")
            .replace(/\s+/g, " ")
            .toLowerCase();
    } else {
        cleanString = '';
    }

    var authMethod;
    if (cleanString == context.PASSPHRASE && event.Confidence > 0.5) {
        authMethod = 'voice';
    } else if (event.Digits == context.PASSCODE) {
        authMethod = 'code';
    } else {
        authMethod = 'none';
    }

    console.log('AuthMethod: ' + authMethod + '; ' +
        'Speech: ' + cleanString + '; ' +
        'confidence: ' + event.Confidence + '; ' +
        'Digits: ' + event.Digits)

    if (authMethod != 'none') {
        // Check if we have a password match, and open the door
        twiml.say({voice: 'man'}, 'come on in!')
        twiml.play({digits: 'ww5555555555', loop: 3}) // Pressing 5 sends DTFM tone to open the door
        twiml.pause({length: 1})
        twiml.play('http://demo.twilio.com/docs/classic.mp3')

        // Also send me a text on this
        twiml.redirect('/text-me?Method=' + authMethod)
        callback(null, twiml)
    } else {
        twiml.redirect('/call-residents')
        callback(null, twiml)
    }
}
