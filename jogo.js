import { canvas, contexto, limites } from "./utils/canvas.js";
import { configuracoes } from "./configuracoes.js";
import { obterParametro, montarUrl } from "./utils/url.js";

import Jogo from "./models/Jogo.js";
import Nivel from "./models/Nivel.js";
import Renderizador from "./models/Renderizador.js";
import Barco from "./models/Barco.js";

const modo = Number(obterParametro('barcos'));

let barcos = [];
for (let i = 0; i < modo; i++) {
    const tamanho = configuracoes.barcos.tamanho;

    barcos.push(
        new Barco({
            posicao: {
                x: (limites.largura / 2) - (tamanho.largura / 2),
                y: ((limites.altura / (modo + 1)) * (i + 1)) - (tamanho.altura / 2),
            },
            sprite: configuracoes.barcos.jogadores[i].sprite,
            controles: configuracoes.barcos.jogadores[i].controles,
        })
    );
}

const niveis = configuracoes.niveis.map(configuracaoNivel => new Nivel(configuracaoNivel));
const jogo = new Jogo(barcos, niveis, modo);
const renderizador = new Renderizador(canvas, contexto, jogo);

function main() {
    jogo.atualizar();

    if (jogo.finalizado) return window.location.href = montarUrl('./fim.html', jogo.resultado);

    renderizador.renderizar();
    requestAnimationFrame(main);
}

main();