// Inicializar Parse com as credenciais do Back4App
Parse.initialize(
    '7KHUUlAqvUvsjds7YslmBLIPglpdSQYCDM0wPYSk',  // Application ID do Back4App
    'l5hvrmdXHu2tG9YbLyhjdxM8Jzge1EkCrdVrnpBE'   // JavaScript Key do Back4App
);
Parse.serverURL = 'https://parseapi.back4app.com';

let token = '';  // Variável para armazenar o token JWT

// Função para enviar o pedido diretamente ao Back4App e gerar token
async function enviarPedido() {
    const prato = document.getElementById('prato').value;
    const acompanhamento = document.getElementById('acompanhamento').value;
    const bebida = document.getElementById('bebida').value;
    const preco = document.getElementById('preco').value;

    // Criar objeto Pedido e enviar para o Back4App
    const Pedido = Parse.Object.extend('Pedido');
    const novoPedido = new Pedido();
    novoPedido.set('prato', prato);
    novoPedido.set('acompanhamento', acompanhamento);
    novoPedido.set('bebida', bebida);
    novoPedido.set('preco', preco);

    try {
        const savedPedido = await novoPedido.save();
        token = generateToken();  // Gera o token fictício
        alert("Pedido enviado com sucesso! Seu token JWT: " + token);
        window.location.href = "lista_pedidos.html";  // Redireciona para a página de pedidos
    } catch (error) {
        alert("Erro ao enviar o pedido: " + error.message);
    }
}

// Função para gerar um token fictício (exemplo)
function generateToken() {
    return 'seu_token_jwt_ficticio';
}

// Função para listar pedidos diretamente do Back4App
async function listarPedidos() {
    const Pedido = Parse.Object.extend('Pedido');
    const query = new Parse.Query(Pedido);

    try {
        const resultados = await query.find();  // Buscar todos os registros
        const listaPedidos = document.getElementById('lista-pedidos');
        listaPedidos.innerHTML = '';  // Limpa a lista antes de adicionar novos itens

        resultados.forEach(pedido => {
            const item = document.createElement('li');
            item.textContent = `${pedido.get('prato')} - ${pedido.get('acompanhamento')} - R$${pedido.get('preco')}`;
            listaPedidos.appendChild(item);
        });
    } catch (error) {
        alert('Erro ao listar os pedidos: ' + error.message);
    }
}
