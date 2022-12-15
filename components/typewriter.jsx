import Typewriter from "typewriter-effect";

function TypewriterReact() {
  return (
    <div className="text-3xl text-center gold font-light mt-2 gold">
      <Typewriter
        onInit={(typewriter) => {
          typewriter
            .typeString("Fullstack Developer")
            .changeDelay(150)
            .deleteAll()
            .typeString("HTML | CSS")
            .changeDelay(150)
            .deleteAll()
            .typeString("Javascript | React")
            .changeDelay(150)
            .deleteAll()
            .typeString("Postgres | Mongo")
            .changeDelay(150)
            .deleteAll()
            .typeString("Docker | AWS")
            .changeDelay(150)
            .deleteAll()
            .start();
        }}
        options={{
          autoStart: true,
          loop: true,
        }}
      />
    </div>
  );
}

export default TypewriterReact;
