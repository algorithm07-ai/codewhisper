# VS Code Plugin - "Explain Code" Feature Memo

**Date:** 2025-06-11

**Objective:** Integrate a "Explain Code" functionality into the existing VS Code plugin, allowing users to select code and receive a natural language explanation.

**Chosen LLM API:** DeepSeek API

## Key Discussion Points & Plan:

1.  **Core Functionality:**
    *   User selects code in the VS Code editor.
    *   Right-click context menu option "Explain Code" triggers the feature.
    *   Selected code is sent to the DeepSeek API.
    *   The API's response (code explanation) is displayed to the user.

2.  **DeepSeek API Integration:**
    *   **Compatibility:** DeepSeek API is compatible with the OpenAI API format, simplifying integration.
    *   **Client Library:** The `openai` npm package can be used.
    *   **API Key Management:**
        *   Users will configure their DeepSeek API key via VS Code settings (`yourExtensionName.deepseekApiKey`).
        *   The plugin will read the key from settings; it will **not** be hardcoded.
    *   **API Endpoint:** The `baseURL` for the `openai` client will be set to DeepSeek's API endpoint (e.g., `https://api.deepseek.com/v1`, to be verified from their docs).
    *   **Model Selection:** A suitable model from DeepSeek (e.g., `deepseek-coder` or a similar capable model) needs to be chosen based on their documentation for code-related tasks.
    *   **Prompt Engineering:** A system prompt and user prompt will be constructed to guide the LLM in generating clear and concise code explanations, specifying the language if known.

3.  **VS Code Extension Implementation Details:**
    *   **Command Registration:** Use `vscode.commands.registerCommand` for `yourExtension.explainCode`.
    *   **Context Menu:** Add the command to `editor/context` in `package.json` with `when: editorHasSelection`.
    *   **Code Retrieval:** Get selected text using `editor.document.getText(editor.selection)`.
    *   **API Call:** Use an async function to call `deepseek.chat.completions.create()`.
    *   **Displaying Explanation:**
        *   Initially, a `WebviewPanel` is recommended for displaying formatted explanations.
        *   Progress indication (`vscode.window.withProgress`) during API calls.
    *   **Error Handling:** Implement robust error handling for API issues, missing API key, etc.
    *   **Configuration:** Define the API key setting in `package.json` under `contributes.configuration`.

4.  **Next Steps (for tomorrow's discussion/work):**
    *   User to sign up for DeepSeek API and obtain an API key.
    *   Thoroughly review DeepSeek API documentation for:
        *   Exact `baseURL`.
        *   Available model identifiers and capabilities.
        *   Specific request parameters or headers.
    *   Begin implementation of the outlined steps.
