import ConectToFirebase from "../models/conectToFireStore.js";
import { PokemonModel } from "../models/PokemonModel.js";
import { PokemonView } from "../views/PokemonView.js";

export class PokemonController {
  constructor() {
    this.db = new ConectToFirebase();
    this.model = new PokemonModel();
    this.view = new PokemonView();
    this.setupAuth();

    this.pokemonsFiltered = [];
    this.selectedPokemons = [];
    this.auxPokemons;

    document.querySelector("button").addEventListener("click", () => this.init());
  }

  // Una función que controla el estado de autenticación, y los botones que interactuan con el mismo
  setupAuth() {
    const loginButton = document.getElementById("loginButton");
    const logoutButton = document.getElementById("logoutButton");

    // Verificar el estado de autenticación
    this.db.onAuthStateChanged((user) => {
      if (user) {
        if (loginButton) loginButton.style.display = "none";
        if (logoutButton) logoutButton.style.display = "block";
      } else {
        if (loginButton) loginButton.style.display = "block";
        if (logoutButton) logoutButton.style.display = "none";
        window.location.href = "login.html";
      }
    });

    if (logoutButton) {
      logoutButton.addEventListener("click", () => {
        this.db.signOut().then(() => {
          window.location.href = "login.html";
        });
      });
    }
  }

  // Inicializamos la Pokedex
  async init() {
    this.view.showLoading();
    try {
      await this.model.loadPokemons();
      this.view.hideLoading();
      this.view.showConsole();
      this.view.displayPokemons(this.model.getAllPokemons());
      this.bindingEvents();
      await this.loadWishlist();
      await this.loadPurchases();
    } catch (error) {
      console.error(error);
    }
  }

  // Esta función carga la lista de deseos del usuario logueado en ese momento
  async loadWishlist() {
    try {
      const wishlistPokemons = await this.db.readAll();
      this.view.displayWishlist(wishlistPokemons, this.handleDelete.bind(this));
    } catch (error) {
      console.error("Error cargando la lista de deseos:", error);
    }
  }

  // Esta función carga el historial de compras del usuario
  async loadPurchases() {
    try {
      const purchasedPokemons = await this.db.readAllPurchases();
      this.view.displayPurchases(purchasedPokemons);
    } catch (error) {
      console.error("Error cargando la lista de compras:", error);
    }
  }

  async bindingEvents() {
    // Bind input filtro por tipo
    this.filterType = document.querySelector("#filtroTipo");
    this.filterType.addEventListener("keyup", () => this.filteringPokemons());

    // Bind input filtro por peso
    this.filterWeight = document.querySelector("#filtroPeso");
    this.filterWeight.addEventListener("keyup", () => this.filteringPokemons());

    // Bind input filtro por poder(ataque)
    this.filterPower = document.querySelector("#filtroPoderTotal");
    this.filterPower.addEventListener("keyup", () => this.filteringPokemons());

    // Bind ambos filtros compras
    this.filterPokemonName = document.getElementById("filterPokemonName");
    this.filterDate = document.getElementById("filterDate");

    this.filterPokemonName.addEventListener("keyup", () => {
        this.filterPurchases();
    });

    this.filterDate.addEventListener("change", () => {
        this.filterPurchases();
    });

    // Bind añadir a Lista de deseos
    document
      .querySelector("#btnAgnadeListaDeseo")
      .addEventListener("click", this.guardarListaDeseo.bind(this));

    // Bind comprar pokemons
    document
      .querySelector("#btnComprar")
      .addEventListener("click", this.simularCompra.bind(this));

    // Bind cartas pokemons para selección
    this.cardPokemons = document.querySelectorAll(".card");
    this.cardPokemons.forEach((card) => {
      card.addEventListener("click", () => {
        this.togglePokemonSelection(card);
      });
    });
  }

  // Esta clase es la que permite seleccionar pokemons proporcionando además feedback visual
  togglePokemonSelection(card) {
    const cardId = card.id;
    const index = this.selectedPokemons.indexOf(cardId);

    if (index !== -1) {
      this.selectedPokemons.splice(index, 1);
      card.classList.remove("selected");
    } else {
      this.selectedPokemons.push(cardId);
      card.classList.add("selected");
    }
  }

  // Este filtro permite filtrar los pokemons por 3 valores diferentes
  async filteringPokemons() {
    this.pokemonsFiltered = [];
    const weightFilter = parseFloat(this.filterWeight.value) || 0;
    const powerFilter = parseFloat(this.filterPower.value) || 0;
    const typeFilter = this.filterType.value.toLowerCase();

    this.model.pokemons.forEach((pkm) => {
      let safePokemon = true;

      if (typeFilter) {
        safePokemon = pkm.pkm_type.some(type => type.type.name.toLowerCase().includes(typeFilter));
      }

      if (safePokemon && pkm.weight >= weightFilter && pkm.attack >= powerFilter) {
        this.pokemonsFiltered.push(pkm);
      }
    });

    if (this.pokemonsFiltered.length === 0) {
      document.querySelector('.noCoincidencias').style.display = 'block';
    } else {
      document.querySelector('.noCoincidencias').style.display = 'none';
    }

    this.view.displayPokemons(this.pokemonsFiltered);
  }
  
  // Este filtro permite filtrar las compras
  async filterPurchases() {
    const nameFilter = this.filterPokemonName.value.toLowerCase().trim();
    const dateFilter = this.filterDate.value;
    const filteredPurchases = [];

    const purchasedPokemons = await this.db.readAllPurchases();
    
    Object.entries(purchasedPokemons).forEach(([key, purchase]) => {
      const matchesName = purchase.pokemonName.toLowerCase().startsWith(nameFilter);
      const purchaseDate = purchase.date.split('T')[0]; // Extraemos la fecha en formato YYYY-MM-DD
      const matchesDate = dateFilter ? purchaseDate === dateFilter : true; // Comparamos solo si hay un filtro
      if (matchesName && matchesDate) {
        filteredPurchases.push(purchase);
    }
    });
    this.view.displayPurchases(filteredPurchases);
}

  /*
  Esta función sirve para guardar los pokemons seleccionados en la base de datos.
  Se comprueba si hay pokemons seleccionados.
  Tambien si el usuario esta logueado
  Por último formatea los datos y los inserta en la base datos.
  */
  async guardarListaDeseo() {
    if (this.selectedPokemons.length === 0) {
      window.alert("No tienes ningún Pokémon seleccionado para añadir a la Lista de Deseo.");
      return;
    }

    let txt = "¿Quieres añadir los siguientes Pokémons a la Lista de Deseo?";
    this.selectedPokemons.forEach((pkm) => {
      txt += ` ${pkm}`;
    });

    if (!window.confirm(txt)) {
      return;
    }

    try {
      const existingPokemons = await this.db.readAll();
      const existingIds = existingPokemons.map(p => p.id);
      const user = this.db.getCurrentUser();

      const allPokemons = this.model.getAllPokemons();
      const pokemonsToSave = this.selectedPokemons.map((pkmId) => {
        const numericId = parseInt(pkmId, 10);
        const pokemon = allPokemons.find((p) => p.id === numericId);
        if (!pokemon) {
          console.warn(`Pokemon con ID ${pkmId} no encontrado en allPokemons.`);
          return null;
        }
        return {
          id: pokemon.id,
          name: pokemon.name,
          price: parseFloat(pokemon.price),
          userId: user.uid
        };
      }).filter(p => p !== null);

      for (const pkm of pokemonsToSave) {
        await this.db.create(pkm);
      }

      window.alert("Pokémons guardados exitosamente en la lista de deseos.");
      await this.loadWishlist();
    } catch (error) {
      console.error("Error guardando la lista de deseos en Firestore:", error);
      window.alert("Error guardando la lista de deseos. Inténtalo de nuevo.");
    }
  }

  /*
  Esta función se encarga de realizar la compra de los pokemons seleccionados.
  Vigila que haya alguno seleccionado y que se esté logueado.
  Por último formatea los datos para introducirlos en la base de datos.
  */
  async simularCompra() {
    if (this.selectedPokemons.length === 0) {
      window.alert("No tienes ningún Pokémon seleccionado para comprar.");
      return;
    }

    let txt = "¿Quieres proceder con la compra de los siguientes Pokémons?";
    this.selectedPokemons.forEach((pkm) => {
      txt += ` ${pkm}`;
    });

    if (!window.confirm(txt)) {
      return;
    }

    try {
      const user = this.db.getCurrentUser();
      if (!user) {
        throw new Error("Usuario no autenticado.");
      }

      const allPokemons = this.model.getAllPokemons();
      const compras = this.selectedPokemons.map((pkmId) => {
        const numericId = parseInt(pkmId, 10);
        const pokemon = allPokemons.find((p) => p.id === numericId);
        if (!pokemon) {
          console.warn(`Pokemon con ID ${pkmId} no encontrado en allPokemons.`);
          return null;
        }
        return {
          userId: user.uid,
          pokemonId: pokemon.id,
          pokemonName: pokemon.name,
          price: parseFloat(pokemon.price),
          date: new Date().toISOString()
        };
      }).filter(c => c !== null);

      for (const compra of compras) {
        await this.db.createPurchase(compra);
      }

      await this.loadPurchases();

      window.alert("Compra realizada exitosamente.");
      this.selectedPokemons = [];
    } catch (error) {
      console.error("Error realizando la compra en Firestore:", error);
      window.alert("Error realizando la compra. Inténtalo de nuevo.");
    }
  }

  // Método para manejar la eliminación de un Pokémon de la lista de deseos
  async handleDelete(id) {
    try {
      const numID = Number(id)
      await this.db.delete(numID);
      window.alert("Pokémon eliminado de la lista de deseos.");
      await this.loadWishlist();
    } catch (error) {
        console.error("Error eliminando Pokémon de la lista de deseos:", error);
        window.alert("Error eliminando Pokémon de la lista de deseos. Inténtalo de nuevo.");
    }
}
}
