const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vReXFZkUzJu7IR9ukhvAXZKCEa0oYUpYZis9g3Lq9RmauoFyCh0Vrco6k2LHAEI4rBhMv-dM6h37iI5/pub?gid=379130877&single=true&output=csv"; // Replace with your published Google Sheet CSV
const directory = document.getElementById("directory");
const searchBox = document.getElementById("searchBox");
let cards = [];

fetch(csvUrl)
  .then(res => res.text())
  .then(text => {
    const rows = text.split("\n").slice(2); // skip buffer + header

    rows.forEach(row => {
      if (!row.trim()) return;

      const cols = row.split(",").slice(1); // skip buffer column
      if (!cols[0]) return;

      // ----- Last Name -----
      let rawName = cols[0].replace(/^"|"$/g, "").trim();
      if (rawName.toLowerCase().includes("family name")) return;
      let lastName = rawName;

      // ----- Parents & Children -----
      let parents = [];
      let children = [];
      if (cols[1]) { // Parents column
        parents = cols[1].split(",").map(n => n.replace(/^"|"$/g, "").trim());
      }
      if (cols[2]) { // Children column
        children = cols[2].split(",").map(n => n.replace(/^"|"$/g, "").trim());
      }

      // ----- Photo URL -----
      let photoUrl = cols[3] ? cols[3].replace(/^"|"$/g, "").trim() : "";
      const placeholderUrl = "https://via.placeholder.com/160x160.png?text=No+Photo";

      // ----- Address -----
      const address = cols[4] ? cols[4].replace(/^"|"$/g, "").trim() : "";

      // ----- Phones -----
      const phoneCell = cols[5] ? cols[5].replace(/^"|"$/g, "").trim() : "";
      const phoneList = phoneCell ? phoneCell.split(";").map(p => {
        const parts = p.split(":");
        return parts.length === 2 ? `${parts[0].trim()}: ${parts[1].trim()}` : p.trim();
      }) : [];

      // ----- Emails -----
      const emailCell = cols[6] ? cols[6].replace(/^"|"$/g, "").trim() : "";
      const emailList = emailCell ? emailCell.split(";").map(e => {
        const parts = e.split(":");
        return parts.length === 2 ? `${parts[0].trim()}: ${parts[1].trim()}` : e.trim();
      }) : [];

      // ----- Create Card -----
      const card = document.createElement("div");
      card.className = "card";
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

      // ----- Add to Search Index -----
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
    directory.innerHTML = "<p style='color:red;'>Error loading data. Check CSV URL and publishing.</p>";
    console.error(err);
  });

// ----- Search Filter -----
searchBox.addEventListener("input", function() {
  const query = this.value.toLowerCase();
  cards.forEach(card => {
    card.element.style.display = card.text.includes(query) ? "block" : "none";
  });
});
