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

function getAllZones()
{
    console.log('running get all zones');
    return knex("zones").select('*');
}

function updateZone(zone)
{
    return knex("zones").where("id", zone.id).update(zone);
}



module.exports = { updateChannel, getAllChannels, getChannel, getAllZones, updateZone } 