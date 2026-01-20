// Replace with your published Display CSV URL
const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vReXFZkUzJu7IR9ukhvAXZKCEa0oYUpYZis9g3Lq9RmauoFyCh0Vrco6k2LHAEI4rBhMv-dM6h37iI5/pub?gid=379130877&single=true&output=csv";

const directory = document.getElementById("directory");
const searchBox = document.getElementById("searchBox");
let cards = [];

// Robust CSV parser to handle quoted cells and commas inside quotes
function parseCSV(text) {
  const lines = text.split(/\r?\n/);
  return lines.map(line => {
    const regex = /("([^"]*(?:""[^"]*)*)"|[^,]+)/g;
    const result = [];
    let match;
    while ((match = regex.exec(line)) !== null) {
      result.push(match[2] ? match[2].replace(/""/g, '"') : match[1]);
    }
    return result;
  });
}

// Fetch CSV and render directory
fetch(csvUrl)
  .then(res => res.text())
  .then(csvText => {
    const rows = parseCSV(csvText).slice(1); // skip header row

    rows.forEach(cols => {
  // Only process rows where the first column (Last Name) is not empty AND is not the header
  if (!cols[0] || cols[0].toLowerCase().includes("last name")) return;

      // ----- Last Name -----
      const lastName = cols[0].trim();

      // ----- Parents -----
      const parent1 = cols[1] ? cols[1].trim() : "";
      const parent2 = cols[2] ? cols[2].trim() : "";
      const parents = [parent1, parent2].filter(n => n !== "");

      // ----- Children -----
      const childrenStr = cols[3] ? cols[3].trim() : "";
      const children = childrenStr ? childrenStr.split(",").map(n => n.trim()) : [];

      // ----- Photo URL -----
      const photoUrl = cols[4] ? cols[4].trim() : "";
      const placeholderUrl = "https://via.placeholder.com/160x160.png?text=No+Photo";

      // ----- Address -----
      const address = cols[5] ? cols[5].trim() : "";

      // ----- Phones -----
      const phonesRaw = cols[6] ? cols[6].trim() : "";
      const phoneList = phonesRaw ? phonesRaw.split(";").map(p => {
        const parts = p.split(":");
        return parts.length === 2 ? `${parts[0].trim()}: ${parts[1].trim()}` : p.trim();
      }) : [];

      // ----- Emails -----
      const emailsRaw = cols[7] ? cols[7].trim() : "";
      const emailList = emailsRaw ? emailsRaw.split(";").map(e => {
        const parts = e.split(":");
        return parts.length === 2 ? `${parts[0].trim()}: ${parts[1].trim()}` : e.trim();
      }) : [];

      // ----- Create Card -----
      const card = document.createElement("div");
      card.className = "card";
      card.style.height = "auto"; // flexible height
      card.style.overflow = "visible";
      card.innerHTML = `
        <img src="${photoUrl}" alt="${lastName}" 
             onerror="this.onerror=null;this.src='${placeholderUrl}'">
        <h3>${lastName}</h3>
        ${parents.length ? `<p>${parents.join(" & ")}</p>` : ""}
        ${children.length ? `<p>${children.join(", ")}</p>` : ""}
        ${address ? `<p>${address}</p>` : ""}
        ${phoneList.length ? `<p>${phoneList.join("<br>")}</p>` : ""}
        ${emailList.length ? `<p>${emailList.join("<br>")}</p>` : ""}
      `;
      directory.appendChild(card);

      // ----- Add to search index -----
      cards.push({
        element: card,
        text: (
          lastName + " " +
          parents.join(" ") + " " +
          children.join(" ") + " " +
          phoneList.join(" ") + " " +
          emailList.join(" ") + " " +
          address
        ).toLowerCase()
      });
    });
  })
  .catch(err => {
    directory.innerHTML = "<p style='color:red;'>Error loading CSV. Check the URL and publishing settings.</p>";
    console.error(err);
  });

// ----- Search filter -----
searchBox.addEventListener("input", function() {
  const query = this.value.toLowerCase();
  cards.forEach(card => {
    card.element.style.display = card.text.includes(query) ? "block" : "none";
  });
});
