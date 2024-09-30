// Creo clase
export default class Pokemon {
    // Creo el constructor
    constructor(data){
        this.name = data.name;  // Nombre del pokemon
        this.id = data.id;      // Ide del pokemon
        this.pkm_front = data.sprites.front_default; // Pokemon de frente
        this.pkm_back = data.sprites.back_default;  // Pokemon de espalda
        this.pkm_weight = data.weight;
        this.pkm_type = data.types;  // Tipo de pokemon
    }
}