import {useCallback, useEffect, useRef, useState} from "react";
import Konva from "konva";
import {Stage, Layer, Image} from "react-konva";
import {useKeyPressEvent} from "react-use";
import useImage from "use-image";

import {useMyStore} from "../store";

import paddleImage from "../images/paddle-bottom.png?url";
import ballImage from "../images/ball.png";
import levels from "../../levels.json";

import "./Pong.css";

function Pong() {
  const {setUi} = useMyStore((state) => state);

  const [touchX, setTouchX] = useState<number | null>(null);

  const [gameInProgress, setGameInProgress] = useState(true);
  const [level, setLevel] = useState(1);

  const [pImage] = useImage(paddleImage);
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

  useKeyPressEvent(
    "ArrowLeft",
    () => {
      playerDirectionRef.current = -1;
    },
    () => {
      playerDirectionRef.current = 0;
    }
  );
  useKeyPressEvent(
    "ArrowRight",
    () => {
      playerDirectionRef.current = 1;
    },
    () => {
      playerDirectionRef.current = 0;
    }
  );

  const handleTouchStart = useCallback((event: TouchEvent) => {
    setTouchX(event.touches[0].clientX);
  }, []);

  const handleTouchEnd = useCallback(() => {
    setTouchX(null);
  }, []);

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
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchend", handleTouchEnd);
    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchEnd]);

  useEffect(() => {
    if (!levelData) {
      setUi("finish");
      setGameInProgress(false);
    }

    userPaddleRef.current?.to({
      width: pRef.current.width,
      duration: 0.25,
    });
    aiPaddleRef.current?.to({
      width: aRef.current.width,
      duration: 0.25,
    });
  }, [levelData, setUi]);

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

    const normalizePaddleLength = (icemassdata: number) => {
      const minPaddleLength = 15;
      const maxPaddleLength = 110;
      const normalizedLength =
        minPaddleLength +
        ((icemassdata - 3) / (8 - 3)) * (maxPaddleLength - minPaddleLength);
      return normalizedLength;
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

      player.width = normalizePaddleLength(levelData!.iceMassData);
      ai.width = normalizePaddleLength(levelData!.iceMassData);

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

      player.x += playerDirection * 5;

      // AI paddle movement
      ai.x += (ball.x + 12 - (ai.x + ai.width / 2)) * 0.1;

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
  }, [gameInProgress, height, levelData, width]);

  return (
    <div className="canvas-wrapper">
      <Stage width={width} height={height}>
        <Layer>
          <Image
            image={pImage}
            x={width / 2 - initialPaddleWidth / 2}
            y={0}
            width={initialPaddleWidth}
            height={paddleHeight}
            ref={aiPaddleRef}
          ></Image>

          <Image
            image={pImage}
            x={width / 2 - initialPaddleWidth / 2}
            y={height - paddleHeight}
            width={initialPaddleWidth}
            height={paddleHeight}
            fillPatternScaleX={0}
            ref={userPaddleRef}
          ></Image>

          <Image
            image={bImage}
            width={ballSize}
            height={ballSize}
            x={width / 2 - ballSize / 2}
            y={height / 2 - ballSize / 2}
            shadowEnabled={false}
            ref={ballRef}
          ></Image>
        </Layer>
      </Stage>
      <div className="levels-wrapper">
        <div
          className="levels"
          style={{
            transform: `translateX(${
              (1 / 3) * 100 + (levelData!.level - 1) * ((1 / 3) * 100 * -1)
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
        <div className="level-text">{levelData?.text ?? ""}</div>
      </div>
    </div>
  );
}

export default Pong;
