// ----- Sample test data -----
const families = [
  {
    name: "Smith Family",
    members: "John & Mary",
    image: "https://via.placeholder.com/300x200?text=Family+Photo"
  },
  {
    name: "Garcia Family",
    members: "Luis, Ana, Sofia",
    image: "https://via.placeholder.com/300x200?text=Family+Photo"
  },
  {
    name: "Johnson Family",
    members: "Mark & Emily",
    image: "https://via.placeholder.com/300x200?text=Family+Photo"
  }
];

// ----- Render function -----
function renderDirectory(list) {
  const directory = document.getElementById("directory");
  directory.innerHTML = "";

  list.forEach(family => {
    const card = document.createElement("div");
    card.style.width = "200px";
    card.style.border = "1px solid #ccc";
    card.style.borderRadius = "8px";
    card.style.padding = "10px";
    card.style.textAlign = "center";

    card.innerHTML = `
      <img src="${family.image}" 
           alt="${family.name}" 
           style="width:100%; border-radius:5px; margin-bottom:10px;">
      <strong>${family.name}</strong>
      <div style="font-size:14px; color:#555;">${family.members}</div>
    `;

    directory.appendChild(card);
  });
}

// ----- Search logic -----
document.getElementById("searchBox").addEventListener("input", function () {
  const query = this.value.toLowerCase();

  const filtered = families.filter(f =>
    f.name.toLowerCase().includes(query) ||
    f.members.toLowerCase().includes(query)
  );

  renderDirectory(filtered);
});

// ----- Initial load -----
renderDirectory(families);
