import React, { Component } from 'react';
import './App.css';
import './ui-toolkit/css/nm-cx/main.css'
import axios from 'axios'

const InputNote = (props) => {
  return (
    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}} className="card">
      <div className="inputContent inputLabel">
        Note:
      </div>
      <div className="inputContent inputTextBox">
        <input style={{margin: '0px'}} onChange={props.handleInputTextChange} value={props.inputText} type="text"></input>
      </div>
      <div className="inputContent inputButtonContainer">
        <button style={{margin: '0px'}} onClick={props.addButtonClicked} className="inputButton">Add Note</button>
      </div>
    </div>
  )
}

const Note = (props) => {

  function formatDate(timeSinceEpoch) {
    const date = new Date(timeSinceEpoch * 1000)
    return date.toDateString().substr(date.toDateString().indexOf(" ") + 1) + ", " + date.toLocaleTimeString();
  }

  return (
    <div className="card noteCard">
      <div className="createdAt">Noted on: {formatDate(props.note.createdAt)}</div>
      <div className="noteText">{props.note.noteText}</div>
    </div>
  )
}

const ScrollBox = (props) => {
  return (
    <div className="card scrollBox">
      {props.notes.map((note) => (<Note key={note.id} note={note} />))}
    </div>
  )
}

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      inputText: "",
      notes: []
    }
    this.handleInputTextChange = this.handleInputTextChange.bind(this);
    this.addButtonClicked = this.addButtonClicked.bind(this)
    this.loadNotes = this.loadNotes.bind(this)
    this.addNote = this.addNote.bind(this)
    this.sortedNotes = this.sortedNotes.bind(this)
  }

  componentDidMount() {
    this.loadNotes()
  }

  loadNotes() {
    const promise = axios.get('http://5a831a6898bd81001246c8e5.mockapi.io/notes');
    promise.then(({ data: notes }) => {
      this.setState({notes: notes})
    }, () => { })
  }

  addNote(noteObj) {
    const promise = axios.post('http://5a831a6898bd81001246c8e5.mockapi.io/notes', noteObj);
    promise.then(({ data: note }) => {
      this.setState({inputText: ""})
      this.loadNotes()
    }, () => { })
  }

  handleInputTextChange(event) {
    this.setState({inputText: event.target.value})
  }

  addButtonClicked() {
    this.addNote({noteText: this.state.inputText})
  }

  sortedNotes() {
    let sortedNotes = this.state.notes.slice();
    return sortedNotes.sort(function(a, b){ return b.createdAt - a.createdAt })
  }

  render() {
    return (
      <div className="App">
        <div className="card outerCard">
          <div className="header">
            <h1>Anonymous Notes</h1>
          </div>
          <InputNote inputText={this.state.inputText} handleInputTextChange={this.handleInputTextChange} addButtonClicked={this.addButtonClicked} />
          { this.state.notes.length > 0 && <ScrollBox notes={this.sortedNotes()}/> }
        </div>
      </div>
    );
  }
}

export default App;
