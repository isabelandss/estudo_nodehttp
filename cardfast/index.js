//a variável app está carragando todo o código que está no custon-express.
//por esse motivo, se não colocarmos o () no final, ele não reconhece que tem uma função
//e dá erro.
var app = require("./config/custom-express")();

//define que estou ouvindo uma determinada porta
app.listen(3001, function() {
    console.log('Servidor rodando na porta 3001');
});