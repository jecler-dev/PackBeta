// ==UserScript==
// @name         BetaScripts Loader
// @namespace    ProjetoMarven
// @version      1.0
// @description  Painel lateral que carrega scripts do GitHub
// @match        https://*.tribalwars.com.br/*
// @grant        none
// @updateURL    https://raw.githubusercontent.com/SEUUSUARIO/tw-scripts/main/loader.user.js
// @downloadURL  https://raw.githubusercontent.com/SEUUSUARIO/tw-scripts/main/loader.user.js
// ==/UserScript==

(function() {
    'use strict';

    const GITHUB_JSON = "https://raw.githubusercontent.com/SEUUSUARIO/tw-scripts/main/buttons.json";
    const STORAGE_KEY = "BetaScriptsButtons";
    const BUTTON_HEIGHT = 32;
    const BUTTON_WIDTH = 120;
    const BUTTON_MARGIN = 3;

    let buttonsData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    const btnsContainer = [];

    function saveData(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(buttonsData)); }

    // BUSCA buttons.json no GitHub
    async function loadGithubButtons(){
        try{
            const res = await fetch(GITHUB_JSON + "?t=" + Date.now());
            const data = await res.json();
            if(Array.isArray(data)){
                buttonsData = data;
                saveData();
                createFloatingButtons();
                console.log("BetaScripts carregados do GitHub");
            }
        }catch(err){
            console.log("GitHub offline, usando cache local");
            createFloatingButtons();
        }
    }

    // CARREGA SCRIPT
    function handleButtonClick(button,url){
        if(!url) return;
        if(document.querySelector(`script[src="${url}"]`)){
            button.innerText="⚠ Já ativo";
            return;
        }
        button.innerText="Carregando...";
        const script = document.createElement("script");
        script.src = url;
        script.onload = () => { button.innerText="✅ Ativo"; button.style.background="#2e9b45"; };
        script.onerror = () => { button.innerText="❌ Erro"; button.style.background="#b32f2f"; };
        document.head.appendChild(script);
    }

    // CRIA MENU
    function createFloatingButtons(){
        btnsContainer.forEach(b=>b.remove());
        btnsContainer.length=0;

        // CABEÇALHO
        const header = document.createElement("div");
        header.innerText = "BetaScripts";
        header.style.position="fixed";
        header.style.right="15px";
        header.style.top="40px";
        header.style.width=`${BUTTON_WIDTH}px`;
        header.style.height=`${BUTTON_HEIGHT}px`;
        header.style.background="#E0D8B0";
        header.style.color="#000";
        header.style.border="2px solid #000";
        header.style.borderRadius="6px";
        header.style.fontFamily="Verdana, Arial, sans-serif";
        header.style.fontSize="12px";
        header.style.fontWeight="bold";
        header.style.textAlign="center";
        header.style.lineHeight=`${BUTTON_HEIGHT-4}px`;
        header.style.boxShadow="2px 2px 5px rgba(0,0,0,0.4)";
        header.style.zIndex="99999";
        document.body.appendChild(header);
        btnsContainer.push(header);

        // BOTÕES
        buttonsData.forEach((bData,index)=>{
            const btn = document.createElement("button");
            btn.innerText = bData.name;
            btn.style.position="fixed";
            btn.style.right="15px";
            btn.style.top=`${40+(index+1)*(BUTTON_HEIGHT+BUTTON_MARGIN)}px`;
            btn.style.width=`${BUTTON_WIDTH}px`;
            btn.style.height=`${BUTTON_HEIGHT}px`;
            btn.style.background="#E0D8B0";
            btn.style.color="#000";
            btn.style.border="2px solid #000";
            btn.style.borderRadius="6px";
            btn.style.fontFamily="Verdana, Arial, sans-serif";
            btn.style.fontSize="12px";
            btn.style.fontWeight="bold";
            btn.style.cursor="pointer";
            btn.style.textAlign="center";
            btn.style.lineHeight=`${BUTTON_HEIGHT-4}px`;
            btn.style.boxShadow="2px 2px 5px rgba(0,0,0,0.4)";
            btn.style.zIndex="99999";
            btn.onclick = ()=>handleButtonClick(btn,bData.link);
            document.body.appendChild(btn);
            btnsContainer.push(btn);
        });
    }

    // INICIALIZA
    loadGithubButtons();
})();
