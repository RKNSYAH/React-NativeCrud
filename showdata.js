import * as React from 'react';
import { Button, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { FlatList } from 'react-native-gesture-handler';
import { useState, useEffect } from 'react';
import { db } from './App';

export default function ShowData({ navigation }) {
  const [items, setItems] = useState([]);
  const [empty, setEmpty] = useState([]);
  useEffect(() =>  {
    db.transaction(function(tx){
      tx.executeSql(
        "SELECT * FROM logindata",
        [],
        (tx, results) => {
          var temp = []
          for (i = 0; i < results.rows.length; i++){
            temp.push(results.rows.item(i));
            setItems(temp);
            if (results.rows.length >= 1) {
              setEmpty(false);
            } else {
              setEmpty(true)
            }
          }
        }
  
      )
    })
  }, [])

    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <FlatList data={items} keyExtractor={item => item.id} renderItem={({item}) =>
                     <View key={item.id} style={{ padding: 20 }}>
                       <Text> Id: {item.id} </Text>
                       <Text> Username: {item.username} </Text>
                       <Text > Password: {item.password} </Text>
                   </View> 
      } >

        </FlatList>
        <Button title="Go back" onPress={() => navigation.navigate('Home')} />
      </View>
    );
  }