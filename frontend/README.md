# Landing Page Frontend

Modern landing page built with Next.js 15, TypeScript, and Tailwind CSS.

## Features

- 🎨 Modern, responsive design
- ⚡ Built with Next.js 15 and App Router
- 🎯 TypeScript for type safety
- 💨 Tailwind CSS for styling
- 📱 Mobile-friendly
- 🔌 Connected to FastAPI backend

## Getting Started

1. Install dependencies:
```bash
npm install
# or
pnpm install
# or
yarn install
```

2. Create a `.env.local` file based on `.env.local.example`:
```bash
cp .env.local.example .env.local
```

3. Update the `.env.local` file with your backend API URL:
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

4. Run the development server:
```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
frontend/
├── app/                 # Next.js App Router
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Home page
│   └── globals.css     # Global styles
├── components/         # React components
│   ├── Hero.tsx        # Hero section
│   ├── Features.tsx    # Features section
│   ├── ContactForm.tsx # Contact form
│   └── Footer.tsx      # Footer
├── lib/               # Utility functions
│   └── api.ts         # API client
└── public/            # Static files
```

## Components

- **Hero**: Eye-catching hero section with CTA buttons
- **Features**: Grid layout showcasing key features
- **ContactForm**: Form connected to backend API
- **Footer**: Site footer with links

## Building for Production

```bash
npm run build
npm start
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
