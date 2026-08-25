const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "tienda_plantas",
  password: "SterannCC900",
  port: 5432,
});

module.exports = pool;