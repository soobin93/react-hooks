// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import React from 'react';
import { useLocalStorageState } from '../utils';

const Board = ({ squares, onClick }) => {
  const renderSquare = (i) => (
    <button className="square" onClick={() => onClick(i)}>
      {squares[i]}
    </button>
  );

  return (
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  );
};

const Game = () => {
  const [history, setHistory] = useLocalStorageState('history', [Array(9).fill(null)]);
  const [currentStep, setCurrentStep] = useLocalStorageState('currentStep', 0);

  const currentSquares = history[currentStep];
  const nextValue = calculateNextValue(currentSquares);
  const winner = calculateWinner(currentSquares);
  const status = calculateStatus(winner, currentSquares, nextValue);

  const selectSquare = (square) => {
    if (winner || currentSquares[square]) {
      return;
    }

    const newHistory = history.slice(0, currentStep + 1);
    const newSquares = [...currentSquares];

    newSquares[square] = nextValue;
    newHistory.push(newSquares);

    setHistory(newHistory);
    setCurrentStep(newHistory.length - 1);
  };

  const restart = () => {
    setHistory([Array(9).fill(null)]);
    setCurrentStep(0);
  };

  let stepKey = 0;
  const moves = history.map((stepSquares, step) => {
    stepKey += 1;
    const desc = step ? `Go to move #${step}` : 'Go to game start';
    const isCurrentStep = step === currentStep;

    return (
      <li key={stepKey}>
        <button disabled={isCurrentStep} onClick={() => setCurrentStep(step)}>
          {desc} {isCurrentStep ? '(current)' : null}
        </button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board onClick={selectSquare} squares={currentSquares} />
        <button className="restart" onClick={restart}>
          restart
        </button>
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ol>{moves}</ol>
      </div>
    </div>
  );
};

const calculateStatus = (winner, squares, nextValue) => winner
  ? `Winner: ${winner}`
  : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`;

const calculateNextValue = (squares) => squares.filter(Boolean).length % 2 === 0 ? 'X' : 'O';

const calculateWinner = (squares) => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }

  return null;
};

const App = () => <Game />;

export default App;
