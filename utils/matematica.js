export function normalizarAngulo(angulo) {
    return ((angulo % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
}

export function anguloParaRotacao(angulo) {
    return {
        x: Math.cos(angulo),
        y: Math.sin(angulo),
    };
}

export function limitar(valor, minimo, maximo) {
    return Math.min(Math.max(valor, minimo), maximo);
}

export function sortearFaixa(minimo, maximo) {
    return minimo + Math.random() * (maximo - minimo);
}

export function embaralhar(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
