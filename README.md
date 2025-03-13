# Web Toolbox

A collection of client-side web tools to help with your daily tasks. All tools run entirely in your browser - no data is sent to any server.

## Available Tools

### Markdown Renderer
- Write and edit markdown content
- See live preview of rendered markdown
- Export as HTML
- Copy markdown to clipboard

### PDF Merger
- Combine multiple PDF files into a single document
- Drag and drop interface for easy file uploads
- Reorder files before merging
- Client-side processing - your files never leave your browser

## Technology Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui components
- pdf-lib for PDF manipulation
- react-markdown for markdown rendering

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment

This project is configured for deployment to GitHub Pages.

### Automatic Deployment

1. Push your changes to the main branch
2. GitHub Actions will automatically build and deploy the site
3. Your site will be available at `https://username.github.io/proj-web-toolbox`

### Manual Deployment

To build the project for manual deployment:

```bash
npm run export
```

This will generate a static site in the `out` directory, which you can deploy to any static hosting service.

## Learn More

This project uses Next.js and is built with modern web technologies to provide a fast, responsive user experience.

## Future Tools

We plan to add more tools to the Web Toolbox in the future, such as:

- Image converter
- JSON formatter/validator
- CSV to JSON converter
- Text diff tool
- And more!

## License

This project is open source and available under the MIT license.
