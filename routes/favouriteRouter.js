var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Favourites = require('../models/favourites');

var favouriteRouter = express.Router();
favouriteRouter.use(bodyParser.json());

favouriteRouter.route('/')
.get(function (req, res, next) {
    Favourites.find({}, function (err, favs) {
        if (err) throw err;
        res.json(favs);
    });
})

.post(function (req, res, next) {
    Favourites.create(req.body, function (err, favs) {
        if (err) throw err;
        res.json(favs);
    });
})

.delete(function (req, res, next) {
    Favourites.remove({}, function (err, resp) {
        if (err) throw err;
        res.json(resp);
    });
});

/* Gets a username and all the data of his/her favourite recipes */
favouriteRouter.route('/:username')
.get(function (req, res, next) {
    Favourites.findOne({user:req.params.username})
        .populate('recipes')
        .exec(function (err, favs) {
            if (err) throw err;
            res.json(favs);
        });
})

/* This operation updates the recipe set of a user or creates it if it does not exist. 
    It ensures that the recipe is unique (it is a set) 
    The operation receives the following parameters in the body of the PUT request: username, recipeId */
.put(function (req, res, next) {
    Favourites.update(
        {user: req.params.username}, 
        {$addToSet: {recipes: req.body.recipeId}},
        {upsert: true},
        function (err, favs) {
            if (err) throw err;
            res.json(favs);
        }
    )
})

/* Removes a recipe from the favourites (a recipe set) of a user
    The parameters of this operation are username (URL parameter) and recipeId (query parameter) */
.delete(function (req, res, next) {
    Favourites.update(
        {user: req.params.username}, 
        {$pull: {recipes: req.query.recipeId}},
        function (err, favs) {
            if (err) throw err;
            res.json(favs);
        }
    )
});


module.exports = favouriteRouter;