const builder = require('botbuilder')
const async = require('async')

const packaging = require('../../data/packaging.json')


const findSuitablePackage = (l, b, h, cb) => {
	let found = false
	let name = 'not found'
	let anskey = 'not found'

	let loop = (key, done) => {
		let val = packaging[key];
		
		if(!found && val.l>=l && val.b >=b && val.h>=h) {
			found = true
			name = val.name
			anskey = key
		}
		done()
	} 

	let doneLoop = () => {
		cb(name, anskey)
	}

	async.each(Object.keys(packaging), loop, doneLoop)
}


module.exports = function(bot) {
    bot.dialog('/sizeAndPriceGuide', [
        
        function (session, args, next) {
    		builder.Prompts.number(session, 'What is the length of parcel (in cms)?');
        },

        function(session, results) {
        	session.dialogData.length = results.response
        	builder.Prompts.number(session, 'Enter the breadth of parcel (in cms)');
    	},

    	function(session, results) {
	        session.dialogData.breadth = results.response
	    	builder.Prompts.number(session, 'Finally, What is the height of parcel (in cms)?');
    	},

      	function(session, results) {
	    	session.dialogData.height = results.response
	    	let l = session.dialogData.length
	    	let b = session.dialogData.breadth
	    	let h = session.dialogData.height
	    	findSuitablePackage(l, b, h, (suitablePackage, anskey) => {
	    		session.dialogData.anskey = anskey
	    		if(suitablePackage === 'not found') {
		    		session.send('There is no suitable package for your parcel')
		    		session.endDialog()
		    	} else {
		    		session.send('%s is suitable for your parcel', suitablePackage)
					builder.Prompts.choice(session, "Which region?", "UK|EU|NONEU|US|REST", builder.ListStyle.button);
		    	}
    		})
    	},
    	function(session, results) {
    		if(results.response){
    			let anskey = session.dialogData.anskey
    			let region = results.response.entity
    			let data = packaging[anskey]
    			data = data.price
    			session.send("This costs %s euros", data[region])
    		}
    		session.endDialog();
    	}
    ])
    .reloadAction(
	    "restart", "Ok. Let's start over?",
	    {
	        matches: /^start over$/i,
	        confirmPrompt: "This will start over. Are you sure?"
	    }
	)
	.cancelAction(
	    "cancel", "How can I help you.", 
	    {
	        matches: /^cancel$/i,
	        confirmPrompt: "This will cancel. Are you sure?"
	    }
	)
};