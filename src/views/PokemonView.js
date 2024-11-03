export class PokemonView {
  constructor() {
    this.pokedex = document.getElementById("pokedex");
    this.loadingMessage = document.querySelector(".cargandoDatos");
    this.consoleElements = document.querySelectorAll(".input, .btnMenu");
    this.modal = document.getElementById("modal");
    this.closeBtn = document.querySelector(".close");
    
    this.setupModalEvents();
  }

  setupModalEvents() {
    const btnVerLista = document.getElementById("btnVerLista");
    btnVerLista.onclick = () => {
      this.showModal();
    };

    this.closeBtn.onclick = () => {
      this.hideModal();
    };

    window.onclick = (event) => {
      if (event.target === this.modal) {
        this.hideModal();
      }
    };
  }

  async showModal() {
    this.modal.style.display = "flex"; // Mostrar el modal
  }

  hideModal() {
    this.modal.style.display = "none"; // Ocultar el modal
  }

  showLoading() {
    document.querySelector("#button").style.visibility = "hidden";
    this.loadingMessage.style.visibility = "visible";
    this.pokedex.style.visibility = "hidden";
  }

  hideLoading() {
    this.loadingMessage.style.visibility = "hidden";
    this.pokedex.style.visibility = "visible";
  }

  showConsole() {
    this.consoleElements.forEach((e) => (e.style.visibility = "visible"));
  }

  displayPokemons(pokemons) {
    this.pokedex.innerHTML = "";
    pokemons.forEach((pokemon) => {
      let types = pokemon.pkm_type.map((t) => t.type.name).join(" ");
      const pokemonCard = document.createElement("div");
      pokemonCard.classList.add("card");
      pokemonCard.id = `${pokemon.id}`;
      pokemonCard.innerHTML = `
        <div class="cardTop">
          <div class="attack">Attack ${pokemon.attack}</div>
          <div class="price">${pokemon.price}€</div>
        </div>   
        <img src="${pokemon.pkm_back}">
        <img class="front" src="${pokemon.pkm_front}"><br>
        ${pokemon.id}. ${pokemon.name}<br>
        Weight ${pokemon.weight}.<br>
        <div class="types">
          ${types}
        </div>`;

      this.pokedex.appendChild(pokemonCard);
    });
  }

  displayWishlist(wishlistPokemons, onDelete) {
    const wishlistContent = this.modal.querySelector(".wishlist-content");
    wishlistContent.innerHTML = "";

    // Verificar si la lista de deseos está vacía
    if (wishlistPokemons.length === 0) {
      wishlistContent.innerHTML = "<p>No hay Pokémon en tu lista de deseos.</p>";
      return;
    }

    // Iterar sobre cada Pokémon en la lista de deseos
    wishlistPokemons.forEach((pokemon) => {
      const pokemonItem = document.createElement("div");
      pokemonItem.classList.add("wishlist-item");
      pokemonItem.innerHTML = `
        <div>
          <strong>${pokemon.name}</strong> (ID: ${pokemon.id}) - Precio: ${pokemon.price}€
          <button class="delete-button" data-id="${pokemon.id}">Eliminar</button>
        </div>`;
      wishlistContent.appendChild(pokemonItem);
    });

    // Agregar evento de clic a los botones de eliminación
    const deleteButtons = wishlistContent.querySelectorAll(".delete-button");
    deleteButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const id = button.getAttribute("data-id");
        onDelete(id);  // Llama a la función onDelete proporcionada
      });
    });
}

}
