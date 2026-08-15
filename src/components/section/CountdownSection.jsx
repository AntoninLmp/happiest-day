import CountdownUntil from "../CountdownUntil";

function CountdownSection() {
    return (
        <section className="bg-[#fee2e5] mb-10">
          <div className="flex items-center justify-center pb-2 pt-5">
            <img
                src="https://cdn-icons-png.flaticon.com/512/3085/3085472.png"
                alt="icon"
                className="w-6 h-6 inline-block mr-2"
              />
            <h1 className="instrument-serif-regular c-pink3">Compte à rebours</h1>
          </div>
          <CountdownUntil />
        </section>
    )
}
export default CountdownSection;