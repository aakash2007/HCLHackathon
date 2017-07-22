module.exports = function(bot) {
    bot.dialog('/contactHuman', [
        function (session, args, next) {
            session.send('Please Wait. \n\nConnecting You To a Human Customer Support.')
            session.sendTyping();
            session.endDialog();
        }
    ]);
};