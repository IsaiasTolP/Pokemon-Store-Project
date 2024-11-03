export class PokemonView {
  constructor() {
    this.pokedex = document.getElementById("pokedex");
    this.loadingMessage = document.querySelector(".cargandoDatos");
    this.consoleElements = document.querySelectorAll(".input, .btnMenu");
    this.modal = document.getElementById("modal");
    this.purchaseModal = document.getElementById("modalCompra");
    this.closeBtn = document.querySelectorAll(".close");
    
    this.setupModalEvents();
  }
  // Función que prepara las acciones a llevar a cabo con los modales (Las ventanas)
  setupModalEvents() {
    const btnVerLista = document.getElementById("btnVerLista");
    const btnVerCompra = document.getElementById("btnVerCompra");
  
    // Asigna la función showModal al botón "Ver lista de deseos"
    btnVerLista.onclick = () => {
      this.showModal("btnVerLista");
    };
  
    // Asigna la función showModal al botón "Ver compra"
    btnVerCompra.onclick = () => {
      this.showModal("btnVerCompra");
    };
  
    // Configura el botón de cerrar
    this.closeBtn.forEach((e) => {
      e.onclick = () => {this.hideModal();
      }
    });
  
    // Cierra el modal cuando el usuario haga clic fuera del contenido
    window.onclick = (event) => {
      if (event.target === this.modal || event.target === this.purchaseModal) {
        this.hideModal();
      }
    };
  }
  
  // Gestionamos los modales
  async showModal(buttonType) {
    if (buttonType === "btnVerCompra") {
      this.purchaseModal.style.display = "flex";
    } else if (buttonType === "btnVerLista") {
      this.modal.style.display = "flex";
    }
  }

  hideModal() {
    this.modal.style.display = "none";
    this.purchaseModal.style.display = "none"
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

  /*
  Esta función muestra la lista de deseos y pone los eventos a los botones de borrado con el manejador de eliminación que recibe como argumento
  */
  displayWishlist(wishlistPokemons, onDelete) {
    const wishlistContent = this.modal.querySelector(".wishlist-content");
    wishlistContent.innerHTML = "";

    if (wishlistPokemons.length === 0) {
      wishlistContent.innerHTML = "<p>No hay Pokémon en tu lista de deseos.</p>";
      return;
    }

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

    const deleteButtons = wishlistContent.querySelectorAll(".delete-button");
    deleteButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const id = button.getAttribute("data-id");
        onDelete(id);
      });
    });
  }

  /*
  Se muestran todos las compras dentro del modal de compras
  */
  displayPurchases(purchases) {
    const purchasesContent = this.purchaseModal.querySelector(".purchase-content");
    purchasesContent.innerHTML = "";
  
    if (purchases.length === 0) {
      purchasesContent.innerHTML = "<p>No hay compras registradas.</p>";
      return;
    }
  
    purchases.forEach((purchase) => {
      const purchaseItem = document.createElement("div");
      purchaseItem.classList.add("purchase-item");
      
      const purchaseDate = new Date(purchase.date).toLocaleDateString("es-ES");
      purchaseItem.innerHTML = `
        <div>
          <strong>${purchase.pokemonName}</strong> (ID: ${purchase.pokemonId}) - Precio: ${purchase.price}€
          <br>
          Fecha de compra: ${purchaseDate}
        </div>`;
        
      purchasesContent.appendChild(purchaseItem);
    });
  }
}
