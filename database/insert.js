const db = require('./_database');

async function endereco(endereco){
    const query = 'INSERT INTO endereco(endereco,bairro,cidade_id,cep,telefone,endereco2,is_loja) VALUES ($1,$2,$3,$4,$5,$6,$7)';
    const values = [endereco.endereco,endereco.bairro,endereco.cidade,endereco.cep,endereco.telefone,'Não tem', true];
    const e = await db.query(query,values);
    const enderecoCadastrado = await db.query('SELECT * FROM endereco order by endereco_id desc limit 1');
    const enderecoR = enderecoCadastrado.rows;
    return enderecoR[0].endereco_id;
}

async function loja(loja){
    const query = 'INSERT INTO loja(gerente_id,endereco_id,ultima_atualizacao) VALUES($1,$2,$3)';
    const values = [loja.gerente_id,loja.endereco_id,new Date().toLocaleString()];
    console.log(values)
    const e = await db.query(query,values)
    console.log('aqui')

    console.log(e)
    return e;
}

module.exports = { endereco,loja}