import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View, FlatList, Linking, Image } from 'react-native';
import moment from 'moment';
import { Card, Button } from 'react-native-elements';
import { Icon } from 'react-native-elements';
import filterForUniqueItems from './filterForUniqueItems.js';

const key = "0e639301ff494ab491315d63255a7d05";

export default function News(){
    const [loading, setLoading] = useState(true);
    const [articles, setArticles] = useState([]);
    const [pageNumber, setPageNumber] = useState(1);
    const [hasErrored, setHasApiError] = useState(false);
    const [lastPageReached, setLastPageReached] = useState(false);
  
    const getNews = async () => {
      try{
          const response = await fetch(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${key}`);
          const jsonData = await response.json();
          const hasMoreArticles = jsonData.articles.length > 0;
          if (hasMoreArticles){
            const newArticleList = filterForUniqueItems(
              articles.concat(jsonData.articles)
            )
            setArticles(newArticleList);
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
      getNews();
    },[articles]);
  
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
  
    if (hasErrored){
      return(
        <View style={styles.container}>
          <Text>Error =(</Text>
        </View>
      )
    }
    return (
      <View style={styles.container}>
        <View style={styles.row}>
          <Text style={styles.label}>Articles Count: </Text>
          <Text style={styles.info}>{articles.length}</Text>
        </View>
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
      fontSize: 20,
      color: 'black',
      fontWeight: 'bold'
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
    }
});