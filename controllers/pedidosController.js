const amqp = require('amqplib/callback_api');
const Parse = require('../config/back4app');  // Conectar ao Back4App

// URL fornecida pelo CloudAMQP
const amqpUrl = 'amqps://vkikkzte:Hx95EnJQdMfYvipDsNTxmKabOikOwJMT@prawn.rmq.cloudamqp.com/vkikkzte';

// Função para criar um novo pedido
exports.criarPedido = async (req, res) => {
    const pedido = req.body;

    // Salvar o pedido no banco de dados do Back4App
    const Pedido = Parse.Object.extend('Pedido');  // Tabela 'Pedido' no Back4App
    const novoPedido = new Pedido();

    novoPedido.set('prato', pedido.prato);
    novoPedido.set('acompanhamento', pedido.acompanhamento);
    novoPedido.set('bebida', pedido.bebida);
    novoPedido.set('preco', pedido.preco);

    try {
        const savedPedido = await novoPedido.save();
        console.log('Pedido salvo no Back4App:', savedPedido);

        // Enviar o pedido para o RabbitMQ
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
    } catch (error) {
        console.error('Erro ao salvar o pedido no Back4App:', error);
        res.status(500).json({ error: 'Erro ao salvar o pedido no Back4App' });
    }
};

// Função para listar pedidos (consultar no Back4App)
exports.listarPedidos = async (req, res) => {
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
        console.error('Erro ao buscar os pedidos no Back4App:', error);
        res.status(500).json({ error: 'Erro ao buscar os pedidos no Back4App' });
    }
};
