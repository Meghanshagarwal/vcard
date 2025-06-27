# QR Code Generator Frontend

React-based frontend application for generating QR codes from contact data, optimized for Vercel deployment.

## Features

- Drag-and-drop file upload (CSV/Excel)
- Interactive field mapping interface
- QR code preview and download
- Professional contact landing pages
- Responsive design with brand colors
- Mobile-optimized contact pages

## Environment Variables

Required for Vercel deployment:

- `VITE_API_URL` - Backend API URL (your Vercel backend deployment)

## Deployment to Vercel

1. Create new Vercel project from this repository
2. Set `VITE_API_URL` environment variable
3. Deploy via Git integration

## Local Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Technologies

- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Radix UI components
- React Query for API state management
- Wouter for routing