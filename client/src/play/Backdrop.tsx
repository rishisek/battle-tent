import _ from "lodash";
import { useRef } from "react";
import styled from "styled-components";

const backdrops = [
  "bg-aquacordetown.jpg",
  "bg-aquacordetown.png",
  "bg-beach.jpg",
  "bg-city.jpg",
  "bg-dampcave.jpg",
  "bg-darkbeach.jpg",
  "bg-darkcity.jpg",
  "bg-darkmeadow.jpg",
  "bg-deepsea.jpg",
  "bg-desert.jpg",
  "bg-earthycave.jpg",
  "bg-elite4drake.jpg",
  "bg-elite4drake.png",
  "bg-forest.jpg",
  "bg-icecave.jpg",
  "bg-leaderwallace.jpg",
  "bg-leaderwallace.png",
  "bg-library.jpg",
  "bg-library.png",
  "bg-meadow.jpg",
  "bg-orasdesert.jpg",
  "bg-orassea.jpg",
  "bg-orassea.png",
  "bg-skypillar.jpg",
];

const Wrapper = styled.div<{ image: string }>`
  width: 700px;
  height: 500px;
  position: absolute;
  top: -90px;
  left: -50px;
  background: transparent url(../fx/bg-beach.png) no-repeat scroll left top;
  display: block;
  opacity: 0.8;
  background-image: url(https://play.pokemonshowdown.com/sprites/gen6bgs/${(
    p
  ) => p.image});
`;

function Backdrop() {
  const backdrop = useRef(_.sample(backdrops) || "");
  return <Wrapper image={backdrop.current} />;
}

export default Backdrop;
