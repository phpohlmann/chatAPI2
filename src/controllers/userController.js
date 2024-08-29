const jwt = require('jsonwebtoken');
const { registrarUser, deletarUser } = require('../models/userModel');
const SECRET = "1234";

function generateToken(payload, expiresIn = '48h') {
    return jwt.sign(payload, SECRET, { expiresIn });
}

function extractToken(req) {
    return req.headers.authorization;
}

async function entrar(req, res) {
    const { nome } = req.body;

    try {
        await registrarUser(req.body);
        const token = generateToken({ nome });
        res.json(token);
    } catch (error) {
        console.error('Erro ao registrar usuário:', error);
        res.status(500).send('Erro ao registrar usuário.');
    }
}

async function sair(req, res) {
    try {
        const token = extractToken(req);

        if (!token) {
            return res.status(401).send('Token não fornecido.');
        }

        const decoded = jwt.verify(token, SECRET);
        await deletarUser(decoded.nome);

        res.json({
            status: 200,
            msg: "OK"
        });
    } catch (error) {
        console.error('Erro durante o logout:', error);
        res.status(401).send('Token inválido.');
    }
}

module.exports = {
    entrar,
    sair
};
