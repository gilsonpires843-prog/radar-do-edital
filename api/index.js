

<!-- ======================================================================= -->
<!-- COPIE APENAS ESTE BLOCO CENTRAL E INSIRA NA ÁREA DE CONTEÚDO DO LICITAHUB SUITE -->
<!-- ======================================================================= -->
<div style="display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 25px; margin-top: 20px; padding: 10px; font-family: 'Segoe UI', system-ui, sans-serif;">
    
    <!-- 🔍 COLUNA DA BUSCA UNIVERSAL POR PALAVRA-CHAVE -->
    <div style="background: #131926; border-radius: 12px; padding: 25px; border: 1px solid #1e293b;">
        <h3 style="margin-top: 0; color: #fff; border-bottom: 1px solid #1e293b; padding-bottom: 10px; font-size: 1.1rem;">Filtro Avançado de Alvos</h3>
        
        <!-- Grupo de Busca Principal -->
        <div style="display: flex; gap: 10px; margin-bottom: 15px;">
            <input type="text" id="inputBuscaUniversal" onkeyup="gerenciarDigitacaoUniversal(event)" placeholder="Digite qualquer produto para o robô monitorar..." style="width: 100%; padding: 12px 14px; background: #0f1420; border: 1px solid #1e293b; border-radius: 8px; color: #fff; font-size: 0.95rem;">
            <button onclick="dispararBuscaUniversal()" style="background-color: #4f46e5; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 0.95rem;">Buscar Portais</button>
        </div>
        
        <!-- Painel Avançado de Sub-restrições (Aparece dinamicamente para qualquer produto) -->
        <div id="painelRestricoesIA" style="background: #0f1420; padding: 15px; border-radius: 8px; margin-bottom: 15px; display: none; border: 1px solid #1e293b;">
            <div style="font-size: 0.85rem; font-weight: bold; color: #94a3b8; margin-bottom: 10px; text-transform: uppercase;">🎯 Restrições Secundárias para o Filtro:</div>
            <div style="display: flex; gap: 10px; margin-bottom: 5px;">
                <input type="text" id="inputSubTermoUniversal" placeholder="Adicione marcas, modelos ou especificações..." style="width: 100%; padding: 12px 14px; background: #0f1420; border: 1px solid #1e293b; border-radius: 8px; color: #fff; font-size: 0.95rem;">
                <button onclick="adicionarTagFiltro()" style="background-color: #334155; color: white; border: none; padding: 5px 15px; border-radius: 8px; cursor: pointer; font-weight: bold;">+</button>
            </div>
            <div id="containerTagsFiltro" style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px;"></div>
        </div>
        
        <!-- Caixa de Resultados (Onde o aviso flutuante antigo travava, agora corrigido) -->
        <div id="caixaResultadosRadar" style="border: 1px dashed #1e293b; border-radius: 8px; padding: 25px; text-align: center; color: #94a3b8; background: #0f1420; font-size: 0.95rem;">
            O sistema está aguardando diretivas. Insira um produto acima para iniciar o rastreamento estratégico.
        </div>
    </div>
    
    <!-- 🤖 COLUNA DO ROBÔ DE LANCES (ESTILO EFFECTI) -->
    <div style="background: #131926; border-radius: 12px; padding: 25px; border: 1px solid #1e293b;">
        <h3 style="margin-top: 0; color: #fff; border-bottom: 1px solid #1e293b; padding-bottom: 10px; font-size: 1.1rem;">Robô de Lances</h3>
        
        <div style="margin-bottom: 18px;">
            <label style="display:block; margin-bottom:6px; font-weight:600; color: #94a3b8; font-size: 0.85rem; text-transform: uppercase;">Valor Limite Configurado:</label>
            <input type="text" value="R$ 3.035.844,77" readonly style="background:#0f1420; color:#fff; width:100%; padding:12px; border:1px solid #1e293b; border-radius:8px; box-sizing:border-box; font-size: 1rem; font-weight: bold; letter-spacing: 0.5px;">
        </div>
        
        <div id="identificadorAlvoAtivo" style="font-size: 0.85rem; margin-bottom: 15px; color: #38bdf8; font-weight: 600;">Aguardando termo de pesquisa do operador...</div>
        
        <!-- Caixa de Status que altera dinamicamente (Verde / Vermelho) -->
        <div id="blocoStatusEfecti" class="status-vencedor" style="border-radius: 8px; padding: 25px; text-align: center; color: white; font-weight: bold; transition: background-color 0.4s ease; margin-top: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.3);">
            <div style="font-size: 0.85rem; text-transform: uppercase; opacity: 0.8; letter-spacing: 0.5px;">Status do Robô</div>
            <div id="valorLanceDinamico" style="font-size: 2.2rem; margin: 8px 0; letter-spacing: -0.5px;">R$ 3.590.137,82</div>
            <div id="textoStatusDinamico" style="font-size: 1rem; background: rgba(0, 0, 0, 0.2); padding: 8px 14px; border-radius: 6px; display: inline-block; text-transform: uppercase; letter-spacing: 0.5px;">1º Lugar - Ganhando</div>
        </div>
    </div>
</div>

<!-- 💬 CAIXINHA FLUTUANTE DE ALERTA (TOAST) CORRIGIDA -->
<div id="alertaFlutuanteRadar" style="position: fixed; bottom: 20px; right: -350px; background-color: #1e293b; border-left: 4px solid #10b981; color: #fff; box-shadow: 0 10px 25px rgba(0,0,0,0.4); padding: 16px 20px; border-radius: 6px; transition: right 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); z-index: 1000; display: flex; align-items: center; gap: 10px; font-family: sans-serif;">
    <span style="color: #10b981; font-weight: bold;">✓</span>
    <span id="mensagemAlertaFlutuante">Resultados atualizados!</span>
</div>

<!-- 🎨 ESTILOS EXCLUSIVOS DO ROBÔ -->
<style>
    .status-vencedor { background-color: #10b981 !important; } /* Verde Effecti */
    .status-perdedor { background-color: #ef4444 !important; } /* Vermelho Effecti */
    .tag-filtro-item { background: #1e293b; padding: 6px 12px; border-radius: 20px; font-size: 0.85rem; display: flex; align-items: center; gap: 6px; color: #fff; border: 1px solid #334155; }
    .btn-remover-tag { color: #ef4444; cursor: pointer; font-weight: bold; margin-left: 4px; }
    .alerta-show { right: 20px !important; }
</style>

<!-- 🧠 INTELIGÊNCIA DE DISPARO DA BUSCA UNIVERSAL E ANIMAÇÃO -->
<script>
    let tagsSecundariasAtivas = [];
    const dicionarioErrosComuns = { "dsecartaveis": "descartaveis", "descarteveis": "descartaveis" };

    function gerenciarDigitacaoUniversal(event) {
        const termo = document.getElementById('inputBuscaUniversal').value.trim();
        const painel = document.getElementById('painelRestricoesIA');
        const container = document.getElementById('caixaResultadosRadar');
        
        // Correção imediata caso digite errado na busca rápida
        if (dicionarioErrosComuns[termo.toLowerCase()]) {
            const correcao = dicionarioErrosComuns[termo.toLowerCase()];
            container.innerHTML = `<div style="color:#ef4444; padding: 5px; font-weight: 600;">⚠️ Palavra-chave inválida! O robô sugere buscar por: <button onclick="aplicarCorrecaoOrtografica('${correcao}')" style="background:#10b981; color:white; border:none; border-radius:4px; padding:4px 12px; cursor:pointer; font-weight:bold; margin-left:5px;">${correcao}</button></div>`;
            painel.style.display = "none";
            return;
        }

        if (termo.length > 2) {
            painel.style.display = "block";
            document.getElementById('identificadorAlvoAtivo').innerText = `🎯 Alvo Ativo no Radar: ${termo.toUpperCase()}`;
        } else {
            painel.style.display = "none";
        }

        if (event.key === "Enter") dispararBuscaUniversal();
    }

    function aplicarCorrecaoOrtografica(termoCorreto) {
        document.getElementById('inputBuscaUniversal').value = termoCorreto;
        gerenciarDigitacaoUniversal({key:""});
        dispararBuscaUniversal();
    }

    function adicionarTagFiltro() {
        const input = document.getElementById('inputSubTermoUniversal');
        const valor = input.value.trim().toLowerCase();
        if (valor && !tagsSecundariasAtivas.includes(valor)) {
            tagsSecundariasAtivas.push(valor);
            input.value = "";
            desenharTagsFiltro();
        }
    }

    function removerTagFiltro(termo) {
        tagsSecundariasAtivas = tagsSecundariasAtivas.filter(t => t !== termo);
        desenharTagsFiltro();
    }

    function desenharTagsFiltro() {
        const lista = document.getElementById('containerTagsFiltro');
        lista.innerHTML = "";
        tagsSecundariasAtivas.forEach(t => {
            lista.innerHTML += `<div class="tag-filtro-item"><span>${t}</span><span class="btn-remover-tag" onclick="removerTagFiltro('${t}')">×</span></div>`;
        });
    }

    // CORREÇÃO DO BUG: A caixinha flutuante só é acionada após o clique real da busca
    function dispararBuscaUniversal() {
        const termo = document.getElementById('inputBuscaUniversal').value.trim();
        const container = document.getElementById('caixaResultadosRadar');
        if (!termo) return;

        let complementoFiltros = tagsSecundariasAtivas.length ? ` combinando os subfiltros [ ${tagsSecundariasAtivas.join(', ')} ]` : "";
        container.innerHTML = `
            <div style="text-align: left; line-height: 1.6; padding: 5px; color: #fff;">
                <strong style="color: #38bdf8;">[Rastreamento Ativo nos Portais]</strong><br>
                Sincronizando editais eletrônicos encontrados para: <strong>"${termo}"</strong>${complementoFiltros}.<br>
                <small style="color: #94a3b8;">Módulo Robô de Lances monitorando a sala de disputa pública.</small>
            </div>
        `;
        
        exibirToastFlutuante("Resultados atualizados com sucesso!");
    }

    function exibirToastFlutuante(msg) {
        const toast = document.getElementById('alertaFlutuanteRadar');
        document.getElementById('mensagemAlertaFlutuante').innerText = msg;
        toast.classList.add('alerta-show');
        
        setTimeout(() => {
            toast.classList.remove('alerta-show');
        }, 3000);
    }

