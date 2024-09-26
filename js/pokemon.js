export default class Pokemon {
    constructor(data) {
        this.name = data.name;
        this.id = data.id;
        this.pkm_front = data.sprites.front_default;
        this.pkm_back = data.sprites.back_default;
        this.pkm_type = data.types;
    }
}