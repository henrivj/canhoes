import Entidade from "./Entidade.js";
import { configuracoes } from "../configuracoes.js";
import { sortearFaixa } from "../utils/matematica.js";
import { hitboxEliptica } from "../utils/colisao.js";

export default class Pedra extends Entidade {
    static sprites = configuracoes.pedra.sprites;
    static vidaInicial = configuracoes.pedra.vida;
    static escalaCaixa = configuracoes.pedra.caixaColisao.escala;
    static correnteza = configuracoes.fisica.correnteza;

    constructor(config) {
        super({
            ...config,
            sprite: Pedra.sprites[Math.floor(sortearFaixa(0, Pedra.sprites.length))],
            velocidade: { atual: Pedra.correnteza },
            vida: Pedra.vidaInicial,
            rotacao: { atual: 0 },
        });
    }

    get caixaColisao() {
        return hitboxEliptica(this, Pedra.escalaCaixa);
    }
}
