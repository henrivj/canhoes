export function hitboxCircular(entidade, escala) {
    const raio = (Math.min(entidade.tamanho.altura, entidade.tamanho.largura) / 2) * escala;

    return {
        centro: entidade.centro,
        raios: { x: raio, y: raio },
    };
}

export function hitboxEliptica(entidade, escala) {
    return {
        centro: entidade.centro,
        raios: {
            x: (entidade.tamanho.largura / 2) * escala,
            y: (entidade.tamanho.altura / 2) * escala,
        },
    };
}

export function verificarColisao(caixaA, caixaB) {
    const distanciaX = caixaB.centro.x - caixaA.centro.x;
    const distanciaY = caixaB.centro.y - caixaA.centro.y;
    const somaRaiosX = caixaA.raios.x + caixaB.raios.x;
    const somaRaiosY = caixaA.raios.y + caixaB.raios.y;

    const termoX = (distanciaX * distanciaX) / (somaRaiosX * somaRaiosX);
    const termoY = (distanciaY * distanciaY) / (somaRaiosY * somaRaiosY);

    return termoX + termoY <= 1;
}

export function calcularSeparacao(caixaA, caixaB) {
    const distanciaX = caixaA.centro.x - caixaB.centro.x;
    const distanciaY = caixaA.centro.y - caixaB.centro.y;
    const distancia = Math.sqrt(distanciaX * distanciaX + distanciaY * distanciaY);

    if (distancia === 0) return { x: 0, y: -1, profundidade: caixaA.raios.y + caixaB.raios.y };

    const direcaoX = distanciaX / distancia;
    const direcaoY = distanciaY / distancia;

    const raioA = 1 / Math.sqrt((direcaoX / caixaA.raios.x) * (direcaoX / caixaA.raios.x) + (direcaoY / caixaA.raios.y) * (direcaoY / caixaA.raios.y));
    const raioB = 1 / Math.sqrt((direcaoX / caixaB.raios.x) * (direcaoX / caixaB.raios.x) + (direcaoY / caixaB.raios.y) * (direcaoY / caixaB.raios.y));
    const profundidade = raioA + raioB - distancia;

    if (profundidade <= 0) return null;

    return { x: direcaoX, y: direcaoY, profundidade };
}

export function empurrar(movel, fixo) {
    const separacao = calcularSeparacao(movel.caixaColisao, fixo.caixaColisao);
    if (!separacao) return false;

    movel.posicao.x += separacao.x * separacao.profundidade;
    movel.posicao.y += separacao.y * separacao.profundidade;
    return true;
}
