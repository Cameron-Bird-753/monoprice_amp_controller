const knex = require('knex');

const connectedKnex = knex(
  {
    client:"sqlite3",
    connection:
    {
      filename:"./data/audio.db3"
    
    }
  }
);

module.exports = connectedKnex;