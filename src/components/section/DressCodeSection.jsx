function DressCodeSection() {
    return (
        <section className="bg-white mb-10">
          <div className="flex items-center justify-center pb-2 pt-5">
            <img
                src="https://cdn-icons-png.flaticon.com/512/3085/3085472.png"
                alt="icon"
                className="w-6 h-6 inline-block mr-2"
              />
            <h1 className="instrument-serif-regular c-green2">Dress Code</h1>
          </div>
          <img src="images/dresscode2.png" alt="" className="mx-auto! md:w-1/3" />
          <div>
            <h2 className="instrument-serif-regular c-pink bg-[#ffd9dc] text-center p-2 my-3! mx-auto! w-max rounded-2xl">
              Tenues Colorées
            </h2>
            <p className="instrument-serif-regular c-pink3 text-center px-4 font-bold">
              Attendez-vous à une explosion de couleurs et de fleurs ! <br />
              
            </p>
            <div className="h-15 flex items-center justify-center gap-4 mt-3">
              <button className="w-10 h-10 bg-[#837f28] rounded-xl"></button>
              <button className="w-10 h-10 bg-[#ed7171] rounded-xl"></button>
              <button className="w-10 h-10 bg-[#fce56b] rounded-xl"></button>
              <button className="w-10 h-10 bg-[#ee6e04] rounded-xl"></button>
              <button className="w-10 h-10 bg-[#7a236c] rounded-xl"></button>
            </div>
          </div>
        </section>
    )
}
export default DressCodeSection;