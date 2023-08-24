import "./Finish.css";

import {useMyStore} from "../store";
import Button from "../button/Button";
import levels from "../../levels.json";

function Finish() {
  const {setUi} = useMyStore((state) => state);

  return (
    <div className="finish">
      <div className="kicker">you made it to</div>
      <div className="year">{levels!.at(-1)!.year}</div>
      <p className="subtitle">
        Congrats: life is only getting harder from here
      </p>

      <Button
        text="play again"
        onClick={() => {
          setUi("play-again");
        }}
      />
    </div>
  );
}

export default Finish;
