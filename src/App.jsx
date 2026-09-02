import './App.css'
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from "./components/Home";
import LoveStory from "./components/LoveStory";
import Informations from './components/section/Informations';
import Confirmation from './components/section/Confirmation';


export default function App (){
  return (
    <Router>
        <Routes>
          <Route path="/" element={<Home isLetter={true}/>} />
          <Route path="/home" element={<Home isLetter={false} />} />
          <Route path="/histoire" element={<LoveStory />} />
          <Route path="/informations" element={<Informations />} />
          <Route path="/confirmation" element={<Confirmation />} />
        </Routes>
    </Router>
  ); 
}