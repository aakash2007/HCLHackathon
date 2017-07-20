module.exports = function(bot) {
    bot.dialog('/showServices', [
        function (session, args, next) {
            session.send('I can help you for following:')
            session.endDialog()
        }
    ]);
};