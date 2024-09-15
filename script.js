// Inicializar Parse com as credenciais do Back4App
Parse.initialize(
    '7KHUUlAqvUvsjds7YslmBLIPglpdSQYCDM0wPYSk',  // Application ID do Back4App
    'l5hvrmdXHu2tG9YbLyhjdxM8Jzge1EkCrdVrnpBE'   // JavaScript Key do Back4App
);
Parse.serverURL = 'https://parseapi.back4app.com';

let token = '';  // Armazenar o token JWT

// URL do backend no Vercel
const backendUrl = 'https://restaurante-r7khbtgpf-isabelesouzas-projects.vercel.app/api/pedidos';

// Função para enviar o pedido ao Back4App e receber o token JWT
async function enviarPedido() {
    const prato = document.getElementById('prato').value;
    const acompanhamento = document.getElementById('acompanhamento').value;
    const bebida = document.getElementById('bebida').value;
    const preco = parseFloat(document.getElementById('preco').value);

    const response = await fetch(backendUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prato, acompanhamento, bebida, preco })
    });

    if (response.ok) {
        const data = await response.json();
        token = data.token;  // Armazena o token JWT recebido
        alert("Pedido enviado com sucesso! Seu token JWT: " + token);
        document.getElementById('pedidoForm').reset();
        window.location.href = "lista_pedidos.html";  // Redireciona para a página de pedidos
    } else {
        alert("Erro ao enviar o pedido.");
    }
}

// Função para listar os pedidos após validar o token JWT
async function listarPedidos() {
    const tokenDigitado = prompt("Digite o token JWT para acessar os pedidos:");

    const response = await fetch(backendUrl, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${tokenDigitado}`
        }
    });

    if (response.ok) {
        const pedidos = await response.json();
        mostrarPedidosNaPagina(pedidos);
    } else {
        alert("Token inválido ou erro ao listar os pedidos.");
    }
}

// Função para mostrar os pedidos na página
function mostrarPedidosNaPagina(pedidos) {
    const listaPedidos = document.getElementById('lista-pedidos');
    listaPedidos.innerHTML = '';  // Limpa a lista antes de adicionar os itens

    pedidos.forEach(pedido => {
        const listItem = document.createElement('li');
        listItem.textContent = `Prato: ${pedido.prato}, Acompanhamento: ${pedido.acompanhamento}, Bebida: ${pedido.bebida}, Preço: R$ ${pedido.preco}`;
        listaPedidos.appendChild(listItem);
    });
}
