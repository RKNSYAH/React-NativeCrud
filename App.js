/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import 'react-native-gesture-handler';
import React from "react";

import {
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
  Linking,
  TouchableOpacity,
  ToastAndroid,
  Button
} from "react-native";
import { useState, useEffect } from "react";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { openDatabase } from 'react-native-sqlite-storage';
import App, { deletedb, insert, login } from "./Insert";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import Test from './android/test';
export const db = openDatabase({ name: 'test1.db' });

import ShowData from "./showdata";

export function Home() {
const [sUsername, setUsername] = useState('');
const [sPassword, setPassword] = useState('');
const [Remember, setRemember] = React.useState(false);
const [items, setItems] = useState([]);
const [empty, setEmpty] = useState([]);

useEffect(() => {
  db.transaction(function (txn) {
    txn.executeSql(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='logindata'",
      [],
      function (tx, res) {
        console.log('item:', res.rows.length);
        if (res.rows.length == 0) {
          txn.executeSql('DROP TABLE IF EXISTS logindata', []);
          txn.executeSql(
            'CREATE TABLE IF NOT EXISTS logindata(id INTEGER PRIMARY KEY AUTOINCREMENT, username VARCHAR(30), password VARCHAR(25))',
            []
          );
        }
      }
    );
  })

}, []);

useEffect(() => {
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
const navigation = useNavigation()

console.log(items)
  return (
  
    <View style={{flex: 1, backgroundColor: 'white'}}>

      <View style={styles.Header}>
        <Text style={styles.headerText}>E-Clinic</Text>
      </View>
      <View style={{flex: 2, flexDirection: 'column', justifyContent: 'center'}}>
        <Text style={styles.label}>Welcome To E-Clinic</Text>
        <View>
        <TextInput
          style={styles.inputContainer}
          placeholder="Username"
          autoComplete="username"
          onChangeText={
            (text) => setUsername(text) 
          }
          value={sUsername}
        ></TextInput></View>
        
        <TextInput
          style={styles.inputContainer}
          placeholder="Password"
          onChangeText={
            (text) => setPassword(text) 
          }
          value={sPassword}
          secureTextEntry={true}
        ></TextInput>
        <View style={{ flexDirection: "row", justifyContent: "space-between", }}>
          <BouncyCheckbox
            isChecked={Remember}
            onPress={() => setRemember(!Remember)}
            fillColor="green"
            text="Remember Me"
            textStyle={{
              textDecorationLine: "none",
            }}
            innerIconStyle={{
              borderRadius: 5,
            }}
            iconStyle={{
              borderRadius: 5,
            }}
            style={{ paddingLeft: 20 }}
            bounceEffectIn={0.96}
          />
          <Text
            style={{
              color: "black",
              textDecorationLine: "underline",
              alignSelf: "center",
              paddingRight: 40,
            }}
            onPress={() => Linking.openURL("")}
          >
            Forgot Password?
          </Text>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          <TouchableOpacity style={styles.button} onPress={() => login(sUsername, sPassword, items, navigation)}>
            <Text style={styles.buttonText}> Login </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => insert(sUsername, sPassword)}>
            <Text style={styles.buttonText} > Sign Up </Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity style={styles.button} onPress={() => deletedb()}>
      <Text style={styles.buttonText} > Reset Database </Text>
      </TouchableOpacity>
    </View>

  );
}

const styles = StyleSheet.create({
  Header:{
    borderBottomWidth: 0.4,
    borderColor: "black",
    borderRadius: 9,
    backgroundColor: 'white',
    elevation: 10
  },
  headerText:{
    fontWeight: '800',
    fontSize: 26,
    paddingVertical: 12,
    paddingLeft: 6,
    color: '#0066AB'
  },
  label: {
    textAlign: "center",
    fontWeight: "700",
    fontSize: 34,
    paddingBottom: 40,
    color: "#00069E",
  },
  buttonText: {
    fontWeight: "600",
    color: "black",
    fontSize: 14,
  },
  button: {
    alignItems: "center",
    backgroundColor: "#DFDFDF",
    padding: 10,
    marginTop: 20,
    paddingHorizontal: 50,
    borderRadius: 5,
  },
  inputContainer: {
    padding: 12,
    borderRadius: 10,
    width: 390,
    margin: 12,
    marginTop: -2,
    backgroundColor: "#DFDFDF",
    borderWidth: 0.4,
    color: "black",
    borderColor: "black",
  },
});

