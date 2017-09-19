var express = require('express');
var consign = require('consign');
var bodyParser = require('body-parser');
var expressvalidator = require('express-validator');

module.exports = function() {
    var app = express();

    //ensinando que os dados serão passados pela url do navegador
    app.use(bodyParser.urlencoded({extended: true}));
    //ensinando que os dados serão em json
    app.use(bodyParser.json());
    app.use(expressvalidator());

    //passando o conhecimento, mostrando a existência da pasta controllers
    consign()
        .include('controllers')
        .then('persistencia')
        .into(app);

        return app;
}