const db = require('./_database');

async function paises(letra) {
    let resultado = await db.query(`SELECT * FROM pais WHERE pais like '${letra}%'`)
    return resultado.rows;
}

async function categorias() {
    let result = await db.query(`SELECT categoria_id,nome,description FROM categoria ORDER BY nome`);
    return result.rows
}

async function filmes_categoria(id_categoria) {
    let filmes = await db.query(`select f.filme_id ,f.titulo, f.descricao from filme f
    inner join filme_categoria fc on f.filme_id = fc.filme_id 
    where fc.categoria_id = ${id_categoria}`)

    let categoria = await db.query(`SELECT nome FROM categoria WHERE categoria_id = ${id_categoria}`);

    return {
        filmes: filmes.rows,
        categoria: categoria.rows
    };
}

async function filme(id_filme) {
    const filme = await db.query(`SELECT * from filme WHERE filme_id = ${id_filme}`);
    return filme.rows
}


async function atores_filme(id_filme) {
    const atores = await db.query(
    `select a.ator_id, a.primeiro_nome, a.ultimo_nome 
     from filme f 
     inner join filme_ator fa on fa.filme_id  = f.filme_id 
    inner join ator a on a.ator_id = fa.ator_id 
    where f.filme_id = ${id_filme};
    `)
    return atores.rows
}

async function lojas(){
    const lojas = await db.query(`select l.loja_id, e.endereco, e.bairro,c.cidade,f.primeiro_nome, f.ultimo_nome, f.email  from loja l inner join endereco e on e.endereco_id = l.endereco_id 
    inner join funcionario f on f.funcionario_id = l.gerente_id 
    inner join cidade c on c.cidade_id = e.cidade_id ;`)
    return lojas.rows;
}

async function loja(idLoja){
    const query = 'SELECT * FROM loja where "loja_id = $1';
    const value = [idLoja];
    const operation = await db.query(query,value);
    return operation.rows; 
}
async function cidades(){
    const cidades = await db.query(`SELECT cidade_id,cidade from cidade`);
    return cidades.rows;
}
async function funcionarios(){
    const funcionarios = await db.query(`SELECT funcionario_id,primeiro_nome,ultimo_nome from funcionario`);
    return funcionarios.rows;
}


module.exports = { paises, categorias, filmes_categoria, filme, atores_filme, lojas, cidades, funcionarios}