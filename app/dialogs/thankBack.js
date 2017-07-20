module.exports = function(bot) {
    bot.dialog('/thankBack', [
        function (session, args, next) {
            session.send('You\'re welcome, happy to help')
            session.endDialog()
        }
    ]);
};