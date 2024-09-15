const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const Parse = require('./config/back4app');  // Importa o Back4App
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

// Rota para criar o pedido e gerar o token
app.post('/pedidos', async (req, res) => {
    const { prato, acompanhamento, bebida, preco } = req.body;

    // Salva no Back4App
    const Pedido = Parse.Object.extend('Pedido');
    const novoPedido = new Pedido();
    novoPedido.set('prato', prato);
    novoPedido.set('acompanhamento', acompanhamento);
    novoPedido.set('bebida', bebida);
    novoPedido.set('preco', preco);

    try {
        const savedPedido = await novoPedido.save();

        // Gera o token JWT
        const payload = { permission: 'access_orders' };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

        // Envia para RabbitMQ
        amqp.connect('amqps://your_rabbitmq_url', (error0, connection) => {
            if (error0) throw error0;
            connection.createChannel((error1, channel) => {
                if (error1) throw error1;

                const queue = 'pedidos';
                const msg = JSON.stringify(req.body);

                channel.assertQueue(queue, { durable: false });
                channel.sendToQueue(queue, Buffer.from(msg));

                res.json({ message: 'Pedido enviado com sucesso', token });
            });
        });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao salvar o pedido no Back4App' });
    }
});

// Rota para listar pedidos com JWT
app.get('/pedidos', verifyToken, async (req, res) => {
    const Pedido = Parse.Object.extend('Pedido');
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

app.listen(3000, () => console.log('Servidor rodando na porta 3000'));
