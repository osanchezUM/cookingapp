// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var recipeSchema = new Schema({
    name: {
        type: String,
        required: true
    },
	image: {
		type: String,
		required: true
	},
	servings: {
		type: Number,
		required: true
	},
	time: {
		type: Number,
		required: true
	},
	level: {
		type: String,
		required: true
	},
	keywords: {
		type: [String],
		required: false
	},
    author: {
        type: String,
        required: false
    },
	ingredients: {
        type: String,
        required: true
    },
    directions: {
        type: String,
        required: true
    },
}, {
    timestamps: true
});

// the schema is useless so far
// we need to create a model using it
var Recipes = mongoose.model('Recipe', recipeSchema);

// make this available to our Node applications
module.exports = Recipes;
