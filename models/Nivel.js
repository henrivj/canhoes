import { limites } from "../utils/canvas.js";
import { configuracoes } from "../configuracoes.js";
import { embaralhar, sortearFaixa } from "../utils/matematica.js";

import Pedra from "./Pedra.js";
import Barril from "./Barril.js";
import BarcoInimigo from "./BarcoInimigo.js";

const classesPorTipo = { pedra: Pedra, barril: Barril, barcoInimigo: BarcoInimigo };

export default class Nivel {
    static gapMinimo = configuracoes.spawn.gapMinimo;

    constructor(config) {
        this.metaPontuacao = config.metaPontuacao;
        this.valorPontosBase = config.valorPontosBase;
        this.numeroFaixas = config.numeroFaixas;
        this.itensSpawn = config.itensSpawn;
    }

    pedras = [];
    barris = [];
    barcosInimigos = [];

    #bloqueia(entidade, faixa) {
        return entidade.faixa === faixa && entidade.posicao.x + entidade.tamanho.largura + Nivel.gapMinimo > limites.largura;
    }

    #faixaBloqueada(faixa) {
        let bloqueada = false;
        const marcar = entidade => { if (this.#bloqueia(entidade, faixa)) bloqueada = true; };

        this.pedras.forEach(marcar);
        this.barris.forEach(marcar);
        this.barcosInimigos.forEach(marcar);

        return bloqueada;
    }

    #guardar(tipo, entidade) {
        if (tipo === 'pedra') this.pedras.push(entidade);
        else if (tipo === 'barril') this.barris.push(entidade);
        else this.barcosInimigos.push(entidade);
    }

    #spawnarItem(item, faixa, alturaFaixa) {
        const tamanho = alturaFaixa * sortearFaixa(item.escalaFaixa.minimo, item.escalaFaixa.maximo);
        const entidade = new classesPorTipo[item.tipo]({
            posicao: { x: limites.largura, y: alturaFaixa * faixa + alturaFaixa / 2 - tamanho / 2 },
            tamanho: { largura: tamanho, altura: tamanho },
            faixa: faixa,
        });

        this.#guardar(item.tipo, entidade);
    }

    #spawnarNaFaixa(faixa, alturaFaixa) {
        for (let i = 0; i < this.itensSpawn.length; i++) {
            if (Math.random() < this.itensSpawn[i].chance) {
                this.#spawnarItem(this.itensSpawn[i], faixa, alturaFaixa);
                return;
            }
        }
    }

    tentarSpawnar() {
        const alturaFaixa = limites.altura / this.numeroFaixas;

        let faixas = [];
        for (let i = 0; i < this.numeroFaixas; i++) faixas.push(i);
        embaralhar(faixas);

        faixas.forEach((faixa, indice) => {
            if (indice === 0 || this.#faixaBloqueada(faixa)) return;
            this.#spawnarNaFaixa(faixa, alturaFaixa);
        });
    }

    atualizar() {
        this.pedras.forEach(pedra => pedra.atualizar());
        this.barris.forEach(barril => barril.atualizar());
        this.barcosInimigos.forEach(barcoInimigo => barcoInimigo.atualizar());

        this.pedras = this.pedras.filter(pedra => pedra.vivo);
        this.barris = this.barris.filter(barril => barril.vivo);
        this.barcosInimigos = this.barcosInimigos.filter(barcoInimigo => barcoInimigo.vivo);
    }

    vazio() {
        return this.pedras.length === 0 && this.barris.length === 0 && this.barcosInimigos.length === 0;
    }
}
