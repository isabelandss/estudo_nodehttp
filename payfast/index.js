//a variável app está carragando todo o código que está no custon-express.
//por esse motivo, se não colocarmos o () no final, ele não reconhece que tem uma função
//e dá erro.
var app = require("./config/custom-express")();

//define que estou ouvindo uma determinada porta
app.listen(3000, function() {
    console.log('Servidor rodndo na porta 3000');
});