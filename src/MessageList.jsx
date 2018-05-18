import React, {Component} from 'react';
import Message from './Message.jsx';

class MessageList extends React.Component{

  render(){
    var messageList = this.props.messageList.map((message)=>{
      return (<Message key={message.message.id} messageData={message}/>);  
    });
    
    return (
      <main className='messages'>
        {messageList}
      </main>
      )
  }
}

export default MessageList;


