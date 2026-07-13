import Entidade from "./Entidade.js";
import { configuracoes } from "../configuracoes.js";
import { sortearFaixa } from "../utils/matematica.js";
import { hitboxEliptica } from "../utils/colisao.js";

export default class BalaCanhao extends Entidade {
    static sprite = configuracoes.canhao.bala.sprite;
    static tamanho = configuracoes.canhao.bala.tamanho;
    static velocidade = configuracoes.canhao.bala.velocidade;
    static vidaInicial = configuracoes.canhao.bala.vida;
    static rotacao = configuracoes.canhao.bala.rotacao;
    static escalaCaixa = configuracoes.canhao.bala.caixaColisao.escala;

    constructor(posicao, direcao) {
        super({
            sprite: BalaCanhao.sprite,
            posicao: posicao,
            tamanho: BalaCanhao.tamanho,
            velocidade: BalaCanhao.velocidade,
            vida: BalaCanhao.vidaInicial,
            rotacao: BalaCanhao.rotacao,
        });

        this.direcao = direcao;
        this.velocidadeRotacao = sortearFaixa(BalaCanhao.rotacao.velocidade.minima, BalaCanhao.rotacao.velocidade.maxima);
    }

    get caixaColisao() {
        return hitboxEliptica(this, BalaCanhao.escalaCaixa);
    }

    #atualizarPosicao() {
        this.posicao.x += this.direcao.x * this.velocidade.maxima;
        this.posicao.y += this.direcao.y * this.velocidade.maxima;
    }

    #atualizarRotacao() {
        this.rotacao.atual += this.velocidadeRotacao;
    }

    #atualizarVida() {
        if (this.foraDaTela) this.vida.atual = 0;
    }

    atualizar() {
        this.#atualizarPosicao();
        this.#atualizarRotacao();
        this.#atualizarVida();
    }
}
