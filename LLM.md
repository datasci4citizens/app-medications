# LLM.md — Instruções para assistentes de IA

Este arquivo define preferências e regras de colaboração para assistentes de IA (Claude, Copilot, etc.) trabalhando neste projeto.

---

## Estilo de resposta

- Respostas curtas e diretas. Sem introduções desnecessárias.
- Não repetir o que o usuário acabou de dizer antes de responder.
- Usar markdown quando ajudar a clareza, mas sem exagerar.
- Não usar emojis salvo pedido explícito.

---

## Edição de código

- **Não remover comentários sem autorização expressa do usuário.** Comentários no código são intencionais e fazem parte do histórico de raciocínio do desenvolvedor. Sugerir remoção é permitido, executar sem permissão não.
- Não refatorar código além do escopo pedido.
- Não adicionar docstrings, type annotations ou comments em código não alterado.
- Não criar arquivos novos sem necessidade clara.
- Preferir editar arquivos existentes a criar novos.

---

## Arquitetura

Este projeto segue o padrão **MVVM**:

```
src/
├── model/        ← Dados, repositórios, regras de negócio puras
├── viewmodel/    ← Estado da UI e orquestração (Contexts, Hooks)
└── view/         ← Componentes visuais sem lógica de negócio
```

- ViewModel nunca renderiza JSX de UI (loading spinners, páginas de erro, etc.) — isso é responsabilidade da View.
- View nunca importa diretamente do Model — passa pelo ViewModel.
- Providers sempre renderizam `children`; quem decide o que mostrar é a View.

---

## Git

- Não fazer commit sem pedido explícito.
- Não usar `--no-verify` ou bypasses de hook.
- Não fazer push sem confirmação.
