var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Recipes = require('../models/recipes');

var recipeRouter = express.Router();
recipeRouter.use(bodyParser.json());

recipeRouter.route('/')
.get(function (req, res, next) {
    /* OSCAR: I use find(req.query) instead of find({}) to allow queries by using the URL parameters) */
    var q = req.query;
     Recipes.find(q, function (err, recipe) {
        if (err) throw err;
        res.json(recipe);
    });
})

.post(function (req, res, next) {
    Recipes.create(req.body, function (err, recipe) {
        if (err) throw err;
        
        console.log('Recipe created: ' + recipe._id);
        /*
        res.writeHead(200, {
            'Content-Type': 'text/plain'
        });
        res.end('Added the recipe with id: ' + id);
        */
        res.json(recipe);
    });
})

.delete(function (req, res, next) {
    Recipes.remove({}, function (err, resp) {
        if (err) throw err;
        res.json(resp);
    });
});

recipeRouter.route('/:recipeId')
.get(function (req, res, next) {
    Recipes.findById(req.params.recipeId, function (err, recipe) {
        if (err) throw err;
        res.json(recipe);
    });
})

.put(function (req, res, next) {
    Recipes.findByIdAndUpdate(req.params.recipeId, {
        $set: req.body
    }, {
        new: true
    }, function (err, recipe) {
        if (err) throw err;
        res.json(recipe);
    });
})

.delete(function (req, res, next) {
    Recipes.findByIdAndRemove(req.params.recipeId, function (err, resp) {        if (err) throw err;
        res.json(resp);
    });
});

module.exports = recipeRouter;