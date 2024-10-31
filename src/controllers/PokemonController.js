// PokemonController.js
import ConectToFirebase from "../models/conectToFireStore.js";
import { PokemonModel } from "../models/PokemonModel.js";
import { PokemonView } from "../views/PokemonView.js";
export class PokemonController {
  constructor() {
    this.db = new ConectToFirebase();
    this.model = new PokemonModel();
    this.view = new PokemonView();

    this.pokemonsFiltered = [];
    this.newDesireList = [];
    this.auxPokemons

    // Bind button event
    document
      .querySelector("button")
      .addEventListener("click", () => this.init());

      // Bind Botons de BBDD de prueba
    document.querySelectorAll(".btnBBDD").forEach((btnBBDD) => {
      btnBBDD.addEventListener("click", () => this.bbddAction(btnBBDD.id));
    });
  }
  async init() {
    this.view.showLoading();
    try {
      await this.model.loadPokemons();
      this.view.hideLoading();
      this.view.showConsole();
      this.view.displayPokemons(this.model.getAllPokemons());
      this.bindingEvents();
    } catch (error) {
      console.error(error);
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
      .addEventListener("click", this.mostrarListaDeseo.bind(this));

    // Bind Cards pokemons
    this.cardPokemons = document.querySelectorAll(".card");
    this.cardPokemons.forEach((card) => {
      card.addEventListener("click", () => this.pokemonsClicked(card.id));
    });
  }

  pokemonsClicked(cardId) {
    this.newDesireList.push(cardId);
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
    this.view.displayPokemons(this.pokemonsFiltered);
}

  // Metódo de prueba de BBDD
  bbddAction(btnClicked) {
    switch (btnClicked) {
      case "readAllPokemon":
        this.getAllPokemon();
        break;

      case "addPokemon":
        let data = {
          tipo: "Iron",
          nombre: "Fixy",
        };
        this.createPokemon(data);
        break;

      case "updatePokemon":
        const id = "dJEvAx4dTIUY9IOeoy7E";
        let data2 = {
          tipo: "Water",
          nombre: "Darum",
        };
        this.updatePokemon(id, data2);
        break;

      case "deletePokemon":
        const id2 = "PezyN0gwr0vzXhBApCxU";
        this.deletePokemon(id2);
        break;

      default:
        break;
    }
  }


  mostrarListaDeseo() {
    let data = {
      tipo: "Watwe",
      nombre: "Darum",
    };

    //this.getAllPokemon();
    //this.createPokemon(data);
    //console.log(this.newDesireList);
    let txt = "¿Quieres añadir los siguientes Pokemons a la Lista de Deseo?";
    this.newDesireList.forEach((pkm) => {
      txt = txt + " " + pkm;
    });

    if (window.confirm(txt)) {
      // ToDo Guardar en BBDD
      console.log("Guardando nueva lista de deseo...");
    } else if (window.confirm("¿Quieres deseleccionar los pokemons?")) {
      // ToDo desmarcar pokemons

      this.newDesireList = [];
    }
  }

  async createPokemon(data) {
    return await this.db.create(data);
  }

  async getAllPokemon() {
    return await this.db.readAll();
  }

  async updatePokemon(id, data) {
    return await this.db.update(id, data);
  }

  async deletePokemon(id) {
    return await this.db.delete(id);
  }
}
