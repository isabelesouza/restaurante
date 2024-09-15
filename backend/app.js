const express = require('express');
const jwt = require('jsonwebtoken');
const amqp = require('amqplib/callback_api');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Configurando JWT
const JWT_SECRET = 'seu_segredo_para_jwt';

// URL fornecida pelo CloudAMQP
const amqpUrl = 'amqps://vkikkzte:Hx95EnJQdMfYvipDsNTxmKabOikOwJMT@prawn.rmq.cloudamqp.com/vkikkzte';

// Função middleware para verificar o token
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

// Rota para criar pedidos
app.post('/pedidos', verifyToken, (req, res) => {
    const pedido = req.body;
    
    // Conectar ao RabbitMQ usando CloudAMQP
    amqp.connect(amqpUrl, (error0, connection) => {
        if (error0) throw error0;
        connection.createChannel((error1, channel) => {
            if (error1) throw error1;

            const queue = 'pedidos';
            const msg = JSON.stringify(pedido);

            // Garantir que a fila exista antes de enviar a mensagem
            channel.assertQueue(queue, { durable: false });
            channel.sendToQueue(queue, Buffer.from(msg));
            
            console.log('Pedido enviado à fila:', msg);
            res.json({ message: 'Pedido enviado com sucesso', pedido });
        });
    });
});

// Rota para listar pedidos
app.get('/pedidos', verifyToken, (req, res) => {
    // Simulação de pedidos - pode ser integrado ao banco de dados
    const pedidos = [
        { prato: 'Feijoada', acompanhamento: 'Arroz', bebida: 'Suco', preco: 50 },
        { prato: 'Pizza', acompanhamento: 'Salada', bebida: 'Refrigerante', preco: 40 }
    ];
    res.json(pedidos);
});

// Rota de login para gerar JWT
app.post('/login', (req, res) => {
    const user = {
        id: 1, 
        username: 'usuario',
        email: 'usuario@teste.com'
    };

    // Gerando token
    jwt.sign({ user }, JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
        res.json({ token });
    });
});

// Iniciando o servidor
app.listen(3000, () => console.log('Servidor rodando na porta 3000'));
