/* 
    Criando servidor 
*/
const db = require('./database/_database')
const express = require('express');
const app = express();
const select = require('./database/select')
const insert = require('./database/insert');
const delet = require('./database/delete');
let ejs = require('ejs');
const fs = require('fs');
const path = require('path');
app.use(express.urlencoded());

app.set("view engine", "ejs");
app.listen('3000');

app.use('/public', express.static(__dirname + "/public"))
app.use('/node_modules', express.static(__dirname + "/node_modules"))
app.use('/views', express.static(__dirname + "/views"))
db.connect();


//Função para adicionar conteúdo de uma view em um modal gerado via request ajax
//transforma o formulario a ser renderizado no modal em string e retorna para a request
async function sendHtml(path, data) {
    let pathView = `views/${path}.ejs`
    let view = await ejs.render(fs.readFileSync(pathView, { encoding: 'utf8' }),
        {
            data: data,
        },
        { async: true })

    return view;
}


/* 
    ROTAS
*/
app.use(express.json())

/**
 * 
 * 
 * ROTAS GERAIS
 * 
 */
app.route('/').get(async (req, res) => {
    const categoria = await select.categorias();
    res.render("pages/index",
        { categorias: categoria })
});

app.route('/categoria/:id').get(async (req, res) => {
    const filmes = await select.filmes_categoria(req.params.id)
    res.render("pages/categoria",
        {
            filmes: filmes.filmes,
            categoria: filmes.categoria[0].nome
        })
})


app.route('/categorias').get(async (req, res) => {
    const categorias = await select.categorias()
    res.send(categorias);
});
app.route('/filmescategoria/:id').get(async (req, res) => {
    const filmes = await select.filmes_categoria(req.params.id)
    res.send(filmes);
});

app.route('/detalhes/:id').get(async (req, res) => {
    const filme = await select.filme(req.params.id);
    const atores = await select.atores_filme(req.params.id)

    res.render("pages/detalhes",
        { filme: filme, atores: atores }
    )
});

/*

ROTAS DE LOJAS

*/
async function lojas(res, success, messageOperation, idLojaEdit) {
    const lojas = await select.lojas();
    const cidades = await select.cidades();
    const funcionarios = await select.funcionarios();


    res.render("pages/lojas",
        {
            lojas: lojas,
            cidades: cidades,
            funcionarios: funcionarios,
            success: success,
            message: messageOperation,
        }
    );
}
app.route('/lojas/salvar').post(async (req, res) => {
    try {
        const endereco = {
            'endereco': req.body.rua,
            'bairro': req.body.bairro,
            'cidade': parseInt(req.body.cidade),
            'cep': req.body.cep,
            'telefone': req.body.telefone
        }
        const endereco_novo = await insert.endereco(endereco);
        const loja = {
            'gerente_id': parseInt(req.body.funcionario),
            'endereco_id': endereco_novo
        }
        await insert.loja(loja)
        lojas(res, true, 'Loja cadastrada com sucesso!')
    } catch (error) {
        lojas(res, false, 'Não foi possível cadastrar sua loja')
    }
})

app.route('/lojadelete').delete(async (req, res) => {
    try {
        await delet.loja(req.body.idLoja)
        lojas(res, true, 'Loja excluida com sucesso!')
    } catch (err) {
        lojas(res, false, 'Não foi possível excluir sua loja')
    }
})

app.route('/lojas').get(async (req, res) => {
    lojas(res, 'normal')
});


app.route('/lojamodal/:idLoja?').get(async function (req, res) {
    const cidades = await select.cidades();
    const funcionarios = await select.funcionarios();
    if (req.params.idLoja != 0) {
        const loja = await select.loja(req.params.idLoja);
        res.render('partials/modalLoja', {
            cidades: cidades,
            funcionarios: funcionarios,
            loja: loja.loja,
            endereco: loja.endereco[0],

        })
    } else {
        res.render('partials/modalLoja', {
            cidades: cidades,
            funcionarios: funcionarios,
        })
    }

});


app.route('/filmes').get((req, res) => res.render("pages/filmes"));



app.route('/formFilme').post(async (req, res) => {
    const pathView = `pages/filme_form`
    const filme = await select.filme(3)
    const idiomas = await select.idiomas();

    res.render("partials/modal_default",
        {
            content: await sendHtml(pathView, { filme, idiomas }),
            size: req.body.size,
            title: req.body.title,
        })

})




