import { carregarImagem } from "../utils/imagens.js";
import { configuracoes } from '../configuracoes.js';
import { normalizarAngulo, limitar } from "../utils/matematica.js";
import { limites } from "../utils/canvas.js";

export default class Renderizador {
    static sombras = configuracoes.renderizador.sombras;
    static hud = configuracoes.hud;
    static jogadores = configuracoes.barcos.jogadores;
    static piscar = configuracoes.barcos.piscar;
    static correnteza = configuracoes.fisica.correnteza;
    static velocidadeLimpeza = configuracoes.jogo.velocidadeLimpeza;

    constructor(canvas, contexto, jogo) {
        this.canvas = canvas;
        this.contexto = contexto;
        this.jogo = jogo;
    }

    spriteSeta = carregarImagem(configuracoes.renderizador.spriteSeta);
    fundo = carregarImagem(configuracoes.renderizador.fundo);
    spritesCoracoes = Renderizador.jogadores.map(jogador => carregarImagem(jogador.spriteCoracao));
    deslocamentoFundo = 0;

    #desenharTexto(texto, x, y, alinhamento) {
        const textos = Renderizador.hud.textos;

        this.contexto.save();
        this.contexto.fillStyle = textos.cor;
        this.contexto.font = textos.fonte;
        this.contexto.textAlign = alinhamento;
        this.contexto.shadowColor = textos.sombra;
        this.contexto.shadowBlur = textos.desfoqueSombra;
        this.contexto.fillText(texto, x, y);
        this.contexto.restore();
    }

    #desenharAviso(linhas, sobreposicao) {
        const avisos = Renderizador.hud.avisos;

        let corSobreposicao = sobreposicao;
        if (!corSobreposicao) corSobreposicao = avisos.sobreposicao;

        let textos = linhas;
        if (typeof textos === 'string') textos = [textos];

        this.contexto.fillStyle = corSobreposicao;
        this.contexto.fillRect(0, 0, limites.largura, limites.altura);

        this.contexto.fillStyle = avisos.cor;
        this.contexto.font = avisos.fonte;
        this.contexto.textAlign = 'center';

        const yInicial = limites.altura / 2 - (textos.length - 1) * avisos.alturaLinha / 2;
        textos.forEach((texto, indice) => this.contexto.fillText(texto, limites.largura / 2, yInicial + indice * avisos.alturaLinha));
    }

    #desenharRotacionado(sprite, x, y, angulo, largura, altura, deslocamentoExtraX = 0) {
        this.contexto.save();
        this.contexto.translate(x, y);
        this.contexto.rotate(angulo);
        if (deslocamentoExtraX) this.contexto.translate(deslocamentoExtraX, 0);
        this.contexto.drawImage(sprite, -largura / 2, -altura / 2, largura, altura);
        this.contexto.restore();
    }

    #desenharSombra(sprite, entidade, deslocamento, inverterY = false) {
        const largura = entidade.tamanho.largura;
        const altura = entidade.tamanho.altura;

        this.contexto.save();
        this.contexto.translate(entidade.posicao.x + largura * deslocamento.x, entidade.posicao.y + altura * deslocamento.y);
        if (inverterY) this.contexto.scale(1, -1);
        this.contexto.filter = `brightness(0) (${Renderizador.sombras.desfoqueSombra}px)`;
        this.contexto.globalAlpha = Renderizador.sombras.opacidadeSombra;
        this.contexto.drawImage(sprite, -largura / 2, -altura / 2, largura, altura);
        this.contexto.restore();
    }

    #indiceSprite(entidade, inverterAngulo = false) {
        const anguloPorQuadro = (Math.PI * 2) / entidade.sprite.length;
        let angulo = entidade.rotacao.atual;
        if (inverterAngulo) angulo = -angulo;

        return Math.floor(normalizarAngulo(angulo + anguloPorQuadro / 2) / anguloPorQuadro) % entidade.sprite.length;
    }

    #barcoPiscando(barco) {
        if (barco.cooldownInvulnerabilidade <= 0) return false;
        return Math.floor(barco.cooldownInvulnerabilidade / Renderizador.piscar) % 2 === 0;
    }

    #desenharComSombra(entidade, deslocamento, inverterY = false) {
        this.#desenharSombra(entidade.sprite, entidade, deslocamento, inverterY);
        this.contexto.drawImage(entidade.sprite, entidade.posicao.x, entidade.posicao.y, entidade.tamanho.largura, entidade.tamanho.altura);
    }

    #desenharSeta(barco) {
        this.#desenharRotacionado(
            this.spriteSeta,
            barco.centro.x,
            barco.centro.y,
            barco.rotacao.atual,
            this.spriteSeta.width,
            this.spriteSeta.height,
            Math.max(barco.tamanho.largura, barco.tamanho.altura) / 2
        );
    }

    #desenharBala(bala) {
        this.#desenharSombra(bala.sprite, bala, Renderizador.sombras.deslocamento.balaCanhao);
        this.#desenharRotacionado(bala.sprite, bala.centro.x, bala.centro.y, bala.rotacao.atual, bala.tamanho.largura, bala.tamanho.altura);
    }

    #desenharLinhaColorida(y) {
        const avisos = Renderizador.hud.avisos;
        const partes = [
            { texto: `${this.jogo.vitorias[0]}`, cor: avisos.coresJogadores[0] },
            { texto: ' x ', cor: avisos.cor },
            { texto: `${this.jogo.vitorias[1]}`, cor: avisos.coresJogadores[1] },
        ];

        let larguraTotal = 0;
        partes.forEach(parte => larguraTotal += this.contexto.measureText(parte.texto).width);

        this.contexto.textAlign = 'left';
        let x = limites.largura / 2 - larguraTotal / 2;
        partes.forEach(parte => {
            this.contexto.fillStyle = parte.cor;
            this.contexto.fillText(parte.texto, x, y);
            x += this.contexto.measureText(parte.texto).width;
        });
    }

    #desenharPlacar() {
        const avisos = Renderizador.hud.avisos;

        this.contexto.save();
        this.contexto.fillStyle = avisos.sobreposicaoEscura;
        this.contexto.fillRect(0, 0, limites.largura, limites.altura);

        this.contexto.font = avisos.fonte;
        this.contexto.shadowColor = Renderizador.hud.textos.sombra;
        this.contexto.shadowBlur = Renderizador.hud.textos.desfoqueSombra;

        this.contexto.textAlign = 'center';
        this.contexto.fillStyle = avisos.cor;
        this.contexto.fillText(`Rodada ${this.jogo.indiceNivel + 1}`, limites.largura / 2, limites.altura / 2 - avisos.alturaLinha / 2);

        this.#desenharLinhaColorida(limites.altura / 2 + avisos.alturaLinha / 2);
        this.contexto.restore();
    }

    #desenharBarraPontuacao() {
        const barra = Renderizador.hud.barra;
        const altura = limites.altura * barra.alturaRelativa;
        const x = limites.largura - barra.margem - barra.largura;
        const y = (limites.altura - altura) / 2;

        this.contexto.fillStyle = barra.fundo;
        this.contexto.fillRect(x - barra.padding, y - barra.padding, barra.largura + barra.padding * 2, altura + barra.padding * 2);

        this.contexto.fillStyle = barra.trilho;
        this.contexto.fillRect(x, y, barra.largura, altura);

        this.jogo.barcos.forEach((barco, indice) => {
            const proporcao = limitar(barco.pontuacao.nivel / this.jogo.nivel.metaPontuacao, 0, 1);

            this.contexto.fillStyle = Renderizador.jogadores[indice].cor;
            this.contexto.fillRect(x, y + altura - altura * proporcao, barra.largura, altura * proporcao);
        });

        this.jogo.barcos.forEach((barco, indice) => {
            const proporcao = limitar(barco.pontuacao.nivel / this.jogo.nivel.metaPontuacao, 0, 1);

            this.contexto.drawImage(barco.sprite[0], x + barra.largura / 2 - barra.marcador / 2, y + altura - altura * proporcao - barra.marcador / 2, barra.marcador, barra.marcador);
        });

        this.contexto.lineWidth = barra.espessuraBorda;
        this.contexto.strokeStyle = barra.contorno;
        this.contexto.strokeRect(x, y, barra.largura, altura);
        this.contexto.lineWidth = barra.espessuraPadrao;

        this.#desenharTexto(`Nível ${this.jogo.indiceNivel + 1}`, x + barra.largura / 2, y + altura + barra.espacamentoTexto, 'center');
    }

    #desenharPlacarJogador(barco, indice) {
        const coracoes = Renderizador.hud.coracoes;

        for (let i = 0; i < barco.vida.atual; i++) {
            let x;
            if (indice === 0) x = coracoes.margem + i * (coracoes.tamanho + coracoes.espacamento);
            else x = limites.largura - coracoes.margem - coracoes.tamanho - i * (coracoes.tamanho + coracoes.espacamento);

            this.contexto.drawImage(this.spritesCoracoes[indice], x, coracoes.margem, coracoes.tamanho, coracoes.tamanho);
        }

        const y = coracoes.margem + coracoes.tamanho + coracoes.espacamentoTexto;

        if (indice === 0) this.#desenharTexto(`${barco.pontuacao.total}`, coracoes.margem, y, 'left');
        else this.#desenharTexto(`${barco.pontuacao.total}`, limites.largura - coracoes.margem, y, 'right');
    }

    renderizarFundo() {
        let velocidade = Renderizador.correnteza;
        if (this.jogo.estado === 'limpando') velocidade *= Renderizador.velocidadeLimpeza;
        this.deslocamentoFundo = (this.deslocamentoFundo - velocidade) % limites.largura;

        this.contexto.drawImage(this.fundo, this.deslocamentoFundo, 0, limites.largura, limites.altura);
        this.contexto.drawImage(this.fundo, this.deslocamentoFundo + limites.largura, 0, limites.largura, limites.altura);

        if (this.deslocamentoFundo > 0) this.contexto.drawImage(this.fundo, this.deslocamentoFundo - limites.largura, 0, limites.largura, limites.altura);
    }

    renderizarFlutuantes() {
        this.jogo.nivel.pedras.forEach(pedra => this.#desenharComSombra(pedra, Renderizador.sombras.deslocamento.pedra));
        this.jogo.nivel.barris.forEach(barril => this.#desenharComSombra(barril, Renderizador.sombras.deslocamento.barril));
        this.jogo.nivel.barcosInimigos.forEach(inimigo => this.#desenharComSombra(inimigo, Renderizador.sombras.deslocamento.barcoInimigo, true));
    }

    renderizarBarcos() {
        this.jogo.barcos.forEach(barco => {
            if (this.#barcoPiscando(barco)) return;

            this.#desenharSombra(barco.sprite[this.#indiceSprite(barco, true)], barco, Renderizador.sombras.deslocamento.barco, true);
            this.contexto.drawImage(barco.sprite[this.#indiceSprite(barco)], barco.posicao.x, barco.posicao.y, barco.tamanho.largura, barco.tamanho.altura);
            this.#desenharSeta(barco);
        });
    }

    renderizarBalasCanhao() {
        this.jogo.barcos.forEach(barco => barco.balasCanhao.forEach(bala => this.#desenharBala(bala)));
    }

    renderizarHud() {
        if (this.jogo.estado !== 'jogando') return;

        this.#desenharBarraPontuacao();
        this.jogo.barcos.forEach((barco, indice) => this.#desenharPlacarJogador(barco, indice));
    }

    renderizarAvisoLimpeza() {
        if (this.jogo.estado !== 'limpando') return;
        this.#desenharAviso(`Nível ${this.jogo.indiceNivel + 1} concluído`, Renderizador.hud.avisos.sobreposicaoEscura);
    }

    renderizarAvisoTransicao() {
        if (this.jogo.estado !== 'transicao') return;

        if (this.jogo.modo === 2) this.#desenharPlacar();
        else this.#desenharAviso(`Nível ${this.jogo.indiceNivel + 1}`);
    }

    renderizar() {
        this.contexto.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.renderizarFundo();
        this.renderizarFlutuantes();
        this.renderizarBarcos();
        this.renderizarBalasCanhao();
        this.renderizarHud();
        this.renderizarAvisoLimpeza();
        this.renderizarAvisoTransicao();
    }
}