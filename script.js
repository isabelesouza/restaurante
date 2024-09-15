// Inicializar Parse com as credenciais do Back4App
Parse.initialize(
    '7KHUUlAqvUvsjds7YslmBLIPglpdSQYCDM0wPYSk',  // Application ID do Back4App
    'l5hvrmdXHu2tG9YbLyhjdxM8Jzge1EkCrdVrnpBE'   // JavaScript Key do Back4App
);
Parse.serverURL = 'https://parseapi.back4app.com';

let token = '';  // Variável para armazenar o token JWT

// Função para enviar o pedido e gerar token
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
        alert("Pedido enviado com sucesso!");
        window.location.href = "lista_pedidos.html";  // Redireciona para a página de pedidos
    } else {
        alert("Erro ao enviar o pedido.");
    }
}

// Função para listar pedidos usando o token
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
        listaPedidos.innerHTML = '';  // Limpa a lista antes de adicionar novos itens

        pedidos.forEach(pedido => {
            const item = document.createElement('li');
            item.textContent = `${pedido.prato} - ${pedido.acompanhamento} - R$${pedido.preco}`;
            listaPedidos.appendChild(item);
        });
    } else {
        alert("Erro ao listar os pedidos ou token inválido.");
    }
}
