const http = require('http');

// Servidor simplificado para rodar o Painel Visual do LicitaHub Suite no Render
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    
    // Entrega a interface de busca universal e robô de lances
    res.end(`
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LicitaHub Suite - Painel Integrado</title>
    <style>
        :root { --primary-color: #4f46e5; --bg-color: #f8fafc; --sidebar-color: #0f172a; }
        body { font-family: 'Segoe UI', system-ui, sans-serif; background-color: var(--bg-color); margin: 0; padding: 0; display: flex; height: 100vh; color: #334155; }
        .sidebar { width: 260px; background-color: var(--sidebar-color); color: white; padding: 20px; box-sizing: border-box; }
        .sidebar h2 { font-size: 1.2rem; margin-bottom: 30px; color: #38bdf8; }
        .sidebar-menu { list-style: none; padding: 0; margin: 0; }
        .sidebar-menu li { padding: 12px 10px; border-radius: 6px; cursor: pointer; margin-bottom: 5px; transition: background 0.2s; }
        .sidebar-menu li.active, .sidebar-menu li:hover { background-color: rgba(255, 255, 255, 0.1); }
        .main-content { flex: 1; padding: 30px; overflow-y: auto; box-sizing: border-box; }
        .dashboard-grid { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 25px; margin-top: 20px; }
        .card { background: white; border-radius: 12px; padding: 25px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
        .card h3 { margin-top: 0; margin-bottom: 20px; font-size: 1.1rem; color: #1e293b; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px; }
        .search-group { display: flex; gap: 10px; margin-bottom: 15px; }
        input[type="text"] { width: 100%; padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 0.95rem; box-sizing: border-box; }
        button { background-color: var(--primary-color); color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-weight: 600; }
        
        /* Área Dinâmica de Especificação Avançada para QUALQUER produto */
        .subfiltro-container { background: #f1f5f9; padding: 15px; border-radius: 8px; margin-bottom: 15px; display: none; }
        .subfiltro-title { font-size: 0.85rem; font-weight: bold; color: #475569; margin-bottom: 10px; text-transform: uppercase; }
        .tags-container { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; }
        .tag-item { background: #e2e8f0; padding: 6px 12px; border-radius: 20px; font-size: 0.85rem; display: flex; align-items: center; gap: 6px; color: #334155; }
        .tag-remove { color: #ef4444; cursor: pointer; font-weight: bold; }
        
        .results-box { border: 1px dashed #cbd5e1; border-radius: 6px; padding: 20px; text-align: center; color: #64748b; }
        .status-box { border-radius: 8px; padding: 20px; text-align: center; color: white; font-weight: bold; transition: background-color 0.3s ease; margin-top: 15px; }
        .status-value { font-size: 1.8rem; margin: 5px 0; }
        .status-text { font-size: 0.95rem; background: rgba(0, 0, 0, 0.15); padding: 6px; border-radius: 4px; display: inline-block; }
        .winning { background-color: #10b981; }
        .losing { background-color: #ef4444; }
        .toast-notification { position: fixed; bottom: 20px; right: -350px; background-color: white; border-left: 4px solid #10b981; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); padding: 16px 20px; border-radius: 4px; transition: right 0.4s ease; z-index: 1000; }
        .toast-notification.show { right: 20px; }
    </style>
</head>
<body>
<div class="sidebar">
    <h2>LicitaHub Suite</h2>
    <ul class="sidebar-menu">
        <li class="active">Radar / Robô de Lances</li>
        <li>Buscar Licitações</li>
        <li>Configurações</li>
    </ul>
</div>
<div class="main-content">
    <div class="dashboard-grid">
        
        <!-- BUSCA TOTALMENTE UNIVERSAL -->
        <div class="card">
            <h3>Buscar Licitações Públicas</h3>
            <div class="search-group">
                <input type="text" id="inputBusca" onkeyup="verificarDigitacao(event)" placeholder="Digite qualquer produto (ex: notebook, limpeza, cadeira)...">
                <button onclick="executarBuscaUniversal()">Filtrar</button>
            </div>
            
            <!-- Painel Avançado: Abre para dar suporte a sub-especificações de qualquer produto digitado -->
            <div id="painelSubfiltros" class="subfiltro-container">
                <div class="subfiltro-title">🎯 Palavras-Chave Secundárias (Refinar Alvo do Robô):</div>
                <div class="search-group" style="margin-bottom: 5px;">
                    <input type="text" id="inputSubTermo" placeholder="Adicione termos para restringir (ex: i7, 16gb, hospitalar)...">
                    <button onclick="adicionarSubTermo()" style="background-color: #64748b; padding: 5px 12px;">+</button>
                </div>
                <div id="listaTags" class="tags-container"></div>
            </div>
            
            <div id="containerResultados" class="results-box">Insira um produto ou palavra-chave para começar o monitoramento.</div>
        </div>
        
        <!-- MONITOR DO ROBÔ DE LANCES -->
        <div class="card">
            <h3>Módulo Robô de Lances</h3>
            <div style="margin-bottom: 15px;">
                <label style="display:block; margin-bottom:5px; font-weight:600;">Valor Limite Configurado:</label>
                <input type="text" value="R$ 3.035.844,77" readonly style="background:#f1f5f9; color:#475569; width:100%; padding:10px; border:1px solid #cbd5e1; border-radius:6px; box-sizing:border-box;">
            </div>
            <div id="configAtiva" style="font-size: 0.85rem; margin-bottom: 15px; color: #475569; font-weight: 600;">Robô aguardando palavra-chave principal...</div>
            <div id="painelRobo" class="status-box winning">
                <div style="font-size: 0.85rem; text-transform: uppercase; opacity: 0.9;">Melhor Lance Atual</div>
                <div id="valorLanceRobo" class="status-value">R$ 3.590.137,82</div>
                <div id="textoStatusRobo" class="status-text">1º Lugar - Ganhando</div>
            </div>
        </div>
    </div>
</div>

<div id="toastAlerta" class="toast-notification"><span id="toastMensagem">Resultados atualizados!</span></div>

<script>
    let subTermosAtivos = [];

    // Mostra o painel avançado assim que o usuário digita um termo principal válido
    function verificarDigitacao(event) {
        const termoPrincipal = document.getElementById('inputBusca').value.trim();
        const painel = document.getElementById('painelSubfiltros');
        
        if (termoPrincipal.length > 2) {
            painel.style.display = "block";
            document.getElementById('configAtiva').innerText = `🎯 Alvo Principal do Robô: \${termoPrincipal.toUpperCase()}`;
        } else {
            painel.style.display = "none";
        }

        // Se apertar Enter, executa a busca direto
        if (event.key === "Enter") {
            executarBuscaUniversal();
        }
    }

    // Adiciona palavras secundárias dinamicamente para limitar o robô
    function adicionarSubTermo() {
        const inputSub = document.getElementById('inputSubTermo');
        const valor = inputSub.value.trim().toLowerCase();
        
        if (valor && !subTermosAtivos.includes(valor)) {
            subTermosAtivos.push(valor);
            inputSub.value = "";
            renderizarTags();
        }
    }

    function removerSubTermo(termo) {
        subTermosAtivos = subTermosAtivos.filter(t => t !== termo);
        renderizarTags();
    }

    function renderizarTags() {
        const lista = document.getElementById('listaTags');
        lista.innerHTML = "";
        subTermosAtivos.forEach(t => {
            lista.innerHTML += `
                <div class="tag-item">
                    <span>\${t}</span>
                    <span class="tag-remove" onclick="removerSubTermo('\${t}')">×</span>
                </div>
            `;
        });
    }

    // Filtra e executa o disparo simulado para qualquer entrada
    function executarBuscaUniversal() {
        const termo = document.getElementById('inputBusca').value.trim();
        const container = document.getElementById('containerResultados');
        
        if (!termo) {
            container.innerHTML = "Por favor, insira uma palavra-chave para buscar.";
            return;
        }

        // Tratamento de limpeza básico contra travamento de digitação rápida
        const termoLimpo = termo.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

        let stringFiltros = subTermosAtivos.length ? ` combinando com [ \${subTermosAtivos.join(', ')} ]` : "";

        container.innerHTML = `
            <div style="text-align: left;">
                <strong style="color: #4f46e5;">[Monitoramento Ativo]</strong><br>
                Buscando em tempo real nos portais por: <strong>"\${termo}"</strong>\${stringFiltros}.<br>
                <small style="color:#64748b;">Robô pronto para disparar lances baseados nas regras do edital localizado.</small>
            </div>
        `;
        
        const toast = document.getElementById('toastAlerta');
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    }

    // --- LÓGICA DO ROBÔ DE LANCES EFFECTI (Simulador de cores alternadas) ---
    let statusGanhando = true;
    setInterval(() => {
        const p = document.getElementById('painelRobo');
        const v = document.getElementById('valorLanceRobo');
        const t = document.getElementById('textoStatusRobo');
        
        if (statusGanhando) {
            v.innerText = "R$ 3.590.137,82";

