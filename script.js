function init() {
    const arr = Array.from(document.querySelectorAll(".flags"));
    arr.forEach(e => {
        flags(e, 300, 40, 10, 0.3, 3);
    })
    window.addEventListener("resize", () => {
        arr.forEach(e => {
            flags(e, 300, 40, 10, 0.3, 3);
        })
    })
    window.addEventListener("mousemove", spotlight)
}
async function flags(e = null, p = 150, rY = 40, h = 20, d = 0.8, t = 3) {
    if (!e) return;
    const { SHOW_TEXT, FILTER_ACCEPT, FILTER_REJECT } = NodeFilter;
    const walker = document.createTreeWalker(e, SHOW_TEXT, {
        acceptNode(node) { return node.textContent.trim() ? FILTER_ACCEPT : FILTER_REJECT }
    })
    const fragment = new DocumentFragment();
    const create = document.createElement.bind(document);
    let [cur, cnt, prev] = [null, 1, null];
    const [rows, lines] = [[], [[]]];
    while ((cur = walker.nextNode())) {
        rows.push([])
        const txt = cur.textContent.trim().split(" ");
        txt.forEach(t => {
            if (t === "") return;
            const [box, wire] = [create("div"), create("div")];
            box.classList.add("_back_");
            wire.classList.add("_wire_");
            box.textContent = t;
            box.append(wire);
            rows.at(-1).push(box);
            fragment.append(box);
        })
        fragment.append(document.createElement("br"));
    }
    e.replaceChildren(fragment);
    rows.flat().forEach(box => {
        const top = Math.round(box.getBoundingClientRect().top);
        if (prev !== null && prev !== top) {
            lines.push([]);
            cnt++;
        }
        lines.at(-1).push(box);
        prev = top;
    })
    const { top: pTop } = e.getBoundingClientRect();
    lines.forEach(async (row, i) => {
        row.forEach(async (box) => {
            const { top: cTop } = box.getBoundingClientRect();
            const wire = box.querySelector("._wire_");
            const r = Math.floor(Math.random() * 3) - 1;
            const styles = window.getComputedStyle(box);
            const background = styles.getPropertyValue("background");
            if (background.includes("url")) {
                const img = background.match(/url\(["']?(.*?)["']?\)/)[1];
                const avg = await avgImg(img);
                box.style.setProperty("--side-color", avg.map(e => e * d).join(","));
            } else if (background.includes("rgb")) {
                const color = background.match(/\(([^)]+)\)/)[1].split(", ");
                box.style.setProperty("--side-color", color.map(e => e * d).join(","));
            }
            Object.assign(box.style, {
                zIndex: cnt - i - 1,
                transform: `perspective(${p}px) rotateY(${rY * r + 10}deg) translateY(-${h * Math.max(r, 0)}%)`,
                boxShadow: `${-1 - r * t}px 0px 0px rgb(var(--side-color))`
            });
            wire.setAttribute("style", `height: ${cTop - pTop}px;`);
        })
    })
}
function avgImg(img) {
    return new Promise((resolve, reject) => {
        try {
            const canvas = document.createElement("canvas");
            canvas.height = 16;
            canvas.width = 16;
            const ctx = canvas.getContext("2d");
            const placedImg = new Image();
            placedImg.src = img;
            placedImg.onload = function () {
                ctx.drawImage(placedImg, 0, 0, 16, 16);
                const data = ctx.getImageData(0, 0, 16, 16).data;
                const colors = [];
                for (let i = 0; i < data.length; i += 4) {
                    const [r, g, b] = data.slice(i, i + 3);
                    colors.push([r, g, b]);
                }
                const avg = colors.reduce((acc, [r = 0, g = 0, b = 0]) => {
                    acc[0] = Number(acc[0]) + Number(r);
                    acc[1] = Number(acc[1]) + Number(g);
                    acc[2] = Number(acc[2]) + Number(b);
                    return acc;
                }, [[0], [0], [0]]).map(e => Math.round(e / colors.length))
                resolve(avg);
            }
        } catch (e) {
            reject(e);
        }
    })
}
function spotlight(e) {
    const light = document.querySelector(".spotlight");
    light.setAttribute("style", `background: 
        radial-gradient(circle at ${e.clientX}px ${e.clientY}px, transparent 0% 200px, rgba(0,0,0,.5) 500px);`)
}
init();