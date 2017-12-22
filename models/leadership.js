var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var leadersSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
	image: {
		type: String,
		required: true
	},
	designation: {
		type: String,
		required: true
	},
	abbr: {
		type: String,
		required: true
	},
    description: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

// the schema is useless so far
// we need to create a model using it
var Leaders = mongoose.model('Leader', leadersSchema);

// make this available to our Node applications
module.exports = Leaders;