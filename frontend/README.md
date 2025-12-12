# DOR - Frontend

Frontend application for the DOR built with React and Vite.

## Installation

```bash
npm install
```

## Environment Setup

Create a `.env` file in the root directory (optional):

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## Development

Run the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173` by default.

## Build

Build for production:

```bash
npm run build
```

## Preview

Preview the production build:

```bash
npm run preview
```

## Project Structure

```
frontend/
├── public/                  # Static assets
│   └── vite.svg
├── src/
│   ├── components/          # Reusable React components
│   │   ├── Button/
│   │   │   ├── Button.jsx
│   │   │   ├── Button.css
│   │   │   └── index.js
│   │   └── index.js        # Component exports
│   ├── pages/              # Page-level components
│   │   └── Home/
│   │       ├── Home.jsx
│   │       ├── Home.css
│   │       └── index.js
│   ├── hooks/              # Custom React hooks
│   │   └── useApi.js
│   ├── services/           # API services and external API calls
│   │   └── api.js
│   ├── context/            # React Context API for state management
│   │   └── AppContext.jsx
│   ├── utils/              # Utility functions and helpers
│   │   ├── format.js
│   │   └── validation.js
│   ├── constants/          # Application constants
│   │   ├── routes.js
│   │   └── api.js
│   ├── styles/             # Global styles and CSS variables
│   │   ├── variables.css
│   │   └── globals.css
│   ├── assets/             # Images, fonts, and other assets
│   ├── App.jsx             # Root component
│   ├── App.css
│   ├── main.jsx            # Application entry point
│   └── index.css
├── index.html
├── vite.config.js
└── package.json
```

## Folder Descriptions

- **components/**: Reusable UI components that can be used across different pages
- **pages/**: Page-level components representing different routes/views
- **hooks/**: Custom React hooks for shared logic (API calls, form handling, etc.)
- **services/**: API communication layer and external service integrations
- **context/**: React Context providers for global state management
- **utils/**: Helper functions, formatters, validators, and other utility functions
- **constants/**: Application-wide constants (routes, API endpoints, configuration values)
- **styles/**: Global CSS files, CSS variables, and shared styles
- **assets/**: Static assets like images, icons, and fonts

## Usage Examples

### Using Components
```jsx
import { Button } from '../components';

<Button variant="primary" onClick={handleClick}>
  Click Me
</Button>
```

### Using Custom Hooks
```jsx
import useApi from '../hooks/useApi';

const { data, loading, error } = useApi('/api/endpoint');
```

### Using API Service
```jsx
import apiService from '../services/api';

// GET request
const data = await apiService.get('/endpoint');

// POST request
const result = await apiService.post('/endpoint', { key: 'value' });
```

### Using Context
```jsx
import { useApp } from '../context/AppContext';

const { user, setUser } = useApp();
```
