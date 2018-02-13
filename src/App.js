import React, { Component } from 'react';
import './App.css';
import './ui-toolkit/css/nm-cx/main.css'

const InputNote = (props) => {
  return (
    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}} className="card">
      <div className="inputContent inputLabel">
        Note:
      </div>
      <div className="inputContent inputTextBox">
        <input type="text"></input>
      </div>
      <div className="inputContent inputButtonContainer">
        <button className="inputButton">Add Note</button>
      </div>
    </div>
  )
}

const Note = (props) => {
  return (
    <div className="card noteCard">
      Words
    </div>
  )
}

const ScrollBox = (props) => {
  return (
    <div className="card scrollBox">
      <Note />
      <Note />
      <Note />
      <Note />
      <Note />
      <Note />
      <Note />
    </div>
  )
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="card outerCard">
          <div className="header">
            <h1>Anonymous Notes</h1>
          </div>
          <InputNote />
          <ScrollBox />
        </div>
      </div>
    );
  }
}

export default App;
