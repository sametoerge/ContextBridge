function showNotification(message) {
  const toast = document.createElement("div");
  toast.textContent = message;
  Object.assign(toast.style, {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    backgroundColor: "#111827",
    color: "#10B981",
    padding: "12px 20px",
    borderRadius: "8px",
    fontFamily: "sans-serif",
    fontSize: "14px",
    fontWeight: "bold",
    zIndex: "999999",
    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
    border: "1px solid #10B981"
  });
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2500);
}

// Sadece kaydetme motoru (Güvenli ve kararlı)
document.addEventListener("keydown", (e) => {
  if (e.altKey && e.key.toLowerCase() === "s") {
    e.preventDefault();
    const selectedText = window.getSelection().toString().trim();
    if (!selectedText) {
      showNotification("⚠️ Önce bir metin seçmelisin!");
      return;
    }

    const contextItem = {
      id: Date.now(),
      text: selectedText,
      source: document.title.slice(0, 30),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    chrome.storage.local.get({ contexts: [] }, (data) => {
      const updated = [contextItem, ...data.contexts].slice(0, 10);
      chrome.storage.local.set({ contexts: updated }, () => {
        showNotification("⚡ Bağlam Hafızaya Alındı!");
      });
    });
  }
});