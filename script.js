
Parse.serverURL = 'https://parseapi.back4app.com';
Parse.initialize(
    '7KHUUlAqvUvsjds7YslmBLIPglpdSQYCDM0wPYSk', 
    'l5hvrmdXHu2tG9YbLyhjdxM8Jzge1EkCrdVrnpBE' 
);

// enviar o pedido para o banco de dados
function enviarPedido() {
    var prato = document.getElementById('prato').value;
    var acompanhamento = document.getElementById('acompanhamento').value;
    var bebida = document.getElementById('bebida').value;
    var preco = parseFloat(document.getElementById('preco').value); 

    
    var Pedido = Parse.Object.extend('pedidos');
    var pedido = new Pedido();

   
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
        
        mostrarPedidosNaPagina(results);
    }).catch(function(error) {
        console.error('Erro ao buscar os pedidos:', error);
        alert('Erro ao buscar os pedidos. Por favor, tente novamente.');
    });
}

// Função para mostrar os pedidos na página
function mostrarPedidosNaPagina(pedidos) {
    var listaPedidos = document.getElementById('lista-pedidos');
    listaPedidos.innerHTML = ''; 

    pedidos.forEach(function(pedido) {
        var prato = pedido.get('prato');
        var acompanhamento = pedido.get('acompanhamento');
        var bebida = pedido.get('bebida');
        var preco = pedido.get('preco');
        var id = pedido.id; 

        var listItem = document.createElement('li');
        listItem.textContent = `Prato: ${prato}, Acompanhamento: ${acompanhamento}, Bebida: ${bebida}, Preço: R$ ${preco}`;

       
        var editButton = document.createElement('button');
        editButton.textContent = 'Editar';
        editButton.className = 'btn-editar';
        editButton.onclick = function() {
            editarPedido(id);
        };
        listItem.appendChild(editButton);

       
        var deleteButton = document.createElement('button');
        deleteButton.textContent = 'Excluir';
        deleteButton.className = 'btn-excluir';
        deleteButton.onclick = function() {
            deletarPedido(id);
            // Recarregar a lista após a exclusão
            listarPedidos();
        };
        listItem.appendChild(deleteButton);

        listaPedidos.appendChild(listItem);
    });
}

function editarPedido(id) {
    var novoPrato = prompt("Novo prato:");
    var novoAcompanhamento = prompt("Novo acompanhamento:");
    var novaBebida = prompt("Nova bebida:");
    var novoPreco = parseFloat(prompt("Novo preço:"));

    var Pedido = Parse.Object.extend('pedidos');
    var query = new Parse.Query(Pedido);

    
    query.get(id).then(function(pedido) {
        // Modificar os valores do pedido
        pedido.set('prato', novoPrato);
        pedido.set('acompanhamento', novoAcompanhamento);
        pedido.set('bebida', novaBebida);
        pedido.set('preco', novoPreco);

        // Salvar as modificações no banco de dados
        return pedido.save();
    }).then(function(updatedPedido) {
        console.log('Pedido atualizado com sucesso:', updatedPedido);
        // Recarregar a lista 
        listarPedidos();
    }).catch(function(error) {     console.error('Erro ao atualizar o pedido:', error);
});
}

//  deletar um pedido
function deletarPedido(id) {
var Pedido = Parse.Object.extend('pedidos');
var query = new Parse.Query(Pedido);

// Buscar o pedido pelo ID
query.get(id).then(function(pedido) {
    // Deletar o pedido
    return pedido.destroy();
}).then(function(deletedPedido) {
    console.log('Pedido deletado com sucesso:', deletedPedido);
    // Recarregar a lista
    listarPedidos();
}).catch(function(error) {
    console.error('Erro ao deletar o pedido:', error);
});
}


