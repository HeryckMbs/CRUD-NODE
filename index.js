/* 
    Criando servidor 
*/
const db = require('./database/_database')
const express =  require('express');
const app = express();
const select = require('./database/select')


app.set("view engine", "ejs");
app.listen('3000');
app.use(express.static("public"))
db.connect();
/* 
    ROTAS
*/

app.route('/').get(async (req,res) => {
    const categoria =  await select.categorias();
    res.render("pages/index",
    {categorias : categoria})
});

app.route('/categoria/:id').get(async (req,res) => {
    const filmes = await select.filmes_categoria(req.params.id)
    res.render("pages/categoria",
    {
        filmes: filmes.filmes, 
        categoria : filmes.categoria[0].nome
    })
})

app.route('/detalhes/:id').get(async (req,res) =>{
    const filme = await select.filme(req.params.id);
    const atores = await select.atores_filme(req.params.id)

    res.render("pages/detalhes",
    {filme: filme, atores : atores}
    )
});

//middleware
app.use(express.json())
let nome = "Heryck ";

app.route('/post').post(function(req,res){
    res.send(req.body.content)
});

app.route('/put').put(function(req,res){
    nome += req.body.nome
    res.send(nome)
});

app.route('/delete/:id').delete( function(req,res) {
    nome = "";
    res.send(req.params.id);

});
