import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { KeyboardAvoidingView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';

export default function App() {

  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [outputMessage, setOutputMessage] = useState('');
  const handleButtonClick = () => {
    console.log(inputMessage);
    const message = {
      _id:Math.random().toString(36).substring(7),
      text: inputMessage,
      createdAt: new Date(),
      user: {
        _id: 1,
        name: 'User',
        avatar: 'https://placeimg.com/140/140/any',
      },
    }
    setMessages((previousMessages) => 
      GiftedChat.append(previousMessages, [message])
  );
    fetch("https://api.openai.com/v1/chat/completions",{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer sk-proj-fZA57d5VjmTT4dLCqoKQT3BlbkFJRpUBk8jsozo8heyOHnCo"
      },
      body: JSON.stringify({
        "messages": [{"role": "user", "content": inputMessage }],
        "model": "gpt-3.5-turbo-1106",
      })
      }).then((response) => response.json()).then((data)=>{
        console.log(data.choices[0].message.content);
        setOutputMessage(data.choices[0].message.content.trim());
        const message = {
          _id:  Math.random().toString(36).substring(7),
          text: data.choices[0].message.content.trim(),
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'User',
            avatar: 'https://placeimg.com/140/140/any',
          },
        }
        setMessages((previousMessages) => 
          GiftedChat.append(previousMessages, [message])
      );
      })
  }

  const handleTextInput = (text) => {
    setInputMessage(text);
    console.log(text);
  }

  return (
    
    <View style={{flex:1}}>
      
      <View style={{flex:1, justifyContent:"center"}}>
      
      <GiftedChat messages={messages} renderInputToolbar={() => {}} user={{_id:1}}/>
      </View>
      <View style={{flexDirection:"row"}}>
        <View style = {{flex:1, marginLeft: 10, marginBottom:20, backgroundColor: "white", 
        borderRadius: 10, borderWidth:1, borderColor: "orange", height: 40, marginLeft: 10, marginRight: 10, justifyContent: "center", paddingLeft: 10, paddingRight:10}}>
          <TextInput placeholder='Bana bir şey sor!' onChangeText={handleTextInput}/>
        </View>

        <TouchableOpacity onPress={handleButtonClick}>
          <View style={{backgroundColor: 'orange', padding: 10, marginLeft:5, marginBottom:10, marginRight:10,
          borderRadius: 50, justifyContent: "center"}}>
          <MaterialCommunityIcons name="send" size={24} color="white" />
          </View>
        </TouchableOpacity>
      </View>
      
      <StatusBar style="auto"/>
    </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
