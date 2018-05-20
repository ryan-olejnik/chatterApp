import React, {Component} from 'react';
import Navbar from './Navbar.jsx';
import MessageList from './MessageList.jsx';
import CreateMessageForm from './CreateMessageForm.jsx';

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      currentUser: '',
      previousUser: '',
      messageList: [],
      connectedToSocket: false,
      usersOnline: 0,
      color: 'black'
    }
    this.sendNewMessage = this.sendNewMessage.bind(this);
    this.openConnection = this.openConnection.bind(this);
    document.title = 'ChattyApp';
  }


  sendNewMessage(message){
    this.webSocket.send(JSON.stringify({username: this.state.currentUser, type: 'new_message',  message: {content: message.content, color: this.state.color}}))
  }

  openConnection(event){
    event.preventDefault();
    let newUsername = event.target.elements.username.value;

    if (newUsername === ''){
      alert('Enter a username!!');
    // FIRST TIME CONNECTING:  
    } else if (this.state.connectedToSocket === false){
        this.webSocket = new WebSocket("ws://localhost:3001");
        this.webSocket.onopen = (event)=>{
          this.setState({connectedToSocket: true, currentUser: newUsername});
          this.webSocket.send(JSON.stringify({type: 'new_client_connection', username: newUsername, message: {content: `${newUsername} has joined the chatroom!`}}));
          
          this.webSocket.addEventListener('message', (message)=>{
            let parsedMessage = JSON.parse(message.data);
            console.log('message Received: ', parsedMessage)
            if (parsedMessage.type === 'new_client_connection'){
              this.setState({usersOnline: parsedMessage.numberOfClients});
            }
            if (parsedMessage.type === 'new_client_colorset'){
              this.setState({color: parsedMessage.color})
            }
            if (parsedMessage.type === 'client_disconnected'){
              this.setState({usersOnline: parsedMessage.numberOfClients});
            }

            let newMessageList = this.state.messageList;
            newMessageList.push(parsedMessage);
            this.setState({messageList: newMessageList});
          });
        }
      
      // Already connected to websocket, changing username:  
      } else if (newUsername !== this.state.currentUser && this.state.connectedToSocket === true){
        let oldUsername = this.state.currentUser;
        this.setState({currentUser: newUsername});
        this.webSocket.send(JSON.stringify(
          {type: 'username_change',
          color: this.state.color,
          username: newUsername,
          message: {color: this.state.color, content: `user ${oldUsername} changed username to: ${newUsername}`}
          }));
      }
    }

  render() {
    return (
      <div id='page-container'>
        <Navbar 
        openConnection={this.openConnection}
        currentUser={this.state.currentUser}
        numberOfUsersOnline={this.state.usersOnline} />
        <MessageList messageList={this.state.messageList}/>
        <CreateMessageForm 
          sendNewMessage={this.sendNewMessage} 
          changeUsername={this.changeUsername}
        />
      </div>
    );
  }
}

export default App;
