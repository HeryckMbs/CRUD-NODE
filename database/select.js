const db = require('./_database');
async function paises(letra) {

    let resultado = await client.query(`SELECT * FROM pais WHERE pais like '${letra}%'`)
    return resultado.rows;
}

async function categorias() {const client = await db.connect();

    let result = await client.query(`SELECT categoria_id,nome,description FROM categoria ORDER BY nome`);
    return result.rows
}

async function filmes_categoria(id_categoria) {const client = await db.connect();

    let filmes = await client.query(`select f.filme_id ,f.titulo, f.descricao from filme f
    inner join filme_categoria fc on f.filme_id = fc.filme_id 
    where fc.categoria_id = ${id_categoria}`)

    let categoria = await client.query(`SELECT nome FROM categoria WHERE categoria_id = ${id_categoria}`);

    return {
        filmes: filmes.rows,
        categoria: categoria.rows
    };
}

async function filme(id_filme) {const client = await db.connect();

    const filme = await client.query(`SELECT * from filme WHERE filme_id = ${id_filme}`);
    return filme.rows
}


async function idiomas(){const client = await db.connect();

    const idiomas = await client.query('select idioma_id,nome from idioma')
    return idiomas.rows;
}



async function atores_filme(id_filme) {const client = await db.connect();

    const atores = await client.query(
    `select a.ator_id, a.primeiro_nome, a.ultimo_nome 
     from filme f 
     inner join filme_ator fa on fa.filme_id  = f.filme_id 
    inner join ator a on a.ator_id = fa.ator_id 
    where f.filme_id = ${id_filme};
    `)
    return atores.rows
}

async function lojas(){const client = await db.connect();

    const lojas = await client.query(`select l.loja_id, e.endereco, e.bairro,c.cidade,f.primeiro_nome, f.ultimo_nome, f.email  from loja l inner join endereco e on e.endereco_id = l.endereco_id 
    inner join funcionario f on f.funcionario_id = l.gerente_id 
    inner join cidade c on c.cidade_id = e.cidade_id ;`)
    return lojas.rows;
}

async function loja(idLoja){const client = await db.connect();

    const query = 'SELECT * FROM loja where "loja_id" = $1';
    const value = [idLoja];
    const operation = await client.query(query,value);
    const queryEndereco = 'SELECT endereco,bairro,cep,telefone from endereco WHERE "endereco_id" = $1';
    const valuesEndereco = [operation.rows[0].endereco_id]; 
    const endereco = await client.query(queryEndereco,valuesEndereco);
    return {loja: operation.rows, endereco: endereco.rows}; 
}
async function cidades(){const client = await db.connect();

    const cidades = await client.query(`SELECT cidade_id,cidade from cidade`);
    return cidades.rows;
}
async function funcionarios(){const client = await db.connect();

    const funcionarios = await client.query(`SELECT funcionario_id,primeiro_nome,ultimo_nome from funcionario`);
    return funcionarios.rows;
}


module.exports = { paises, categorias, filmes_categoria, filme, atores_filme, lojas, cidades, funcionarios,loja,idiomas}