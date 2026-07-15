import { acharImagens } from "./utils/imagens.js";

export const configuracoes = {
    fisica: {
        correnteza: 4,
        atrito: 0.01,
    },

    jogo: {
        duracaoTransicao: 150,
        duracaoMorte: 72,
        velocidadeLimpeza: 4,
    },

    spawn: {
        gapMinimo: 120,
    },

    barcos: {
        tamanho: { altura: 100, largura: 100 },
        velocidade: {
            atual: 0,
            maxima: 6,
            aceleracao: { minima: 0.05, maxima: 0.12 },
            freio: 0.08,
        },
        rotacao: { atual: 0, velocidade: { minima: 0.02, maxima: 0.05 }, fatorPivo: 1.8 },
        vida: { atual: 3, maxima: 3 },
        invulnerabilidade: 90,
        piscar: 6,
        caixaColisao: { escala: 0.8 },
        jogadores: [
            {
                sprite: acharImagens('./assets/barcos/jogadores/azul/barcoAzul_', '.png', 16),
                spriteCoracao: './assets/barcos/jogadores/coracaoAzul.png',
                cor: 'rgba(70, 130, 240, 0.8)',
                controles: {
                    frente: 'w',
                    esquerda: 'a',
                    direita: 'd',
                    freio: 's',
                    atirar: { esquerda: 'b', direita: 'v' },
                },
            },
            {
                sprite: acharImagens('./assets/barcos/jogadores/vermelho/barcoVermelho_', '.png', 16),
                spriteCoracao: './assets/barcos/jogadores/coracaoVermelho.png',
                cor: 'rgba(240, 80, 80, 0.8)',
                controles: {
                    frente: 'arrowup',
                    esquerda: 'arrowleft',
                    direita: 'arrowright',
                    freio: 'arrowdown',
                    atirar: { esquerda: ';', direita: '.' },
                },
            },
        ],
    },

    canhao: {
        cooldown: { esquerda: 30, direita: 30 },
        lados: {
            esquerda: { angulo: Math.PI / 2 },
            direita: { angulo: -Math.PI / 2 },
        },
        bala: {
            sprite: './assets/barcos/balaCanhao.png',
            tamanho: { altura: 20, largura: 20 },
            velocidade: { maxima: 10 },
            rotacao: { atual: 0, velocidade: { minima: -0.3, maxima: 0.3 } },
            vida: { atual: 1, maxima: 1 },
            dano: 1,
            caixaColisao: { escala: 1 },
        },
    },

    barcoInimigo: {
        sprite: './assets/barcos/pirata/barcoPirata.png',
        vida: { atual: 1, maxima: 1 },
        dano: 1,
        caixaColisao: { escala: 0.8 },
        recompensa: { vida: 1, fatorPontos: 0.5 },
    },

    pedra: {
        sprites: acharImagens('./assets/pedras/pedra_', '.png', 5, 1),
        vida: { atual: 1, maxima: 1 },
        dano: 1,
        caixaColisao: { escala: 0.8 },
    },

    barril: {
        sprite: './assets/barris/barril.png',
        vida: { atual: 1, maxima: 1 },
        caixaColisao: { escala: 0.9 },
    },

    renderizador: {
        spriteSeta: './assets/barcos/jogadores/seta.png',
        fundo: './assets/rio.png',
        reflexos: {
            opacidadeReflexo: 0.4,
            deslocamento: {
                barco: { x: 0.5, y: 1 },
                balaCanhao: { x: 1, y: 2 },
                barcoInimigo: { x: 0.5, y: 1.2 },
                pedra: { x: 0.55, y: 1 },
                barril: { x: 0.55, y: 0.7 },
            },
        },
    },

    hud: {
        textos: { fonte: '20px monospace', cor: 'white', sombra: 'rgba(0, 0, 0, 0.85)', desfoqueSombra: 4 },
        avisos: { fonte: '64px monospace', cor: 'white', alturaLinha: 72, sobreposicao: 'rgba(0, 0, 0, 0.4)', sobreposicaoEscura: 'rgba(0, 0, 0, 0.62)', coresJogadores: ['rgb(120, 180, 255)', 'rgb(255, 110, 110)'] },
        barra: {
            largura: 30,
            alturaRelativa: 0.45,
            margem: 48,
            padding: 6,
            espacamentoTexto: 32,
            marcador: 34,
            espessuraBorda: 3,
            espessuraPadrao: 1,
            contorno: 'white',
            fundo: 'rgba(15, 23, 42, 0.7)',
            trilho: 'rgba(0, 0, 0, 0.4)',
        },
        coracoes: { tamanho: 32, espacamento: 8, margem: 24, espacamentoTexto: 24 },
    },

    niveis: [
        {
            metaPontuacao: 100,
            valorPontosBase: 10,
            numeroFaixas: 6,
            itensSpawn: [
                { tipo: 'barril', escalaFaixa: { minimo: 0.275, maximo: 0.35 }, chance: 0.0035 },
                { tipo: 'pedra', escalaFaixa: { minimo: 0.7, maximo: 0.9 }, chance: 0.0045 },
                { tipo: 'barcoInimigo', escalaFaixa: { minimo: 0.75, maximo: 0.95 }, chance: 0.0011 },
            ],
        },
        {
            metaPontuacao: 100,
            valorPontosBase: 10,
            numeroFaixas: 7,
            itensSpawn: [
                { tipo: 'barril', escalaFaixa: { minimo: 0.2, maximo: 0.3 }, chance: 0.0025 },
                { tipo: 'pedra', escalaFaixa: { minimo: 0.85, maximo: 0.95 }, chance: 0.0055 },
                { tipo: 'barcoInimigo', escalaFaixa: { minimo: 0.9, maximo: 1 }, chance: 0.0015 },
            ],
        },
        {
            metaPontuacao: 100,
            valorPontosBase: 10,
            numeroFaixas: 8,
            itensSpawn: [
                { tipo: 'barril', escalaFaixa: { minimo: 0.15, maximo: 0.25 }, chance: 0.0015 },
                { tipo: 'pedra', escalaFaixa: { minimo: 1, maximo: 1.25 }, chance: 0.006 },
                { tipo: 'barcoInimigo', escalaFaixa: { minimo: 1, maximo: 1.1 }, chance: 0.0025 },
            ],
        },
    ],
};