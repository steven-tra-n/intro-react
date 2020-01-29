import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props){
  return(
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  )
}

class Board extends React.Component {
  renderSquare(i, c, r) {
    return <Square value={this.props.squares[i]} onClick={() => this.props.onClick(i, c, r)} />;
  }

  render() {
    let squares = [];
    let square = 0;
    let row = 1;
    let col = 1; 

    squares.push(<div className="board-row"></div>);

    while(square < 9){
      // console.log(`${square}, ${row}, ${col}`); //push this.renderSquare(square, row, col);
      squares.push(this.renderSquare(square, row, col))

      if(col >= 3){
        col = 1;
        row = row + 1; 

        squares.push('</div>');

        if(square < 8){
          squares.push('<div className="board-row">');
        }
      } else{
        col = col + 1;
      }

      square = square + 1;
    }

    return (
      <div>
        {/* <div className="board-row">
          {this.renderSquare(0, 1, 1)}
          {this.renderSquare(1, 1, 2)}
          {this.renderSquare(2, 1, 3)}
        </div>
        <div className="board-row">
          {this.renderSquare(3, 2, 1)}
          {this.renderSquare(4, 2, 2)}
          {this.renderSquare(5, 2, 3)}
        </div>
        <div className="board-row">
          {this.renderSquare(6, 3, 1)}
          {this.renderSquare(7, 3, 2)}
          {this.renderSquare(8, 3, 3)}
        </div> */}
        {squares}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        coords: ''
      }],
      stepNumber: 0,
      xIsNext: true
    };
  }
  
  handleClick(i, c, r){
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const coords = `(${c}, ${r})`;

    if(calculateWinner(squares) || squares[i]){ //Winner is determined or square is already filled
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        coords: coords
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      col: c,
      row: r
    });
  }

  jumpTo(step){
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ? 
        `Go to move #${move} ${history[move].coords}`:
        'Go to game start';
      return(
        <li key={move}>
          <button onClick={() => this.jumpTo(move)} style={ this.state.stepNumber === move ? {backgroundColor: 'red'} : {}}>{desc}</button>
        </li>
      );
    });

    let status;
    if(winner){
      status = 'Winner: ' + winner;
    } else{
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board squares={current.squares} onClick={(i, c, r) => this.handleClick(i, c, r)}/>
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
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
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
