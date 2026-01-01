# 📋 Clipboard Pro: Job Application Assistant

**Clipboard Pro** is a professional Chrome Extension designed to streamline the tedious process of filling out job applications. Instead of digging through old resumes or documents, keep your most effective professional snippets—work history, skill summaries, and cover letter fragments—organized and ready to paste.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.5.0-green.svg)
![Privacy](https://img.shields.io/badge/privacy-local--only-orange.svg)

## ✨ Key Features

- **📂 Multi-Category Organization**: Group snippets by job role (e.g., "Frontend Engineer", "Product Manager") to keep different career tracks separate.
- **🏷️ Customizable Snippet Types**: Assign scannable icons and custom colors to snippets (e.g., Experience, Skills, Education).
- **⚡ One-Click Copy**: Instantly copy text to your clipboard with visual feedback.
- **📥 Import from Clipboard**: Capture your current clipboard contents into your library with a single click.
- **💾 Local-First Storage**: Your data never leaves your computer. It uses `chrome.storage.local` for privacy and offline availability.
- **☁️ Backup & Sync**: Export your entire library to a JSON file and import it on any other device.
- **🔍 Instant Search**: Real-time filtering to find the exact phrasing you need in seconds.

## 🚀 Installation (Developer Mode)

Since this is a custom extension, follow these steps to install it in Chrome:

1. **Download/Clone** this repository to your local machine.
2. Open Google Chrome and navigate to `chrome://extensions/`.
3. Enable **Developer mode** using the toggle in the top-right corner.
4. Click the **Load unpacked** button.
5. Select the folder containing the extension files (where `manifest.json` is located).
6. The Clipboard icon should now appear in your extension bar!

## 🛠️ Built With

- **React**: For a reactive and modern UI.
- **Tailwind-inspired CSS**: Clean, modern, and responsive design.
- **Chrome Extension API (Manifest V3)**: Ensuring high performance and security.
- **Local Storage API**: Persistent local data management.

## 🔒 Privacy & Security

**Clipboard Pro** is designed with privacy in mind:
- **No Cloud Sync**: We do not upload your data to any servers.
- **Minimal Permissions**: We only request `storage` and `clipboardRead/Write` to function.
- **Open Data**: You can export and delete your data at any time.

## 🤝 Contributing

Contributions are welcome! If you have ideas for new features or find a bug:
1. Fork the Project.
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the Branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---
*Designed with ❤️ for job seekers everywhere.*