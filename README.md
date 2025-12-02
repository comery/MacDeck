# MacDeck

MacDeck is a local Web App shortcut manager with a Mac-styled interface. It helps you create, organize, and generate executable launchers for your local development projects.

## 🚀 How to Run Locally

It is recommended to use **Vite** to run this project locally. Follow these steps:

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) (v18 or higher) installed.

### 2. Initialize Project

Open your terminal and run:

```bash
# 1. Create a new React + TypeScript project
npm create vite@latest macdeck-app -- --template react-ts

# 2. Enter the directory
cd macdeck-app

# 3. Install dependencies
npm install lucide-react @google/genai
```

### 3. Setup Code

1.  **Copy Source Files**:
    Copy all files from this project (contents of `src/`) into your local `src/` folder.
    *   *Note:* Vite uses `main.tsx` as the entry point. Rename `index.tsx` to `main.tsx` or copy its contents into `main.tsx`.

2.  **Setup HTML**:
    Replace the default `index.html` in your project root with the `index.html` provided here.
    *   *Important:* Update the script tag in `index.html` to point to the correct entry file:
        ```html
        <script type="module" src="/src/main.tsx"></script>
        ```

### 4. Configure API Key

Create a `.env` file in the root directory of your project:

```env
VITE_API_KEY=your_gemini_api_key_here
```

*Note: The code is already configured to look for `VITE_API_KEY`.*

### 5. Run

```bash
npm run dev
```

Open your browser at `http://localhost:5173` (or the URL shown in terminal).

---

## ✨ Features

*   **Mac Aesthetic**: Glassmorphism UI and card-based design.
*   **AI Suggestions**: Auto-generate run commands from project descriptions using Google Gemini.
*   **Custom Icons**: Upload your own images or use built-in icons.
*   **Launcher Generation**: One-click download of `.command` files to launch local projects instantly.
