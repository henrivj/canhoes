import { obterParametro } from "./utils/url.js";

function lerLista(texto) {
    if (!texto) return [];
    return texto.split(',').map(Number);
}

function montarResultado(modo, vencedor, vitorias, pontuacoes) {
    if (modo === 2) {
        let titulo = 'Empate!';
        if (vencedor === 1) titulo = 'Jogador 1 venceu!';
        else if (vencedor === 2) titulo = 'Jogador 2 venceu!';

        return {
            titulo: titulo,
            linha1: `${vitorias[0]} x ${vitorias[1]}`,
            linha2: `Pontos: ${pontuacoes[0]} x ${pontuacoes[1]}`,
        };
    }

    let titulo = 'Fim de jogo';
    if (vencedor === 1) titulo = 'Você venceu!';

    return {
        titulo: titulo,
        linha1: `Pontos: ${pontuacoes[0]}`,
        linha2: '',
    };
}

function definir(seletor, texto) {
    if (texto) document.querySelector(seletor).textContent = texto;
}

const resultado = montarResultado(
    Number(obterParametro('modo')),
    Number(obterParametro('vencedor')),
    lerLista(obterParametro('vitorias')),
    lerLista(obterParametro('pontuacoes'))
);

definir('#titulo', resultado.titulo);
definir('#linha1', resultado.linha1);
definir('#linha2', resultado.linha2);
