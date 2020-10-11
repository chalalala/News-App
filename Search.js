import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View, FlatList, Linking, Image, TextInput } from 'react-native';
import moment from 'moment';
import { Card, Button } from 'react-native-elements';
import { Icon } from 'react-native-elements';
import filterForUniqueItems from './filterForUniqueItems.js';
import { TouchableOpacity } from 'react-native-gesture-handler';

const key = "84af92544a4249b0a1b41e3c823177c9";

export default function News(){
    const [loading, setLoading] = useState(false);
    const [query, setQuery] = useState([]);
    const [articles, setArticles] = useState([]);
    const [hasErrored, setHasApiError] = useState(false);
    const [lastPageReached, setLastPageReached] = useState(false);
    
    const getNews = async () => {
        setArticles([]);
        setLoading(true);
        try{
            const response = await fetch(`https://newsapi.org/v2/everything?qInTitle=${query}&apiKey=${key}`);
            const jsonData = await response.json();
            const hasMoreArticles = jsonData.articles.length > 0;
            if (hasMoreArticles){
                setArticles(jsonData.articles);
            }
            else{
                setLastPageReached(false);
            }
        }
        catch(error){
            setHasApiError(true);
      };
  
      setLoading(false);
    };
  
    useEffect(() => {getNews()},[]);
  
    if (loading){
      return(
        <View style={styles.container}>
          <ActivityIndicator size="large" loading={loading} color="#0000ff"/>
        </View>
      )
    }
    
    const renderArticleItem = ({item}) => {
      return(
        <Card>
          <View style={styles.row}>
            <Text style={styles.title}>{item.title}</Text>
          </View>
          <Image 
            source={{uri: item.urlToImage}}
            style={styles.image}
          />
          <View style={styles.row}>
            <Text style={styles.label}>Source: </Text>
            <Text style={styles.info}>{item.source.name}</Text>
          </View>
          <Text style={{marginBottom:10}}>{item.content}</Text>
          <View style={styles.row}>
            <Text style={styles.row}>
              <Text style={styles.label}>Published: </Text>
              <Text style={styles.info}>
                {moment(item.publishedAt).format('LLL')}
              </Text>
            </Text>
          </View>
          <Button icon={<Icon/>} title="Read more" backgroundColor="#03A9F4" onPress={() => onPress(item.url)}/>
        </Card>
      );
    }; 
  
    const onPress = url => {
      Linking.canOpenURL(url).then(supported => {
        if (supported){
          Linking.openURL(url);
        }
        else{
          console.log(`Don't know how to open URL: ${url}`);
        }
      })
    }
    // if (hasErrored){
    //     return(
    //       <View style={styles.container}>
    //         <Text>Error =(</Text>
    //       </View>
    //     )
    // }
    return (
      <View style={styles.container}>
        <View style={styles.row}>
          <Text style={styles.title}>Search for articles</Text>
        </View>
        <TextInput
            onChangeText={text => setQuery(text.toLowerCase().split(" ").join("+"))}
            style={styles.queryInput}
            placeholder="Enter keywords"
        />
        <TouchableOpacity style={styles.searchButton} onClick={getNews}>
            <Text style={styles.textButton}>Search</Text>
        </TouchableOpacity>
        <Text>Number of results: {articles.length}</Text>    
        <FlatList
          data={articles}
          onEndReached={getNews}
          onEndReachedThreshold={1}
          renderItem={renderArticleItem}
          keyExtractor={item => item.title}
          ListFooterComponent={lastPageReached ?
            <Text style={styles.info}>No more articles</Text> : 
            <ActivityIndicator size="large" loading={loading}/>
          }
        />
      </View>
    );
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
    title: {
      fontSize: 24,
      color: 'black',
      fontWeight: 'bold',
      marginVertical: 20,
    },
    label: {
      fontSize: 16,
      color: 'black',
      fontWeight: 'bold'
    },
    info: {
      fontSize: 16,
      color: 'grey'
    },
    image: {
      width:'100%',
      height:200,
    },
    queryInput: {
        width:'80%',
        padding: 10,
        borderWidth: 1,
        borderColor: 'gray',
        color: 'black'
    },
    searchButton:{
        backgroundColor: '#4066ed',
        width:150,
        height:50,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
        borderRadius: 50
    },
    textButton: {
        color: 'white',
        fontSize: 20,
    }
});