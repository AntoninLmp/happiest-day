import './App.css'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from "./components/Home";
import LoveStory from "./components/LoveStory";


export default function App (){
  return (
    <BrowserRouter basename='happiest-day'>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/histoire" element={<LoveStory />} />
        </Routes>
    </BrowserRouter>
  ); 
}