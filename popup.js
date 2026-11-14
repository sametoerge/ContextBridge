let allContexts = [];

function renderList() {
  const searchInput = document.getElementById("searchBox");
  const categoryFilter = document.getElementById("categoryFilter");
  
  const query = searchInput ? searchInput.value.toLowerCase().trim() : "";
  const selectedCategory = categoryFilter ? categoryFilter.value : "all";

  const list = document.getElementById("list");
  list.innerHTML = "";

  // Filtreleme (Arama metni ve Kategoriye göre)
  const filtered = allContexts.filter(item => {
    const text = (item.text || "").toLowerCase();
    const source = (item.source || "").toLowerCase();
    const category = item.category || "Not"; // Varsayılan kategori Not

    const matchesQuery = text.includes(query) || source.includes(query);
    const matchesCategory = selectedCategory === "all" || category === selectedCategory;

    return matchesQuery && matchesCategory;
  });

  if (filtered.length === 0) {
    list.innerHTML = "<p style='font-size:12px; color:#64748b; text-align:center; padding: 10px;'>Eşleşen bağlam bulunamadı.</p>";
    return;
  }

  filtered.forEach((item) => {
    const div = document.createElement("div");
    div.className = "card";
    const category = item.category || "Not";
    
    div.innerHTML = `
      <div class="meta">
        <span>${item.source}</span>
        <div>
          <span class="badge">${category}</span>
          <span style="margin-left: 4px;">${item.timestamp}</span>
        </div>
      </div>
      <div class="text">${item.text}</div>
    `;
    
    // Karta tıklandığında panoya kopyala
    div.onclick = () => {
      navigator.clipboard.writeText(item.text).then(() => {
        div.style.borderColor = "#38bdf8";
        div.querySelector(".text").style.color = "#38bdf8";
        setTimeout(() => {
          div.style.borderColor = "#10b981";
          div.querySelector(".text").style.color = "#f8fafc";
        }, 500);
      });
    };
    
    list.appendChild(div);
  });
}

function loadData() {
  chrome.storage.local.get({ contexts: [] }, (data) => {
    allContexts = data.contexts;
    renderList();
  });
}

// Dinleyiciler
document.getElementById("searchBox").addEventListener("input", renderList);
document.getElementById("categoryFilter").addEventListener("change", renderList);

document.getElementById("clear").onclick = () => {
  if (confirm("Tüm hafızayı temizlemek istediğine emin misin?")) {
    chrome.storage.local.set({ contexts: [] }, () => {
      allContexts = [];
      renderList();
    });
  }
};

loadData();