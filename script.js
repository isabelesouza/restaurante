// Inicializar Parse com as credenciais do Back4App
Parse.initialize(
    '7KHUUlAqvUvsjds7YslmBLIPglpdSQYCDM0wPYSk',  // Application ID
    'l5hvrmdXHu2tG9YbLyhjdxM8Jzge1EkCrdVrnpBE'   // JavaScript Key
);
Parse.serverURL = 'https://parseapi.back4app.com';

async function enviarPedido() {
    const prato = document.getElementById('prato').value;
    const acompanhamento = document.getElementById('acompanhamento').value;
    const bebida = document.getElementById('bebida').value;
    const preco = document.getElementById('preco').value;

    await fetch('/pedidos', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,  // Use the JWT token
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prato, acompanhamento, bebida, preco })
    }).then(response => {
        if (response.ok) {
            alert("Pedido enviado com sucesso!");
            document.getElementById('pedidoForm').reset();
        } else {
            alert("Erro ao enviar pedido.");
        }
    });
}


// Função para listar os pedidos
async function listarPedidos() {
    const Pedido = Parse.Object.extend('Pedido');
    const query = new Parse.Query(Pedido);

    try {
        const resultados = await query.find();
        const listaPedidos = document.getElementById('lista-pedidos');
        listaPedidos.innerHTML = '';

        resultados.forEach(pedido => {
            const item = document.createElement('li');
            item.textContent = `${pedido.get('prato')} - ${pedido.get('acompanhamento')} - R$${pedido.get('preco')}`;

            // Adicionar botão de editar
            const btnEditar = document.createElement('button');
            btnEditar.textContent = 'Editar';
            btnEditar.classList.add('btn-editar');
            btnEditar.onclick = () => editarPedido(pedido);
            item.appendChild(btnEditar);

            // Adicionar botão de excluir
            const btnExcluir = document.createElement('button');
            btnExcluir.textContent = 'Excluir';
            btnExcluir.classList.add('btn-excluir');
            btnExcluir.onclick = () => deletarPedido(pedido);
            item.appendChild(btnExcluir);

            listaPedidos.appendChild(item);
        });
    } catch (error) {
        alert('Erro ao listar os pedidos: ' + error.message);
    }
}

// Função para editar um pedido
async function editarPedido(pedido) {
    const novoPrato = prompt('Novo prato:', pedido.get('prato'));
    const novoAcompanhamento = prompt('Novo acompanhamento:', pedido.get('acompanhamento'));
    const novaBebida = prompt('Nova bebida:', pedido.get('bebida'));
    const novoPreco = prompt('Novo preço:', pedido.get('preco'));

    pedido.set('prato', novoPrato);
    pedido.set('acompanhamento', novoAcompanhamento);
    pedido.set('bebida', novaBebida);
    pedido.set('preco', novoPreco);

    try {
        await pedido.save();
        alert('Pedido editado com sucesso!');
        window.location.reload();  // Recarregar a lista de pedidos
    } catch (error) {
        alert('Erro ao editar o pedido: ' + error.message);
    }
}

// Função para excluir um pedido
async function deletarPedido(pedido) {
    try {
        await pedido.destroy();
        alert('Pedido excluído com sucesso!');
        window.location.reload();  // Recarregar a lista de pedidos
    } catch (error) {
        alert('Erro ao excluir o pedido: ' + error.message);
    }
}
