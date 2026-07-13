import Entidade from "./Entidade.js";
import { configuracoes } from "../configuracoes.js";
import { hitboxEliptica } from "../utils/colisao.js";

export default class Barril extends Entidade {
    static sprite = configuracoes.barril.sprite;
    static vidaInicial = configuracoes.barril.vida;
    static escalaCaixa = configuracoes.barril.caixaColisao.escala;
    static correnteza = configuracoes.fisica.correnteza;

    constructor(config) {
        super({
            ...config,
            sprite: Barril.sprite,
            velocidade: { atual: Barril.correnteza },
            vida: Barril.vidaInicial,
            rotacao: { atual: 0 },
        });
    }

    get caixaColisao() {
        return hitboxEliptica(this, Barril.escalaCaixa);
    }

    consumir() {
        this.vida.atual = 0;
    }
}
