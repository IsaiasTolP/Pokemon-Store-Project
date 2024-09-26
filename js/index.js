import Pokemon from "./pokemon.js";

var pokemons = [];

const button = document.querySelector("button");

button.addEventListener("click", () => {
    // window.alert("Hola");
    document.querySelectorAll("#filtro").forEach(element => {
        element.style.visibility = "visible";
    });

    document.querySelectorAll("#btn_lista_deseo").forEach(element => {
        element.style.visibility = "visible";
    });

    document.querySelector(".listaPokemon").style.visibility = "visible";

    startPokemon();
});

function mostrarPokemon() {
    document.querySelector(".cargandoDatos").style.visibility = "visible";
}

/*
const request = new XMLHttpRequest();
request.addEventListener()
*/

const startPokemon = async () => {
    for(var i = 1; i <= 151; i++){
        try{
            await fetch("https://pokeapi.co/api/v2/pokemon/" + i + "/")
            .then(function(result){
                return result.json();
            }).then(function(data){
                const pokemon = new Pokemon(data);
                pushPokemon(pokemon);
            });
        }
        catch (error){
            alert(`There is an error ${error}`);
        }
    }

    await showPokedex();
}

function pushPokemon(pokemon){
    pokemons.push(pokemon);
}

const showPokedex = async () =>{
    const pokedex = document.getElementById("pokedex");
    for(var i = 0; i < pokemons.length; i++) {
        var aux =  0;
        while (aux != pokemons[i].pkm_type.length) {
            if (aux == 0)
                var tipo1 = pokemons[i].pkm_type[aux].type.name;                       
            if (aux == 1)   
                var tipo2 = pokemons[i].pkm_type[aux].type.name;
            else 
                tipo2 = "";          
            aux++; 
        }
        pokedex.innerHTML +=    `<div class="card">
                                    <img src="${pokemons[i].pkm_back}">
                                    <img class="front" src="${pokemons[i].pkm_front}"><br>
                                    ${pokemons[i].id}. ${pokemons[i].name[0].toUpperCase() + pokemons[i].name.substring(1)}<br>
                                    <div class="types">
                                        ${tipo1} ${tipo2}
                                    </div>
                                </div>`
    }
}