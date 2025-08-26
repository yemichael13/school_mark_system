# School Mark System

A modern, responsive web application for managing student grades and academic performance. Built with React and Vite for optimal performance and developer experience.

## Features

- **Student Management**: Add, edit, and delete student records
- **Grade Tracking**: Record and display student grades with visual indicators
- **Subject Organization**: Organize students by subject areas
- **Performance Analytics**: View total students, average grades, and highest scores
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Beautiful gradient design with smooth animations

## Technology Stack

- **Frontend**: React 18 with Hooks
- **Build Tool**: Vite
- **Styling**: CSS3 with modern features (Grid, Flexbox, CSS Variables)
- **State Management**: React useState hook for local state

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository or navigate to the project directory
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` directory.

## Usage

### Adding Students
1. Fill in the student name, grade (0-100), and subject
2. Click "Add Student" to save the record

### Editing Students
1. Click the "Edit" button on any student card
2. Modify the information in the form
3. Click "Save Changes" to update or "Cancel" to discard changes

### Deleting Students
1. Click the "Delete" button on any student card
2. The student will be permanently removed from the system

### Grade System
- **A (90-100%)**: Green - Excellent performance
- **B (80-89%)**: Light Green - Good performance  
- **C (70-79%)**: Yellow - Satisfactory performance
- **D (60-69%)**: Orange - Below average performance
- **F (0-59%)**: Red - Failing performance

## Project Structure

```
src/
├── App.jsx          # Main application component
├── App.css          # Application styles
├── main.jsx         # Application entry point
└── index.css        # Global styles
```

## Contributing

This is a demonstration project. Feel free to fork and modify for your own use.

## License

This project is open source and available under the MIT License.
