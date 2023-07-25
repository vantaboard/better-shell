const preTags = [...document.querySelectorAll("pre")];

function findShellNode(node) {
    if (String(node.innerHTML).trim().startsWith("$ ")) {
        return node;
    }

    return [...node.childNodes]
        .map((child) => {
            if (String(child.innerHTML).trim().startsWith("$ ")) {
                return child;
            } else {
                findShellNode(child);
            }
        })
        .filter(Boolean);
}

const shellNodes = preTags.map((block) => findShellNode(block)).flat();

shellNodes.forEach((node) => {
    node.innerHTML = node.innerHTML.replace(
        /^\$ /,
        `<span style="user-select: none">$ </span>`,
    );
});

const copyIcon = "📋";

preTags.forEach((block) => {
    block.style.position = "relative";
    const buttonColor =
        window
            .getComputedStyle(block, null)
            .getPropertyValue("background-color")
            .replace("rgb(", "")
            .replace(")", "")
            .split(",")
            .map((color) => parseInt(color))
            .reduce((acc, color) => acc + color) > 382
            ? "black"
            : "white";

    const copyButton = document.createElement("button");
    copyButton.innerHTML = copyIcon;
    copyButton.style = `
        position: absolute;
        top: 5px;
        right: 5px;
        padding: 0;
        margin: 0;
        text-shadow: rgba(0, 0, 0, 0.45) 1px 1px 3px;
        z-index: 1;
        border: none;
        background: none;
        color: ${buttonColor};
        font-size: 1.5rem;
        cursor: pointer;
        outline: none;
    `;
    copyButton.onclick = () => {
        navigator.clipboard.writeText(
            block.innerText.replaceAll(/(?<=^|\n)\$/g, '').replace(/\n\n\uD83D\uDCCB$/, ""),
        );
    };
    block.appendChild(copyButton);
});
