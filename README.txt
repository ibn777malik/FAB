

A modern real estate platform with both public-facing website for property listings and an admin CRM system for property management.

## Features

### Public Website
- Modern, responsive design
- Property listings with filtering capabilities
- Detailed property pages with image galleries
- Property inquiry forms
- Mobile-friendly layout

### Admin CRM
- Secure login system with JWT authentication
- Dashboard with property statistics
- Property management (add, edit, delete)
- User settings and profile management
- Role-based access control

## Tech Stack

- **Frontend:** Next.js, React, Tailwind CSS
- **Backend:** Express.js, JWT for authentication
- **Data Storage:** JSON files (can be replaced with a database)
- **Styling:** Tailwind CSS for utility-first styling

## Getting Started

### Prerequisites
- Node.js (v14+)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd fabrica-realestate
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Install frontend dependencies
```bash
cd frontend
npm install
```

### Running the Application

1. Start the backend server (from the backend directory)
```bash
npm start
# Server will run on http://localhost:4000
```

2. In a separate terminal, start the frontend dev server (from the frontend directory)
```bash
npm run dev
# Website will be available at http://localhost:3000
```

### Demo Credentials
- **Email:** admin@fabrica.com
- **Password:** password123

## Project Structure

The project is organized into two main parts:

1. **Frontend (Next.js)** - Contains all the React components, pages, and styles
2. **Backend (Express.js)** - Provides APIs for authentication and data management

See the included `file-structure.md` document for a detailed breakdown of the file organization.

## Development Roadmap

### Phase 1 (Current)
- Basic CRM with property management
- Public website with property listings
- Core authentication and permissions

### Phase 2
- Database integration (replacing JSON files)
- Enhanced search functionality
- User role management
- Advanced filtering options

### Phase 3
- Mobile app development
- Analytics dashboard
- Marketing automation
- Advanced reporting

## License

This project is licensed under the MIT License - see the LICENSE file for details.
