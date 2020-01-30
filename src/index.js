import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props){
  return(
    <button className="square" onClick={props.onClick} style={props.highlight ? {backgroundColor:'red'} : {}}>
      {props.value}
    </button>
  )
}

class Board extends React.Component {
  renderSquare(i, c, r) {
    return <Square value={this.props.squares[i]} onClick={() => this.props.onClick(i, c, r)} highlight={this.props.winLine && this.props.winLine.includes(i)}/>;
  }

  render() {
    let rows = [];
    let squares = [];
    let count = -1;

    for(let row = 1; row <= 3; row++){
      for(let col = 1; col <= 3; col++){
        count = count + 1;

        squares.push(this.renderSquare(count, row, col));
      }

    rows.push(<div className="board-row">{squares}</div>)
    squares = []; //Reset squares for new row
    };

    return (
      <div>
        {rows}
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
      xIsNext: true,
      order: 'asc'
    };
  }
  
  handleClick(i, c, r){
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const coords = `(${c}, ${r})`;

    if(calculateWinner(squares).winner || squares[i]){ //Winner is determined or square is already filled
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        coords: coords
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step){
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }

  toggleSort(){
    this.setState({
      order: this.state.order === 'asc' ? 'desc' : 'asc'
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

    if(this.state.order != 'asc'){
      moves.reverse();
    }

    let status;
    if(winner.winner){
      status = 'Winner: ' + winner.winner;
    } else{
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board squares={current.squares} onClick={(i, c, r) => this.handleClick(i, c, r)} winLine={winner.winLine}/>
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div><button onClick={() => this.toggleSort()}>Toggle Sort</button></div>
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
      return {
        winner: squares[a],
        winLine: lines[i]
      };
    }
  }
  return {
    winner: null
  };
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
