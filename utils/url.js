export function obterParametro(chave) {
    const parametros = new URLSearchParams(window.location.search);
    return parametros.get(chave);
}

export function montarUrl(pagina, parametros) {
    const url = new URL(pagina, window.location.href);
    for (const chave in parametros) url.searchParams.set(chave, parametros[chave]);
    return url.href;
}
