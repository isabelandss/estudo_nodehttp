

module.exports = function (app) {
    app.get("/pagamentos", function(req, res) {
        console.log("Recebida requisição de teste na porta 3000.");
        res.send("OK");
    });

    app.delete('/pagamentos/pagamento/:id', function(req, res) {
        var pagamento = {};
        var id = req.params.id;

        pagamento.id = id;
        pagamento.status = 'CANCELADO';

        var connection = app.persistencia.connectionFactory();
        var pagamentoDAO = new app.persistencia.PagamentosDAO(connection);

        pagamentoDAO.atualiza(pagamento, function(erro) {
            if(erro) {
                res.status(500).send(erro);
                return;
            }
            console.log("PAGAMENTO CANCELADO");
            res.status(204).send(pagamento);
        });
    });

    app.put('/pagamentos/pagamento/:id', function(req, res) {
        var pagamento = {};
        var id = req.params.id;

        pagamento.id = id;
        pagamento.status = 'CONFIRMADO';

        var connection = app.persistencia.connectionFactory();
        var pagamentoDAO = new app.persistencia.PagamentosDAO(connection);

        pagamentoDAO.atualiza(pagamento, function(erro) {
            if(erro) {
                res.status(500).send(erro);
                return;
            }
            console.log("PAGAMENTO CRIADO");
            res.send(pagamento);
        });

    });

    app.post('/pagamentos/pagamento', function(req, res) {
        req.assert("pagamento.forma_de_pagamento", "Forma de pagamento eh obrigatorio.").notEmpty();
        req.assert("pagamento.valor", "Valor eh obrigatorio e deve ser decimal").notEmpty().isFloat();
        var erros = req.validationErrors();
        if(erros) {
            console.log("Erros de validacao encontrados");
            res.status(500).send(erros);
            return;
        }

        var pagamento = req.body["pagamento"];
        console.log('Processando uma requisição de um novo pagamento');
        pagamento.status = 'CRIADO';
        pagamento.data = new Date;

        var connection = app.persistencia.connectionFactory();
        var pagamentoDAO = new app.persistencia.PagamentosDAO(connection);

        pagamentoDAO.salva(pagamento, function(erro, resultado) {
            if(erro) {
                console.log("ERRO AO INSERIR NO BANCO " + erro);
                res.status(400).send(erro);
            } else {
                pagamento.id = resultado.insertId;
                console.log("PAGAMENTO CRIADO");

                if(pagamento.forma_de_pagamento == 'cartao') {
                    var cartao = req.body["cartao"];
                    console.log(cartao);

                    var clienteCartoes = new app.servicos.clienteCartoes();
                    clienteCartoes.autoriza(cartao, function(exception, request, response, retorno) {
                        if(exception) {
                            console.log(exception);
                            res.status(400).send(exception);
                            return;
                        }

                        //res.location("/pagamentos/pagamento/" + resultado.insertId);
                        
                        var response = {
                            dados_do_pagamento: pagamento,
                            cartao: retorno,
                            links: [
                                {
                                    href: "http://localhost:3000/pagamentos/pagamento/" + pagamento.id,
                                    rel: "CONFIRMAR",
                                    method: "PUT"
                                }, 
                                {
                                    href: "http://localhost:3000/pagamentos/pagamento/" + pagamento.id,
                                    rel: "CANCELAR",
                                    method: "DELETE"
                                }
                            ]
                        }
                        
                        console.log(retorno);
                    });

                    res.status(201).json(cartao);
                    return;
                } else {
                    res.location("/pagamentos/pagamento/" + resultado.insertId);
                    
                    var response = {
                        dados_do_pagamento: pagamento,
                        links: [
                            {
                                href: "http://localhost:3000/pagamentos/pagamento/" + pagamento.id,
                                rel: "CONFIRMAR",
                                method: "PUT"
                            }, 
                            {
                                href: "http://localhost:3000/pagamentos/pagamento/" + pagamento.id,
                                rel: "CANCELAR",
                                method: "DELETE"
                            }
                        ]
                    }
                    res.status(201).json(response);
                }
            }
        });
    });
}


