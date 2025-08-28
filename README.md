# PIO Brasileiro

Meal management system for PIO College, developed to facilitate meal scheduling and control for students and staff.

# User Pages previews:

<img width="240" alt="Screenshot 2025-08-28 at 3 02 03 PM" src="https://github.com/user-attachments/assets/a84bb431-0acb-46a7-a1cb-c15e2145b69e" />
<img width="240" alt="Screenshot 2025-08-28 at 3 03 00 PM" src="https://github.com/user-attachments/assets/2569c91a-dc2d-47cd-a40a-9645144da106" />
<img width="240" alt="Screenshot 2025-08-28 at 3 03 35 PM" src="https://github.com/user-attachments/assets/43f9ca3b-309f-4061-8b92-96f2b0cd6628" />
<img width="240" alt="Screenshot 2025-08-28 at 3 03 56 PM" src="https://github.com/user-attachments/assets/be02c160-c479-49dc-a5ba-657b911bb869" />



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
├── app/                     
    ├── (admin-protected)/   # Admin Protected routes
    ├── (protected)/         # Authenticated user protected routes
├── components/              
│   ├── home/                # Home page components
│   ├── refeicoes/           # Meal components
│   ├── profile/             # Profile components
│   └── ui/                  # Interface components
└── lib/                     # Utilities and configurations
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

## Component Structure

The project uses a modular architecture with reusable components, these are a few examples:

- **Header** - Header with navigation and notifications
- **Footer** - Footer with navigation menu
- **MealCard** - Card for meal scheduling
- **ImageSelector** - Profile image selector
- **NotificationMenu** - Notifications menu

## Global CSS Variables

The project uses a consistent design system with global CSS variables for colors, spacing, and borders, ensuring visual uniformity throughout the application.
