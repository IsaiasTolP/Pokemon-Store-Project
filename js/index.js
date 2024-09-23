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
});