
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
        const urlFinal = "https://openai.com";

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
            headers: { 
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        return JSON.parse(response.data.choices[0].message.content);
    } catch (error) {
        console.error("Erro na OpenAI:", error.message);
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
    
    // Evita divisão por zero ou valores negativos na fórmula de markup
    if ((1 - imposto - lucro) <= 0) {
        return "Erro (Imposto/Lucro muito altos)";
    }
    
    const precoVendaFinal = custoBaseTotal / (1 - imposto - lucro);
    return precoVendaFinal.toFixed(2);
}

module.exports = async (req, res) => {
    if (req.method === 'POST') {
        const constBody = req.body;

        if (constBody.numero && constBody.texto) {
            const comando = constBody.texto.toLowerCase();

            // Corrigido: usando os operadores lógicos corretos || (OU)
            if (comando.includes("calcular") || comando.includes("planilha") || comando.includes("preco")) {
                
                await enviarAlertaWhatsApp(constBody.numero, "🤖 Calculando dados da sua planilha unificada...");

                const dados = await extrairDadosComIA(constBody.texto);

                if (dados) {
                    const precoIdeal = calcularPlanilhaUnificada(
                        dados.custo || 0, 
                        dados.frete || 0, 
                        dados.salario || 0, 
                        dados.beneficios || 0, 
                        dados.imposto || 0, 
                        dados.lucro || 0
                    );

                    let respostaCalculada = '📋 *PLANILHA UNIFICADA GERADA*\n\n';
                    respostaCalculada += '📦 *Insumos (Rodolpho dos Anjos):*\n';
                    respostaCalculada += '• Custo Fabrica: R\$ ' + (dados.custo || 0).toFixed(2) + '\n';
                    respostaCalculada += '• Frete/Logistica: R\$ ' + (dados.frete || 0).toFixed(2) + '\n\n';
                    respostaCalculada += '👥 *Mao de Obra (Pedro Carnevale):*\n';
                    respostaCalculada += '• Salario Base: R\$ ' + (dados.salario || 0).toFixed(2) + '\n';
                    respostaCalculada += '• Encargos Sociais (80%): Incluso\n';
                    respostaCalculada += '• Beneficios (VT/VR): R\$ ' + (dados.beneficios || 0).toFixed(2) + '\n\n';
                    respostaCalculada += '📈 *Impostos e Margem:*\n';
                    respostaCalculada += '• Imposto: ' + (dados.imposto || 0) + '%\n';
                    respostaCalculada += '• Lucro Desejado: ' + (dados.lucro || 0) + '%\n\n';
                    respostaCalculada += '💰 *PRECO MINIMO PARA O PREGAO:*\n';
                    respostaCalculada += '👉 *R\$ ' + precoIdeal + '*';

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
