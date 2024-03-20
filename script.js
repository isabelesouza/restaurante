// Configurar o Parse SDK
Parse.serverURL = 'https://parseapi.back4app.com';
Parse.initialize(
    '7KHUUlAqvUvsjds7YslmBLIPglpdSQYCDM0wPYSk', // Seu Application ID
    'l5hvrmdXHu2tG9YbLyhjdxM8Jzge1EkCrdVrnpBE' // Sua JavaScript key
);

// Função para enviar o pedido para o banco de dados
function enviarPedido() {
    var prato = document.getElementById('prato').value;
    var acompanhamento = document.getElementById('acompanhamento').value;
    var bebida = document.getElementById('bebida').value;
    var preco = parseFloat(document.getElementById('preco').value); // Convertendo para número

    // Criar um objeto Parse para a classe 'pedidos'
    var Pedido = Parse.Object.extend('pedidos');
    var pedido = new Pedido();

    // Definir os valores do pedido
    pedido.set('prato', prato);
    pedido.set('acompanhamento', acompanhamento);
    pedido.set('bebida', bebida);
    pedido.set('preco', preco);

    // Salvar o pedido no banco de dados
    pedido.save().then(function(response) {
        console.log('Pedido enviado com sucesso:', response);
        alert('Pedido enviado com sucesso!');
        // Limpar o formulário após o envio do pedido
        document.getElementById('pedidoForm').reset();
    }).catch(function(error) {
        console.error('Erro ao enviar o pedido:', error);
        alert('Erro ao enviar o pedido. Por favor, tente novamente.');
    });
}

// Função para listar os pedidos salvos no banco de dados
function listarPedidos() {
    var Pedido = Parse.Object.extend('pedidos');
    var query = new Parse.Query(Pedido);

    query.find().then(function(results) {
        console.log('Pedidos encontrados:', results);
        // Mostrar os pedidos em algum lugar na sua página
        mostrarPedidosNaPagina(results);
    }).catch(function(error) {
        console.error('Erro ao buscar os pedidos:', error);
        alert('Erro ao buscar os pedidos. Por favor, tente novamente.');
    });
}

// Função para mostrar os pedidos na página
function mostrarPedidosNaPagina(pedidos) {
    var listaPedidos = document.getElementById('lista-pedidos');
    listaPedidos.innerHTML = ''; // Limpar a lista antes de adicionar os pedidos

    pedidos.forEach(function(pedido) {
        var prato = pedido.get('prato');
        var acompanhamento = pedido.get('acompanhamento');
        var bebida = pedido.get('bebida');
        var preco = pedido.get('preco');

        var listItem = document.createElement('li');
        listItem.textContent = `Prato: ${prato}, Acompanhamento: ${acompanhamento}, Bebida: ${bebida}, Preço: R$ ${preco}`;
        listaPedidos.appendChild(listItem);
    });
}

// Função para editar um pedido
function editarPedido(id) {
    var Pedido = Parse.Object.extend('pedidos');
    var query = new Parse.Query(Pedido);

    // Buscar o pedido pelo ID
    query.get(id).then(function(pedido) {
        // Modificar os valores do pedido
        pedido.set('prato', 'Novo prato');
        pedido.set('acompanhamento', 'Novo acompanhamento');
        pedido.set('bebida', 'Nova bebida');
        pedido.set('preco', 20); // Novo preço

        // Salvar as modificações no banco de dados
        return pedido.save();
    }).then(function(updatedPedido) {
        console.log('Pedido atualizado com sucesso:', updatedPedido);
    }).catch(function(error) {
        console.error('Erro ao atualizar o pedido:', error);
    });
}

// Função para deletar um pedido
function deletarPedido(id) {
    var Pedido = Parse.Object.extend('pedidos');
    var query = new Parse.Query(Pedido);

    // Buscar o pedido pelo ID
    query.get(id).then(function(pedido) {
        // Deletar o pedido
        return pedido.destroy();
    }).then(function(deletedPedido) {
        console.log('Pedido deletado com sucesso:', deletedPedido);
    }).catch(function(error) {
        console.error('Erro ao deletar o pedido:', error);
    });
}
