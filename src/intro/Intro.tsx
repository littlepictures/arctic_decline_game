import "./Intro.css";
import {BrowserView, MobileView} from "react-device-detect";

import {useMyStore} from "../store";
import logo from "../images/logo.svg";
import arrowLeft from "../images/arrow-left.svg";
import arrowRight from "../images/arrow-right.svg";
import Button from "../button/Button";

function Intro() {
  const {setUi} = useMyStore((state) => state);

  return (
    <div className="intro">
      <img className="logo" src={logo} alt="" />
      <p className="subtitle">This Game is based on real data:</p>
      <p className="description">
        the length of the ice sheets matches the arctic ice mass
      </p>
      <Button
        text="start game"
        onClick={() => {
          setUi("game");
        }}
      />
      <div className="instruction">
        <MobileView>
          Touch on the left or right side of your screen to move your ice sheet
        </MobileView>
        <BrowserView>
          use <img src={arrowLeft} /> and <img src={arrowRight} /> keys to move
          your ice sheet
        </BrowserView>
      </div>
    </div>
  );
}

export default Intro;
