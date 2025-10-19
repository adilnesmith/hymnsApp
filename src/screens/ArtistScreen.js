import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ImageBackground, TextInput } from 'react-native';

// Mock data for artists
const artistsData = {
  '1': [ // North America
    { id: 'a1', name: 'Fanny Crosby', songCount: 120 },
    { id: 'a2', name: 'Ira D. Sankey', songCount: 85 },
    { id: 'a3', name: 'Charles Wesley', songCount: 45 },
  ],
  '2': [ // Latin America
    { id: 'a4', name: 'Marcos Witt', songCount: 65 },
    { id: 'a5', name: 'Alex Campos', songCount: 42 },
  ],
  // Add more regions as needed
};

// Add some more artists for demonstration
const allArtists = [
  ...artistsData['1'],
  ...artistsData['2'],
  { id: 'a6', name: 'John Newton', songCount: 38 },
  { id: 'a7', name: 'Isaac Watts', songCount: 52 },
  { id: 'a8', name: 'Horatio Spafford', songCount: 28 },
  { id: 'a9', name: 'Chris Tomlin', songCount: 95 },
  { id: 'a10', name: 'Hillsong', songCount: 110 },
].sort((a, b) => a.name.localeCompare(b.name));

const ArtistScreen = ({ route, navigation }) => {
  const { regionId, alphabetical } = route.params || {};
  const [artists, setArtists] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (alphabetical) {
      setArtists(allArtists);
    } else if (regionId) {
      setArtists(artistsData[regionId] || []);
    }
  }, [regionId, alphabetical]);

  const filteredArtists = artists.filter(artist => 
    artist.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderArtist = ({ item }) => (
    <TouchableOpacity 
      style={styles.artistCard}
      onPress={() => navigation.navigate('SongList', { artistId: item.id, artistName: item.name })}
    >
      <View style={styles.artistInfo}>
        <Text style={styles.artistName}>{item.name}</Text>
        <Text style={styles.songCount}>{item.songCount} hymns</Text>
      </View>
      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  );

  return (
    <ImageBackground 
      source={require('../../assets/background.jpg')} 
      style={styles.background} 
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Text style={styles.title}>
          {alphabetical ? 'All Artists (A-Z)' : route.params?.regionName || 'Artists'}
        </Text>
        
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search artists..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#95a5a6"
          />
        </View>
        
        <FlatList
          data={filteredArtists}
          renderItem={renderArtist}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.noResults}>No artists found</Text>
          }
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 15,
    marginBottom: 20,
    textAlign: 'center',
  },
  searchContainer: {
    marginBottom: 20,
  },
  searchInput: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#2c3e50',
    borderWidth: 1,
    borderColor: '#bdc3c7',
  },
  listContainer: {
    paddingBottom: 20,
  },
  artistCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  artistInfo: {
    flex: 1,
  },
  artistName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  songCount: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  arrow: {
    fontSize: 24,
    color: '#bdc3c7',
    marginLeft: 10,
  },
  noResults: {
    textAlign: 'center',
    marginTop: 20,
    color: '#7f8c8d',
    fontSize: 16,
  },
});

export default ArtistScreen;
