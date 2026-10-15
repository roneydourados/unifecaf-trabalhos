# Como colar no Webstudio (HTML Embed)

Use o ficheiro **`index.html`** (ou `webstudio-embed.html` — são iguais).

É um **fragmento** (~42k caracteres), sem `<!DOCTYPE>` / `<html>` / `<body>`, pronto para o campo **Code**.

## Passos

1. No Webstudio, selecione o componente **HTML Embed**
2. Abra **Settings** (painel da direita)
3. Ative **Client Only** → **ON**
4. Ative **Run scripts on canvas** → **ON** (para testar no editor)
5. Apague tudo o que estiver no campo **Code**
6. Cole **todo** o conteúdo de `index.html` de uma vez
7. Publique / Preview para validar o chat e os botões

## Por que dava erro / não funcionava

| Problema | Causa | Correção |
| --- | --- | --- |
| Syntax error ao colar | Documento HTML completo (`<!DOCTYPE>`, `<html>`) no Embed | Agora é só fragmento |
| Syntax `Identifier already declared` | `const` global + script a correr 2× | IIFE + guarda `__gcInited` |
| Funções não respondiam | Uso de `DOMContentLoaded` (Webstudio não dispara) | `initGaleCode()` corre já |
| Widget estranho | `position:fixed` + animações no canvas | Botão limpo + overlays no `body` |
| Fechar dialog não funciona | Listeners perdidos na hidratação | Delegação global + `onclick` + `window.fecharModal` |

## Teste local

Abra `preview.html` no browser (envolve o fragmento num documento completo).

```bash
python3 -m http.server 8765
# http://localhost:8765/preview.html
```
