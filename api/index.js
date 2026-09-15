
const axios = require('axios');

// ⚠️ ATENÇÃO: Substitua pelo link completo da sua Evolution API que está no Render
// Exemplo: "https://onrender.com"
const URL_EVOLUTION = "https://onrender.com";
const API_KEY_SEGURANCA = "SenhaSecretaDoEspiao123";

async function enviarAlertaWhatsApp(numeroCliente, textoMensagem) {
    const payload = {
        number: numeroCliente,
        options: {
            delay: 1200,
            presence: "composing"
        },
        textMessage: {
            text: textoMensagem
        }
    };

    try {
        const response = await axios.post(URL_EVOLUTION, payload, {
            headers: {
                'Content-Type': 'application/json',
                'apikey': API_KEY_SEGURANCA
            }
        });
        return response.data;
    } catch (error) {
        console.error("Erro no WhatsApp:", error.message);
    }
}

// Essa função simula o cálculo da Planilha do Rodolpho dos Anjos antes de enviar o arquivo
function calcularComposicaoPreco(custoItem, freteItem, impostoPorcentagem, lucroDesejadoPorcentagem) {
    const imposto = impostoPorcentagem / 100;
    const lucro = lucroDesejadoPorcentagem / 100;
    
    // Fórmula matemática de formação de preço de venda (Markup/Preço Base)
    const precoVenda = (custoItem + freteItem) / (1 - imposto - lucro);
    return precoVenda.toFixed(2);
}

module.exports = async (req, res) => {
    if (req.method === 'POST') {
        const constBody = req.body;

        // Se receber número e texto, roda o comportamento padrão do Radar/Espião
        if (constBody.numero && constBody.texto) {
            
            // Lógica Nova: Se o texto contiver o comando de calcular preço
            if (constBody.texto.includes("calcular preço")) {
                // Aqui o robô avisa que vai iniciar a Planilha de Composição de Preço
                const mensagemPreco = "📋 *Radar do Edital - Composição de Preços*\n\nIniciando o simulador estilo Rodolpho dos Anjos para você não ser desclassificado! Me envie o custo do produto.";
                await enviarAlertaWhatsApp(constBody.numero, mensagemPreco);
            } else {
                // Se for um edital comum achado na internet, envia o alerta normal do Espião
                await enviarAlertaWhatsApp(constBody.numero, constBody.texto);
            }
        }
        return res.status(200).json({ status: "sucesso" });
    }
    
    res.status(200).send('API do Radar do Edital rodando perfeitamente!');
};
