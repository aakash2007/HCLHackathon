module.exports = function(bot) {
    bot.dialog('/rateTimeQuote', [
        function (session, args, next) {
            session.send('This is rateTimeQuote!')
            session.endDialog()
        }
    ]);
};