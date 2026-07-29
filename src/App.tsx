import { Toaster } from 'react-hot-toast';
import { Router } from "./routes";
import { ThemeProvider } from './context/ThemeContext';

export default function App() {
  return (
    <ThemeProvider>
      <Toaster position="top-right" />
      <Router />
    </ThemeProvider>
  );
}