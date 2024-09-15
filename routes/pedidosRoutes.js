const express = require('express');
const router = express.Router();
const pedidosController = require('../controllers/pedidosController');

// Rota para criar um novo pedido
router.post('/', pedidosController.criarPedido);

// Rota para listar os pedidos
router.get('/', pedidosController.listarPedidos);

module.exports = router;
