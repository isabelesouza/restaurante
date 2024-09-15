let token = '';  // Store the JWT token

// Initialize Parse with Back4App credentials
Parse.initialize(
    '7KHUUlAqvUvsjds7YslmBLIPglpdSQYCDM0wPYSk',  // Application ID
    'l5hvrmdXHu2tG9YbLyhjdxM8Jzge1EkCrdVrnpBE'   // JavaScript Key
);
Parse.serverURL = 'https://parseapi.back4app.com';

// Function to send the pedido and display the token
async function enviarPedido() {
    const prato = document.getElementById('prato').value;
    const acompanhamento = document.getElementById('acompanhamento').value;
    const bebida = document.getElementById('bebida').value;
    const preco = document.getElementById('preco').value;

    const response = await fetch('/pedidos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prato, acompanhamento, bebida, preco })
    });

    if (response.ok) {
        const data = await response.json();
        token = data.token;  // Store the token
        alert(`Pedido enviado com sucesso! Seu token JWT: ${token}`);
        document.getElementById('pedidoForm').reset();
    } else {
        alert("Erro ao enviar pedido.");
    }
}

// Function to list pedidos using the token
async function listarPedidos() {
    if (!token) {
        alert("Por favor, envie um pedido primeiro para obter um token.");
        return;
    }

    const response = await fetch('/pedidos', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (response.ok) {
        const pedidos = await response.json();
        const listaPedidos = document.getElementById('lista-pedidos');
        listaPedidos.innerHTML = '';  // Clear the list first

        pedidos.forEach(pedido => {
            const item = document.createElement('li');
            item.textContent = `${pedido.prato} - ${pedido.acompanhamento} - R$${pedido.preco}`;
            listaPedidos.appendChild(item);
        });
    } else {
        alert("Erro ao listar os pedidos ou token inválido.");
    }
}

// Function to edit a pedido
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
        window.location.reload();
    } catch (error) {
        alert('Erro ao editar o pedido: ' + error.message);
    }
}

// Function to delete a pedido
async function deletarPedido(pedido) {
    try {
        await pedido.destroy();
        alert('Pedido excluído com sucesso!');
        window.location.reload();
    } catch (error) {
        alert('Erro ao excluir o pedido: ' + error.message);
    }
}
