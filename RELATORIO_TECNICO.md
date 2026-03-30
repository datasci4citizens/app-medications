# Relatório Técnico — LembraMed (app-medications)

> **Data:** 27 de março de 2026
> **Revisado por:** Análise automatizada com Claude Code
> **Branch analisada:** `64-refactor-project-architecture-to-mvvm`

---

## 1. Visão Geral

### Resumo do estado atual

LembraMed é um aplicativo de lembrete e controle de medicamentos desenvolvido em **React 19 + TypeScript + Capacitor**, com suporte a Web e Android. A aplicação permite que usuários registrem medicamentos, visualizem doses diárias por horário, marquem doses como tomadas ou esquecidas, e façam buscas em um banco de dados de medicamentos.

A **migração para MVVM foi concluída** desde o relatório anterior (26/03/2026): a estrutura `src/model/`, `src/view/` e `src/viewmodel/` está ativa e conectada ao `main.tsx`. A arquitetura antiga (`src/contexts/`, `src/pages/`, `src/utils/` na raiz) foi removida. O app em execução agora roda 100% pela nova arquitetura.

### Progresso da migração MVVM

| Camada | Estrutura criada | Conectada ao app | Progresso |
|--------|-----------------|-----------------|-----------|
| Model | ✅ `src/model/` completo | ✅ Usada por contexts e services | 100% |
| ViewModel | ✅ `src/viewmodel/` completo | ✅ Usada pelo `main.tsx` | 100% |
| View | ✅ `src/view/` completo | ✅ Usada pelo `main.tsx` | 100% |

**Progresso geral da migração: 100%** ✅

A migração arquitetural está finalizada. Os itens pendentes agora são de funcionalidade e qualidade, não de arquitetura.

### Pontuação geral de qualidade: **7,0 / 10**

**Justificativa (atualizada):**
- (+) Migração MVVM concluída e funcional
- (+) `main.tsx` importa corretamente de `src/view/` e `src/viewmodel/`
- (+) `AuthContext` agora usa `authStorage` do repositório — `localStorage` não é mais acessado diretamente
- (+) `MedicationContext` não renderiza mais JSX — apenas expõe `isLoading`
- (+) `InitLogin()` protegido por `try/catch`
- (+) Stack moderna, bem configurada (React 19, Vite, Tailwind 4, Capacitor, TypeScript strict)
- (+) Tipagem robusta com interfaces bem definidas
- (+) Lógica de cálculo de doses correta e bem isolada
- (-) Funcionalidade principal (`AddMedication`) completamente comentada e inoperante
- (-) Zero cobertura de testes
- (-) Persistência insegura de tokens de autenticação (localStorage via Repository)
- (-) `Profile.tsx` é um stub vazio
- (-) Código morto comentado nos Contexts (tela de loading não implementada na View)

---

## 2. Arquitetura & MVVM

### O que está correto (estado atual)

**Estrutura MVVM completamente ativa:**

```
src/
├── model/          ← Dados, repositórios, regras de negócio puras
│   ├── repositories/   ← AuthRepository, MedicationRepository
│   ├── data/           ← Dados mock (mockMedication, mockMedicationsDatabase)
│   ├── services/       ← socialAuth (OAuth Google)
│   └── utils/          ← Cálculos e helpers puros
├── viewmodel/      ← Estado da UI e orquestração
│   ├── contexts/       ← AuthContext, MedicationContext
│   └── hooks/          ← useAuth, useMedications
└── view/           ← Componentes visuais sem lógica de negócio
    ├── components/     ← Button, Input, Modal, MedicationCard, DateSelector, ProtectedRoute
    ├── pages/          ← Login, Home, Medications, MedicationDetails, SearchMedication, etc.
    └── styles/         ← index.css, theme.css
```

**`main.tsx` conectado corretamente à nova arquitetura:**

```typescript
// src/main.tsx — CORRETO (estado atual)
import { AuthProvider } from './viewmodel/contexts/AuthContext.tsx';
import { MedicationProvider } from './viewmodel/contexts/MedicationContext.tsx';
import { Home } from './view/pages/Home.tsx';
import { Medications } from './view/pages/Medications.tsx';
// ✅ Todos os imports agora apontam para src/view/ e src/viewmodel/
```

**`AuthContext` usa o Repository corretamente:**

```typescript
// src/viewmodel/contexts/AuthContext.tsx — CORRETO
import { authStorage } from '../../model/repositories/AuthRepository';

const login = (userData: User, authToken: string) => {
  authStorage.saveToken(authToken);  // ✅ via Repository, não localStorage direto
  authStorage.saveUser(userData);
};
```

**`MedicationContext` não renderiza mais JSX:**

```typescript
// src/viewmodel/contexts/MedicationContext.tsx — CORRETO
return <MedicationContext.Provider value={value}>{children}</MedicationContext.Provider>;
// ✅ Sem JSX de loading — expõe apenas isLoading como estado
```

**`InitLogin()` protegido por `try/catch`:**

```typescript
// src/main.tsx — CORRETO
try {
  await InitLogin();
} catch (e) {
  console.warn("Error: InitLogin not works: ", e);
}
```

### Violações remanescentes de responsabilidade

#### Violação 1 — Loading spinner não implementado na View

O código de loading foi removido dos Contexts (correto), mas nenhum componente na View consome o `isLoading` para exibir um spinner. O resultado prático é que a tela fica em branco durante o carregamento inicial.

```typescript
// src/viewmodel/contexts/MedicationContext.tsx
// if (isLoading) {  ← código comentado, ainda não implementado na View
//   return (<div>Carregando...</div>);
// }
```

**Solução:** Criar um componente `LoadingSpinner` na View e consumir `isLoading` nos layouts (`Home.tsx` ou `App.tsx`):

```typescript
// src/view/pages/Home.tsx
function Home() {
  const { isLoading } = useMedications();
  if (isLoading) return <LoadingSpinner />;
  return <Outlet />;
}
```

#### Violação 2 — `useAuth` definido em `AuthContext.tsx` em vez do próprio hook

```typescript
// src/viewmodel/contexts/AuthContext.tsx — linhas 79-88
export function useAuth() {  // ❌ hook definido no Context
  const context = useContext(AuthContext);
  if (!context) throw new Error('...');
  return context;
}
```

Deveria estar em `src/viewmodel/hooks/useAuth.ts`. Atualmente `src/viewmodel/hooks/` pode ter um arquivo separado — verificar se há duplicidade.

#### Violação 3 — View ainda acoplada diretamente ao Model em `MedicationDetails.tsx`

```typescript
// src/view/pages/MedicationDetails.tsx — acoplamento indevido ainda presente
import { medicationsDatabase } from "../../model/data/mockMedicationsDatabase";  // ❌
import { calculateDosesForDay } from "../../model/utils/medicationCalculations"; // ❌
import { getBrandColor } from "../../model/utils/brandColorHelper";              // ❌
```

Essas dependências deveriam ser resolvidas pelo ViewModel (hook `useMedications` estendido) e chegar como props ou via hook.

---

## 3. Design Patterns

### Padrões aplicados corretamente

| Padrão | Onde | Avaliação |
|--------|------|-----------|
| **Repository** | `src/model/repositories/` | ✅ Correto e em uso pelo ViewModel |
| **Observer** | React Context + `useState` | ✅ Padrão idiomático para React |
| **Custom Hook** | `useAuth`, `useMedications` | ✅ Encapsulamento correto, com guard de provider |
| **Factory (implícito)** | `addMedication` cria objeto com ID | ✅ Funciona, mas pode melhorar |
| **Strategy** | `ScheduleType: 'fixed' \| 'interval'` | ✅ Tipos de agendamento bem definidos |

### Padrões aplicados incorretamente

#### Factory incompleto — ID frágil

```typescript
// src/viewmodel/contexts/MedicationContext.tsx — linha 74
id: Date.now().toString(), // ❌ Colisão possível em adições rápidas; não é UUID
```

**Solução:**
```typescript
id: crypto.randomUUID(), // ✅ disponível em browsers modernos e Capacitor
```

### Padrões recomendados que estão faltando

| Padrão | Onde aplicar | Motivo |
|--------|-------------|--------|
| **Error Boundary** | Wrapper em `main.tsx` | Crashes silenciosos em produção sem feedback ao usuário |
| **Command Pattern** | Ações de dose (`markAsTaken`, `markAsSkipped`) | Habilita undo, auditoria e replay de ações |
| **Adapter** | Camada entre API backend e tipos locais | `Login.tsx` usa a resposta da API diretamente |
| **State Machine** | `DoseStatus` (upcoming → pending → late → taken/skipped) | Transições de estado com regras complexas sem enforcement |

---

## 4. Segurança

### 🔴 ALTO — Token JWT armazenado em `localStorage`

**Arquivos:** `src/model/repositories/AuthRepository.ts`, `src/model/repositories/storage.ts`

O `AuthContext` agora usa corretamente o `authStorage` do Repository (melhoria em relação ao relatório anterior), mas o Repository em si persiste o token em `localStorage`, que é vulnerável a XSS:

```typescript
// src/model/repositories/AuthRepository.ts (inferido)
// storage.set('auth_token', token) → localStorage.setItem(...)  🔴
```

**Risco:** Qualquer script XSS na página pode ler `localStorage` e roubar o token.

**Correção:** Para Capacitor/Android, usar `@capacitor/preferences` (Secure Storage). Para web, usar `httpOnly cookies` gerenciados pelo backend:

```typescript
import { Preferences } from '@capacitor/preferences';

export const authStorage = {
  saveToken: async (token: string) =>
    Preferences.set({ key: 'auth_token', value: token }),
  getToken: async () =>
    (await Preferences.get({ key: 'auth_token' })).value,
};
```

### 🔴 ALTO — Nenhuma validação do token JWT recebido do backend

**Arquivo:** `src/view/pages/Auth/Login.tsx`

O token retornado pelo backend é armazenado sem nenhuma verificação de assinatura, expiração ou formato.

**Correção:** Validar pelo menos a expiração do JWT no cliente antes de armazenar. Adicionar lógica de refresh token ou redirecionamento ao expirar.

### 🟡 MÉDIO — Tipo `any` em dados de usuário

**Arquivo:** `src/model/repositories/AuthRepository.ts`, `src/model/repositories/storage.ts`

```typescript
getUser: () => storage.get('user'), // 🟡 Retorna unknown sem cast tipado
```

**Correção:**
```typescript
getUser: () => storage.get<User>('user'),
saveUser: (user: User) => storage.set<User>('user', user),
```

### 🟡 MÉDIO — Ausência de expiração de sessão

Não há verificação de TTL do token. Um token armazenado meses atrás será aceito indefinidamente no cliente.

### 🟡 MÉDIO — Login como convidado sem restrições

O fluxo de "Entrar como Convidado" cria uma sessão sem autenticação real, mas tem acesso às mesmas rotas protegidas que um usuário autenticado.

### 🟢 BAIXO — Sanitização de input presente mas não utilizada consistentemente

`src/model/utils/validators.ts` define `sanitizeString()` e `sanitizeInput()`, mas não são chamados nos campos de busca de `SearchMedication.tsx`.

---

## 5. Design System & UI

### Consistência visual

#### Cores hardcoded no JSX em vez de variáveis CSS

```typescript
// src/view/pages/MedicationDetails.tsx
<div className="min-h-screen bg-[#eeeef4]">  // ❌ cor arbitrária, não está em theme.css
```

O arquivo `theme.css` define `--color-graybg: #EFEFEF`, mas o valor usado na página (`#eeeef4`) é diferente e não mapeado.

#### Tamanhos de fonte não padronizados

```typescript
// src/view/pages/Medications.tsx
<h2 className="font-merriweather font-bold text-[26px]">  // ❌ tamanho arbitrário
<h3 className="font-merriweather font-bold text-[28px]">  // ❌ diferente sem motivo
```

**Solução:** Definir uma escala tipográfica no `tailwind.config.js`:

```javascript
theme: {
  extend: {
    fontSize: {
      'display': ['2rem', { lineHeight: '1.2' }],
      'heading': ['1.75rem', { lineHeight: '1.3' }],
      'subheading': ['1.625rem', { lineHeight: '1.4' }],
    }
  }
}
```

### Componentes duplicados sem abstração

**`MedicationCard` de dose renderizado em 3 contextos idênticos em `Medications.tsx`.**

Poderia ser abstraído em um componente `DoseSection`:

```typescript
function DoseSection({ title, doses, onTake, onCardClick }: DoseSectionProps) {
  if (doses.length === 0) return null;
  return (
    <div className="mt-8">
      <h3 className="font-merriweather font-bold text-heading text-inkblack mb-3">{title}</h3>
      <div className="flex flex-col gap-3">
        {doses.map((dose) => (
          <MedicationCard key={dose.occurrenceId} dose={dose}
            onTake={() => onTake(dose)} onClick={() => onCardClick(dose.medication.id)} />
        ))}
      </div>
    </div>
  );
}
```

### Acessibilidade (a11y)

| Problema | Severidade | Arquivo |
|----------|-----------|---------|
| Botões sem `aria-label` (apenas ícones) | 🟡 Médio | `MedicationDetails.tsx` (botão voltar com `<FiArrowLeft>`) |
| Imagens de medicamento sem `alt` descritivo | 🟡 Médio | `MedicationDetails.tsx` |
| Loading spinner sem `role="status"` e `aria-live` | 🟢 Baixo | não implementado ainda |
| `<button>` estilo "TOMADO" sem `disabled` attribute | 🟡 Médio | `MedicationDetails.tsx` |
| Contraste de texto: `text-gray-400` em fundo branco | 🟡 Médio | Estado vazio em `Medications.tsx` |

---

## 6. Qualidade de Código

### Violações de Clean Code

#### Comentários de BUG no código de produção

Há comentários como `// BUG 3:`, `// BUG 6:`, `// BUG 14:`, `// BUG 17:` espalhados pelo código:

```typescript
// src/view/pages/Medications.tsx
// BUG 3: Normalizar selectedDate para meia-noite ao inicializar

// src/view/pages/MedicationDetails.tsx
// BUG 6: Calcular a dose atual/próxima para permitir interagir pelos botões
// BUG 14: Guard de data futura
```

**Solução:** Converter em issues no repositório e remover do código.

#### Nomes de variáveis em português e inglês misturados

```typescript
// src/view/pages/Medications.tsx
const horario = dose.time;  // ❌ "horario" em português, resto em inglês
```

#### `setTimeout` para navegação animada — frágil

```typescript
// src/view/pages/MedicationDetails.tsx
function handleBack() {
  setIsExiting(true);
  setTimeout(() => navigate(-1), 250); // ❌ 250ms hardcoded
}
```

### Cobertura de testes

**Cobertura atual: 0%**

O diretório `tests/` existe mas contém apenas um arquivo de imagem de mockup (`Faixa_lateral.png`) e uma pasta `old code/`. Nenhum arquivo `.test.ts` ou `.spec.ts` foi encontrado.

**O que falta prioritariamente:**

| Módulo | Tipo de teste recomendado |
|--------|--------------------------|
| `medicationCalculations.ts` | Unit test — lógica de status de dose com casos de borda |
| `validators.ts` | Unit test — validação de formulários |
| `MedicationContext` | Integration test — CRUD de medicamentos |
| `AuthContext` | Integration test — login/logout/persistência |
| `Medications.tsx` | Component test — renderização e interações |
| `ProtectedRoute.tsx` | Component test — redirecionamento autenticado/não autenticado |

### Tratamento de erros

#### Sem Error Boundary

Não existe nenhum Error Boundary no app. Um erro não tratado em qualquer componente resulta em tela em branco sem feedback ao usuário.

#### Erro silencioso no storage

```typescript
// src/model/repositories/storage.ts
get: <T>(key: string): T | null => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error('Erro ao buscar:', error); // ❌ retorna null silenciosamente
    return null;
  }
},
```

### Código morto / não utilizado

| Arquivo | Situação |
|---------|----------|
| `src/view/pages/AddMedication.tsx` | 100% comentado — retorna `<></>` |
| `src/view/pages/Profile.tsx` | Stub vazio — exibe apenas "Perfil em construção" |
| `src/view/pages/LoadingPageAuth.tsx` | Criado mas não usado (import comentado em `AuthContext`) |
| `src/model/utils/validators.ts` (`validateRegisterForm`) | Exportada mas não há tela de cadastro |
| Comentários `// BUG X:` | Marcadores de desenvolvimento em arquivos de produção |

---

## 7. Plano de Ação Priorizado

> **Itens concluídos desde o relatório anterior (26/03):**
> - ✅ `main.tsx` conectado à nova arquitetura MVVM
> - ✅ Arquivos antigos (`src/contexts/`, `src/pages/`, `src/utils/` raiz) removidos
> - ✅ `AuthContext` usando `authStorage` do Repository
> - ✅ `MedicationContext` sem JSX de loading
> - ✅ `InitLogin()` com tratamento de erro

| Prioridade | Item | Categoria | Esforço estimado | Impacto |
|-----------|------|-----------|-----------------|---------|
| 🔴 P0 | Implementar `AddMedication.tsx` (descomentar e corrigir) | Funcionalidade | Grande (2–3 dias) | Crítico |
| 🔴 P1 | Implementar spinner de loading na View consumindo `isLoading` | Confiabilidade | Pequeno (2h) | Alto |
| 🔴 P1 | Migrar autenticação para Capacitor Preferences / httpOnly cookies | Segurança | Médio (1 dia) | Alto |
| 🟡 P1 | Adicionar Error Boundary global | Confiabilidade | Pequeno (2h) | Alto |
| 🟡 P1 | Remover todos os comentários `// BUG X:` e criar issues | Qualidade | Pequeno (1h) | Médio |
| 🟡 P1 | Mover `MedicationDetails` para não importar diretamente do Model | Arquitetura | Pequeno (2h) | Médio |
| 🟡 P2 | Implementar `Profile.tsx` | Funcionalidade | Grande (2+ dias) | Médio |
| 🟡 P2 | Adicionar testes unitários para `medicationCalculations.ts` | Testes | Médio (1 dia) | Alto |
| 🟡 P2 | Substituir `Date.now().toString()` por `crypto.randomUUID()` | Qualidade | Pequeno (30 min) | Médio |
| 🟡 P2 | Validar expiração do JWT no cliente | Segurança | Pequeno (2h) | Médio |
| 🟢 P3 | Padronizar escala tipográfica no `tailwind.config.js` | Design System | Pequeno (2h) | Baixo |
| 🟢 P3 | Adicionar `aria-label` em botões de ícone | Acessibilidade | Pequeno (2h) | Médio |
| 🟢 P3 | Corrigir cor `bg-[#eeeef4]` para variável de design token | Design System | Pequeno (30 min) | Baixo |
| 🟢 P3 | Abstrair `DoseSection` para evitar repetição em `Medications.tsx` | Qualidade | Pequeno (1h) | Baixo |

---

### Roadmap sugerido

#### Fase 1 — Urgente (próxima sprint)

```
[ ] Implementar AddMedication.tsx — funcionalidade nuclear do app
[ ] Implementar loading spinner na View (consumir isLoading dos contexts)
[ ] Adicionar Error Boundary global
[ ] Substituir Date.now().toString() por crypto.randomUUID()
[ ] Remover todos os comentários "BUG X:" e criar issues no repositório
[ ] Mover lógica do Model que está em MedicationDetails para o ViewModel
```

#### Fase 2 — Importante (sprint seguinte)

```
[ ] Migrar armazenamento de token para Capacitor Preferences
[ ] Implementar Profile.tsx com dados do usuário logado
[ ] Adicionar validação de expiração do JWT no cliente
[ ] Escrever testes unitários para medicationCalculations.ts e validators.ts
[ ] Mover useAuth para src/viewmodel/hooks/useAuth.ts (se ainda estiver em AuthContext)
```

#### Fase 3 — Melhorias (backlog)

```
[ ] Padronizar escala tipográfica com tokens Tailwind
[ ] Corrigir inconsistências de cor (bg-[#eeeef4] → variável CSS)
[ ] Adicionar aria-label em todos os botões de ícone
[ ] Abstrair componente DoseSection em Medications.tsx
[ ] Adicionar testes de componente (Medications, MedicationCard, Auth)
[ ] Implementar refresh token e expiração de sessão
[ ] Implementar suporte a notificações push para lembretes
[ ] Integrar com backend real (substituir mock data)
```

---

## Pontos Positivos

**Migração MVVM concluída:**
A separação entre Model, View e ViewModel está completa e operacional. `main.tsx` importa exclusivamente de `src/view/` e `src/viewmodel/`, e os Contexts consomem os Repositories corretamente.

**Tipagem TypeScript rigorosa:**
Os tipos em `src/types/index.ts` são detalhados e corretos — `DoseStatus`, `ScheduleType`, `WeekDay` e `DoseRecord` capturam fielmente o domínio do problema.

**Lógica de cálculo de doses bem isolada:**
`medicationCalculations.ts` centraliza toda a lógica de cálculo de status de dose com suporte a agendamentos fixos, por intervalo e restrições por dias da semana — corretamente separada da UI e em `src/model/utils/`.

**Performance com `useMemo`:**
`Medications.tsx` usa `useMemo` de forma apropriada para evitar recálculos de doses a cada re-render.

**Abstração de storage:**
`src/model/repositories/storage.ts` e os Repositories específicos (`AuthRepository`, `MedicationRepository`) formam uma camada de abstração correta, facilitando a futura migração para armazenamento seguro.

**Componentes comuns bem implementados:**
`Button.tsx`, `Input.tsx` e `Modal.tsx` são componentes polimórficos bem estruturados com variantes tipadas.

**Configuração de tooling moderna e completa:**
Stack bem escolhida: Biome para formatação/lint, Vite 7 com SWC, TypeScript strict mode, Capacitor 8 para mobile — ferramentas adequadas para um projeto desse tipo.

**Sistema de cores de marca farmacêutica:**
O mapeamento de marcas de medicamentos para cores em `BRAND_COLORS` é um detalhe de UX cuidadoso que melhora o reconhecimento visual na lista de doses.
