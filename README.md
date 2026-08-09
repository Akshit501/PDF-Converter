# 📄 PdfDrip — 100% In-Browser PDF Processing Studio

> A lightning-fast, privacy-first, client-side PDF converter and editing toolkit built with Next.js 16, React 19, TypeScript, and Tailwind CSS v4. Your files **never leave your device**.

---

## 🌟 Key Highlights

- **🔒 100% Client-Side & Private**: All file operations (compression, merging, splitting, rendering, encryption) happen directly inside your browser memory using WebAssembly and JavaScript libraries (`pdf-lib` & `pdfjs-dist`). Zero file uploads to external servers.
- **⚡ Blazingly Fast**: Instant processing with no server latency, waiting queues, or upload/download bottlenecks.
- **🎨 Modern & Responsive UI**: Clean interface built with Tailwind CSS v4, custom typography (*Space Grotesk*, *Inter*, *JetBrains Mono*), smooth dark/light theme switching, and fluid micro-animations powered by Framer Motion.
- **📁 Multi-Tool Suite**: 10 comprehensive PDF utilities covering conversion, editing, optimization, security, and extraction.
- **📱 Mobile & Desktop Optimized**: Responsive layout supporting drag-and-drop file uploads across all screen sizes.

---

## ✨ Features & Tools Breakdown

### 1. 🔀 Merge PDF (`/merge-pdf`)
- Combine multiple PDF files into a single unified document.
- Drag-and-drop file reordering with real-time file preview and page counts.
- Preserves original document formatting, fonts, and page orientation.

### 2. ✂️ Split PDF (`/split-pdf`)
- Extract specific page ranges or split an entire PDF into individual single-page documents.
- Interactive page selection with visual thumbnail previews.
- Flexible range syntax support (e.g., `1-3, 5, 8-10`).

### 3. 🗜️ Compress PDF (`/compress-pdf`)
- Reduce PDF file sizes while maintaining visual readability.
- Customizable compression presets (Light, Recommended, Extreme) with target DPI and JPEG quality controls.
- Real-time before/after file size reduction metrics.

### 4. 🌙 PDF Dark Mode (`/dark-mode`)
- Smart color inversion for eye-friendly night-time reading and eco-printing.
- Customizable color presets: **Inverted**, **Dark Sepia**, **High Contrast**, and **Custom Color Inversion**.
- Generates downloadable dark-themed PDF files directly in the browser.

### 5. 🖼️ Images to PDF (`/jpg-to-pdf`)
- Convert JPG, PNG, and WebP images into a formatted PDF document.
- Custom page orientation (Portrait / Landscape), page margins, and image fit options (Fit, Fill, Original).
- Drag-and-drop reordering of image sequences prior to document creation.

### 6. 📸 PDF to Images (`/pdf-to-jpg`)
- Render PDF pages into high-resolution JPG or PNG images.
- Export individual pages or package all pages into a `.zip` archive powered by JSZip.
- Custom image render resolution scaling options.

### 7. 📑 PDF Page Manager (`/page-manager`)
- Interactive thumbnail grid to inspect and reorganize your PDF document structure.
- Rotate individual pages clockwise or counter-clockwise (90°, 180°, 270°).
- Delete unnecessary pages from the document before exporting.

### 8. 🔒 Protect PDF (`/protect-pdf`)
- Encrypt sensitive PDF files with password protection.
- Standard client-side PDF encryption algorithms implemented securely in `pdf-lib`.

### 9. 📝 Text Extractor (`/extract-text`)
- Extract raw text content from any readable PDF document.
- Copy extracted text to clipboard with a single click or export as `.txt` files.
- Ideal for research, document parsing, and quick text copy-pasting.

### 10. 💧 Watermark PDF (`/watermark`)
- Stamp custom text watermarks across PDF pages.
- Fine-tune text content, font size, opacity, text color, rotation angle, and grid layout positioning.

---

## 🛠️ Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **[Next.js 16](https://nextjs.org/)** | App Router framework with React 19 support |
| **[React 19](https://react.dev/)** | Modern component UI architecture |
| **[TypeScript](https://www.typescriptlang.org/)** | Strict type safety and robust developer tooling |
| **[Tailwind CSS v4](https://tailwindcss.com/)** | Styling, design tokens, and responsive dark/light theme support |
| **[pdf-lib](https://pdf-lib.js.org/)** | Client-side PDF generation, merging, splitting, watermarking, and encryption |
| **[pdfjs-dist](https://mozilla.github.io/pdf.js/)** | Mozilla PDF.js engine for page rendering, image export, and text extraction |
| **[JSZip](https://stuk.github.io/jszip/)** | In-memory ZIP archive generation for batch image downloads |
| **[Framer Motion](https://www.framer.com/motion/)** | UI animations and smooth drag-and-drop layout transitions |
| **[Lucide React](https://lucide.dev/)** | Clean SVG icon library |

---

## 🔒 Privacy & Security Architecture

PdfDrip operates under a strict **Zero-Knowledge Privacy Architecture**:

```
 ┌──────────────────┐      ┌─────────────────────────────┐      ┌──────────────────┐
 │ User Selects File│ ───▶ │ Browser Memory (RAM)        │ ───▶ │ Downloaded File  │
 └──────────────────┘      │ (pdf-lib / pdfjs Canvas)    │      └──────────────────┘
                           └─────────────────────────────┘
                                          │
                                 🚫 NO SERVER UPLOAD
                                          │
                           [ 100% Client-Side Sandbox ]
```

1. **Local Ingestion**: Selected files are loaded into browser memory buffers (`ArrayBuffer` / `Blob`).
2. **In-Browser Processing**: All manipulations occur in Web Workers and HTML5 Canvas contexts.
3. **Zero Transmission**: No document data, metadata, or metrics leave the user's browser.

---

## 🚀 Getting Started

### Prerequisites

Ensure you have **Node.js 18.x** or higher installed on your machine.

- **Node.js**: `>= 18.0.0`
- Package manager: `npm`, `pnpm`, `yarn`, or `bun`

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Akshit501/PDF-Converter.git
   cd PDF-Converter
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

## 📜 Available Scripts

In the project directory, you can execute:

- `npm run dev` — Starts the Next.js development server with Hot Reloading.
- `npm run build` — Compiles and builds the production-ready application bundle.
- `npm run start` — Boots up the Next.js production server.
- `npm run lint` — Runs ESLint to verify code quality and coding standards.

---

## 📂 Project Directory Structure

```
pdf-converter/
├── app/                      # Next.js 16 App Router Routes
│   ├── compress-pdf/         # Compress PDF page route
│   ├── dark-mode/            # PDF Dark Mode page route
│   ├── extract-text/         # Extract Text page route
│   ├── jpg-to-pdf/           # Images to PDF page route
│   ├── merge-pdf/            # Merge PDF page route
│   ├── page-manager/         # Page Manager page route
│   ├── pdf-to-jpg/           # PDF to Images page route
│   ├── privacy/              # Privacy Policy page route
│   ├── protect-pdf/          # Protect PDF page route
│   ├── split-pdf/            # Split PDF page route
│   ├── watermark/            # Watermark PDF page route
│   ├── globals.css           # Custom Tailwind CSS v4 variables & styles
│   ├── layout.tsx            # Global layout wrapper with fonts & meta tags
│   └── page.tsx              # Application homepage & workspace
├── src/
│   ├── components/           # UI Components & Tool Views
│   │   ├── FileUploader.tsx  # Drag-and-drop file upload workspace
│   │   ├── Navbar.tsx        # Navigation bar & theme switcher
│   │   ├── ToolFaq.tsx       # Reusable FAQ accordion
│   │   └── ...               # Tool-specific UI modules
│   ├── lib/                  # In-Browser PDF Libraries & Engines
│   │   ├── pdfCompression.ts # Size reduction algorithm
│   │   ├── pdfDarkMode.ts    # Canvas color inverter & dark mode engine
│   │   ├── pdfImagesToPdf.ts # Image-to-PDF compilation engine
│   │   ├── pdfOperations.ts  # Merge & Split engines
│   │   ├── pdfPageManager.ts # Page reorder, rotate & delete operations
│   │   ├── pdfSecurity.ts    # Password encryption utility
│   │   ├── pdfTextExtractor.ts# PDF text parser engine
│   │   ├── pdfToImages.ts    # Image rendering & ZIP bundling engine
│   │   └── pdfWatermark.ts   # Watermark layout and placement engine
│   ├── hooks/                # Custom React hooks
│   └── types/                # TypeScript interface definitions
├── public/                   # Static assets, icons, and favicon
├── package.json              # Project dependencies and script definitions
└── next.config.ts            # Next.config configuration
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!  
Feel free to check the [issues page](https://github.com/Akshit501/PDF-Converter/issues).

1. Fork the Repository
2. Create a Feature Branch (`git checkout -b feature/new-feature`)
3. Commit your Changes (`git commit -m 'Add new feature'`)
4. Push to the Branch (`git push origin feature/new-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open-source and available under the **[MIT License](LICENSE)**.
