const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const Parse = require('parse/node');  
const amqp = require('amqplib/callback_api');

const app = express();
app.use(bodyParser.json());

const JWT_SECRET = 'seu_segredo_jwt';

Parse.initialize(
    '7KHUUlAqvUvsjds7YslmBLIPglpdSQYCDM0wPYSk',  
    'l5hvrmdXHu2tG9YbLyhjdxM8Jzge1EkCrdVrnpBE'   
);
Parse.serverURL = 'https://parseapi.back4app.com';

// Função para gerar JWT
function generateJWT() {
    const payload = { permission: 'access_orders' };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
    return token;
}

// Rota para enviar pedidos ao Back4App e RabbitMQ
app.post('/pedidos', async (req, res) => {
    const { prato, acompanhamento, bebida, preco } = req.body;

    const Pedido = Parse.Object.extend('pedidos');
    const novoPedido = new Pedido();
    novoPedido.set('prato', prato);
    novoPedido.set('acompanhamento', acompanhamento);
    novoPedido.set('bebida', bebida);
    novoPedido.set('preco', preco);

    try {
        const savedPedido = await novoPedido.save(); 

        amqp.connect('amqps://vkikkzte:Hx95EnJQdMfYvipDsNTxmKabOikOwJMT@prawn.rmq.cloudamqp.com/vkikkzte', (error0, connection) => {
            if (error0) throw error0;
            connection.createChannel((error1, channel) => {
                if (error1) throw error1;

                const queue = 'pedidos';
                const msg = JSON.stringify(req.body);

                channel.assertQueue(queue, { durable: false });
                channel.sendToQueue(queue, Buffer.from(msg));

                console.log('Pedido enviado para RabbitMQ:', msg);
            });
        });

        const token = generateJWT();
        res.json({ message: 'Pedido enviado com sucesso', token });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao salvar o pedido no Back4App ou enviar ao RabbitMQ' });
    }
});

// Middleware para verificar o JWT
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

// Rota protegida para listar pedidos (JWT necessário)
app.get('/pedidos', verifyToken, async (req, res) => {
    const Pedido = Parse.Object.extend('pedidos');
    const query = new Parse.Query(Pedido);

    try {
        const results = await query.find();
        const pedidos = results.map(p => ({
            prato: p.get('prato'),
            acompanhamento: p.get('acompanhamento'),
            bebida: p.get('bebida'),
            preco: p.get('preco')
        }));
        res.json(pedidos);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao listar os pedidos' });
    }
});

module.exports = app;
