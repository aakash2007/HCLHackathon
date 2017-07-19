const builder = require('botbuilder');
const request = require('request');

function getOrder(trackid, callback) {
    let url = "http://www.dhl.co.in/shipmentTracking?AWB=" + trackid + "&countryCode=in&languageCode=en&_=1500382489026";
    request({
        url: url,
        json: true
    }, function(err, res, body) {
        if (!err && res.statusCode === 200 && !body.errors) {
            callback(body)
        } else {
            callback(false)
        }
    })
}

module.exports = function(bot) {
    bot.dialog('/trackOrder', [

        function (session, args, next) {
            builder.Prompts.number(session, 'What\'s your tracking ID?');
        },
        function(session, results){
            let trackid = results.response;
            session.dialogData.trackid = trackid;
            getOrder(trackid, (x) => {
                
                if (x) {
                    let result = x.results[0];
                    session.send("I found your result");
                    session.send("Tracking ID: "+result.id);
                    session.send("As of now, the order status is: " + result.delivery.status);
                    session.send("It's last checkpoint was:\n" + result.checkpoints[0].description + "\n Time: " + result.checkpoints[0].time + "\n On: " + result.checkpoints[0].date + "\n At " + result.checkpoints[0].location);
                } else {
                    session.send("Sorry, I'm not able to find the record with id " + trackid);
                    session.send("Maybe your tracking ID is incorrect");
                }
                session.endDialog();
            })
        }
    ]);
}