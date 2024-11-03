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
    this.newDesireList = [];
    this.auxPokemons;

    // Bind button event
    document.querySelector("button").addEventListener("click", () => this.init());
  }

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
        window.location.href = "login.html"; // Redirige al login
      }
    });

    if (logoutButton) {
      logoutButton.addEventListener("click", () => {
        this.db.signOut().then(() => {
          window.location.href = "login.html"; // Redirige al login
        });
      });
    }
  }

  async init() {
    this.view.showLoading();
    try {
      await this.model.loadPokemons();
      this.view.hideLoading();
      this.view.showConsole();
      this.view.displayPokemons(this.model.getAllPokemons());
      this.bindingEvents();
      await this.loadWishlist();
    } catch (error) {
      console.error(error);
    }
  }

  async loadWishlist() {
    try {
      const wishlistPokemons = await this.db.readAll(); // Obtener la lista de deseos del usuario
      this.view.displayWishlist(wishlistPokemons, this.handleDelete.bind(this)); // Mostrar la lista de deseos en la vista
    } catch (error) {
      console.error("Error cargando la lista de deseos:", error);
    }
  }

  async bindingEvents() {
    // Bind input filterType
    this.filterType = document.querySelector("#filtroTipo");
    this.filterType.addEventListener("keyup", () => this.filteringPokemons());

    // Bind input filterWeight
    this.filterWeight = document.querySelector("#filtroPeso");
    this.filterWeight.addEventListener("keyup", () => this.filteringPokemons());

    // Bind input filterPower
    this.filterPower = document.querySelector("#filtroPoderTotal");
    this.filterPower.addEventListener("keyup", () => this.filteringPokemons());

    // Bind Añadir a Lista de deseos
    document
      .querySelector("#btnAgnadeListaDeseo")
      .addEventListener("click", this.guardarListaDeseo.bind(this));

    // Bind Cards pokemons
    this.cardPokemons = document.querySelectorAll(".card");
    this.cardPokemons.forEach((card) => {
      card.addEventListener("click", () => {
        this.togglePokemonSelection(card);
      });
    });
  }

  togglePokemonSelection(card) {
    const cardId = card.id;
    const index = this.newDesireList.indexOf(cardId);

    // Si el Pokémon ya está en la lista, lo eliminamos y quitamos la clase
    if (index !== -1) {
      this.newDesireList.splice(index, 1);
      card.classList.remove("selected");
    } else {
      // Si el Pokémon no está en la lista, lo añadimos y agregamos la clase
      this.newDesireList.push(cardId);
      card.classList.add("selected");
    }
  }

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

  async guardarListaDeseo() {
    if (this.newDesireList.length === 0) {
      window.alert("No tienes ningún Pokémon seleccionado para añadir a la Lista de Deseo.");
      return; // Salir de la función si no hay Pokémon seleccionados
    }

    let txt = "¿Quieres añadir los siguientes Pokémons a la Lista de Deseo?";
    this.newDesireList.forEach((pkm) => {
      txt += ` ${pkm}`;
    });

    if (!window.confirm(txt)) {
      return; // Salir si el usuario cancela
    }

    try {
      // Obtener todos los Pokémon guardados actualmente en la base de datos
      const existingPokemons = await this.db.readAll();
      const existingIds = existingPokemons.map(p => p.id);

      // Crear una lista de objetos para guardar, excluyendo los duplicados
      const allPokemons = this.model.getAllPokemons();
      const pokemonsToSave = this.newDesireList.map((pkmId) => {
        const numericId = parseInt(pkmId, 10); // Convertir el ID a número
        const pokemon = allPokemons.find((p) => p.id === numericId);
        if (!pokemon) {
          console.warn(`Pokemon con ID ${pkmId} no encontrado en allPokemons.`);
          return null;
        }
        return {
          id: pokemon.id,
          name: pokemon.name,
          price: parseFloat(pokemon.price) || 0,
        };
      }).filter(p => p !== null);

      // Guardar cada Pokémon en Firestore
      for (const pkm of pokemonsToSave) {
        await this.db.create(pkm);
      }

      console.log("Pokémons guardados exitosamente en la lista de deseos.");
      window.alert("Pokémons guardados exitosamente en la lista de deseos.");
      await this.loadWishlist();
    } catch (error) {
      console.error("Error guardando la lista de deseos en Firestore:", error);
      window.alert("Error guardando la lista de deseos. Inténtalo de nuevo.");
    }
  }

  // Método para manejar la eliminación de un Pokémon de la lista de deseos
  async handleDelete(id) {
    console.log(`Intentando eliminar Pokémon con ID: ${id}`); // Debugging
    try {
      const numID = Number(id)
      await this.db.delete(numID); // Llama al método de eliminación en la base de datos
      console.log(`Pokémon con ID: ${id} eliminado de la base de datos.`); // Debugging
      window.alert("Pokémon eliminado de la lista de deseos."); // Mensaje de confirmación
      await this.loadWishlist(); // Recargar la lista de deseos
    } catch (error) {
        console.error("Error eliminando Pokémon de la lista de deseos:", error);
        window.alert("Error eliminando Pokémon de la lista de deseos. Inténtalo de nuevo.");
    }
}
}
