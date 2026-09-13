const axios = require('axios');

module.exports = async (req, res) => {
    // Verifica se o WhatsApp está enviando dados (POST)
    if (req.method === 'POST') {
        const body = req.body;
        
        // Mostra no sistema a mensagem que chegou do celular
        console.log("Mensagem recebida do WhatsApp:", JSON.stringify(body));

        // Resposta obrigatória para o WhatsApp saber que deu tudo certo
        return res.status(200).json({ status: "success", message: "Espião do Edital ativo!" });
    }

    // Se alguém tentar abrir o link pelo navegador normal
    res.status(200).send('API do Espião do Edital rodando com sucesso na Vercel!');
};
