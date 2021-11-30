const SIZE = 3;

const DIFFICULTY_COLORS = {
    EASY: "rgb(22, 187, 68)",
    MEDIUM: "#fcba03",
    HARD: "#f21d1d",
};

const getCell = function (pos) {
    return document.getElementById(`cell-${pos}`);
};

const clearBoard = function () {
    for (let i = 0; i < Math.pow(SIZE, 4); i++) {
        const cell = getCell(i);
        cell.disabled = false;
        cell.value = "";
    }
};

const randomizeBoard = async function () {
    const difficulty = document.getElementById("difficulty-select").value;

    const data = await fetch(`getRandomBoard/${SIZE}/${difficulty}`)
        .then((res) => {
            return res.json();
        })
        .catch((res) => {
            return undefined;
        });

    clearBoard();

    Object.entries(data).forEach(([pos, value]) => {
        const cell = getCell(pos);
        if (value === 0) {
            cell.value = "";
        } else {
            cell.value = value;
            cell.disabled = true;
        }
    });

    console.log(data);
};
document.getElementById("difficulty-select").addEventListener("change", (e) => {
    console.log("hi");
    const difficulty = e.target.value;
    document.getElementById("difficulty-header").style.color =
        DIFFICULTY_COLORS[difficulty];
});

document
    .getElementById("randomize-btn")
    .addEventListener("click", (e) => randomizeBoard);

document.getElementById("clear-btn").addEventListener("click", (e) => clearBoard());

document.addEventListener("load", randomizeBoard());
