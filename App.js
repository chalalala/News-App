import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome } from '@expo/vector-icons'; 

import News from './News.js';
import Publishers from './Publishers.js';
import Search from './Search.js';

const Tab = createBottomTabNavigator();

const iconsList = {
  News: "newspaper-o",
  Publishers: "building-o",
  Search: "search"
}

export default function App() {
  return(
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({route}) => ({
          tabBarIcon: ({focused}) => {
            return <FontAwesome name={iconsList[route.name]} size={24} color={focused ? "blue" : "black"}/>;
          }
        })}
        tabBarOptions={{
          activeTintColor: "blue",
          inactiveTintColor: "grey"
        }}>
        <Tab.Screen name="News" component={News}/>
        <Tab.Screen name="Publishers" component={Publishers}/>
        <Tab.Screen name="Search" component={Search}/>
      </Tab.Navigator>
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  containerFlex: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  container: {
    flex: 1,
    marginTop: 40,
    alignItems: 'center',
    backgroundColor: '#fff',
    justifyContent: 'center'
  },
  header: {
    height: 30,
    width: '100%',
    backgroundColor: 'pink'
  },
  row: {
    flexDirection: 'row'
  },
  label: {
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold'
  },
  info: {
    fontSize: 16,
    color: 'grey'
  }
});
