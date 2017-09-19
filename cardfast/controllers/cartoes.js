module.exports = function(app) {
    app.post("/cartoes/autoriza", function(req, res) {
        console.log("PROCESSANDO PAGAMENTO COM CARTÃO");

        var cartao = req.body;

        req.assert("numero", "Numero eh obrigatório e deve ter 16 caracteres").notEmpty().len(16, 16);
        req.assert("bandeira", "Bandeira do cartão é obrigatória").notEmpty();
        req.assert("ano_de_expiracao", "Ano de expiração é obrigatória e deve ter 4 caracteres.").notEmpty();
        req.assert("mes_de_expiracao", "Mes de expiração é obrigatória e deve ter 2 caracteres.").notEmpty();
        req.assert("cvv", "CVV é obrigatória");

        var erros = req.validationErrors();

        if(erros) {
            console.log("ERROS DE VALIDAÇÃO ENCONTRADOS");
            res.status(400).send(erros);
            return;
        }
        cartao.status = 'AUTORIZADO';

        var response = {
            dados_do_cartao: cartao
        }

        res.status(201).json(response);
        return;

    });
}