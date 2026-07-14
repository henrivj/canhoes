import { obterParametro } from "./utils/url.js";

function lerLista(texto) {
    if (!texto) return [];
    return texto.split(',').map(Number);
}

function montarResultado(modo, vencedor, vitorias, pontuacoes) {
    let titulo, linha1, linha2 = ''
    
    if (modo === 1){
        if(vencedor === 0) titulo = 'Você perdeu!';
        else if(vencedor === 1) titulo = 'Você venceu!';

        linha1 = `Pontos: ${pontuacoes[0]}`
    } else if (modo === 2) {
        titulo = `Jogador ${vencedor} venceu!`

        linha1 = `${vitorias[0]} x ${vitorias[1]}`
        linha2 = `Pontos: ${pontuacoes[0]} x ${pontuacoes[1]}`
    }

    return {
        titulo: titulo,
        linha1: linha1,
        linha2: linha2,
    };
}

function definir(id, texto) {
    if (texto) document.getElementById(id).textContent = texto;
}

const resultado = montarResultado(
    Number(obterParametro('modo')),
    Number(obterParametro('vencedor')),
    lerLista(obterParametro('vitorias')),
    lerLista(obterParametro('pontuacoes'))
);

definir('titulo', resultado.titulo);
definir('linha1', resultado.linha1);
definir('linha2', resultado.linha2);
