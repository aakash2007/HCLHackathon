module.exports = function(bot) {
    bot.dialog('/greet', [
        function (session, args, next) {
            const lastVisit = session.userData.lastVisit;

            session.send(['Hello!', 'Hi there!', 'Hi!']);

            if (!lastVisit) {
                session.send('DHL Chatbot at your Service');
                session.userData = Object.assign({}, session.userData, {
                    lastVisit: new Date()
                });
                session.save();
            } else {
                session.send('Glad you\'re back!');
            }

            session.send("How can I help you?")
            session.endDialog("You can ask me *What can you do* to get a list of my capabilities.");

        }
    ]);
};