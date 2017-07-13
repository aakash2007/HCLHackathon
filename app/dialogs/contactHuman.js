module.exports = function(bot) {
    bot.dialog('/contactHuman', [
        function (session, args, next) {
            session.send('This is contactHuman')
            session.endDialog();
        }
    ]);
};