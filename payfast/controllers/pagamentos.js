

module.exports = function (app) {
    app.get("/pagamentos", function(req, res) {
        console.log("Recebida requisição de teste na porta 3000.");
        res.send("OK");
    });

    app.post('/pagamentos/pagamento', function(req, res) {
        var pagamento = req.body;
        console.log('Processando uma requisisção de um novo pagamento');
        pagamento.status = 'CRIADO';
        pagamento.data = new Date;

        var connection = app.persistencia.connectionFactory();
        var pagamentoDAO = new app.persistencia.PagamentosDAO(connection);

        pagamentoDAO.salva(pagamento, function(erro, resultado) {
            console.log("PAGAMENTO CRIADO");
            res.json(pagamento);
        });
    });
}


