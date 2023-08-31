import Pong from "../pong/Pong";
import Intro from "../intro/Intro";
import Finish from "../finish/Finish";
import PlayAgain from "../play-again/Play-Again";

import {useMyStore} from "../store";

import ice01 from "../images/ice-01.svg";
import ice02 from "../images/ice-02.svg";
import ice03 from "../images/ice-03.svg";
import ice04 from "../images/ice-04.svg";

import "./App.css";
import "./Shapes.css";

const ices = [ice01, ice02, ice03, ice04];

function App() {
  const {ui, contentWidth} = useMyStore((state) => state);

  // THIS IS FOR generating CSS for the moving ice pieces in the background
  //
  // const things = [];
  // for (let index = 0; index < 30; index++) {
  //   const rotation =
  //     Math.random() > 0.5 ? Math.random() * 360 : Math.random() * 360 * -1;
  //   const rotation2 = Math.random() * 360;
  //   const speed = 95 + Math.random() * 40;

  //   const top = Math.random() * 100;
  //   const marginLeft = Math.random() * 100;
  //   const transformOrigin1 = Math.random() * 100;
  //   const transformOrigin2 = Math.random() * 100;

  //   things.push(`
  //   @keyframes shape-${index} {
  //     0% {
  //       transform-origin: ${transformOrigin1}% 50%;
  //       transform: translate3d(0, 0, 0) rotate(${rotation}deg);
  //     }
  //     100% {
  //       transform-origin: ${transformOrigin2}% 50%;
  //       transform: translate3d(0, 0, 0) rotate(${rotation + 360}deg);
  //     }
  //   }
  //   .shape-${index} {
  //     position: absolute;
  //     width: 100vw;
  //     top: ${top}%;
  //     animation: shape-${index} ${speed}s linear infinite;
  //   }

  //   .shape-${index} img {
  //     transform: rotate(${rotation2}deg);
  //     margin-left: ${marginLeft}%;
  //   }

  //   `);
  // }
  // console.log(things);

  return (
    <div className="container">
      <div className="content" style={{width: `${contentWidth}px`}}>
        {ui === "intro" && <Intro />}
        {ui === "game" && <Pong />}
        {ui === "finish" && <Finish />}
        {ui === "play-again" && <PlayAgain />}
        <div className="footer">
          <a
            href="https://www.brockmann-consult.de/imprint/"
            target="_blank"
            className="imprint"
          >
            Imprint
          </a>
          <a
            href="https://github.com/littlepictures/arctic_decline_game"
            className="share"
            target="_blank"
          >
            Data/Repo
          </a>
        </div>
      </div>
      <div className="shapes">
        {Array(15)
          .fill("a")
          .map((_, index) => {
            return (
              <div key={index} className={`shape shape-${index}`}>
                <img
                  src={ices[Math.floor(Math.random() * ices.length)]}
                  alt=""
                />
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default App;
