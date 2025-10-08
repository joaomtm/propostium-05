// Estado
let baseFontSize = 18; // px (min 12, max 28)
const MIN_FONT = 12;
const MAX_FONT = 28;

// Caminhos originais e brancos para as imagens laterais
const imagesConfig = {
  left: {
    original: "assets/img/VICTOR FRANKL PP.png",
    white: "assets/img/VICTOR_FRANKL_PP_branco.png"
  },
  right: {
    original: "assets/img/Bonequinho PP.png",
    white: "assets/img/Bonequinho_PP_branco.png"
  }
};

// Espera DOM pronto
document.addEventListener('DOMContentLoaded', () => {
  // Elementos
  const decreaseBtn = document.getElementById("decrease-font");
  const increaseBtn = document.getElementById("increase-font");
  const toggleContrastBtn = document.getElementById("toggle-contrast");
  const helpBtn = document.getElementById("help-btn");

  const chatContainer = document.getElementById("chat-container");
  const placeholder = document.querySelector(".placeholder");
  const userInput = document.getElementById("user-input");
  const sendBtn = document.getElementById("send-btn");

  const body = document.body;
  const headerTitle = document.querySelector("header h1");

  const imageLeft = document.querySelector(".image-left");
  const imageRight = document.querySelector(".image-right");

  const helpModal = document.getElementById("help-modal");
  const closeHelp = document.getElementById("close-help");

  // Fonte
  function setRootFontSize(px) {
    const clamped = Math.max(MIN_FONT, Math.min(MAX_FONT, px));
    baseFontSize = clamped;
    document.documentElement.style.fontSize = baseFontSize + "px";
    document.documentElement.style.setProperty('--base-font-size', baseFontSize + "px");
    document.documentElement.setAttribute('data-font-size', baseFontSize);
  }

  // Visibilidade do chat
  function toggleChatVisibility(showChat) {
    if (showChat) {
      if (placeholder) placeholder.classList.add("hidden");
      if (chatContainer) chatContainer.classList.remove("hidden");
    } else {
      if (placeholder) placeholder.classList.remove("hidden");
      if (chatContainer) chatContainer.classList.add("hidden");
    }
  }

  // Mensagens
  function addMessage(text, sender) {
    if (!chatContainer) return;
    toggleChatVisibility(true);

    const wrapper = document.createElement("div");
    wrapper.classList.add("message-wrapper");

    const msg = document.createElement("div");
    msg.classList.add("message", sender);
    msg.innerHTML = sender === "user"
      ? `<strong>Você:</strong><br>${escapeHtml(text)}`
      : `<strong>Propositum:</strong><br>${escapeHtml(text)}`;

    wrapper.appendChild(msg);
    chatContainer.appendChild(wrapper);

    chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: "smooth" });
    showScrollbar();
  }

  function escapeHtml(unsafe) {
    return unsafe
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function showScrollbar() {
    if (!chatContainer) return;
    chatContainer.classList.add("scrolling");
    setTimeout(() => chatContainer.classList.remove("scrolling"), 2000);
  }

  // Contraste e imagens
  function toggleHighContrast() {
    const isOn = body.classList.toggle("high-contrast");
    if (toggleContrastBtn) toggleContrastBtn.setAttribute("aria-pressed", isOn ? "true" : "false");

    if (imageLeft && imageRight) {
      imageLeft.src = isOn ? imagesConfig.left.white : imagesConfig.left.original;
      imageRight.src = isOn ? imagesConfig.right.white : imagesConfig.right.original;
    }

    if (headerTitle) headerTitle.style.color = isOn ? "#fff" : "";
    if (placeholder) placeholder.style.color = isOn ? "#fff" : "";
  }

  // Modal de ajuda
  function openHelp() {
    if (!helpModal) return;
    helpModal.classList.remove("hidden");
    helpModal.setAttribute("aria-hidden", "false");
    if (closeHelp) closeHelp.focus();
    document.addEventListener("keydown", escToClose);
    helpModal.addEventListener("click", backdropToClose);
  }

  function closeHelpModal() {
    if (!helpModal) return;
    helpModal.classList.add("hidden");
    helpModal.setAttribute("aria-hidden", "true");
    if (helpBtn) helpBtn.focus();
    document.removeEventListener("keydown", escToClose);
    helpModal.removeEventListener("click", backdropToClose);
  }

  function escToClose(e) {
    if (e.key === "Escape") closeHelpModal();
  }

  function backdropToClose(e) {
    if (e.target === helpModal) closeHelpModal();
  }

  // Envio de mensagem para a API
  async function enviarMensagemParaAPI(pergunta) {
    try {
      const resposta = await fetch("/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ pergunta })
      });

      const dados = await resposta.json();

      if (resposta.ok && dados.resposta) {
        addMessage(dados.resposta, "bot");
      } else {
        addMessage("Desculpe, houve um erro ao processar sua pergunta.", "bot");
      }
    } catch (erro) {
      console.error("Erro na API:", erro);
      addMessage("Erro de conexão com o servidor. Verifique se o back-end está ativo.", "bot");
    }
  }

  // Listeners
  if (decreaseBtn) decreaseBtn.addEventListener("click", () => setRootFontSize(baseFontSize - 2));
  if (increaseBtn) increaseBtn.addEventListener("click", () => setRootFontSize(baseFontSize + 2));
  if (toggleContrastBtn) toggleContrastBtn.addEventListener("click", toggleHighContrast);

  if (helpBtn) helpBtn.addEventListener("click", openHelp);
  if (closeHelp) closeHelp.addEventListener("click", closeHelpModal);

  if (sendBtn && userInput) {
    sendBtn.addEventListener("click", () => {
      const text = userInput.value.trim();
      if (!text) return;
      addMessage(text, "user");
      userInput.value = "";
      enviarMensagemParaAPI(text);
    });

    userInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        sendBtn.click();
      }
    });
  }

  // Inicializa
  setRootFontSize(baseFontSize);
  toggleChatVisibility(false);
});
