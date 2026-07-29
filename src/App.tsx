import { Toaster } from 'react-hot-toast';
import { Router } from "./routes";

export default function App() {
  return (
    <>
      <Toaster position="top-right" />
      <Router />
    </>
  );
}