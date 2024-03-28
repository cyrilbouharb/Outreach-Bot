require('dotenv').config();
const Pool = require('pg').Pool;

const pool = new Pool({
    user: "dbrwxdqr",
    password: "NJqE3-vqZAc402ThwZv70XxoOsMxQKGR",
    host: "raja.db.elephantsql.com",
    port: 5432,
    database: "dbrwxdqr",
}); 

module.exports = pool;
