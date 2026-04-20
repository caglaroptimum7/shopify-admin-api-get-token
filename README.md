# 🚀 Shopify Admin API Token Wizard

A professional React-based wizard to easily generate Shopify Admin API access tokens (`shpca_...`) for local development and testing.

## 🌟 Features

- **Step-by-Step Wizard**: Easy UI to enter credentials and store details.
- **Scope Presets**: Quick-add common Shopify API scopes.
- **Auto-Redirection**: Handles the OAuth flow and redirects back to the UI seamlessly.
- **Persistent Storage**: Remembers your Client ID and Scopes for the next session.
- **Copy to Clipboard**: One-click access to your generated token.

---

## 🛠️ Mandatory Shopify Configuration

Before using the tool, you **must** configure your app in the [Shopify Partner Dashboard](https://partners.shopify.com/):

1.  Go to **App Setup**.
2.  Set **App URL** to:
    `http://localhost:3456` (or your Vercel URL)
3.  Set **Allowed redirection URL(s)** to:
    `http://localhost:3456/callback` (or your Vercel URL + `/callback`)

---

## 🚀 Getting Started (Local)

1.  **Install dependencies**:
    ```bash
    npm install
    ```

2.  **Run in Development Mode**:
    ```bash
    npm run dev
    ```
    - UI: `http://localhost:3000`
    - API/Callback Handler: `http://localhost:3456`

3.  **Follow the Wizard**:
    - Enter your Client ID and Client Secret.
    - Select your required Scopes.
    - Enter your shop domain (e.g., `my-dev-store`).
    - Authorize and get your token!

---

## ☁️ Vercel Deployment

This project is configured for Vercel. 

1.  Push the code to your GitHub repository.
2.  Import the project in Vercel.
3.  Vercel will automatically detect the settings and deploy the Express API (as Serverless Functions) and the React Frontend.

**Note**: When running on Vercel, update your Shopify Partner Dashboard URLs to match your Vercel deployment URL instead of `localhost:3456`.

---

## 🔒 Security Note

This tool is designed for **local development and testing**. While it can be deployed, remember that Shopify Client Secrets are sensitive. Your credentials are stored in your browser's `localStorage` and are only sent to the backend during the token exchange process.

---

Built with ❤️ for Shopify Developers.
