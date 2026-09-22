<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LicitaHub Suite - Robô de Lances</title>
    <style>
        :root { 
            --primary-color: #4f46e5; 
            --bg-color: #0b0f19; 
            --card-bg: #131926;
            --sidebar-color: #000000;
            --text-main: #f8fafc;
            --text-muted: #94a3b8;
        }
        body { font-family: 'Segoe UI', system-ui, sans-serif; background-color: var(--bg-color); margin: 0; padding: 0; display: flex; height: 100vh; color: var(--text-main); }
        
        /* Sidebar Idêntica ao seu Print Real */
        .sidebar { width: 280px; background-color: var(--sidebar-color); border-right: 1px solid #1e293b; padding: 20px; box-sizing: border-box; display: flex; flex-direction: column; }
        .brand { display: flex; align-items: center; gap: 12px; margin-bottom: 30px; padding-bottom: 15px; border-bottom: 1px solid #1e293b; }
        .brand-logo { background: #4f46e5; width: 36px; height: 36px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 1.2rem; }
        .brand-text h2 { margin: 0; font-size: 1rem; color: #fff; }
        .brand-text span { font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; }
        
        .sidebar-menu { list-style: none; padding: 0; margin: 0; overflow-y: auto; flex: 1; }
        .sidebar-menu li { padding: 12px 14px; border-radius: 8px; cursor: pointer; margin-bottom: 4px; font-size: 0.95rem; display: flex; align-items: center; gap: 12px; color: var(--text-muted); transition: all 0.2s; }
        .sidebar-menu li:hover, .sidebar-menu li.active { background-color: #1e293b; color: #fff; }
        .sidebar-menu li.active { border-left: 4px solid var(--primary-color); padding-left: 10px; background-color: rgba(255, 255, 255, 0.03); }
        .badge-beta { background: #ca8a04; color: #fff; font-size: 0.65rem; padding: 2px 6px; border-radius: 4px; font-weight: bold; margin-left: auto; }

        /* Área do Conteúdo */
        .main-content { flex: 1; padding: 30px; overflow-y: auto; box-sizing: border-box; }
        .dashboard-grid { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 25px; margin-top: 10px; }
        .card { background: var(--card-bg); border-radius: 12px; padding: 25px; border: 1px solid #1e293b; }
        .card h3 { margin-top: 0; margin-bottom: 20px; font-size: 1.1rem; color: #fff; border-bottom: 1px solid #1e293b; padding-bottom: 10px; }
        
        .search-group { display: flex; gap: 10px; margin-bottom: 15px; }
        input[type="text"] { width: 100%; padding: 12px 14px; background: #0f1420; border: 1px solid #1e293b; border-radius: 8px; font-size: 0.95rem; box-sizing: border-box; color: #fff; }
        input[type="text"]:focus { border-color: var(--primary-color); outline: none; }
        button { background-color: var(--primary-color); color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-weight: 600; transition: background 0.2s; }
        button:hover { background-color: #4338ca; }
        
        .subfiltro-container { background: #0f1420; padding: 15px; border-radius: 8px; margin-bottom: 15px; display: none; border: 1px solid #1e293b; }
        .subfiltro-title { font-size: 0.85rem; font-weight: bold; color: var(--text-muted); margin-bottom: 10px; text-transform: uppercase; }
        .tags-container { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; }
        .tag-item { background: #1e293b; padding: 6px 12px; border-radius: 20px; font-size: 0.85rem; display: flex; align-items: center; gap: 6px; color: #fff; }
        .tag-remove { color: #ef4444; cursor: pointer; font-weight: bold; }
        
        .results-box { border: 1px dashed #1e293b; border-radius: 8px; padding: 25px; text-align: center; color: var(--text-muted); background: #0f1420; }
        
        /* 🟩 Caixa do Robô de Lances (Estilo dinâmico Verde/Vermelho) 🟥 */
        .status-box { border-radius: 8px; padding: 25px; text-align: center; color: white; font-weight: bold; transition: background-color 0.4s ease; margin-top: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.4); }
        .status-value { font-size: 2.2rem; margin: 8px 0; letter-spacing: -0.5px; }
        .status-text { font-size: 1rem; background: rgba(0, 0, 0, 0.2); padding: 8px 14px; border-radius: 6px; display: inline-block; text-transform: uppercase; }
        .winning { background-color: #10b981; } /* Verde - Ganhando */
        .losing { background-color: #ef4444; }  /* Vermelho - Cobrindo Lance */
        
        .toast-notification { position: fixed; bottom: 20px; right: -350px; background-color: #1e293b; border-left: 4px solid #10b981; color: #fff; box-shadow: 0 10px 25px rgba(0,0,0,0.3); padding: 16px 20px; border-radius: 6px; transition: right 0.4s ease; z-index: 1000; }
        .toast-notification.show { right: 20px; }
    </style>
</head>
<body>

<!-- BARRA LATERAL ATUALIZADA COM O SEU DESIGN -->
<div class="sidebar">
    <div class="brand">
        <div class="brand-logo">L</div>
        <div class="brand-text">
            <h2>LicitaHub Suite</h2>
            <span>Gestão de Licitações</span>
        </div>
    </div>
    <ul class="sidebar-menu">
        <li>🏠 Home</li>
        <li>🔍 Buscar Licitações</li>
        <li class="active">🎯 Robô de Lances</li> <!-- MUDADO AQUI -->
        <li>❤️ Licitações favoritas</li>
        <li>📅 Calendário</li>
        <li>📁 Gestor de documentos</li>
        <li>📄 Gerador de proposta</li>
        <li>⚙️ Leitor de Edital IA <span class="badge-beta">BETA</span></li>
        <li>⚖️ Docs Jurídicos IA</li>
        <li>📝 Gerador de declarações</li>
        <li>📊 Pesquisa de Preço <span class="badge-beta">BETA</span></li>
    </ul>
</div>

<!-- CONTEÚDO PRINCIPAL DA TELA -->
<div class="main-content">
    <h2>🎯 Módulo: Robô de Lances</h2>
    <p style="color: var(--text-muted); margin-bottom: 25px;">Gerencie os filtros universais de monitoramento e acompanhe o comportamento das disputas.</p>

    <div class="dashboard-grid">
        <div class="card">
            <h3>Filtro Avançado de Alvos</h3>
            <div class="search-group">
                <input type="text" id="inputBusca" onkeyup="verificarDigitacao(event)" placeholder="Digite qualquer produto para o robô monitorar...">
                <button onclick="executarBuscaUniversal()">Buscar Portais</button>
            </div>
            
            <div id="painelSubfiltros" class="subfiltro-container">
                <div class="subfiltro-title">🎯 Restrições Secundárias para o Filtro:</div>
                <div class="search-group" style="margin-bottom: 5px;">
                    <input type="text" id="inputSubTermo" placeholder="Adicione marcas ou especificações do edital...">
                    <button onclick="adicionarSubTermo()" style="background-color: #334155; padding: 5px 12px;">+</button>
                </div>
                <div id="listaTags" class="tags-container"></div>
            </div>
            
            <div id="containerResultados" class="results-box">O sistema está aguardando diretivas. Insira um produto acima para abrir o escopo de subfiltros.</div>
        </div>
        
        <div class="card">
            <h3>Robô de Lances</h3>
            <div style="margin-bottom: 18px;">
                <label style="display:block; margin-bottom:6px; font-weight:600; color: var(--text-muted); font-size: 0.85rem;">VALOR LIMITE CONFIGURADO:</label>
                <input type="text" value="R$ 3.035.844,77" readonly style="background:#0f1420; color:#fff; width:100%; padding:12px; border:1px solid #1e293b; border-radius:8px; box-sizing:border-box; font-size: 1rem; font-weight: bold;">
            </div>
            <div id="configAtiva" style="font-size: 0.85rem; margin-bottom: 15px; color: #38bdf8; font-weight: 600;">Aguardando termo de pesquisa do operador...</div>
            
            <div id="painelRobo" class="status-box winning">
                <div style="font-size: 0.85rem; text-transform: uppercase; opacity: 0.8; letter-spacing: 0.5px;">Status do Robô</div>
                <div id="valorLanceRobo" class="status-value">R$ 3.590.137,82</div>
                <div id="textoStatusRobo" class="status-text">1º Lugar - Ganhando</div>
            </div>
        </div>
    </div>
</div>

<div id="toastAlerta" class="toast-notification"><span id="toastMensagem">Resultados atualizados!</span></div>

<script>
    let subTermosAtivos = [];
    const termosCorretos = { "dsecartaveis": "descartaveis", "descarteveis": "descartaveis" };

    function verificarDigitacao(event) {
        const termoPrincipal = document.getElementById('inputBusca').value.trim();
        const painel = document.getElementById('painelSubfiltros');
        const container = document.getElementById('containerResultados');
        
        if (termosCorretos[termoPrincipal.toLowerCase()]) {
            const sug = termosCorretos[termoPrincipal.toLowerCase()];
            container.innerHTML = `<div style="color:#ef4444; padding: 10px;">⚠️ Palavra-chave inválida! O robô sugere: <button onclick="aplicarCorrecao('${sug}')" style="background:#10b981; color:white; border:none; border-radius:4px; padding:4px 8px; cursor:pointer; font-weight:bold;">${sug}</button></div>`;
            painel.style.display = "none";
            return;
        }

        if (termoPrincipal.length > 2) {
            painel.style.display = "block";
            document.getElementById('configAtiva').innerText = `🎯 Alvo Ativo no Radar: ${termoPrincipal.toUpperCase()}`;
        } else {
            painel.style.display = "none";
        }

        if (event.key === "Enter") executarBuscaUniversal();
    }

