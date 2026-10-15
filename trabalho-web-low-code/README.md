# GaleCode — Smart Web Experience

Experiência web moderna para uma empresa de serviços digitais (GaleCode), com assistente de IA **Gale**, personalização em HTML/CSS/JavaScript e formulário de interesse com classificação inteligente.

Projeto alinhado ao desafio **Smart Web Experience: Criando uma Experiência Digital com No-Code, Padrões Web e IA**.

## GaleCode

Acesso público à aplicação:

**[GaleCode](https://admin:webstudio@trabalho-web-low-code-4jrgy.wstd.io/)**

## Problema

Pequenas empresas dependem só das redes sociais: clientes pedem informação, serviços ou orçamentos de forma manual e lenta. É preciso uma presença digital rápida, de baixo custo, responsiva e com interação inteligente — sem equipa de desenvolvimento própria.

## Solução

Site institucional da **GaleCode** com:

- Apresentação de serviços (Web, Mobile, Automações com IA)
- Navegação multipágina (Início, Serviços, Contacto)
- Detalhes interativos por serviço (modal)
- Assistente de atendimento **Gale** (chat simulado)
- Formulário de interesse com **classificação e recomendação** por regras em JavaScript
- Interface responsiva (desktop, tablet, smartphone)

## Funcionalidades

| Funcionalidade | Descrição |
| --- | --- |
| Hero + marca | Página inicial com imagem full-bleed e CTAs |
| Serviços | Cards com imagens e modal de detalhes |
| Contacto | Formulário para demonstrar interesse / pedir orçamento |
| Classificação IA | JS analisa objetivo + mensagem e recomenda o serviço |
| Gale (chat) | Assistente com atalhos, digitação simulada e recomendações |
| Menu mobile | Hamburger + navegação acessível |
| Acessibilidade | Skip link, `aria-*`, `aria-live` no chat, labels no formulário |

## Tecnologias e ferramentas

- **HTML, CSS, JavaScript** — personalização completa num único ficheiro (`index.html`)
- **Plataforma no-code/low-code alvo:** Webstudio (ou Webflow/Framer) — colar o código num bloco Custom HTML / Embed
- **Fonts:** Google Fonts (Inter Tight, Plus Jakarta Sans, DM Sans)
- **Imagens:** Unsplash (licença gratuita)
- **IA / automação:** assistente Gale + classificação heurística de pedidos (simulação local em JS, pronta para evoluir para API real)

## Personalizações com padrões Web

- Layout e tipografia custom (CSS variables, grid, media queries)
- Navegação SPA-like com troca de views em JS
- Modal de serviços e widget de chat flutuante
- Formulário com validação e feedback dinâmico
- Responsividade e `prefers-reduced-motion`
- Atributos de acessibilidade (ARIA, foco, skip link)

## Recurso inteligente

1. **Gale** — chatbot de atendimento que responde sobre serviços, preços e recomenda soluções.
2. **Classificador de pedidos** — no formulário de Contacto, o JavaScript pontua palavras-chave e o objetivo escolhido, classifica a solicitação (Web / Mobile / IA / Orçamento) e recomenda o serviço adequado.

## Ficheiros

| Ficheiro | Uso |
| --- | --- |
| `index.html` | Fragmento **Webstudio-ready** (~42k) — colar no campo Code do HTML Embed |
| `webstudio-embed.html` | Cópia igual a `index.html` |
| `preview.html` | Pré-visualização local do fragmento |
| `index.src.html` | Fonte legível |
| `WEBSTUDIO.md` | Instruções de colagem (Client Only + Run scripts) |

## Como testar localmente

```bash
# Na pasta do projeto
python3 -m http.server 8765
```

Abra [http://localhost:8765](http://localhost:8765).

### Fluxos sugeridos

1. Início → Ver Serviços → clicar num card → Perguntar à Gale  
2. Abrir **Falar com Gale** → atalho **Recomendar**  
3. **Contacto** → preencher formulário → ver classificação → Continuar com a Gale  

## Publicar no Webstudio (ou equivalente)

1. Criar página na plataforma no-code/low-code  
2. Inserir **um** bloco Custom Code / Embed / HTML  
3. Colar **todo** o conteúdo de `index.html` (já está abaixo de 50.000 caracteres)  
4. Publicar e guardar o **link público** da solução  

## Entregáveis do trabalho (checklist)

- [x] Parte prática — aplicação funcional com HTML/CSS/JS + IA  
- [x] README com problema, funcionalidades, tecnologias e instruções  
- [ ] Parte teórica — documento de análise (problema, ferramenta, decisões)  
- [ ] Vídeo pitch (até 4 min) + link YouTube/Loom/Drive  
- [ ] Link público da solução publicada  

## Créditos

Fotos: [Unsplash License](https://unsplash.com/license)  
© 2026 GaleCode · Assistente IA: Gale
