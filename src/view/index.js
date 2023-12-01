const MAX_ANIM = 60 * 5;

/**
 * @param {HTMLCanvasElement} canvas
 */
function resizeCanvas(canvas) {
  canvas.width = document.body.clientWidth;
  canvas.height = document.body.clientHeight;
}

/**
 * @typedef {{ text: string; x: number; y: number; size: number; anim: number; }} Sentence
 */

function main() {
  /**
   * @type {HTMLCanvasElement}
   */
  const canvas = document.getElementById("screen");

  /**
   * @type {HTMLInputElement}
   */
  const input = document.getElementById("text-input");

  resizeCanvas(canvas);

  window.addEventListener("resize", () => {
    resizeCanvas(canvas);
  });

  const ctx = canvas.getContext("2d");

  const sentences = new Set();
  const stream = new WebSocket(new URL("/api/stream", "ws://" + location.host));

  stream.addEventListener("message", msg => {
    if (typeof msg.data !== "string") return;

    const sentence = JSON.parse(msg.data);
    sentence.anim = MAX_ANIM;

    sentences.add(sentence);
  });

  input.addEventListener("keydown", (event) => {
    if (event.isComposing || event.keyCode === 229) {
      return;
    }

    if (event.key === "Enter") {
      stream.send(JSON.stringify({
        text: input.value,
        x: Math.random(),
        y: Math.random(),
        size: Math.random()
      }));

      input.value = "";
    }
  });

  draw(canvas, ctx, sentences);
}

/**
 * @param {HTMLCanvasElement} canvas
 * @param {CanvasRenderingContext2D} ctx
 * @param {Set<Sentence>} sentences
 */
function draw(canvas, ctx, sentences) {
  ctx.reset();
  ctx.textAlign = "center";

  for (const sentence of sentences) {
    ctx.font = `${Math.max(1.5, sentence.size * 2)}rem serif`;
    ctx.fillStyle = `rgba(0,0,0,${sentence.anim / MAX_ANIM})`;
    ctx.fillText(sentence.text, sentence.x * canvas.width, sentence.y * canvas.height);

    sentence.anim--;

    if (sentence.anim < 0) {
      sentences.delete(sentence);
    }
  }

  requestAnimationFrame(() => draw(canvas, ctx, sentences));
}

window.addEventListener("load", main);
