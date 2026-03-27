# LembraMed

A medication tracker app focused on accessibility and simplicity.

## 🏗️ Arquitetura (MVVM)

Este projeto segue o padrão **Model-View-ViewModel (MVVM)** para garantir a separação de responsabilidades e facilitar a manutenção:

```text
src/
├── model/           # Camada de Dados e Regras de Negócio
│   ├── data/        # Bancos de dados mockados e dados estáticos
│   ├── repositories/# Abstração do acesso aos dados (LocalStorage, API)
│   ├── services/    # Serviços externos (Auth, Notificações)
│   └── utils/       # Lógica pura (cálculos, validadores, helpers de data)
├── viewmodel/       # Lógica de Estado e Ponte entre View e Model
│   ├── contexts/    # Provedores de estado global (AuthContext, MedicationContext)
│   └── hooks/       # Hooks que expõem o estado para os componentes (useAuth, useMedications)
├── view/            # Interface do Usuário (UI)
│   ├── components/  # Componentes reutilizáveis (Botões, Inputs, Cards)
│   ├── pages/       # Telas completas da aplicação
│   └── styles/      # Estilização global e temas
├── types/           # Definições de tipos TypeScript globais
├── constants/       # Valores constantes (Cores, Configurações)
└── assets/          # Recursos estáticos (Imagens, SVGs)
```

### Responsabilidades:
- **Model:** Onde os dados vivem e as regras de negócio são processadas. Não conhece a UI.
- **ViewModel:** Gerencia o estado da aplicação e expõe dados formatados para a View. É onde o `useContext` e os hooks de lógica residem.
- **View:** Apenas exibe dados e envia eventos do usuário. Deve ser o mais "burra" possível em termos de lógica complexa.

---

## 🚀 Tecnologias

* **React** + **TypeScript** (via Vite)
* **Tailwind CSS** (Estilização)
* **Capacitor** (Native Mobile)
* **Biome** (Formatting and Linting)

## 🛠️ Como Iniciar

1.  Instale as dependências:
    ```bash
    npm install
    ```

2.  Inicie o servidor de desenvolvimento:
    ```bash
    npm run dev
    ```

## 📱 Desenvolvimento Nativo (Android)

1.  **Build do projeto web:**
    ```bash
    npm run build
    ```

2.  **Sincronizar com Capacitor:**
    ```bash
    npx cap sync
    ```

3.  **Rodar no Android:**
    ```bash
    npx cap run android
    ```

> **Nota:** Requer **Java 21 JDK**. Verifique seu `JAVA_HOME`.

---

## 🧹 Padronização (Biome)

Para verificar erros e formatação:
```bash
npm run check
```
Para **corrigir automaticamente**:
```bash
npm run check:write
```
