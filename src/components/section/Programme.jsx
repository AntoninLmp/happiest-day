import GlassNavBar from "./GlassNavBar";
import Photomaton from "./Photomaton";

export default function Programme () {
    return (
        <div>
            <img src="images/Hands.jpg" alt="hands" className="m-auto" />
            <div className="flex items-center justify-center pb-2">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3085/3085472.png"
              alt="icon"
              className="w-6 h-6 inline-block mr-2"
            />
            <h1 className="instrument-serif-regular c-green2">
              Programme de la journée
            </h1>
          </div>
          <section>
            <span className="bg-gray-500 w-[90%] h-[80%]"></span>
          </section>
          <GlassNavBar index={2}/>
        </div>
    )}; 