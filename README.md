# Canhões!

Desenvolvido por: **Henrique Justus**

> Projeto colaborativo desenvolvido junto com Matheus Steingraber, Juan Amorim e Fábio Trevisan.

---

## 2. Visão Geral do Sistema

### Descrição

**Canhões!** é um jogo desenvolvido em HTML, CSS e JavaScript puro (sem frameworks), com foco em mecânicas de colisão e física em tempo real, renderizadas via `<canvas>`.

### Objetivo

Controlar um barco que navega por um rio, desviando de obstáculos e inimigos, atirando com canhões dos dois lados da embarcação e coletando itens, buscando atingir a pontuação necessária para avançar de fase.

### Tema

O jogador assume o comando de um barco em um rio infestado de piratas e rochas. É preciso sobreviver aos obstáculos, afundar os barcos inimigos com os canhões e coletar barris para pontuar, avançando por fases cada vez mais difíceis até vencer a partida (ou, no modo versus, derrotar o barco adversário).

O jogo possui dois modos:
- **1 Jogador**: modo solo, o jogador avança sozinho pelas fases.
- **2 Jogadores**: modo versus (jogador contra jogador), na mesma tela.

### Instruções de Jogabilidade

**Jogador 1 (barco azul)**

| Ação | Tecla |
|---|---|
| Acelerar para frente | `W` |
| Virar à esquerda | `A` |
| Virar à direita | `D` |
| Frear | `S` |
| Atirar canhão esquerdo | `B` |
| Atirar canhão direito | `V` |

**Jogador 2 (barco vermelho)** — disponível apenas no modo 2 Jogadores

| Ação | Tecla |
|---|---|
| Acelerar para frente | `↑` |
| Virar à esquerda | `←` |
| Virar à direita | `→` |
| Frear | `↓` |
| Atirar canhão esquerdo | `;` |
| Atirar canhão direito | `.` |

**Coletáveis e obstáculos**

- **Barril** 🛢️: item coletável flutuante. Ao passar por cima, concede pontos ao jogador.
- **Pedra**: obstáculo estático. Colidir com ela causa dano e empurra o barco.
- **Barco inimigo (pirata)**: navio inimigo que também causa dano ao colidir; pode ser afundado com um tiro de canhão, o que recupera um pouco de vida e concede pontos extras ao jogador que o destruiu.

### Especificações Técnicas

- **Vidas**: cada barco começa com 3 pontos de vida. Ao sofrer dano, o barco entra em um período curto de invulnerabilidade (90 frames) antes de poder ser atingido novamente. Quando a vida chega a zero, o jogador é eliminado.
- **Progressão de fases**: o jogo possui 3 níveis, cada um com uma meta de pontuação (100 pontos) e número crescente de faixas de spawn (6, 7 e 8 faixas), aumentando a densidade e a dificuldade dos obstáculos e inimigos a cada fase.
- **Pontuação**: pontos são obtidos coletando barris e afundando barcos inimigos. Ao atingir a meta de pontuação da fase, o jogador avança para a próxima; no modo 2 Jogadores, vence a rodada quem atingir a meta primeiro ou quem sobreviver caso o adversário seja eliminado.
- **Colisão**: a detecção de colisão é feita por sobreposição de elipses/círculos (hitboxes), com resolução física simples (empurrão) para colisões entre barcos, pedras e inimigos, e detecção pura para colisões de projéteis (canhões).

### Créditos

**Sobre o aluno**

- Nome: Henrique Justus

**Product Owner / Professor Orientador**

- Nome: Carlos Roberto da Silva Filho

**Demais colaboradores do projeto**

- Matheus Steingraber
- Juan Amorim
- Fábio Trevisan

### Link de Produção

🔗 [https://canhoes.vercel.app/](https://canhoes.vercel.app/)

---

## 3. Instruções de Instalação e Execução

O projeto é feito em **HTML, CSS e JavaScript puro**, sem dependências externas ou etapas de build — não há `package.json`.

1. **Clonagem**

   ```bash
   git clone https://github.com/henrivj/canhoes.git
   cd canhoes
   ```

2. **Instalação de Dependências**

   Não há dependências para instalar — o projeto não utiliza `npm`/`node_modules`.

3. **Execução do Projeto**

   Como o jogo usa módulos ES (`import`/`export`), é necessário servi-lo através de um servidor local (abrir o `index.html` diretamente via `file://` não funciona por restrições de CORS dos módulos ES).

   Algumas opções:

   - **VSCode + Live Server**: instale a extensão "Live Server" e clique em "Go Live" com o `index.html` aberto.
   - **Via Node.js** (sem instalar nada globalmente):

     ```bash
     npx serve .
     ```

   - **Via Python**:

     ```bash
     python -m http.server 8000
     ```

   Depois, acesse o endereço indicado pelo servidor (ex: `http://localhost:8000`) no navegador.

4. **Link do Vercel em Produção**

   🔗 [https://canhoes.vercel.app/](https://canhoes.vercel.app/)
