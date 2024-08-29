const { connect } = require('./db'); 

async function getCollection() {
    const db = await connect();
    return db.collection('usuarios');
}

async function registrarUser(nick) {
    const collection = await getCollection();
    return collection.insertOne({ nick });
}

async function deletarUser(nome) {
    const collection = await getCollection();
    return collection.deleteOne({ 'nick.nome': nome });
}

module.exports = {
    registrarUser,
    deletarUser
};
