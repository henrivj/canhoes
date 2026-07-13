import { carregarImagem } from "../utils/imagens.js";
import { limites } from "../utils/canvas.js";

export default class Entidade {
    constructor(config) {
        this.sprite = carregarImagem(config.sprite);
        this.posicao = { ...config.posicao };
        this.tamanho = { ...config.tamanho };
        this.velocidade = { ...config.velocidade };
        this.vida = { ...config.vida };
        this.rotacao = { ...config.rotacao };
        this.faixa = config.faixa;
    }

    get vivo() {
        return this.vida.atual > 0;
    }

    get foraDaTela() {
        return this.posicao.x + this.tamanho.largura < 0
            || this.posicao.x > limites.largura
            || this.posicao.y + this.tamanho.altura < 0
            || this.posicao.y > limites.altura;
    }

    get centro() {
        return {
            x: this.posicao.x + this.tamanho.largura / 2,
            y: this.posicao.y + this.tamanho.altura / 2,
        };
    }

    colidir(dano = 1) {
        this.vida.atual -= dano;
    }

    #atualizarPosicao() {
        this.posicao.x -= this.velocidade.atual;
    }

    #atualizarVida() {
        if (this.foraDaTela) this.vida.atual = 0;
    }

    atualizar() {
        this.#atualizarPosicao();
        this.#atualizarVida();
    }
}
