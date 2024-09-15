const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const amqp = require('amqplib/callback_api');

const app = express();
app.use(bodyParser.json());

const JWT_SECRET = 'your_jwt_secret';

// Middleware para verificar o token JWT
function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (bearerHeader) {
        const token = bearerHeader.split(' ')[1];
        jwt.verify(token, JWT_SECRET, (err, authData) => {
            if (err) {
                res.sendStatus(403);
            } else {
                req.authData = authData;
                next();
            }
        });
    } else {
        res.sendStatus(403);
    }
}

// Rota para gerar o token JWT
app.post('/generate-token', (req, res) => {
    const payload = { permission: 'access_orders' };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
});

// Rota para enviar dados ao RabbitMQ
app.post('/send-rabbitmq', verifyToken, (req, res) => {
    const { prato, acompanhamento, bebida, preco } = req.body;

    amqp.connect('amqps://your_rabbitmq_url', (error0, connection) => {
        if (error0) throw error0;
        connection.createChannel((error1, channel) => {
            if (error1) throw error1;

            const queue = 'pedidos';
            const msg = JSON.stringify({ prato, acompanhamento, bebida, preco });

            channel.assertQueue(queue, { durable: false });
            channel.sendToQueue(queue, Buffer.from(msg));

            res.json({ message: 'Pedido enviado para RabbitMQ' });
        });
    });
});

// Iniciar o servidor
app.listen(3000, () => console.log('Servidor rodando na porta 3000'));
