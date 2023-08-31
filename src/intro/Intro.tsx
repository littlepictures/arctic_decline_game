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
      <div></div>
      <div className="top-wrapper">
        <img className="logo" src={logo} alt="" />
        <p className="subtitle">This game is based on real satellite data:</p>
        <p className="description">
          the length of your paddle reflects changes in sea ice extent
        </p>
        <Button
          text="start game"
          onClick={() => {
            setUi("game");
          }}
        />
      </div>
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
