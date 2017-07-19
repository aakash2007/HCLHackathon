var http = require('http');

module.exports = function(value, currency, output) {
    return new Promise(function(resolve, reject) {
        var url = `http://api.fixer.io/latest?base=${currency}&symbols=${output}`
        var body = "";
        http.get(url, function(res) {
            res.on('data', data => body += data);
            res.on('end', () =>{
                var rate = JSON.parse(body)["rates"][output];
                var newValue = rate * value;
                resolve(Math.round(newValue * 100) / 100);
            })
        })
    });
}