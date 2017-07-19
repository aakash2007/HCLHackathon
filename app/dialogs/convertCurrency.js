const http = require('http');
const builder = require('botbuilder')
const base = require('../../data/currencyData.json').units

const convertor = (value, currency, output) => {
    return new Promise(function(resolve, reject) {
        let url = `http://api.fixer.io/latest?base=${currency}&symbols=${output}`
        let body = "";
        http.get(url, function(res) {
            res.on('data', data => body += data);
            res.on('end', () =>{
                let rate = JSON.parse(body)["rates"][output];
                let newValue = rate * value;
                resolve(Math.round(newValue * 100) / 100);
            })
        })
    });
}

module.exports = function(bot) {
    bot.dialog('/convertCurrency', [
        function (session, args, next) {    
            builder.Prompts.choice(session, 'Enter the base unit(unit that you want to convert from)', base);
        },
        function(session, results) {
            session.dialogData.initialUnit = results.response.entity
            builder.Prompts.choice(session, 'Enter the final unit(unit that you want to convert to)', base);
        },
        function(session, results) {
            session.dialogData.finalUnit = results.response.entity
            builder.Prompts.number(session, 'Enter the value in base units');  
        },
        function(session, results) {
            session.dialogData.initialValue = results.response
            convertor(session.dialogData.initialValue, session.dialogData.initialUnit, session.dialogData.finalUnit)
            .then((finalValue) => {
                session.send(session.dialogData.initialValue + ' ' +  session.dialogData.initialUnit + ' is equals to ' + finalValue + ' ' + session.dialogData.finalUnit)
                session.endDialog()
            })
        }
    ]);
};