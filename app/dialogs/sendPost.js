const builder = require('botbuilder')

module.exports = function(bot) {
    bot.dialog('/sendPost', [
        function (session, args, next) {
            session.send("Let's get your post card ready");
        	builder.Prompts.text(session, "Type message for the postcard")
        },
        function(session, results) {
        	session.dialogData.text = results.response
        	builder.Prompts.text(session, "What's the recipient's name?");
    	},
        function(session, results) {
            session.dialogData.name = results.response
            builder.Prompts.confirm(session, "Do you want to send picture with it?");
        },
        function(session, results, next) {
        	session.dialogData.sendPic = results.response
            if(results.response) {
	        	builder.Prompts.attachment(session, "Upload a picture for postcard.")
        	} else {
        		next()
        	}
    	},
    	function(session, results, next) {
	    	if(session.dialogData.sendPic) {
	    		session.dialogData.pic = results.response
            }
			builder.Prompts.text(session, "What is the receiver's address")
    	},
        function(session, results) {
            session.dialogData.address = results.response;
            builder.Prompts.number(session,"What's the receiver's pin code?")
        },
    	function(session, results) {
	    	session.dialogData.pinCd = results.response
            session.send("Okay! We will get it delivered to " + session.dialogData.name.split(" ")[0]);
            session.send("\n\nAddress: " + session.dialogData.address + " " + session.dialogData.pinCd + "\n\n" + "\n\n" + session.dialogData.text);
	    	// session.endDialog()
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
};