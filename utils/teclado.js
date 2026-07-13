export const teclasPressionadas = {};

document.addEventListener('keydown', (event) => (teclasPressionadas[event.key.toLowerCase()] = true));
document.addEventListener('keyup', (event) => (teclasPressionadas[event.key.toLowerCase()] = false));

window.addEventListener('blur', () => {
    for (const tecla in teclasPressionadas) teclasPressionadas[tecla] = false;
});
