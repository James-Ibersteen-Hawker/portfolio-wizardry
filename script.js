function init() {
    const arr = Array.from(document.querySelectorAll(".flags"));
    arr.forEach(e => {
        flags(e, 230, 40, 10);
    })
}
function flags(e = null, p = 150, rY = 40, h = 20) {
    if (!e) return;
    const walker = document.createTreeWalker(e, NodeFilter.SHOW_TEXT, {
        acceptNode(node) {
            return node.textContent.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
        }
    })
    const fragment = new DocumentFragment();
    const create = document.createElement.bind(document);
    let cur = null, cnt = 0;
    const boxes = [];
    while ((cur = walker.nextNode())) {
        boxes.push([]);
        const txt = cur.textContent.split(" ");
        txt.forEach(e => {
            const [box, wire] = [create("div"), create("div")];
            box.classList.add("_back_");
            wire.classList.add("_wire_");
            box.textContent = e;
            box.append(wire);
            boxes.at(-1).push(box);
            fragment.append(box);
        })
        fragment.append(document.createElement("br"));
        cnt++;
    }
    e.replaceChildren(fragment);
    boxes.forEach((row, i) => {
        row.forEach(box => {
            const { top: cTop } = box.getBoundingClientRect();
            const { top: pTop } = e.getBoundingClientRect();
            const wire = box.querySelector("._wire_");
            const r = Math.floor(Math.random() * 3) - 1;
            box.setAttribute("style", `
                z-index: ${cnt - i - 1};
                transform: perspective(${p}px) rotateY(${rY * r + 10}deg) translateY(-${h * Math.max(r, 0)}%);
                box-shadow: ${-1 - r * 3}px 0px 0px maroon;`
            );
            wire.setAttribute("style", `height: ${cTop - pTop}px;`);
        })
    })
}
init();