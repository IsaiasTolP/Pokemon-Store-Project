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

    mostrarPokemon();
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
            .then(function result(){
                return result.json();
            })
            .then(function(data){
                console.log(data);
            });
        }
        catch (error){
            console.error(`There is an error ${error}`);
        }
    }
}