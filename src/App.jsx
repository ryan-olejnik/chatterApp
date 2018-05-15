import React, {Component} from 'react';

function Navbar(props){
  return (
    <div id='navbar'>
      <p>Chattyyyyyyyyyy</p>
    </div>
    );
}

class MessageList extends React.Component{
  render(){
    var messageList = this.props.messageList.map((message, index)=>{
      // console.log('index = ', index);
      return (<Message key={index} message={message}/>);
    });
    
    // console.log(messageList);
    return (
      <div>
        {messageList}
      </div>
      )
  }
}

class Message extends React.Component{

  render(){
    // console.log(this.props)
    return(<p><b>{this.props.message.username}:</b>  {this.props.message.content}</p>);
  }
}

class CreateMessageForm extends React.Component{
  constructor(props){
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(event){
    event.preventDefault();
    var newMessage = {username: event.target.elements.username.value, content: event.target.elements.message.value};
    console.log(newMessage);
    this.props.addMessage(newMessage);

    event.target.elements.message.value = '';
  }

  render(){
    return (
      <div id='message_form'>
        <form onSubmit={this.onSubmit}>
          <input type='text' value={this.props.currentUser} name='username' placeholder='Your Name...'></input>
          <input type='text' name='message' placeholder='Your Message...'></input>
          <button type='submit'  >Post Message!</button>
        </form>
      </div>
      )
  }
}

class App extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      currentUser: 'ryan-admin',
      messageList: [
        {
          username: "Bob",
          content: "Has anyone seen my marbles?",
        },
        {
          username: "Anonymous",
          content: "No, I think you lost them. You lost your marbles Bob. You lost them for good."
        }
      ]
    }
    this.addMessage = this.addMessage.bind(this);
  }


  addMessage(newMessage){
    console.log('inside addMessage function: ', newMessage);
    var currentMessages = this.state.messageList;
    this.setState({messageList: [...currentMessages, newMessage]});
  }

  render() {
    return (
      <div id='page_container'>
        <Navbar/>
        <MessageList messageList={this.state.messageList}/>
        <CreateMessageForm currentUser={this.state.currentUser} addMessage={this.addMessage}/>
      </div>
    );
  }
}


export default App;
