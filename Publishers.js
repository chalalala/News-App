import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View, FlatList, Linking, TabBarIOS } from 'react-native';
import moment from 'moment';
import { Card, Button } from 'react-native-elements';
import { Icon } from 'react-native-elements';
import filterForUniqueItems from './filterForUniqueItems.js';

const key = "0e639301ff494ab491315d63255a7d05";

export default function Publishers(){
    const [loading, setLoading] = useState(true);
    const [publishers, setPublishers] = useState([]);
    const [pageNumber, setPageNumber] = useState(1);
    const [hasErrored, setHasApiError] = useState(false);
    const [lastPageReached, setLastPageReached] = useState(false);
  
    const getPublishers = async () => {
      try{
          const response = await fetch(`https://newsapi.org/v2/sources?apiKey=${key}`);
          const jsonData = await response.json();
          // setPublishers(publishers.concat(jsonData.sources));
          const hasMorePublishers = jsonData.sources.length > 0;
          if (hasMorePublishers){
            const newPublishersList = filterForUniqueItems(
              publishers.concat(jsonData.sources)
            )
            setPublishers(newPublishersList);
            setPageNumber(pageNumber+1);  
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
  
    useEffect(() => {
      getPublishers();
    },[publishers]);

        const [articles, setArticles] = useState([]);

    const getNews = async () => {
      try{
          const response = await fetch(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${key}`);
          const jsonData = await response.json();
         
          const newArticleList = filterForUniqueItems(
            articles.concat(jsonData.articles)
          )
          setArticles(newArticleList);
          setPageNumber(pageNumber+1);  
      }
      catch(error){
        setHasApiError(true);
      };
    };
  
    useEffect(() => {
      getNews();
    },[articles]);
  
    if (loading){
      return(
        <View style={styles.container}>
          <ActivityIndicator size="large" loading={loading} color="#0000ff"/>
        </View>
      )
    }
    
    const getNumberOfArticles = (item) => {
      return(
        <Text>{articles.filter(article => article.source.name === item.name).length}</Text>
      )
    }

    function toCapitalize(string){
      return string.charAt(0).toUpperCase() + string.slice(1);
    }

    const renderItem = ({item}) => {
      return(
        <Card>
          <Text style={styles.title}>{item.name}</Text>
          {/* <Text style={styles.info}>{item.description}</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Categories: </Text>
            <Text style={styles.info}>{toCapitalize(item.category)}</Text>
          </View> */}
          <View style={styles.row}>
            <Text style={styles.label}>Number of articles: </Text>
            <Text style={styles.info}>{getNumberOfArticles(item)}</Text>
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
  
    if (hasErrored){
      return(
        <View style={styles.container}>
          <Text>Error =(</Text>
        </View>
      )
    }
    return (
      <View style={styles.container}>
        <FlatList
          data={publishers}
          onEndReached={getPublishers}
          onEndReachedThreshold={1}
          renderItem={renderItem}
          keyExtractor={item => item.title}
          ListFooterComponent={lastPageReached ?
            <Text>No more publishers</Text> : 
            <ActivityIndicator size="large" loading={loading} color="#0000ff"/>
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
    title: {
      fontSize: 20,
      color: 'black',
      fontWeight: 'bold'
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
      color: 'grey',
      marginBottom: 10
    }
});
  