const express = require('express');
const jwt = require('jsonwebtoken');
const amqp = require('amqplib/callback_api');
const bodyParser = require('body-parser');
const pedidosRoutes = require('./routes/pedidosRoutes');

const app = express();
app.use(bodyParser.json());

// Configurando JWT
const JWT_SECRET = 'um_segredo_muito_seguro_gerado_aleatoriamente';

// URL fornecida pelo CloudAMQP
const amqpUrl = 'amqps://vkikkzte:Hx95EnJQdMfYvipDsNTxmKabOikOwJMT@prawn.rmq.cloudamqp.com/vkikkzte';

// Middleware de verificação do token JWT
function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (bearerHeader) {
        const token = bearerHeader.split(' ')[1];
        jwt.verify(token, JWT_SECRET, (err, authData) => {
            if (err) res.sendStatus(403);
            else next();
        });
    } else {
        res.sendStatus(403);
    }
}

// Rota de login para gerar JWT
app.post('/login', (req, res) => {
    const user = {
        id: 1, 
        username: 'usuario',
        email: 'usuario@teste.com',
        role: 'admin'  // Adicionando role ao token
    };

    // Gerando token
    jwt.sign({ user }, JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
        res.json({ token });
    });
});

// Usando as rotas de pedidos (com verificação de JWT)
app.use('/pedidos', verifyToken, pedidosRoutes);

// Iniciando o servidor
app.listen(3000, () => console.log('Servidor rodando na porta 3000'));
