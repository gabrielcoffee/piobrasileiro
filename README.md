# PIO Brasileiro

Meal management system for PIO College, developed to facilitate meal scheduling and control for students and staff.

## About the Project

PIO Brasileiro is a modern web application that allows users to:
- Schedule meals (lunch and dinner) for different days of the week
- Manage user profiles
- View notifications about scheduling deadlines
- Select meal options (at college or to take away)
- Add guests to meals

## Technologies Used

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Static typing for greater code safety
- **React** - Library for building interfaces
- **CSS Modules** - Modular and scoped styling
- **Lucide React** - Icon library

### Development
- **ESLint** - Code linting and formatting
- **PostCSS** - CSS processing

### Project Structure
```
src/
├── app/                 # Application pages (App Router)
├── components/          # Reusable components
│   ├── home/           # Home page components
│   ├── refeicoes/      # Meal components
│   ├── profile/        # Profile components
│   └── ui/             # Interface components
└── lib/                # Utilities and configurations
```

## Main Features

### Meal System
- Lunch and dinner scheduling
- Location selection (PIO College or to take away)
- Guest addition
- Scheduling deadline control

### User Profile
- View and edit personal information
- Profile picture upload
- Password change

### Notifications
- Real-time notification system
- Scheduling deadline alerts
- Notification history

## How to Execute

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Available Scripts

- `npm run dev` - Runs the development server
- `npm run build` - Generates production build
- `npm run start` - Runs the application in production
- `npm run lint` - Runs the linter

## Component Structure

The project uses a modular architecture with reusable components:

- **Header** - Header with navigation and notifications
- **Footer** - Footer with navigation menu
- **MealCard** - Card for meal scheduling
- **ImageSelector** - Profile image selector
- **NotificationMenu** - Notifications menu

## Global CSS Variables

The project uses a consistent design system with global CSS variables for colors, spacing, and borders, ensuring visual uniformity throughout the application.
