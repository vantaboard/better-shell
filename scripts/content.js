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
    const span = document.createElement("span");
    span.style = "user-select: none";
    node.textContent = node.textContent.replace(/^\$ /, "");
    span.textContent = "$ ";
    node.prepend(span);
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
    copyButton.textContent = copyIcon;
    copyButton.style = `
        color: ${buttonColor};
    `;
    copyButton.className = "copy-btn";

    copyButton.onclick = () => {
        copyButton.className = "copy-btn clicked";

        setTimeout(() => {
            copyButton.className = "copy-btn";
        }, 150);

        navigator.clipboard.writeText(
            block.innerText.replaceAll(/(?<=^|\n)\$/g, '').replace(/\n{0,2}\uD83D\uDCCB$/, ""),
        );
    };
    block.appendChild(copyButton);
});
