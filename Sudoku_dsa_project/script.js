const N = 9;

// Hash table to store valid numbers for each cell
const cellCandidates = new Map();

function createSudokuGrid() {
    const gridElement = document.getElementById('sudoku-grid');
    for (let i = 0; i < N; i++) {
        for (let j = 0; j < N; j++) {
            const cell = document.createElement('input');
            cell.type = 'number';
            cell.min = 1;
            cell.max = 9;
            cell.classList.add('cell');
            gridElement.appendChild(cell);
        }
    }
}

function getGridValues() {
    const cells = document.querySelectorAll('.cell');
    const grid = Array.from({ length: N }, () => Array(N).fill(0));
    cells.forEach((cell, index) => {
        const row = Math.floor(index / N);
        const col = index % N;
        grid[row][col] = cell.value ? parseInt(cell.value) : 0;
    });
    return grid;
}

function setGridValues(grid) {
    const cells = document.querySelectorAll('.cell');
    cells.forEach((cell, index) => {
        const row = Math.floor(index / N);
        const col = index % N;
        cell.value = grid[row][col] || '';
    });
}

// Function to initialize the hash table with candidates for each cell
function initializeCandidates(grid) {
    cellCandidates.clear();
    for (let row = 0; row < N; row++) {
        for (let col = 0; col < N; col++) {
            if (grid[row][col] === 0) {
                const key = `${row},${col}`;
                cellCandidates.set(key, new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]));
            }
        }
    }
}

// Function to update candidates after placing a number
function updateCandidates(grid, row, col, num) {
    // Remove the number from candidates in the same row and column
    for (let i = 0; i < N; i++) {
        const rowKey = `${row},${i}`;
        const colKey = `${i},${col}`;
        cellCandidates.get(rowKey)?.delete(num);
        cellCandidates.get(colKey)?.delete(num);
    }

    // Remove the number from candidates in the same 3x3 box
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            const key = `${boxRow + i},${boxCol + j}`;
            cellCandidates.get(key)?.delete(num);
        }
    }
}

function isSafe(grid, row, col, num) {
    // Check if the number is in the candidates for this cell
    const key = `${row},${col}`;
    return cellCandidates.get(key)?.has(num) ?? false;
}

// Backtracking function to solve Sudoku
function solveSudokuBacktrack(grid, row = 0, col = 0) {
    // Base case: if we've filled all cells, the puzzle is solved
    if (row === N - 1 && col === N) {
        return true;
    }
    // Move to the next row if we've reached the end of the current row
    if (col === N) {
        row++;
        col = 0;
    }
    // Skip filled cells
    if (grid[row][col] !== 0) {
        return solveSudokuBacktrack(grid, row, col + 1);
    }
    // Try placing each number from 1 to 9
    for (let num = 1; num <= N; num++) {
        if (isSafe(grid, row, col, num)) {
            // Place the number if it's safe
            grid[row][col] = num;
            updateCandidates(grid, row, col, num);

            // Recursively try to solve the rest of the puzzle
            if (solveSudokuBacktrack(grid, row, col + 1)) {
                return true; // Solution found
            }

            // If placing the number doesn't lead to a solution, backtrack
            grid[row][col] = 0;
            initializeCandidates(grid); // Reset candidates
        }
    }

    // No valid number found, backtrack
    return false;
}

function solve() {
    const grid = getGridValues();
    initializeCandidates(grid);
    if (solveSudokuBacktrack(grid)) {
        setGridValues(grid);
    } else {
        alert('No solution exists');
    }
}

function clear() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => cell.value = '');
}

document.addEventListener('DOMContentLoaded', () => {
    createSudokuGrid();
    document.getElementById('solve-btn').addEventListener('click', solve);
    document.getElementById('clear-btn').addEventListener('click', clear);
});