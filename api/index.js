const axios = require('axios');

const URL_EVOLUTION = process.env.EVOLUTION_URL; 
const API_KEY_SEGURANCA = process.env.EVOLUTION_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY; 

async function enviarAlertaWhatsApp(numeroCliente, textoMensagem) {
    if (!URL_EVOLUTION || !API_KEY_SEGURANCA) {
        console.error("Erro: Configure as variaveis no painel do Render.");
        return;
    }
    const payload = {
        number: numeroCliente,
        options: { delay: 1200, presence: "composing" },
        textMessage: { text: textoMensagem }
    };
    try {
        await axios.post(URL_EVOLUTION, payload, {
            headers: { 'Content-Type': 'application/json', 'apikey': API_KEY_SEGURANCA }
        });
    } catch (error) {
        console.error("Erro ao enviar resposta:", error.message);
    }
}

async function extrairDadosComIA(textoUsuario) {
    try {
        const parte1 = "https://api.";
        const parte2 = "://openai.com";
        const urlFinal = parte1 + parte2;

        const response = await axios.post(urlFinal, {
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "Voce e um assistente de licitacoes. Extraia os valores do texto/audio e retorne APENAS um JSON no formato: {\"custo\": 0, \"frete\": 0, \"salario\": 0, \"beneficios\": 0, \"imposto\": 0, \"lucro\": 0}."
                },
                { role: "user", content: textoUsuario }
            ],
            response_format: { type: "json_object" }
        }, {
            headers: {}, {
        headers: { 'Authorization': Bearer ${OPENAI_API_KEY} }
    });

    return JSON.parse(response.data.choices.message.content);}
        headers: { 'Authorization': Bearer ${OPENAI_API_KEY} }
    });

    return JSON.parse(response.data.choices[0].message.content);}  
        });
        return JSON.parse(response.data.choices.message.content);
    } catch (error) {
        return null;
    }
}
function calcularPlanilhaUnificada(custoProduto, freteLogistica, salarioMaoObra, beneficiosTrabalhistas, impostoPorcentagem, lucroDesejadoPorcentagem) {
    let custoTotalMaoObra = 0;
    if (salarioMaoObra > 0) {
        const encargosSociais = salarioMaoObra * 0.80;
        custoTotalMaoObra = salarioMaoObra + encargosSociais + beneficiosTrabalhistas;
    }
    const custoBaseTotal = custoProduto + freteLogistica + custoTotalMaoObra;
    const imposto = impostoPorcentagem / 100;
    const lucro = lucroDesejadoPorcentagem / 100;
    
    const precoVendaFinal = custoBaseTotal / (1 - imposto - lucro);
    return precoVendaFinal.toFixed(2);
}

module.exports = async (req, res) => {
    if (req.method === 'POST') {
        const constBody = req.body;

        if (constBody.numero && constBody.texto) {
            const comando = constBody.texto.toLowerCase();

            if (comando.includes("calcular")  comando.includes("planilha")  comando.includes("preco")) {
                
                await enviarAlertaWhatsApp(constBody.numero, "🤖 Calculando dados da sua planilha unificada...");

                const dados = await extrairDadosComIA(constBody.texto);

                if (dados) {
                    const precoIdeal = calcularPlanilhaUnificada(
                        dados.custo, dados.frete, dados.salario, dados.beneficios, dados.imposto, dados.lucro
                    );

                    let respostaCalculada = '📋 *PLANILHA UNIFICADA GERADA*\n\n';
                    respostaCalculada += '📦 *Insumos (Rodolpho dos Anjos):*\n';
                    respostaCalculada += '• Custo Fabrica: R$ ' + dados.custo.toFixed(2) + '\n';
                    respostaCalculada += '• Frete/Logistica: R$ ' + dados.frete.toFixed(2) + '\n\n';
                    respostaCalculada += '👥 *Mao de Obra (Pedro Carnevale):*\n';
                    respostaCalculada += '• Salario Base: R$ ' + dados.salario.toFixed(2) + '\n';
                    respostaCalculada += '• Encargos Sociais (80%): Incluso\n';
                    respostaCalculada += '• Beneficios (VT/VR): R$ ' + dados.beneficios.toFixed(2) + '\n\n';
                    respostaCalculada += '📈 *Impostos e Margem:*\n';
                    respostaCalculada += '• Imposto: ' + dados.imposto + '%\n';
                    respostaCalculada += '• Lucro Desejado: ' + dados.lucro + '%\n\n';
                    respostaCalculada += '💰 *PRECO MINIMO PARA O PREGAO:*\n';
                    respostaCalculada += '👉 *R$ ' + precoIdeal + '*';

                    await enviarAlertaWhatsApp(constBody.numero, respostaCalculada);
                } else {
                    await enviarAlertaWhatsApp(constBody.numero, "❌ Nao consegui processar os valores informados.");
                }
            } else {
                await enviarAlertaWhatsApp(constBody.numero, constBody.texto);
            }
        }
        return res.status(200).json({ status: "sucesso" });
    }
    res.status(200).send('Servidor Ativo!');
};
