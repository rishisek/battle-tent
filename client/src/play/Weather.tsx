import { WeatherName } from "@pkmn/client";
import styled from "styled-components";

const Wrapper = styled.div<{ background: string; color: string }>`
  position: absolute;
  display: block;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  text-shadow: #fff 1px 1px 0, #fff 1px -1px 0, #fff -1px 1px 0,
    #fff -1px -1px 0;
  color: ${(p) => p.color};
  opacity: 0.5;
  background: ${(p) => p.background};
`;

const weathToCol: {
  [w in WeatherName]: { background: string; color: string };
} = {
  Sand: {
    background:
      "#e6e0ac url(https://play.pokemonshowdown.com/fx/weather-sandstorm.png) no-repeat scroll left top",
    color: "#543",
  },
  Sun: {
    background:
      "#feb url(https://play.pokemonshowdown.com/fx/weather-sunnyday.jpg) no-repeat scroll left top",
    color: "#641",
  },
  Rain: {
    background:
      "#9bf url(https://play.pokemonshowdown.com/fx/weather-raindance.jpg) no-repeat scroll left top",
    color: "#04b",
  },
  Hail: {
    background:
      "#ade url(https://play.pokemonshowdown.com/fx/weather-hail.png) no-repeat scroll left top",
    color: "#145",
  },
  "Harsh Sunshine": {
    background:
      "#feb url(https://play.pokemonshowdown.com/fx/weather-sunnyday.jpg) no-repeat scroll left top",
    color: "#641",
  },
  "Heavy Rain": {
    background:
      "#9bf url(https://play.pokemonshowdown.com/fx/weather-raindance.jpg) no-repeat scroll left top",
    color: "#04b",
  },
  "Strong Winds": {
    background:
      "#aaa url(https://play.pokemonshowdown.com/fx/weather-strongwind.png) no-repeat scroll left top",
    color: "#666",
  },
};

interface IProps {
  type: WeatherName | undefined;
}
function Weather({ type }: IProps) {
  if (type) return <Wrapper {...weathToCol[type]} />;
  return null;
}

export default Weather;
