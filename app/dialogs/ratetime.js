const builder = require('botbuilder');
const http = require('http');
const qs = require('querystring');
const xml2js = require('xml2js');

const cntryCd = require('../../data/countryCode.json');
const len = cntryCd.length;

function getRate(options, callback) {
	var url = "http://dct.dhl.com/data/quotation/?" + qs.stringify(options);
	var body = "";
	http.get(url, function(res) {
		res.on('data', data => body += data);
		res.on('end', () => {
			xml2js.parseString(body, (err, result) => {
				if (err) {
					callback(false);
				}
				else {
					callback(result);
				}
			})
		});
		res.on('error', err => callback(false));
	})
}

const wgtCh = ["kg", "lb"];
const lntCh = ["cm", "in"];


module.exports = function(bot) {
	bot.dialog('/rateTimeQuote', [

			function(session, args, next) {
				session.send("DHL Capability Tool");
				builder.Prompts.text(session, "What's the Origin Country Code? (like IN, US, AF)");
			},
			function(session, results) {
				var orgCtry = results.response
				var found = false;
				for ( var i=0; i<len; i++) {
					
					if(cntryCd[i]["Code"] == orgCtry){
						found = true;
						session.dialogData.orgCtry = orgCtry;
						session.send("Origin Country: " + cntryCd[i]["Name"])
					}
				}
				if (!found) {
					session.end();			// Enter here for dialog reset
				}
				builder.Prompts.text(session, "What's the Destination Country Code? (like IN, US, AF)")
			},
			function(session, results, next) {
				var dstCtry = results.response
				session.dialogData.found = false;
				for ( var i=0; i<len; i++) {
					
					if(cntryCd[i]["Code"] == dstCtry){
						session.dialogData.found = true;
						session.dialogData.dstCtry = dstCtry;
						session.send("Destination Country: " + cntryCd[i]["Name"])
					}
				}
				if (session.dialogData.found == false) {
					//session.end();			// Enter here for dialog reset
					next()
				}
				else {
					next()
				}
			},
			function(session, results) {
				session.Prompts.number(session, "Origin City Pin Code?");
			},
			function(session, results) {
				let orgZip = results.response;
				session.dialogData.orgZip = orgZip;
				session.send("okay")
				session.Prompts.number(session, "Destination City Pin Code?");
			},
			function(session, results) {
				let dstZip = results.response;
				session.dialogData.dstZip = dstZip;
				session.Prompts.text(session,"When do you want to ship it? (Enter Date in yyyy-mm-dd format)");
			},
			function(session, results) {
				let shpDate = results.response;
				session.dialogData.shpDate = shpDate;
				session.Prompts.confirm(session, "Is it a Dutiable Material?");
			},
			function(session, results, next) {
				let dtbl = results.response;
				if(dtbl) {
					session.dialogData.dtbl = "Y";
					session.Prompts.number(session,"Enter Decalred Value (in USD)");
				}
				else {
					session.dialogData.dtbl = "N";
					next()
				}
			},
			function(session, results) {
				if(session.dialogData.dtbl == "Y") {
					session.dialogData.declVal = results.response;
					session.dialogData.declValCur = "USD";
				}
				session.send("Tell me the dimensions of your parcel");
				session.send("Let's first decide the units");
				session.Prompts.choice(session, "Unit for weight", wgtCh);
			},
			function(session, results) {
				session.dialogData.wgtUom = results.response.entity;
				session.Prompts.number(session, "Enter Weight (in " + session.dialogData.wgtUom + ")");
			},
			function(session, results) {
				session.dialogData.declVal = results.response;
				session.Prompts.choice(session, "Unit for lengths", lntCh);	
			},
			function(session, results) {
				session.dialogData.dimUom = results.response.entity;
				session.send("Okay. Got It. Now enter the dimensions in " + session.dialogData.dimUom);
				session.Prompts.number("Length");
			},
			function(session, results) {
				session.dialogData.l0 = results.response;
				session.Prompts.number("Width");
			},
			function(session, results) {
				session.dialogData.w0 = results.response;
				session.Prompts.number("Height");
			},
			function(session, results) {
				session.dialogData.h0 = results.response;
				var obj = {
						dtbl:session.dialogData.dtbl,
						declVal:session.dialogData.declVal,
						declValCur:session.dialogData.declValCur,
						wgtUom:session.dialogData.wgtUom,
						dimUom:session.dialogData.dimUom,
						noPce:1,
						wgt0:session.dialogData.wgt0,
						w0:session.dialogData.w0,
						l0:session.dialogData.l0,
						h0:session.dialogData.h0,
						shpDate:session.dialogData.shpDate,
						orgCtry:session.dialogData.orgCtry,
						orgZip:session.dialogData.orgZip,
						dstCtry:session.dialogData.dstCtry,
						dstZip:session.dialogData.dstZip
					}
				 getRate(obj, (x) => {
					if (x) {
						console.log(x.quotationResponse.count[0])
						qtcount = x.quotationResponse.count[0];
						session.send("I found " + qtcount + " results for your query");
					}
					else {
						console.log("An error");
					}
				})
			}

		]);
};