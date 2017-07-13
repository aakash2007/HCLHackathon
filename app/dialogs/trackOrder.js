module.exports = function(bot) {
    bot.dialog('/trackOrder', [
        function (session, args, next) {
            session.send('This is trackOrder')
            session.endDialog();
        }
    ]);
};