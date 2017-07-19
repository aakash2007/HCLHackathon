var http = require('http');
var qs = require('querystring');
var xml2js = require('xml2js');
module.exports = (options) => {
    return new Promise((resolve, reject) => {
        var url = "http://dct.dhl.com/data/quotation/?" + qs.stringify(options);
        var body = "";
        http.get(url, function(res) {
            res.on('data', data => body += data);
            res.on('end', () => {
                xml2js.parseString(body, (err, result) => {
                    if(err) reject(err);
                    else resolve(result);
                })
            });
            res.on('error', err => reject(err));

        })
    })
}

/***********************INPUT**********************/
// dtbl:Y - Is It Dutiable Material?
// declVal:10 - What is its Declared Value (If Dutiable)?
// declValCur:INR - Currecny Of Declared Value 
// wgtUom:kg - What is it's weight's unit? (Make it default "kg")
// dimUom:cm - What is it's dimension's unit? (Make it default "cm")
// noPce:1 - Number of Pieces
// wgt0:1 - Weight of Item
// w0:15 - Widht of First Piece
// l0:15 - Lenth of First Piece
// h0:15 - Height Of First Piece
// w1 - Width of Second Piece ans so on.....
// shpDate:2017-07-28 - Date of Shipping
// orgCtry:IN - Origin Country Code
// orgCity:JAIPUR - Origin City (Ignore It - Ask for Zip Only)
// orgSub: (Ignore For Now)
// orgZip:302001 - Origin Zip Code
// dstCtry:US - Destination Country
// dstCity:NEW YORK - Destination City (Ignore It - Ask for Zip Only)
// dstSub: (Ignore For Now)
// dstZip:10000 - Destination Zip Code


/**************************OUTPUT****************************/
// {
//     "count":"4",
//     "dctWsDuration":"4555",
//     "displayPrices":"Y",
//     "fastEDDDisclaimer":"",
//     "pieceInfoCount":"1",
//     "pieceInfoList":{
//         "pieceInfo":{
//             "h":"15",
//             "id":"0",
//             "l":"15",
//             "w":"15",
//             "wgt":"1"
//         }
//     },
//     "quotationList":
//         {
//             "quotation":
//                 [
//                     {
//                         "displayPrices":"N",
//                         "doNotShowProduct":"false",
//                         "estDeliv":"Tuesday, 1 August 2017, by 10:30",
//                         "globalProdCd":"M",
//                         "latBkg":"17:00",
//                         "latPckp":"19:00",
//                         "optServiceList":{
//                             "optService":[
//                                 {"srvcCode":"DD","srvcName":"DUTIES & TAXES PAID"},
//                                 {"srvcCode":"II","srvcName":"SHIPMENT INSURANCE"},
//                                 {"srvcCode":"GG","srvcName":"PACKAGING ITEM"}
//                             ]
//                         },
//                         "pickupWindowEnd":"19:00",
//                         "prodNm":"EXPRESS 10:30",
//                         "quotationServiceList":{
//                             "quotationService":[
//                                 {"priceAvailable":"false","srvCd":"M","srvNm":"EXPRESS 10:30"},
//                                 {"priceAvailable":"false","srvCd":"YJ","srvNm":"10:30 PREMIUM"}
//                             ]
//                         },
//                         "volWgt":"1 kg"
//                     },
//                     {
//                         "displayPrices":"Y",
//                         "doNotShowProduct":"false",
//                         "estDeliv":"Tuesday, 1 August 2017, by 12:00",
//                         "estTotPrice":"INR6,507.94",
//                         "globalProdCd":"Y",
//                         "latBkg":"17:00",
//                         "latPckp":"19:00",
//                         "optServiceList":{
//                             "optService":[
//                                 {"srvcCode":"DD","srvcName":"DUTIES & TAXES PAID"},
//                                 {"srvcCode":"II","srvcName":"SHIPMENT INSURANCE"},
//                                 {"srvcCode":"WQ","srvcName":"CERTIFICATE OF ORIGIN"},
//                                 {"srvcCode":"GG","srvcName":"PACKAGING ITEM"}
//                             ]
//                         },
//                         "pickupWindowEnd":"19:00",
//                         "prodNm":"EXPRESS 12:00",
//                         "quotationServiceList":{
//                             "quotationService":[
//                                 {"priceAndTax":"INR4,479.28","priceAvailable":"true","srvCd":"Y","srvNm":"EXPRESS 12:00","tax":"INR683.28","totAmt":"INR6,507.94","totTxAmt":"INR992.74"},
//                                 {"priceAndTax":"INR1,084.66","priceAvailable":"false","srvCd":"FC","srvNm":"","tax":"INR165.46"},
//                                 {"priceAndTax":"INR944.00","priceAvailable":"false","srvCd":"YK","srvNm":"12:00 PREMIUM","tax":"INR144.00"}
//                             ]
//                         },
//                         "totTax":"INR992.74",
//                         "volWgt":"1 kg"
//                     },
//                     {
//                         "displayPrices":"Y",
//                         "doNotShowProduct":"false",
//                         "estDeliv":"Tuesday, 1 August 2017, by the end of the day","estTotPrice":"INR5,375.14","globalProdCd":"P","latBkg":"17:00","latPckp":"19:00","optServiceList":{"optService":[{"srvcCode":"DD","srvcName":"DUTIES & TAXES PAID"},{"srvcCode":"II","srvcName":"SHIPMENT INSURANCE"},{"srvcCode":"WQ","srvcName":"CERTIFICATE OF ORIGIN"},{"srvcCode":"GG","srvcName":"PACKAGING ITEM"}]},"pickupWindowEnd":"19:00","prodNm":"EXPRESS WORLDWIDE","quotationServiceList":{"quotationService":[{"priceAndTax":"INR4,479.28","priceAvailable":"true","srvCd":"P","srvNm":"EXPRESS WORLDWIDE","tax":"INR683.28","totAmt":"INR5,375.14","totTxAmt":"INR819.94"},{"priceAndTax":"INR895.86","priceAvailable":"false","srvCd":"FC","srvNm":"","tax":"INR136.66"}]},"totTax":"INR819.94","volWgt":"1 kg"},{"displayPrices":"Y","doNotShowProduct":"false","estDeliv":"Tuesday, 1 August 2017, by the end of the day","estTotPrice":"INR8,283.60","globalProdCd":"J","latBkg":"17:00","latPckp":"19:00","optServiceList":{"optService":{"srvcCode":"II","srvcName":"SHIPMENT INSURANCE"}},"pickupWindowEnd":"19:00","prodNm":"EXPRESS JUMBO","quotationServiceList":{"quotationService":[{"priceAndTax":"INR6,903.00","priceAvailable":"true","srvCd":"J","srvNm":"EXPRESS JUMBO","tax":"INR1,053.00","totAmt":"INR8,283.60","totTxAmt":"INR1,263.60"},{"priceAndTax":"INR1,380.60","priceAvailable":"false","srvCd":"FC","srvNm":"","tax":"INR210.60"}]},"totTax":"INR1,263.60","volWgt":"1 kg"}]}}