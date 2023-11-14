import React, { useState } from "react";
import Cell from "./Cell";
import "./Board.css";
import sfx from './assets/switch.wav'
import powerOn from './assets/lampOn.wav'
import winnerFx from './assets/award.wav'
// import bulb from './assets/bulb.mov'  <- Future Design Idea

//  **  Board Component  **
function Board({ nrows, ncols }) {
  const [board, setBoard] = useState(createBoard());

  /** create a board nrows high/ncols wide, each cell randomly lit or unlit */
  function createBoard() {
    let initialBoard = [];
    let fillRow = [];

    for (let i = 0; i < nrows; i++) {
      for (let j = 0; j < ncols; j++) {
        let randomBool = Math.floor(Math.random() * 2);
        randomBool === 0 ? fillRow.push(false) : fillRow.push(true);
      }
      initialBoard.push(fillRow);
      fillRow = [];
    }
    return initialBoard;
  }

  //  ** Check to see if game has been won  **
  function hasWon() {
    let rowDark = [];
    //  **  Check each row to see if lights are on  **
    for (let row of board) {
      if (row.every(e => e === false)) {
        rowDark.push(true);
      }
    }
    //  **  Check each column to see if lights are on  **
    if (rowDark.length === nrows) {
      //  **  If every light is turned OFF - The game has been won  **
      if (rowDark.every(e => e === true)) {
        let award = new Audio(winnerFx);
        award.volume = .1;
        award.play();
        return true;
      }
    }
    return false;
  }

  //  **  On Click - Flip current and surrounding cells  **
  function flipCellsAround(coord) {
    const { x, y } = coord;
    const boardCopy = board.slice();
    const click = new Audio(sfx);

    //  Check to make sure click target is inside of the game table
    if (x >= 0 && x < nrows && y >= 0 && y < ncols) {
      click.volume = .6;
      click.play();
      //  ****  Flip Currently Targeted, CENTER Cell  ****
      boardCopy[x][y] = !boardCopy[x][y];

      if (x > 0) {
        //  ****  Flip ABOVE Cell  ****
        boardCopy[x - 1][y] = !boardCopy[x - 1][y];
      }
      if (x < nrows - 1) {
        //  ****  Flip BELOW Cell  ****
        boardCopy[x + 1][y] = !boardCopy[x + 1][y];
      }
      if (y > 0) {
        //  ****  Flip LEFT Cell  ****
        boardCopy[x][y - 1] = !boardCopy[x][y - 1];
      }
      if (y < ncols - 1) {
        //  ****  Flip BELOW Cell  ****
        boardCopy[x][y + 1] = !boardCopy[x][y + 1];
      }
      setBoard(boardCopy);
    }
  }

  // **  Get random key for data cells  **
  const getRandomKey = () => {
    return Math.random() * 10000;
  }

  //  **  Initialize Game Board and create cell markup for table  **
  let gameBoard = [];

  board.forEach((row, index) => {
    let newRow = [];
    let indexX = index;
    row.forEach((i, index) => {
      let indexY = index;
      newRow.push(
        <Cell
          isLit={i}
          key={getRandomKey()}
          flipCellsAroundMe={() => flipCellsAround({
            x: indexX,
            y: indexY,
          })}
        />
      );
    });
    gameBoard.push(
      <tr key={getRandomKey()}>{newRow}</tr>
    );
    newRow = [];
  })

  return (
    <>
      <table className='grid'>
        <tbody>
          {hasWon() === false ? gameBoard :
            <tr>
              <td className="winner">You Win!</td>
            </tr>}
        </tbody>
      </table>
      <button className="start-button" onClick={() => {
        setBoard(createBoard());
        let power = new Audio(powerOn);
        power.volume = .1;
        power.play();
      }}>
        Start New Game
      </button>
    </>
  )
}

export default Board;
