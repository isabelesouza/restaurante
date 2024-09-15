const API_URL = 'http://localhost:3000';  // Substitua pelo URL do backend no Heroku ou outro serviço
let token = '';  // O token JWT será armazenado aqui após o login

// Função para fazer login e obter o token JWT
async function login() {
    const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    token = data.token;
    console.log('Token JWT recebido:', token);
}

// Função para listar os pedidos
async function listarPedidos() {
    // Primeiro, faça login para obter o token
    await login();

    const response = await fetch(`${API_URL}/pedidos`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (response.ok) {
        const pedidos = await response.json();
        const listaPedidos = document.getElementById('lista-pedidos');

        pedidos.forEach(pedido => {
            const item = document.createElement('li');
            item.textContent = `${pedido.prato} - ${pedido.acompanhamento} - R$${pedido.preco}`;

            // Adicionar botão de editar
            const btnEditar = document.createElement('button');
            btnEditar.textContent = 'Editar';
            btnEditar.classList.add('btn-editar');
            btnEditar.onclick = () => editarPedido(pedido.id);
            item.appendChild(btnEditar);

            // Adicionar botão de excluir
            const btnExcluir = document.createElement('button');
            btnExcluir.textContent = 'Excluir';
            btnExcluir.classList.add('btn-excluir');
            btnExcluir.onclick = () => deletarPedido(pedido.id);
            item.appendChild(btnExcluir);

            listaPedidos.appendChild(item);
        });
    } else {
        alert("Erro ao listar os pedidos.");
    }
}

// Função para editar um pedido (implementação adicional)
function editarPedido(id) {
    // Implementar lógica para editar o pedido
    const novoPrato = prompt('Novo prato:');
    const novoAcompanhamento = prompt('Novo acompanhamento:');
    const novaBebida = prompt('Nova bebida:');
    const novoPreco = prompt('Novo preço:');

    fetch(`${API_URL}/pedidos/${id}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prato: novoPrato, acompanhamento: novoAcompanhamento, bebida: novaBebida, preco: novoPreco })
    })
    .then(response => {
        if (response.ok) {
            alert('Pedido editado com sucesso!');
            window.location.reload();  // Recarregar a lista de pedidos
        } else {
            alert('Erro ao editar o pedido.');
        }
    });
}

// Função para excluir um pedido
function deletarPedido(id) {
    fetch(`${API_URL}/pedidos/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (response.ok) {
            alert('Pedido excluído com sucesso!');
            window.location.reload();  // Recarregar a lista de pedidos
        } else {
            alert('Erro ao excluir o pedido.');
        }
    });
}
