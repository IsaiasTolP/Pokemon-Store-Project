const button = document.querySelector("button");

button.addEventListener("click", () => {
    // window.alert("Hola");
    document.querySelectorAll(`#filtro`).forEach( (e) => {
        e.style.visibility = "visible";
    });
});