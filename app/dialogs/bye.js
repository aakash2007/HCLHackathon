module.exports = function(bot) {
    bot.dialog('/bye', [
        function (session, args, next) {
            session.send('Goodbye!')
            session.send('See you soon')
            session.endConversation()
        }
    ]);
};