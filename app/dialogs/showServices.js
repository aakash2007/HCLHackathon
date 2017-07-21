module.exports = function(bot) {
    bot.dialog('/showServices', [
        function (session, args, next) {
            session.send('I can help you for following:');
            session.send("* **Order Tracking:** Track the current status and last checkpoint of you order using tracking ID\n\nJust type: *Track my order* or *Where is my order*" );
            session.send("* **Send Postcard:** Send out a postcard right away!\n\nTell Me: *I want to send a postcard* or *Write a postcard*");
            session.send("* **Rate and Time Quote:** Check for services and estimated costs for your parcel\n\nUse It: *Show rate time quote* or *Get rate and time*")
            session.send("* **Size and Price Guide:** Find a suitable box for your parcel without any delay\n\nJust ask: *Find a suitable package* or *Which box will I need*");
            session.send("* **Check Location Availability:** Check if DHL operates in your city or not.\n\nTry: *Is DHL available in my city* or *Do you ship here*");
            session.send("* **Convert Currency:** Realtime currency conversion\n\nStart it by: *Convert currency*");
            session.send("During any function, you can use hotwords: **cancel** or **restart** to control your conversation.");
            session.endDialog()
        }
    ]);
};