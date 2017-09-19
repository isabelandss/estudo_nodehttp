var soap = require('soap');

soap.createClient('http://ws.correios.com.br/calculador/CalcPrecoPrazo.asmx?wsdl', function(erro, cliente) {
    console.log("CLIENTE SOAP CRIADO");

    cliente.calcPrazo({'':''}, function(err, resultado) {
        console.log(resultado);
    });
});