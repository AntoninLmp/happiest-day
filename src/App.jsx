import './App.css'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from "./components/Home";
import LoveStory from "./components/LoveStory";
import Programme from './components/section/Programme';


export default function App (){
  return (
    <BrowserRouter basename='happiest-day'>
        <Routes>
          <Route path="/" element={<Home isLetter={true}/>} />
          <Route path="/home" element={<Home isLetter={false} />} />
          <Route path="/histoire" element={<LoveStory />} />
          <Route path="/programme" element={<Programme />} />
        </Routes>
    </BrowserRouter>
  ); 
}