import "./Play-Again.css";

import {useMyStore} from "../store";
import Button from "../button/Button";

function PlayAgain() {
  const {setUi} = useMyStore((state) => state);

  return (
    <div className="play-again">
      <div className="title">PLAY AGAIN?</div>
      <p className="p1">why do you expect to have another chance?</p>
      <p className="p2">there is no such thing as time travel...</p>

      <Button
        text="See Highscore"
        onClick={() => {
          setUi("highscore");
        }}
      />
    </div>
  );
}

export default PlayAgain;
