const db = require('./_database');

async function loja(id_loja){
    const client = await db.connect();

    console.log('excluiraa')

    const query = 'DELETE FROM loja WHERE "loja_id" = $1';
    const values = [id_loja];
    const e = await db.query(query,values);
    console.log(e.rowCount == 1 ? true : false)
    return e;
}

module.exports = {loja}