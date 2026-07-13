import { anguloParaRotacao, limitar } from "../utils/matematica.js";
import { teclasPressionadas } from "../utils/teclado.js";
import { configuracoes } from "../configuracoes.js";
import { limites } from "../utils/canvas.js";
import { hitboxCircular } from "../utils/colisao.js";

import BalaCanhao from "./BalaCanhao.js";
import Entidade from "./Entidade.js";

export default class Barco extends Entidade {
    static tamanho = configuracoes.barcos.tamanho;
    static velocidadeInicial = configuracoes.barcos.velocidade;
    static vidaInicial = configuracoes.barcos.vida;
    static rotacaoInicial = configuracoes.barcos.rotacao;
    static invulnerabilidade = configuracoes.barcos.invulnerabilidade;
    static escalaCaixa = configuracoes.barcos.caixaColisao.escala;
    static correnteza = configuracoes.fisica.correnteza;
    static atrito = configuracoes.fisica.atrito;
    static lados = configuracoes.canhao.lados;
    static cooldownCanhao = configuracoes.canhao.cooldown;

    constructor(config) {
        super({
            ...config,
            tamanho: Barco.tamanho,
            velocidade: { ...Barco.velocidadeInicial, atual: Barco.correnteza },
            vida: Barco.vidaInicial,
            rotacao: Barco.rotacaoInicial,
        });

        this.controles = config.controles;
        this.posicaoInicial = { ...config.posicao };
    }

    direcao = { x: 0, y: 0 };
    cooldownCanhao = { esquerda: 0, direita: 0 };
    cooldownInvulnerabilidade = 0;
    balasCanhao = [];
    pontuacao = { nivel: 0, total: 0 };
    podeMover = true;
    podeAtirar = true;

    get caixaColisao() {
        return hitboxCircular(this, Barco.escalaCaixa);
    }

    get invulneravel() {
        return this.cooldownInvulnerabilidade > 0;
    }

    set invulneravel(ativo) {
        if (ativo) this.cooldownInvulnerabilidade = Barco.invulnerabilidade;
        else this.cooldownInvulnerabilidade = 0;
    }

    set pontosNivel(valor) {
        this.pontuacao.nivel = valor;
    }

    get #aceleracaoAtual() {
        return this.velocidade.aceleracao.minima + (this.velocidade.aceleracao.maxima - this.velocidade.aceleracao.minima) * this.velocidade.atual / this.velocidade.maxima;
    }

    pontuar(valor) {
        this.pontuacao.nivel += valor;
        this.pontuacao.total += valor;
    }

    recuperarVida(quantidade) {
        this.vida.atual = limitar(this.vida.atual + quantidade, 0, this.vida.maxima);
    }

    sofrerDano(dano = 1) {
        if (this.invulneravel) return;

        this.colidir(dano);
        this.invulneravel = true;
    }

    reposicionar() {
        this.posicao = { ...this.posicaoInicial };
        this.velocidade.atual = Barco.correnteza;
        this.rotacao.atual = 0;
        this.invulneravel = false;
    }

    reiniciar() {
        this.reposicionar();
        this.vida.atual = this.vida.maxima;
        this.pontosNivel = 0;
    }

    #atualizarDirecao() {
        this.direcao = anguloParaRotacao(this.rotacao.atual);
    }

    #atualizarRotacao() {
        let velocidadeRotacao = this.rotacao.velocidade.maxima - (this.rotacao.velocidade.maxima - this.rotacao.velocidade.minima) * this.velocidade.atual / this.velocidade.maxima;

        if (teclasPressionadas[this.controles.freio]) velocidadeRotacao *= this.rotacao.fatorPivo;

        if (teclasPressionadas[this.controles.esquerda]) this.rotacao.atual -= velocidadeRotacao;
        if (teclasPressionadas[this.controles.direita]) this.rotacao.atual += velocidadeRotacao;
    }

    #atualizarVelocidade() {
        this.velocidade.atual -= Barco.atrito;

        if (teclasPressionadas[this.controles.frente]) this.velocidade.atual += this.#aceleracaoAtual;
        if (teclasPressionadas[this.controles.freio]) this.velocidade.atual -= this.velocidade.freio;

        this.velocidade.atual = limitar(this.velocidade.atual, 0, this.velocidade.maxima);
    }

    #atualizarPosicao() {
        this.posicao.x += this.direcao.x * this.velocidade.atual - Barco.correnteza;
        this.posicao.y += this.direcao.y * this.velocidade.atual;
    }

    #atualizarLimites() {
        const metadeAltura = this.tamanho.altura / 2;
        const metadeLargura = this.tamanho.largura / 2;

        if (this.posicao.x + metadeLargura < 0) this.posicao.x = -metadeLargura;
        else if (this.posicao.x + metadeLargura > limites.largura) this.posicao.x = limites.largura - metadeLargura;

        if (this.posicao.y + metadeAltura < 0) this.posicao.y = limites.altura - metadeAltura;
        else if (this.posicao.y + metadeAltura > limites.altura) this.posicao.y = - metadeAltura;
    }

    #atualizarCanhao() {
        for (const lado in Barco.lados) {
            if (this.cooldownCanhao[lado] > 0) this.cooldownCanhao[lado]--;

            if (teclasPressionadas[this.controles.atirar[lado]] && this.cooldownCanhao[lado] === 0) {
                this.balasCanhao.push(new BalaCanhao(
                    { x: this.posicao.x + this.tamanho.largura / 2, y: this.posicao.y + this.tamanho.altura / 2 },
                    anguloParaRotacao(this.rotacao.atual + Barco.lados[lado].angulo)
                ));
                this.cooldownCanhao[lado] = Barco.cooldownCanhao[lado];
            }
        }
    }

    #atualizarBalas() {
        this.balasCanhao.forEach(bala => bala.atualizar());
        this.balasCanhao = this.balasCanhao.filter(bala => bala.vivo);
    }

    #atualizarInvulnerabilidade() {
        if (this.cooldownInvulnerabilidade > 0) this.cooldownInvulnerabilidade--;
    }

    #mover() {
        if (!this.podeMover) return;

        this.#atualizarRotacao();
        this.#atualizarVelocidade();
        this.#atualizarPosicao();
        this.#atualizarLimites();
    }

    #atirar() {
        if (this.podeAtirar) this.#atualizarCanhao();
    }

    atualizar() {
        this.#atualizarDirecao();
        this.#mover();
        this.#atirar();
        this.#atualizarBalas();
        this.#atualizarInvulnerabilidade();
    }
}
