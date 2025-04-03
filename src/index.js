let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const toyCollection = document.getElementById("toy-collection");
  const toyForm = document.querySelector(".add-toy-form");
  const toyURL = "http://localhost:3000/toys";

  // Toggle the toy form visibility
  addBtn.addEventListener("click", () => {
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  // Fetch and display all toys
  function fetchToys() {
    fetch(toyURL)
      .then(response => response.json())
      .then(toys => toys.forEach(renderToy));
  }

  // Render a toy card
  function renderToy(toy) {
    const toyCard = document.createElement("div");
    toyCard.className = "card";
    toyCard.innerHTML = `
      <h2>${toy.name}</h2>
      <img src="${toy.image}" class="toy-avatar" />
      <p>${toy.likes} Likes</p>
      <button class="like-btn" id="${toy.id}">Like ❤️</button>
    `;
    toyCollection.appendChild(toyCard);

    // Like button event listener
    toyCard.querySelector(".like-btn").addEventListener("click", () => increaseLikes(toy, toyCard));
  }

  // Handle form submission
  toyForm.addEventListener("submit", event => {
    event.preventDefault();
    const toyData = {
      name: event.target.name.value,
      image: event.target.image.value,
      likes: 0,
    };
    createToy(toyData);
    toyForm.reset();
  });

  // Create new toy (POST request)
  function createToy(toyData) {
    fetch(toyURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(toyData),
    })
      .then(response => response.json())
      .then(renderToy);
  }

  // Increase likes (PATCH request)
  function increaseLikes(toy, toyCard) {
    const newLikes = toy.likes + 1;
    fetch(`${toyURL}/${toy.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ likes: newLikes }),
    })
      .then(response => response.json())
      .then(updatedToy => {
        toyCard.querySelector("p").textContent = `${updatedToy.likes} Likes`;
        toy.likes = updatedToy.likes;
      });
  }

  fetchToys();
});
