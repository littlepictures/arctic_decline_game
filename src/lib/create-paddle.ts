export function createPaddle(w: number) {
  const width = Math.round(w);

  const svg = `
    <svg width="${width}" height="24" viewBox="0 0 ${width} 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path id="paddle-bottom"
        d="M6 20L6 18L4 18L2 18L2 6L4 6L6 6L6 4L6 2L${width - 6} 2L${
    width - 6
  } 4L${width - 6} 6L${width - 4} 6L${width - 2} 6L${width - 2} 18L${
    width - 4
  } 18L${width - 6} 18L${width - 6} 20L${width - 6} 22L6 22L6 20Z"
        fill="#C4D6EA" stroke="#4D96BD" stroke-width="4" />
</svg>
    `;

  const blob = new Blob([svg], {type: "image/svg+xml"});
  const url = URL.createObjectURL(blob);
  const image = document.createElement("img");
  image.src = url;
  image.addEventListener("load", () => URL.revokeObjectURL(url), {once: true});

  return image;
}
