const SIZE = 3;

const getComputedVariable = function (variable) {
    getComputedStyle(document.documentElement).getPropertyValue(variable);
};

const DIFFICULTY_COLORS = {
    EASY: getComputedVariable("--easy"),
    MEDIUM: getComputedVariable("--medium"),
    HARD: getComputedVariable("--hard"),
};

const changeDifficultyColor = function () {
    const difficulty = document.getElementById("difficulty-select").value;
    console.log(DIFFICULTY_COLORS);
    document.getElementById("difficulty-header").style.color =
        DIFFICULTY_COLORS[difficulty];
};

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

    if (values === undefined) {
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
            cell.disabled = true;
        }
    });
};

const solve = async function () {
    const values = {};

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
};

document
    .getElementById("difficulty-select")
    .addEventListener("change", (e) => changeDifficultyColor());

document.getElementById("randomize-btn").addEventListener("click", (e) => {
    clearBoardSuccess();
    setBoard();
});

document.getElementById("clear-btn").addEventListener("click", (e) => {
    clearBoardSuccess();
    clearBoard();
});

document.getElementById("solve-btn").addEventListener("click", (e) => solve());

window.addEventListener("load", () => {
    setBoard();
    changeDifficultyColor();

    console.log(getComputedVariable("--easy"));
    console.log("hh");
});
