exports.handler = function (context, event, callback) {
    let twiml = new Twilio.twiml.VoiceResponse();

    var bodyText;

    switch (event.Method) {
        case 'code':
            bodyText = 'Someone used the code to open the gate.';
            break;
        case 'voice':
            bodyText = 'Someone used the voice password to open the gate.';
            break;
        case 'call':
            bodyText = 'Someone called the gate and was passed through to the backup number.';
            break;
        default:
            bodyText = 'Somebody called the gate but didn\'t know the passcode.';
    }

    if (context.ENABLED.toLowerCase() == 'true') {
        context.getTwilioClient().messages.create({
            to: context.BACKUP_PHONE,
            from: context.TWILIO_PHONE,
            body: bodyText,
        })
            .then((message) => {
                console.log(message.sid);
                callback(null, twiml);
            })
            .catch((err) => callback(err, null));
    }
};