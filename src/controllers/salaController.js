const { criarSalas, listarSalas, criarMensagem } = require("../models/salaModel");
const { ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const db = require("../models/db");

const SECRET = "1234";

async function listar(req, res) {
  try {
    const salas = await listarSalas();
    res.json(salas);
  } catch (error) {
    console.error('Erro ao listar salas:', error);
    res.status(500).send("Erro ao listar salas");
  }
}

async function criar(req, res) {
  try {
    const novaSala = await criarSalas(req.body);
    console.log(novaSala);
    res.status(201).json(novaSala);
  } catch (error) {
    console.error("Erro ao criar sala:", error);
    res.status(500).json({ message: 'Erro ao criar sala', error: error.message });
  }
}

function sair(req, res) {
  res.json({ status: 200, msg: "OK" });
}

async function listarmen(req, res) {
  try {
    const { idSala } = req.query;

    if (!idSala) {
      return res.status(400).send('idSala é obrigatório.');
    }

    const database = await db.connect();
    const sala = await database.collection('salas').findOne(
      { _id: new ObjectId(idSala) },
      { projection: { mensagens: 1, _id: 0 } }
    );

    if (!sala) {
      return res.status(404).send('Sala não encontrada.');
    }

    res.status(200).json(sala.mensagens);
  } catch (error) {
    console.error('Erro ao listar mensagens:', error);
    res.status(500).send('Erro interno do servidor.');
  }
}

function entrar(req, res) {
  res.json({ status: 200, msg: "OK" });
}

async function enviarmen(req, res) {
  try {
    const { idSala } = req.query;
    const { conteudo } = req.body;

    if (!idSala || !conteudo) {
      return res.status(400).send('idSala e conteúdo da mensagem são obrigatórios.');
    }

    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).send('Token não fornecido.');
    }

    let decoded;
    try {
      decoded = jwt.verify(token, SECRET);
    } catch (error) {
      console.error('Erro ao verificar token:', error);
      return res.status(401).send('Token inválido.' + error);
    }

    const { nome } = decoded;
    const mensagemData = { nome, nomegrupo: idSala, conteudo };

    await criarMensagem(mensagemData);
    res.status(201).json(mensagemData);
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error);
    res.status(500).send('Erro interno do servidor.');
  }
}

module.exports = {
  listar,
  criar,
  sair,
  listarmen,
  entrar,
  enviarmen
};
