import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from './src/screens/HomeScreen';
import RegionScreen from './src/screens/RegionScreen';
import ArtistScreen from './src/screens/ArtistScreen';
import SongListScreen from './src/screens/SongListScreen';
import LyricsScreen from './src/screens/LyricsScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{ title: 'Christian Hymns' }} 
          />
          <Stack.Screen 
            name="Region" 
            component={RegionScreen} 
            options={{ title: 'Select Region' }} 
          />
          <Stack.Screen 
            name="Artist" 
            component={ArtistScreen} 
            options={{ title: 'Artists' }} 
          />
          <Stack.Screen 
            name="SongList" 
            component={SongListScreen} 
            options={{ title: 'Songs' }} 
          />
          <Stack.Screen 
            name="Lyrics" 
            component={LyricsScreen} 
            options={{ title: 'Lyrics' }} 
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
