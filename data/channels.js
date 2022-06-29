const knex = require('../util/knexfile')

function updateChannel(channel)
{
    return knex("channels").where("id", channel.id).update(channel);
}

function getChannel(id)
{
    return knex("channels").first().where('id', '=', id)// Resolves to any
  
}

function getAllChannels()
{
    return knex("channels").select('*');
}



module.exports = { updateChannel, getAllChannels, getChannel } 