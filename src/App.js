import "./App.css";
import { useState, useEffect } from "react";
import Square from "./Components/Square";

function App() {
  const [board, setBoard] = useState([...Array(6)].map((row) => Array(6).fill('')));
  const [player, setPlayer] = useState("O");
  const [result, setResult] = useState({ winner: "none", state: "none" });

  useEffect(() => {
    checkWin(player,board);
    checkIfTie(player,board);

    if (player === "X") {
      setPlayer("O");
    } else {
      setPlayer("X");
    }
  }, [board]);

  useEffect(() => {
    if (result.state !== "none") {
      alert(`Game Finished! Winning Player: ${result.winner}`);
      restartGame();
    }
  }, [result]);

  const chooseSquare = (index1, index2) => {
    const arr = [...board];
    arr[index1][index2] = player;
    setBoard(arr);
    console.log(board);
  };

  const checkWin = (symbol, board) => {
    //Navigate the board horizontally
    const isHorizontalWinner = (symbol, board) => {
      return board.some((moves) => moves.every((move) => move === symbol))
    }

    const transposeBoard = (board) => {
      return board.map((_,index) => board.map((row) => row[index]))
    }

    const isVerticalWinner = (symbol, board) => {
      return transposeBoard(board).some((moves) => moves.every((move) => move === symbol))
    }

  // Get diagonal moves from the board  This will be used to check if a particular user has won //diagonally
    const getDiagonalMoves = (board) => {

      const diagonalMoves = [];
      const equalBasedDiagonal = []; // i === j
      const sumBasedDiagonal = [] // i + j == n -1 

      // Check for left to right diagonal moves
      for(let row = 0; row < board.length; row++){
        for (let col = 0; col < board.length; col++) {
          if (row === col) {
            equalBasedDiagonal.push(board[row][col])
          }
        }
      }

      // Check for right to left diagonal moves
      for(let row = 0; row < board.length; row++){
        for (let col = 0; col < board.length; col++) {
          if (row + col === board.length -1 ) {
            sumBasedDiagonal.push(board[row][col])
          }
        }
      }

      diagonalMoves.push(equalBasedDiagonal,sumBasedDiagonal);
      return diagonalMoves;
  }

  // Use the diagonal moves to check if the user is a winner
    const isDiagonalWinner = (symbol,board) => {
      return getDiagonalMoves(board).some((moves) => moves.every((move) => move === symbol))

    }

    // Check the winner
    const isWinner = (symbol,board) => isHorizontalWinner(symbol,board) || isVerticalWinner(symbol,board) || isDiagonalWinner(symbol,board)

    if (isWinner(symbol,board)) {
          setResult({ winner: player, state: "Won" });
    }
  };

  const checkIfTie = (symbol,board) => {
    const isGameOver = (board) => board.every((row) => row.every((move) => !!move));
    if (isGameOver(board)) {
      setResult({ winner: "No One", state: "Tie" });
    }
  };

  const restartGame = () => {
    setBoard([...Array(6)].map((row) => Array(6).fill('')));
    setPlayer("O");
  };

  return (
    <div className="App">
      <div className="board">
        {board.map((board1, index1) => 
          {
            return (
              <div className="row" key={index1}>
                {board1.map((board2, index2) => {
                  return (
                  <Square
                    key={index2}
                    val={board2}
                    chooseSquare={() => {
                      chooseSquare(index1, index2);
                    }}
                  />)
                })}  
            </div>
            )
          })
        }
      </div>
    </div>
  );
}

export default App;
