import React, { Component } from 'react';
import './App.css';
import './ui-toolkit/css/nm-cx/main.css'
import axios from 'axios'
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch
} from 'react-router-dom'

const InputNote = (props) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="card">
      <div className="inputContent inputLabel">
        Note:
      </div>
      <div className="inputContent inputTextBox">
        <input style={{ margin: '0px' }} onChange={props.handleInputTextChange} value={props.inputText} type="text"></input>
      </div>
      <div className="inputContent inputButtonContainer">
        <button style={{ margin: '0px' }} disabled={props.inputText.length < 3 ? true : false} onClick={props.addButtonClicked} className="inputButton">Add Note</button>
      </div>
    </div>
  )
}

const VotingBox = (props) => {
  return (
    <div className="votingBox">
      <div style={{display:'inline-block'}}>
        <div className="voteText">Votes:</div>
        <div className="voteText">{props.voteCount > 0 ? "+" + props.voteCount : 0}</div>
      </div>
      <button className="voteButton" onClick={() => props.handleVote(props.noteId)} >Upvote!</button>
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
      <div>
        <div style={{display:'inline-block', width: '70%'}} className="noteText">{props.note.noteText}</div>
        <VotingBox noteId={props.note.id} voteCount={props.note.voteCount} handleVote={props.handleVote}/>
      </div>
    </div>
  )
}

const ScrollBox = (props) => {
  return (
    <div className="card scrollBox">
      {props.notes.map((note) => (<Note key={note.id} handleVote={props.handleVote} note={note} />))}
    </div>
  )
}

const SortSelection = (props) => {
  return (
    <div className="sortSelection">
      <div className={props.sortedBy === 'date' ? "inputContent" : "inputContent inactiveSort" } onClick={() => props.updateSortedBy("date")}>Date</div>
      <div className="inputContent">|</div>
      <div className={props.sortedBy === 'vote' ? "inputContent" : "inputContent inactiveSort" } onClick={() => props.updateSortedBy("vote")}>Vote</div>
    </div>
  )
}

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      inputText: "",
      notes: [],
      sortedBy: 'date'
    }
    this.handleInputTextChange = this.handleInputTextChange.bind(this);
    this.addButtonClicked = this.addButtonClicked.bind(this)
    this.loadNotes = this.loadNotes.bind(this)
    this.addNote = this.addNote.bind(this)
    this.sortedNotes = this.sortedNotes.bind(this)
    this.updateSortedBy = this.updateSortedBy.bind(this)
    this.handleVote = this.handleVote.bind(this)
  }

  componentDidMount() {
    this.loadNotes()
  }

  loadNotes() {
    const promise = axios.get('http://5a831a6898bd81001246c8e5.mockapi.io/notes');
    promise.then(({ data: notes }) => {
      this.setState({ notes: notes })
    }, () => { })
  }

  addNote(noteObj) {
    const promise = axios.post('http://5a831a6898bd81001246c8e5.mockapi.io/notes', noteObj);
    promise.then(({ data: note }) => {
      this.setState({ inputText: "" })
      this.loadNotes()
    }, () => { })
  }

  handleInputTextChange(event) {
    this.setState({ inputText: event.target.value })
  }

  addButtonClicked() {
    this.addNote({ noteText: this.state.inputText, voteCount: 0 })
  }

  sortedNotes() {
    let sortedNotes = this.state.notes.slice();
    if (this.state.sortedBy === 'date')
      return sortedNotes.sort(function (a, b) { return b.createdAt - a.createdAt })
    else
    return sortedNotes.sort(function (a, b) { return b.voteCount - a.voteCount }) 
  }

  updateSortedBy(dateOrVote) {
    this.setState({sortedBy: dateOrVote})
  }

  handleVote(noteId) {
    let tempNote = this.state.notes.find((note) => noteId === note.id)
    tempNote.voteCount++
    const promise = axios.put('http://5a831a6898bd81001246c8e5.mockapi.io/notes/' + noteId, tempNote);
    promise.then(({ data: note }) => {
      this.loadNotes()
    }, () => { })
  }

  render() {
    return (
      <Router>
        <div className="App">
          <div className="card outerCard">
            <div className="header">
              <h1>Anonymous Notes</h1>
            </div>
            <InputNote inputText={this.state.inputText} handleInputTextChange={this.handleInputTextChange} addButtonClicked={this.addButtonClicked} />
            {this.state.notes.length > 0 && <SortSelection sortedBy={this.state.sortedBy} updateSortedBy={this.updateSortedBy} />}
            {this.state.notes.length > 0 && <ScrollBox handleVote={this.handleVote} notes={this.sortedNotes()} />}
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
