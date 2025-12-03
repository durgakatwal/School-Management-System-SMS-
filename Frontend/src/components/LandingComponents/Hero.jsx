import React from "react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();
  const handleRegisterClick = () => {
    navigate("/signup");
  };
  return (
    <section className="relative flex items-center justify-center text-white">
      <div className="absolute top-0 left-0 w-full h-full -z-20">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          src="/college1.mp4"
          className="w-full h-full object-cover"
        />
      </div>
      {/* below div tag is used to set the contrast and text properly in the background */}
      <div className="absolute h-full w-full top-0 left-0 bg-black/30 -z-10"></div>
      <div className="flex flex-col items-center justify-center text-center gap-6 min-h-[80vh] max-w-2/3 px-4">
        <h1 className="text-4xl md:text-6xl font-bold">
          Explore the world with WanderWise
        </h1>
        <p className="text-sm text-white">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Beatae
          mollitia, blanditiis qui, ex ratione consectetur maxime dolorem
          suscipit et magni corrupti dolores rerum in illum Lorem ipsum dolor
          sit, amet consectetur adipisicing elit. Sint, consequatur?
        </p>
        <div className="flex items-center gap-4">
          <Button size={"lg"}>Explore Trips</Button>
          <Button
            size="lg"
            variant={"outline"}
            className="bg-transparent"
            onClick={handleRegisterClick}
          >
            Register
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
