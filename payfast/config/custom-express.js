var express = require('express');
var consign = require('consign');
var bodyParser = require('body-parser');

module.exports = function() {
    var app = express();

    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());

    //passando o conhecimento, mostrando a existência da pasta controllers
    consign()
        .include('controllers')
        .then('persistencia')
        .into(app);

        return app;
}