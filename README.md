# LembraMed

A medication tracker app focused on accessibility and simplicity.

## Technologies

* **React** + **TypeScript** (via Vite)
* **Biome** (Formatting and Linting)

## Getting Started

1.  Install dependencies:
    ```bash
    npm install
    ```

2.  Run the development server:
    ```bash
    npm run dev
    ```

## Build

To create the production build:

```bash
npm run build
```

## Native Development (Android)

To run the app on an Android device or emulator, follow these steps:

1.  **Build the web project:**
    ```bash
    npm run build
    ```

2.  **Sync with Capacitor:**
    ```bash
    npx cap sync
    ```

3.  **Run on Android:**
    ```bash
    npx cap run android
    ```

Alternatively, to open the project in Android Studio:
```bash
npx cap open android
```

> **Note:** This project requires **Java 21 JDK**. Ensure your `JAVA_HOME` environment variable is set correctly or export it before running:
> ```bash
> export JAVA_HOME=/path/to/your/java-21-jdk
> ```

### This project uses Biome to ensure code standardization and error checking.

<details> <summary><strong>Click to see Formatting/Fix commands</strong></summary>

To check for errors and formatting issues:
```bash
npm run check
```
To <strong>automatically fix</strong> formatting and organize imports:
```bash
npm run check:write
```

</details>