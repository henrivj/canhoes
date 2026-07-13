import Entidade from "./Entidade.js";
import { configuracoes } from "../configuracoes.js";
import { hitboxCircular } from "../utils/colisao.js";

export default class BarcoInimigo extends Entidade {
    static sprite = configuracoes.barcoInimigo.sprite;
    static vidaInicial = configuracoes.barcoInimigo.vida;
    static escalaCaixa = configuracoes.barcoInimigo.caixaColisao.escala;
    static correnteza = configuracoes.fisica.correnteza;

    constructor(config) {
        super({
            ...config,
            sprite: BarcoInimigo.sprite,
            velocidade: { atual: BarcoInimigo.correnteza },
            vida: { ...BarcoInimigo.vidaInicial },
            rotacao: { atual: 0 },
        });
    }

    get caixaColisao() {
        return hitboxCircular(this, BarcoInimigo.escalaCaixa);
    }
}
