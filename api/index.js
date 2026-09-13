const axios = require('axios');

async function enviarAlertaWhatsApp(numeroCliente, textoMensagem) {
  const URL_EVOLUTION = "https://onrender.com";
  const API_KEY_SEGURANCA = "SenhaSecretaDoEspiao123";

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

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    const constBody = req.body;
    if (constBody.numero && constBody.texto) {
        await enviarAlertaWhatsApp(constBody.numero, constBody.texto);
    }
    return res.status(200).json({ status: "success" });
  }
  res.status(200).send('API do Espiao do Edital rodando!');
};
