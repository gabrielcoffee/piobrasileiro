# PIO Brasileiro

Meal management system for PIO College, developed to facilitate meal scheduling and control for students and staff.

## About the Project

PIO Brasileiro is a modern web application that allows users to:
- Schedule meals (lunch and dinner) for different days of the week
- Manage user profiles
- View notifications about scheduling deadlines
- Select meal options (at college or to take away)
- Add guests to meals

## A few Screenshots

<img width="200" height="846" alt="Screenshot 2025-08-22 at 12 28 20 AM" src="https://github.com/user-attachments/assets/7c818cd1-97ab-4902-b766-f0fa195671f3" />
<img width="200" height="842" alt="Screenshot 2025-08-22 at 12 28 29 AM" src="https://github.com/user-attachments/assets/866ae7bb-e153-43b6-86b9-183b49eb8df5" />
<img width="200" height="838" alt="Screenshot 2025-08-22 at 12 28 47 AM" src="https://github.com/user-attachments/assets/a5ec3753-189a-4155-b4e3-dd801e0025e6" />
<img width="200" height="841" alt="Screenshot 2025-08-22 at 12 31 34 AM" src="https://github.com/user-attachments/assets/fa015876-024f-470f-afad-40a199fb1002" />

## Technologies Used on Front End
- **Next.js 14** - React framework with App Router
- **TypeScript** - Static typing for greater code safety
- **React** - Library for building interfaces
- **CSS Modules** - Modular and scoped styling
- **Lucide React** - Icon library


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
