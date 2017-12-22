// 
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var favouriteSchema = new Schema({
    user:  {
        type: String,
        required: true
    },
    recipes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recipe'
    }]
}, {
    timestamps: true
});


// the schema is useless so far
// we need to create a model using it
var Favourites = mongoose.model('Favourite', favouriteSchema);

// make this available to our Node applications
module.exports = Favourites;
