const builder = require('botbuilder');
const request = require('request');

function getOrder(trackid) {
    var url = "http://www.dhl.co.in/shipmentTracking?AWB=" + trackid + "&countryCode=in&languageCode=en&_=1500382489026";
    equest({
        url: url,
        json: true
    }, function(err, res, body) {
        if (!err && res.statusCode === 200) {
            console.log("I am groot");
            console.log(body.results[0].description);
            return body;
        }
    });
    console.log(url);
}

module.exports = function(bot) {
    bot.dialog('/trackOrder', [

        function (session, args, next) {
        	builder.Prompts.text(session, 'What\'s your tracking ID?');
        },

        function(session, results){
        	let trackid = results.response;
            session.userData.trackid = trackid;
            builder.Prompts.text(session,"Okay Let's See");
            result = getOrder(trackid).results[0];

            if (false) {
                builder.Prompts.text(session,"Sorry, I'm not able to find the record with id " + trackid);
                builder.Prompts.text(session,"Maybe check your tracking ID?");
            }
            else {
                builder.Prompts.text(session,"I found your result");
                builder.Prompts.text(session, "Tracking ID: "+result.id);
                builder.Prompts.text(session, "As of now, the order status is: " + result.delivery.status);
                builder.Prompts.text(session, "It's last checkpoint was:\n" + result.checkpoints[0].description + "\n Time: " + result.checkpoints[0].time + "\n On: " + result.checkpoints[0].date + "\n At " + result.checkpoints[0].location);
                session.endDialog();
            }

        }
    ]);
}