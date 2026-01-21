const directory = document.getElementById("directory");

// TEMPORARY test data (hard-coded)
const testFamilies = [
  {
    familyName: "Smith",
    parents: "John & Jane",
    children: "Thomas, Lucy",
    address: "123 Main St.",
    phones: ["John: 214-555-1234", "Jane: 214-555-5678"],
    emails: ["smith@gmail.com"],
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/512px-Placeholder_view_vector.svg.png"
  },
  {
    familyName: "Garcia",
    parents: "Miguel & Ana",
    children: "",
    address: "456 Oak Ave.",
    phones: ["Miguel: 214-555-0000"],
    emails: ["garcia@email.com"],
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/512px-Placeholder_view_vector.svg.png"
  }
];

// Render cards
testFamilies.forEach(family => {
  const card = document.createElement("div");
  card.className = "card";

  const img = document.createElement("img");
  img.src = family.image;
  img.alt = family.familyName;
  card.appendChild(img);

  const title = document.createElement("h3");
  title.textContent = family.familyName;
  card.appendChild(title);

  if (family.parents) {
    const parents = document.createElement("p");
    parents.textContent = family.parents;
    card.appendChild(parents);
  }

  if (family.children) {
    const children = document.createElement("p");
    children.textContent = family.children;
    card.appendChild(children);
  }

  if (family.address) {
    const address = document.createElement("p");
    address.textContent = family.address;
    card.appendChild(address);
  }

  family.phones.forEach(phone => {
    const p = document.createElement("p");
    p.textContent = phone;
    card.appendChild(p);
  });

  family.emails.forEach(email => {
    const e = document.createElement("p");
    e.textContent = email;
    card.appendChild(e);
  });

  directory.appendChild(card);
});
