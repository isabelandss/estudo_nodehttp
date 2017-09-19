

module.exports = function (app) {
    app.get("/pagamentos", function(req, res) {
        console.log("Recebida requisição de teste na porta 3000.");
        res.send("OK");
    });

    app.post('/pagamentos/pagamento', function(req, res) {
        req.assert("forma_de_pagamento", "Forma de pagamento eh obrigatorio.").notEmpty();
        req.assert("valor", "Valor eh obrigatorio e deve ser decimal").notEmpty().isFloat();
        var erros = req.validationErrors();
        if(erros) {
            console.log("Erros de validacao encontrados");
            res.status(500).send(erros);
            return;
        }

        var pagamento = req.body;
        console.log('Processando uma requisisção de um novo pagamento');
        pagamento.status = 'CRIADO';
        pagamento.data = new Date;

        var connection = app.persistencia.connectionFactory();
        var pagamentoDAO = new app.persistencia.PagamentosDAO(connection);

        pagamentoDAO.salva(pagamento, function(erro, resultado) {
            if(erro) {
                console.log("ERRO AO INSERIR NO BANCO " + erro);
                res.status(400).send(erro);
            } else {
                console.log("PAGAMENTO CRIADO");
                res.location("/pagamentos/pagamento/" + resultado.insertId);
                res.status(201).json(pagamento);
            }
        });
    });
}


