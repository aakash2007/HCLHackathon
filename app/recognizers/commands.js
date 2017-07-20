const unrecognized = {
    entities: [],
    intent: null,
    intents: [],
    score: 0
};

const parse = {
    parse: function (context, text) {
        const parts = text.split(':');
        const command = parts[0];
        //Add composite commands
        console.log('Resolved [%s] as [%s] command', text, command);

        const action = this[command] || this[command.slice(1)];
        if (!action) {
            return unrecognized;
        } else {
            return action.call(this, context, ...parts.slice(1));
        }
    },

    contactHuman: () => ({
        intent: 'contactHuman',
        score: 1
    }),
    convertCurrency: () => ({
        intent: 'convertCurrency',
        score: 1
    }),
    greet: () => ({
        intent: 'greet',
        score: 1
    }),
    locationAvailability: () => ({
        intent: 'locationAvailability',
        score: 1
    }),
    sendPost: () => ({
        intent: 'sendPost',
        score: 1
    }),
    sizeAndPriceGuide: () => ({
        intent: 'sizeAndPriceGuide',
        score: 1
    }),
    trackOrder: () => ({
        intent: 'trackOrder',
        score: 1
    }),
    thankBack: () => ({
        intent: 'thankBack',
        score: 1
    }),
};


module.exports = {
    recognize: function (context, callback) {
        const text = context.message.text;
        if (!text.startsWith('^')) {
            callback.call(null, null, unrecognized);
        } else {
            
            callback.call(null, null, parse.parse(context, text));
        }
    }
};