const db = require("./db");
const { ObjectId } = require('mongodb');

async function connectToCollection(collectionName) {
    const database = await db.connect();
    return database.collection(collectionName);
}

async function listarSalas() {
    try {
        const salasCollection = await connectToCollection('salas');
        return await salasCollection.find({}, { projection: { mensagens: 0 } }).toArray();
    } catch (error) {
        console.error('Erro ao listar salas:', error);
        throw error; 
    }
}

async function criarSalas(salaData) {
    try {
        console.log(salaData);
        const salasCollection = await connectToCollection('salas');
        return await salasCollection.insertOne(salaData);
    } catch (error) {
        console.error('Erro ao criar sala:', error);
        throw error;
    }
}

async function criarMensagem(mensagemData) {
    try {
        const salasCollection = await connectToCollection('salas');
        mensagemData.timestamp = new Date();

        const result = await salasCollection.updateOne(
            { _id: new ObjectId(mensagemData.nomegrupo) },
            { $push: { mensagens: mensagemData } }
        );

        if (result.matchedCount === 0) {
            throw new Error('Sala não encontrada.');
        }
        return result;
    } catch (error) {
        console.error('Erro ao criar mensagem:', error);
        throw error;
    }
}

module.exports = {
    listarSalas,
    criarSalas,
    criarMensagem
};
