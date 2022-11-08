const db = require('./_database');

async function loja(id_loja){
    const query = 'DELETE FROM loja WHERE loja_id ($1)';
    const values = [id_loja];
    const e = await db.query(query,values);
    console.log(e)
}

module.exports = {}