function enviarPedido() {
    var prato = document.getElementById('prato').value;
    var acompanhamento = document.getElementById('acompanhamento').value;
    var bebida = document.getElementById('bebida').value;
    var preco = document.getElementById('preco').value;

    // Aqui você pode adicionar lógica adicional, como validação dos campos, envio de dados para um servidor, etc.
 
    // Exemplo de como exibir os dados do pedido em um alerta :
    var mensagem = "Pedido Confirmado:\n\n";
    mensagem += "Prato: " + prato + "\n";
    mensagem += "Acompanhamento: " + acompanhamento + "\n";
    mensagem += "Bebida: " + bebida + "\n";
    mensagem += "Preço: R$ " + preco + "\n";
    alert(mensagem);

    // Limpar o formulário após o envio do pedido,teste
    document.getElementById('pedidoForm').reset();
}
