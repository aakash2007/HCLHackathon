const builder = require('botbuilder')

module.exports = function(bot) {
    bot.dialog('/sendPost', [
        function (session, args, next) {
            session.send('This is sendPost')
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
	    	session.dialogData.address = results.response
		 	let msg = new builder.Message(session);
		    msg.attachmentLayout(builder.AttachmentLayout.carousel)
		    msg.attachments([
		        new builder.HeroCard(session)
		            .title("Postcard")
		            .subtitle("Address: %s", session.dialogData.name + "," + session.dialogData.address)
		            .text("Message: %s", session.dialogData.text)
		            .images([builder.CardImage.create(session, session.dialogData.pic)])
		         
		    ])
		    session.send(msg).endDialog();
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