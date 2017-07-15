const builder = require('botbuilder')
const async = require('async')

const packaging = require('../../data/packaging.json')


const findSuitablePackage = (l, b, h, cb) => {
	let found = false
	let name = 'not found'
	
	let loop = (key, done) => {
		let val = packaging[key];
		
		if(!found && val.l>=l && val.b >=b && val.h>=h) {
			found = true
			name = val.name
		}
		done()
	} 

	let doneLoop = () => {
		cb(name)
	}

	async.each(Object.keys(packaging), loop, doneLoop)
}


module.exports = function(bot) {
    bot.dialog('/sizeAndPriceGuide', [
        
        function (session, args, next) {
        	session.send('This is sizeAndPriceGuide')
    		builder.Prompts.number(session, 'Enter the length of parcel in cms?');
        },

        function(session, results) {
        	session.dialogData.length = results.response
        	builder.Prompts.number(session, 'Enter the breadth of parcel in cms?');
    	},

    	function(session, results) {
	        session.dialogData.breadth = results.response
	    	builder.Prompts.number(session, 'Enter the height of parcel in cms?');
    	},

      	function(session, results) {
	    	session.dialogData.height = results.response
	    	let l = session.dialogData.length
	    	let b = session.dialogData.breadth
	    	let h = session.dialogData.height
	    	findSuitablePackage(l, b, h, (suitablePackage) => {
	    		if(suitablePackage === 'not found') {
		    		session.send('There is no suitable package for your parcel')
		    	} else {
		    		session.send('%s is suitable for your parcel', suitablePackage)
		    	}
		    	session.endDialog()
	    	})
    	}
    ]);
};