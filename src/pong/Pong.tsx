import {useCallback, useEffect, useRef, useState} from "react";
import Konva from "konva";
import {Stage, Layer, Image} from "react-konva";
import {useKeyPressEvent, useInterval} from "react-use";
import useImage from "use-image";
import {isMobile} from "react-device-detect";

import {createPaddle} from "../lib/create-paddle";
import {useMyStore} from "../store";

// import paddleImage from "../images/paddle-bottom.png?url";
import ballImage from "../images/ball.png";
import levels from "../../levels.json";

import "./Pong.css";

const startColor = "#B4BD4D";
const endColor = "#BD4D4D";

function interpolateColor(color1: string, color2: string, factor: number) {
  const r1 = parseInt(color1.substring(1, 3), 16);
  const g1 = parseInt(color1.substring(3, 5), 16);
  const b1 = parseInt(color1.substring(5, 7), 16);

  const r2 = parseInt(color2.substring(1, 3), 16);
  const g2 = parseInt(color2.substring(3, 5), 16);
  const b2 = parseInt(color2.substring(5, 7), 16);

  const r = Math.round(r1 + factor * (r2 - r1));
  const g = Math.round(g1 + factor * (g2 - g1));
  const b = Math.round(b1 + factor * (b2 - b1));

  return (
    "#" +
    r.toString(16).padStart(2, "0") +
    g.toString(16).padStart(2, "0") +
    b.toString(16).padStart(2, "0")
  );
}

const normalizePaddleLength = (iceExtentData: number) => {
  const minPaddleLength = 15;
  const maxPaddleLength = 110;
  const normalizedLength =
    minPaddleLength +
    ((iceExtentData - 3) / (8 - 3)) * (maxPaddleLength - minPaddleLength);
  return normalizedLength;
};

function Pong() {
  const {autoplay, setUi} = useMyStore((state) => state);

  const [touchX, setTouchX] = useState<number | null>(null);
  const [paddleWidth, setPaddleWidth] = useState<number>(110);
  const [paImage, setPaImage] = useState<HTMLImageElement>(
    createPaddle(paddleWidth)
  );

  const [gameInProgress, setGameInProgress] = useState(true);
  const [level, setLevel] = useState(1);

  const [bImage] = useImage(ballImage);

  const playerDirectionRef = useRef(0);

  const ballRef = useRef<Konva.Image | null>(null);
  const userPaddleRef = useRef<Konva.Image | null>(null);
  const aiPaddleRef = useRef<Konva.Image | null>(null);

  const width = Math.min(window.innerWidth, 780);
  const height = Math.min(window.innerHeight * 0.8);
  const initialPaddleWidth = 110;
  const paddleHeight = 24;
  const ballSize = 24;

  const bRef = useRef({
    velocityX: 3,
    velocityY: 3,
    radius: ballSize / 2,
    speed: 3,
    x: width / 2 - ballSize / 2,
    y: height / 2 - ballSize / 2,
  });

  const pRef = useRef({
    x: width / 2 - initialPaddleWidth / 2,
    y: height - paddleHeight,
    width: initialPaddleWidth,
    initialWidth: initialPaddleWidth,
    height: paddleHeight,
    color: "#fff",
    score: 0,
  });

  const aRef = useRef({
    x: width / 2 - initialPaddleWidth / 2,
    y: 0,
    width: initialPaddleWidth,
    initialWidth: initialPaddleWidth,
    height: paddleHeight,
    color: "#fff",
  });

  const levelData = levels.find((l) => l.level === level);

  const factor = Math.min(
    (levelData?.level ?? 1 - 1) / levels.at(-1)!.level,
    1
  );
  const levelColor = interpolateColor(startColor, endColor, factor);

  useKeyPressEvent(
    "ArrowLeft",
    () => {
      if (!autoplay) {
        playerDirectionRef.current = -1;
      }
    },
    () => {
      playerDirectionRef.current = 0;
    }
  );
  useKeyPressEvent(
    "ArrowRight",
    () => {
      if (!autoplay) {
        playerDirectionRef.current = 1;
      }
    },
    () => {
      playerDirectionRef.current = 0;
    }
  );

  useInterval(() => {
    setLevel(level + 1);
  }, 5000);

  const handleTouchStart = useCallback((event: TouchEvent) => {
    setTouchX(event.touches[0].clientX);
  }, []);

  const handleTouchEnd = useCallback(() => {
    setTouchX(null);
  }, []);

  useEffect(() => {
    if (!levelData) {
      return;
    }
    const userPaddle = userPaddleRef.current;
    const aiPaddle = aiPaddleRef.current;

    const player = pRef.current;
    const ai = aRef.current;

    const newPaddleWidth = normalizePaddleLength(levelData!.iceExtentData);
    player.width = newPaddleWidth;
    ai.width = newPaddleWidth;

    setPaddleWidth(newPaddleWidth);
    setPaImage(createPaddle(newPaddleWidth));

    userPaddle?.x(player.x);
    aiPaddle?.x(ai.x);
  }, [levelData]);

  useEffect(() => {
    if (touchX === null) {
      playerDirectionRef.current = 0;
      return;
    }

    if (touchX > window.innerWidth / 2) {
      playerDirectionRef.current = 1;
    } else {
      playerDirectionRef.current = -1;
    }
  }, [touchX]);

  useEffect(() => {
    if (autoplay) {
      return;
    }

    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchend", handleTouchEnd);
    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchEnd, autoplay]);

  useEffect(() => {
    if (!levelData) {
      setUi("finish");
      setGameInProgress(false);

      if (autoplay) {
        window.location.reload();
      }
    }

    // userPaddleRef.current?.to({
    //   width: pRef.current.width,
    //   duration: 0.25,
    // });
    // aiPaddleRef.current?.to({
    //   width: aRef.current.width,
    //   duration: 0.25,
    // });
  }, [autoplay, levelData, setUi]);

  useEffect(() => {
    if (!gameInProgress) {
      return () => {};
    }

    // Check if ball collides with a paddle
    const collision = (b, p) => {
      const collided =
        b.x + 12 + b.radius > p.x &&
        b.x + 12 - b.radius < p.x + p.width &&
        b.y + 12 + b.radius > p.y &&
        b.y + 12 - b.radius < p.y + p.height;

      return collided;
    };

    const userPaddle = userPaddleRef.current;
    const aiPaddle = aiPaddleRef.current;
    const ballCircle = ballRef.current;

    const player = pRef.current;
    const ai = aRef.current;
    const ball = bRef.current;

    const resetBall = () => {
      ball.x = width / 2;
      ball.y = height / 2;
      ball.velocityX = (Math.random() - 0.5) * 10;
      ball.velocityY = -ball.velocityY;
      ball.speed = 3;

      setLevel((level) => level + 1);
    };

    const game = new Konva.Animation(() => {
      const playerDirection = playerDirectionRef.current;

      ball.x += ball.velocityX;
      ball.y += ball.velocityY;

      // Check for collisions with canvas borders
      if (ball.x + 12 + ball.radius > width || ball.x + 12 - ball.radius < 0) {
        ball.velocityX = -ball.velocityX;
      }

      // Determine the paddle to check for collisions
      const paddle = ball.y + 12 > height / 2 ? player : ai;

      // Check for collisions with the paddle
      if (collision(ball, paddle)) {
        // setGameInProgress(false);
        const angle = ((Math.random() - 0.5) * Math.PI) / 4;

        ball.velocityY = -ball.velocityY;
        ball.speed += 5;

        ball.velocityX = ball.speed * Math.sin(angle);
      }

      // Check for collisions with top and bottom borders
      if (ball.y + 12 - ball.radius < 0 || ball.y + 12 + ball.radius > height) {
        resetBall();
      }

      if (isMobile) {
        player.x += playerDirection * 5;
      } else {
        player.x += playerDirection * 10;
      }

      // AI paddle movement
      ai.x += (ball.x + 12 - (ai.x + ai.width / 2)) * 0.1;

      if (autoplay) {
        player.x += (ball.x + 12 - (ai.x + ai.width / 2)) * 0.1;
      }

      // Check for player paddle collisions with canvas borders
      if (player.x < 0) {
        player.x = 0;
      } else if (player.x + player.width > width) {
        player.x = width - player.width;
      }

      // Check for ai paddle collisions with canvas borders
      if (ai.x < 0) {
        ai.x = 0;
      } else if (ai.x + ai.width > width) {
        ai.x = width - ai.width;
      }

      // Check collision with the player paddle
      if (collision(ball, player)) {
        player.score += 10;
      }

      // update stuff on canvas
      ballCircle?.x(ball.x);
      ballCircle?.y(ball.y);

      userPaddle?.x(player.x);
      aiPaddle?.x(ai.x);
    }, [userPaddle?.getLayer()]);

    game.start();

    return () => game.stop();
  }, [autoplay, gameInProgress, height, levelData, width]);

  return (
    <div className="canvas-wrapper">
      <Stage width={width} height={height}>
        <Layer>
          <Image
            image={paImage}
            x={width / 2 - initialPaddleWidth / 2}
            y={0}
            width={paddleWidth}
            height={paddleHeight}
            ref={aiPaddleRef}
          ></Image>

          <Image
            image={paImage}
            x={width / 2 - initialPaddleWidth / 2}
            y={height - paddleHeight}
            width={paddleWidth}
            height={paddleHeight}
            ref={userPaddleRef}
          ></Image>

          <Image
            image={bImage}
            width={ballSize}
            height={ballSize}
            x={width / 2 - ballSize / 2}
            y={height / 2 - ballSize / 2}
            ref={ballRef}
          ></Image>
        </Layer>
      </Stage>
      <div className="levels-wrapper">
        <div
          className="levels"
          style={{
            transform: `translateX(${
              (1 / 3) * 100 +
              ((levelData?.level ?? 1) - 1) * ((1 / 3) * 100 * -1)
            }%)`,
          }}
        >
          {levels.map((level) => {
            return (
              <div
                style={{width: `${width / 3}px`}}
                className={`level ${
                  levelData?.level === level.level ? "level-active" : ""
                }`}
                key={level.level}
              >
                <div className="level-year">{level?.year ?? ""}</div>
              </div>
            );
          })}
        </div>
        <div className="level-text" style={{color: levelColor}}>
          {levelData?.text ?? ""}
        </div>
      </div>
    </div>
  );
}

export default Pong;
