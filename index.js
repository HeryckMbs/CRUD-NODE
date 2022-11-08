/* 
    Criando servidor 
*/
const db = require('./database/_database')
const express = require('express');
const app = express();
const select = require('./database/select')
const insert = require('./database/insert');

const router = express.Router();
app.use(express.urlencoded());

app.set("view engine", "ejs");
app.listen('3000');

app.use('/public',express.static(__dirname+"/public"))
app.use('/node_modules',express.static(__dirname+"/node_modules"))
db.connect();
/* 
    ROTAS
*/
app.use(express.json())

async function  lojas(res,success){
    const lojas = await select.lojas();
    const cidades = await select.cidades();
    const funcionarios = await select.funcionarios();
    res.render("pages/lojas",
        {
            lojas: lojas,
            cidades: cidades,
            funcionarios: funcionarios,
            success : success
        }
    );
}
app.route('/lojas/salvar').post(async (req,res)=> {
    try{
        const endereco = {
            'endereco' : req.body.rua,
            'bairro' : req.body.bairro,
            'cidade' : parseInt(req.body.cidade),
            'cep' : req.body.cep,
            'telefone' : req.body.telefone
        }
        const endereco_novo = await insert.endereco(endereco);
        const loja = {
                    'gerente_id' : parseInt(req.body.funcionario),
                    'endereco_id' : endereco_novo
        }
        await insert.loja(loja)
        lojas(res,true)
    }catch(error){
            lojas(false)
    } 
})

app.route('/').get(async (req, res) => {
    const categoria = await select.categorias();
    res.render("pages/index",
        { categorias: categoria })
});

app.route('/lojas').get(async (req, res) => {
    lojas(res,'normal')
});




app.route('/categoria/:id').get(async (req, res) => {
    const filmes = await select.filmes_categoria(req.params.id)
    res.render("pages/categoria",
        {
            filmes: filmes.filmes,
            categoria: filmes.categoria[0].nome
        })
})

app.route('/detalhes/:id').get(async (req, res) => {
    const filme = await select.filme(req.params.id);
    const atores = await select.atores_filme(req.params.id)

    res.render("pages/detalhes",
        { filme: filme, atores: atores }
    )
});

//middleware
let nome = "Heryck ";
app.route('/post').post(function (req, res) {
    res.send(req.body.content)
});

app.route('/put').put(function (req, res) {
    nome += req.body.nome
    res.send(nome)
});

app.route('/delete/:id').delete(function (req, res) {
    nome = "";
    res.send(req.params.id);

});
