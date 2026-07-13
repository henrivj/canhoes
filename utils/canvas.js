export const canvas = document.querySelector('canvas');
export const contexto = canvas.getContext('2d');

export const limites = { largura: window.innerWidth, altura: window.innerHeight };

canvas.width = limites.largura;
canvas.height = limites.altura;
contexto.imageSmoothingEnabled = false;