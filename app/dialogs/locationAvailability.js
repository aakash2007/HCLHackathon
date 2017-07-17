const builder = require('botbuilder');
const citiesAndCountries = require('../../data/citiesAndCountries.json')

function capitalizeFirstLetter(s) {
    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

module.exports = function(bot) {
    bot.dialog('/locationAvailability', [
        
        function (session, args, next) {
    		builder.Prompts.text(session, 'What is your country name?');
        },

        function(session, results) {
     	 	let country = capitalizeFirstLetter(results.response)
	    	if(citiesAndCountries[country]) {
	    		session.userData.country = country
	    		builder.Prompts.text(session, 'What is your city name?');
	    	} else {
		    	session.send('Sorry! we will be available in your country soon')
		    	session.endDialog()	    	
		    }	
    	},

    	function(session, results) {
	    	let country = session.userData.country
	    	let city = capitalizeFirstLetter(results.response)
	       	if((citiesAndCountries[country]).includes(city)) {
				session.send('Yay! we are available in your city')
    			session.endDialog()
	    	} else {
	    		session.send('Sorry! we will be available in your city soon')
    			session.endDialog()
	    	}
    	}
    ])
	.reloadAction(
	    "restart", "Ok. Let's start over.",
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
}