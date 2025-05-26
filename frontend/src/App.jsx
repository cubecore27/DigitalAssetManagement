import { BrowserRouter, Routes } from 'react-router-dom';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import MainRoutes from './routes/Routes';

function App() {

  return (
    <>
    <BrowserRouter>
      <MainRoutes/>
    </BrowserRouter>
    </>
  );
}
export default App
