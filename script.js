function init() {
    const arr = Array.from(document.querySelectorAll(".flags"));
    arr.forEach(e => {
        flags(e, 230, 40, 10, 0.7);
    })
}
async function flags(e = null, p = 150, rY = 40, h = 20, d = 0.8) {
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
            let boxShadowRule = "";
            if (background.includes("url")) {
                const img = background.match(/url\(["']?(.*?)["']?\)/)[1];
                const avg = await avgImg(img);
            } else if (background.includes("rgb")) {
                const color = background.match(/\(([^)]+)\)/)[1].split(", ");
                boxShadowRule = `box-shadow: ${-1 - r * 3}px 0px 0px rgb(${color.map(e => e * d).join(",")});`
            }
            box.setAttribute("style", `
                z-index: ${cnt - i - 1};
                transform: perspective(${p}px) rotateY(${rY * r + 10}deg) translateY(-${h * Math.max(r, 0)}%);
                ${boxShadowRule}`
            );
            wire.setAttribute("style", `height: ${cTop - pTop}px;`);
        })
    })
}
function avgImg(img) {
    return new Promise((resolve, reject) => {
        try {
            alert(img)
            const canvas = document.createElement("canvas");
            canvas.height = 16;
            canvas.width = 16;
            const ctx = canvas.getContext("2d");
            const placedImg = new Image();
            placedImg.src = img;
            placedImg.onload = function () {
                ctx.drawImage(placedImg, 0,0, 16, 16);
                const data = ctx.getImageData(0,0,16,16).data;
                const average = [100, 100, 100];
                resolve(average);
            }
            // ctx.
        } catch (e) {
            reject(e);
        }
    })
}
init();