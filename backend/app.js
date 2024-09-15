const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const Parse = require('./config/back4app');  // Importing Back4App configuration
const amqp = require('amqplib/callback_api');

const app = express();
app.use(bodyParser.json());

const JWT_SECRET = 'your_jwt_secret';

// Middleware to verify JWT token
function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (bearerHeader) {
        const token = bearerHeader.split(' ')[1];
        jwt.verify(token, JWT_SECRET, (err, authData) => {
            if (err) {
                res.sendStatus(403);
            } else {
                next();
            }
        });
    } else {
        res.sendStatus(403);
    }
}

// Route to generate JWT
app.post('/generate-token', (req, res) => {
    const payload = { permission: 'access_orders' };  // General payload
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
});

// Route to create a pedido
app.post('/pedidos', verifyToken, async (req, res) => {
    const { prato, acompanhamento, bebida, preco } = req.body;

    // Save to Back4App
    const Pedido = Parse.Object.extend('Pedido');
    const novoPedido = new Pedido();
    novoPedido.set('prato', prato);
    novoPedido.set('acompanhamento', acompanhamento);
    novoPedido.set('bebida', bebida);
    novoPedido.set('preco', preco);

    try {
        const savedPedido = await novoPedido.save();
        console.log('Pedido salvo no Back4App:', savedPedido);

        // Send to RabbitMQ
        amqp.connect('amqps://<your_rabbitmq_url>', (error0, connection) => {
            if (error0) throw error0;
            connection.createChannel((error1, channel) => {
                if (error1) throw error1;

                const queue = 'pedidos';
                const msg = JSON.stringify(req.body);

                channel.assertQueue(queue, { durable: false });
                channel.sendToQueue(queue, Buffer.from(msg));

                console.log('Pedido enviado para RabbitMQ:', msg);
                res.json({ message: 'Pedido enviado com sucesso', pedido: savedPedido });
            });
        });
    } catch (error) {
        console.error('Erro ao salvar o pedido:', error);
        res.status(500).json({ error: 'Erro ao salvar o pedido no Back4App' });
    }
});

// Route to list pedidos
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
        console.error('Erro ao listar os pedidos:', error);
        res.status(500).json({ error: 'Erro ao listar os pedidos' });
    }
});

app.listen(3000, () => console.log('Servidor rodando na porta 3000'));
