const cacheImagens = {};

export function carregarImagem(caminho) {
	if (!Array.isArray(caminho)) {
		if (cacheImagens[caminho]) return cacheImagens[caminho];
		const imagem = new Image();
		imagem.src = caminho;
		cacheImagens[caminho] = imagem;
		return imagem;
	}
	else return caminho.map((src) => carregarImagem(src));
}

export function acharImagens(caminho, extensao, quantidade, inicio = 0) {
	const imagens = [];
	for (let i = inicio; i < inicio + quantidade; i++) imagens.push(`${caminho}${i}${extensao}`);
	return imagens;
}