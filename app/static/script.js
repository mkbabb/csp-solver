let SIZE = 3;

function throttle(func, wait = 1000) {
    let enableCall = true;

    return function (...args) {
        if (!enableCall) return;
        enableCall = false;
        func(...args);
        setTimeout(() => (enableCall = true), wait);
    };
}

const clearBoardSuccess = function () {
    const board = document.getElementById("board");

    board.classList.remove("solve-failure");
    board.classList.remove("solve-success");
};

const setBoardSuccess = function (success) {
    const board = document.getElementById("board");

    clearBoardSuccess();

    if (success) {
        board.classList.add("solve-success");
    } else {
        board.classList.add("solve-failure");
    }
};

document.getElementById("board-size-select").addEventListener("change", (e) => {
    SIZE = parseFloat(document.getElementById("board-size-select").value);
    setComputedVariable("--size", SIZE);

    const tbody = document.querySelector("#board tbody");
    while (tbody.firstChild) {
        tbody.removeChild(tbody.lastChild);
    }

    clearBoardSuccess();

    initBoard(SIZE);
});

const getComputedVariable = (variable, el = document.documentElement) =>
    getComputedStyle(el).getPropertyValue(variable);

const setComputedVariable = (variable, value, el = document.documentElement) =>
    el.style.setProperty(variable, value);

const initBoard = function (size) {
    const N = Math.pow(size, 2);
    const M = Math.pow(N, 2);

    const tableBody = document.querySelector("#board tbody");

    let k = 0;

    const border = getComputedVariable("--border");

    for (let i = 0; i < N; i++) {
        const row = document.createElement("tr");

        for (let j = 0; j < N; j++) {
            const td = document.createElement("td");
            const input = document.createElement("input");

            if (j !== 0 && j !== N - 1 && j % size === 0) {
                td.style.borderLeft = border;
            }
            if (i !== 0 && i !== N - 1 && i % size === 0) {
                td.style.borderTop = border;
            }

            input.id = `cell-${k}`;
            input.type = "text";

            td.appendChild(input);
            row.appendChild(td);

            k += 1;
        }

        tableBody.appendChild(row);
    }
};

const DIFFICULTY_COLORS = {
    EASY: getComputedVariable("--easy"),
    MEDIUM: getComputedVariable("--medium"),
    HARD: getComputedVariable("--hard"),
};

const changeDifficultyColor = function () {
    const difficulty = document.getElementById("difficulty-select").value;
    document.getElementById("difficulty-header").style.color =
        DIFFICULTY_COLORS[difficulty];
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

const setBoard = async function (values) {
    clearBoard();

    let randomize = values === undefined;

    if (randomize) {
        const difficulty = document.getElementById("difficulty-select").value;
        values = await fetch(`getRandomBoard/${SIZE}/${difficulty}`)
            .then((res) => {
                return res.json();
            })
            .catch((res) => {
                return undefined;
            });

        console.log(values);
    }

    Object.entries(values).forEach(([pos, value]) => {
        const cell = getCell(pos);

        if (value === 0) {
            cell.value = "";
        } else {
            cell.value = value;

            if (randomize) {
                cell.disabled = true;
            }
        }
    });
};

let solvin = false;

const solve = async function () {
    if (solvin) {
        return;
    }
    const values = {};
    solvin = true;

    for (let i = 0; i < Math.pow(SIZE, 4); i++) {
        const cell = getCell(i);

        if (cell.value === "") {
        } else {
            values[String(i)] = parseFloat(cell.value);
        }
    }

    const body = {
        values: values,
        size: SIZE,
    };

    console.log("solvin");

    const data = await fetch(`solve/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    })
        .then((res) => {
            return res.json();
        })
        .catch((res) => {
            return undefined;
        });

    if (data === undefined) {
        setBoardSuccess(false);
    } else {
        const { solved, values } = data;
        setBoardSuccess(solved);
        setBoard(values);
    }

    solvin = false;
};

document
    .getElementById("difficulty-select")
    .addEventListener("change", (e) => changeDifficultyColor());

const randomizer = throttle(() => {
    clearBoardSuccess();
    setBoard();
}, 1000);

const clearer = throttle(() => {
    clearBoardSuccess();
    clearBoard();
}, 1000);

const solver = throttle(solve, 1000);

document.getElementById("randomize-btn").addEventListener("click", randomizer);

document.getElementById("clear-btn").addEventListener("click", clearer);

document.getElementById("solve-btn").addEventListener("click", solver);

window.addEventListener("load", () => {
    initBoard(SIZE);
    setBoard();
    changeDifficultyColor();
});
