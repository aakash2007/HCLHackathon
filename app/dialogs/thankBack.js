module.exports = function(bot) {
    bot.dialog('/thankBack', [
        function (session, args, next) {
            session.send(["You're welcome", "Happy to help"]);
            session.endDialog()
        }
    ]);
};