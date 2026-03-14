# 🎨 Vue Portfolio Builder

A modern, drag-and-drop portfolio builder that lets users create stunning portfolios with live preview and PDF export.

![Vue Portfolio Builder](https://img.shields.io/badge/Vue-3-42b883?style=flat&logo=vue.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6?style=flat&logo=typescript)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

- **🎯 Drag & Drop Interface** - Intuitive editor to rearrange sections
- **📱 Live Preview** - See changes in real-time
- **🎨 Multiple Templates** - Choose from 5+ professionally designed templates
- **📄 PDF Export** - Download your portfolio as a polished PDF
- **🌙 Dark Mode** - Built-in dark mode support
- **💾 Auto-save** - Never lose your work with local storage persistence
- **📤 JSON Import/Export** - Backup and share your portfolio data

## 🛠️ Tech Stack

- **Vue 3** (Composition API)
- **TypeScript**
- **Vite** (Build tool)
- **Tailwind CSS** (Styling)
- **VueDraggable** (Drag & Drop)
- **html2pdf.js** (PDF Export)
- **Pinia** (State Management)

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 📁 Project Structure

```
portfolio-builder/
├── src/
│   ├── components/
│   │   ├── Editor/          # Editor components
│   │   ├── Preview/         # Preview components  
│   │   └── shared/          # Shared UI components
│   ├── composables/         # Vue composables
│   ├── stores/              # Pinia stores
│   ├── types/               # TypeScript types
│   ├── utils/               # Utility functions
│   └── templates/           # Portfolio templates
├── public/
└── package.json
```

## 🎨 Templates

1. **Minimal** - Clean, text-focused design
2. **Creative** - Bold colors and unique layout
3. **Professional** - Corporate-friendly, structured
4. **Developer** - Tech-focused with code snippets
5. **Designer** - Visual-heavy, image-focused

## 📖 Usage

1. Select a template or start blank
2. Fill in your information (name, bio, projects, skills)
3. Drag sections to reorder
4. Preview in real-time
5. Export as PDF or JSON

## 📄 License

MIT License - feel free to use for your own portfolio!

---

Made with ❤️ using Vue 3
