var express = require('express');

module.exports = function() {
    var router = express.Router({mergeParams: true});

    var sayHello = function(name){
        return "Hello " + name
    }

    router.get('/', function(req, res) {
        res.render('index.ejs')
    });

    return {
        routes: router
    };
}