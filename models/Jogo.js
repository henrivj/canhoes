import { configuracoes } from "../configuracoes.js";
import { verificarColisao, empurrar } from "../utils/colisao.js";

export default class Jogo {
    static duracaoTransicao = configuracoes.jogo.duracaoTransicao;
    static duracaoMorte = configuracoes.jogo.duracaoMorte;
    static velocidadeLimpeza = configuracoes.jogo.velocidadeLimpeza;
    static danoPedra = configuracoes.pedra.dano;
    static danoInimigo = configuracoes.barcoInimigo.dano;
    static danoBala = configuracoes.canhao.bala.dano;
    static recompensaInimigo = configuracoes.barcoInimigo.recompensa;

    constructor(barcos, niveis, modo) {
        this.barcos = barcos;
        this.niveis = niveis;
        this.modo = modo;
        this.nivel = niveis[0];
        this.vitorias = Array(barcos.length).fill(0);
    }

    estado = 'transicao';
    indiceNivel = 0;
    framesTransicao = Jogo.duracaoTransicao;
    framesMorte = 0;
    finalizando = false;
    finalizado = false;
    resultado = null;

    get #permiteMovimento() {
        return this.estado === 'jogando' || this.estado === 'limpando';
    }

    get #permiteCanhao() {
        return this.estado === 'jogando';
    }

    get #vencedorFinal() {
        if (this.modo === 1) return 1;
        if (this.vitorias[0] > this.vitorias[1]) return 1;
        if (this.vitorias[1] > this.vitorias[0]) return 2;
        return 0;
    }

    #finalizarJogo(vencedor) {
        this.finalizado = true;
        this.resultado = {
            modo: this.modo,
            vencedor: vencedor,
            vitorias: this.vitorias,
            pontuacoes: this.barcos.map(barco => barco.pontuacao.total),
        };
    }

    #avancarNivel() {
        this.indiceNivel++;
        this.nivel = this.niveis[this.indiceNivel];

        this.estado = 'transicao';
        this.framesTransicao = Jogo.duracaoTransicao;

        if (this.modo === 1) {
            this.barcos[0].reposicionar();
            this.barcos[0].pontosNivel = 0;
        } else {
            this.barcos.forEach(barco => barco.reiniciar());
        }
    }

    #iniciarLimpeza() {
        this.estado = 'limpando';
        if (this.indiceNivel === this.niveis.length - 1) this.finalizando = true;
    }

    #iniciarMorte() {
        this.estado = 'morrendo';
        this.framesMorte = Jogo.duracaoMorte;
    }

    #verificarFimDeNivel() {
        if (this.modo === 1) {
            if (!this.barcos[0].vivo) return this.#iniciarMorte();
            if (this.barcos[0].pontuacao.nivel >= this.nivel.metaPontuacao) this.#iniciarLimpeza();
            return;
        }

        let vencedorDoNivel = null;
        this.barcos.forEach((barco, indice) => {
            if (!barco.vivo) vencedorDoNivel = 1 - indice;
            else if (barco.pontuacao.nivel >= this.nivel.metaPontuacao) vencedorDoNivel = indice;
        });

        if (vencedorDoNivel === null) return;
        this.vitorias[vencedorDoNivel]++;
        this.#iniciarLimpeza();
    }

    #acertarInimigo(barco, bala, inimigo) {
        inimigo.colidir(Jogo.danoBala);
        bala.colidir();

        if (inimigo.vivo) return;
        barco.recuperarVida(Jogo.recompensaInimigo.vida);
        barco.pontuar(this.nivel.valorPontosBase * Jogo.recompensaInimigo.fatorPontos);
    }

    #colidirBala(barco, bala) {
        if (!bala.vivo) return;
        const caixaBala = bala.caixaColisao;

        this.barcos.forEach(alvo => {
            if (alvo !== barco && bala.vivo && verificarColisao(caixaBala, alvo.caixaColisao)) {
                alvo.sofrerDano(Jogo.danoBala);
                bala.colidir();
            }
        });

        if (bala.vivo) this.nivel.pedras.forEach(pedra => {
            if (verificarColisao(caixaBala, pedra.caixaColisao)) bala.colidir();
        });

        if (bala.vivo) this.nivel.barcosInimigos.forEach(inimigo => {
            if (inimigo.vivo && bala.vivo && verificarColisao(caixaBala, inimigo.caixaColisao)) this.#acertarInimigo(barco, bala, inimigo);
        });
    }

    #colidirBalas(barco) {
        barco.balasCanhao.forEach(bala => this.#colidirBala(barco, bala));
    }

    #coletarBarris(barco) {
        const caixaBarco = barco.caixaColisao;

        this.nivel.barris.forEach(barril => {
            if (barril.vivo && verificarColisao(caixaBarco, barril.caixaColisao)) {
                barril.consumir();
                barco.pontuar(this.nivel.valorPontosBase);
            }
        });
    }

    #colidirObstaculos(barco, aplicarDano) {
        this.nivel.pedras.forEach(pedra => {
            if (empurrar(barco, pedra) && aplicarDano) barco.sofrerDano(Jogo.danoPedra);
        });

        this.nivel.barcosInimigos.forEach(inimigo => {
            if (inimigo.vivo && empurrar(barco, inimigo) && aplicarDano) barco.sofrerDano(Jogo.danoInimigo);
        });
    }

    #colidirBarcos(aplicarDano) {
        if (this.barcos.length < 2) return;
        if (empurrar(this.barcos[0], this.barcos[1]) && aplicarDano) {
            this.barcos[0].sofrerDano();
            this.barcos[1].sofrerDano();
        }
    }

    #resolverFisica(aplicarDano) {
        this.#colidirBarcos(aplicarDano);
        this.barcos.forEach(barco => this.#colidirObstaculos(barco, aplicarDano));
    }

    #atualizarColisoes() {
        this.#resolverFisica(true);
        this.barcos.forEach(barco => {
            this.#coletarBarris(barco);
            this.#colidirBalas(barco);
        });
    }

    #atualizarJogando() {
        this.nivel.tentarSpawnar();
        this.#atualizarColisoes();
        this.#verificarFimDeNivel();
    }

    #atualizarLimpeza() {
        this.#resolverFisica(false);
        for (let i = 1; i < Jogo.velocidadeLimpeza; i++) this.nivel.atualizar();

        if (!this.nivel.vazio()) return;

        if (this.finalizando) this.#finalizarJogo(this.#vencedorFinal);
        else this.#avancarNivel();
    }

    #atualizarMorte() {
        this.framesMorte--;
        if (this.framesMorte <= 0) this.#finalizarJogo(0);
    }

    #atualizarTransicao() {
        this.framesTransicao--;
        if (this.framesTransicao <= 0) this.estado = 'jogando';
    }

    #atualizarBarco(barco) {
        barco.podeMover = this.#permiteMovimento;
        barco.podeAtirar = this.#permiteCanhao;
        barco.atualizar();
    }

    atualizar() {
        if (this.finalizado) return;

        this.barcos.forEach(barco => this.#atualizarBarco(barco));
        this.nivel.atualizar();

        if (this.estado === 'transicao') this.#atualizarTransicao();
        else if (this.estado === 'morrendo') this.#atualizarMorte();
        else if (this.estado === 'limpando') this.#atualizarLimpeza();
        else this.#atualizarJogando();
    }
}
