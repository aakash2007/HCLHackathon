const builder = require('botbuilder')

module.exports = function(bot) {
    bot.dialog('/sendPost', [
        function (session, args, next) {
            session.send('This is sendPost')
        	builder.Prompts.text(session, "Type message for the postcard")
        },
        function(session, results) {
        	session.dialogData.text = results.response
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
	    	if(!session.dialogData.sendPic) {
	    		next()
	    	} else {
		    	session.dialogData.pic = results.response
				builder.Prompts.text(session, "What is the receiver's address")
    		}
    	},
    	function(session, results) {
	    	session.dialogData.address = results.response
		 	let msg = new builder.Message(session);
		    msg.attachmentLayout(builder.AttachmentLayout.carousel)
		    msg.attachments([
		        new builder.HeroCard(session)
		            .title("Postcard")
		            .subtitle("Address: %s", session.dialogData.address)
		            .text("Message: %s", session.dialogData.text)
		            .images([builder.CardImage.create(session, session.dialogData.pic)])
		         
		    ])
		    session.send(msg).endDialog();
	    	// session.endDialog()
    	}
    ]);
};