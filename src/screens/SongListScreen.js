import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ImageBackground, TextInput } from 'react-native';

// Mock data for songs by artist
const songsByArtist = {
  'a1': [ // Fanny Crosby
    { id: 's1', title: 'Blessed Assurance', favorite: true },
    { id: 's2', title: 'To God Be the Glory', favorite: false },
    { id: 's3', title: 'Jesus Is Tenderly Calling', favorite: true },
  ],
  'a2': [ // Ira D. Sankey
    { id: 's4', title: 'The Ninety and Nine', favorite: false },
    { id: 's5', title: 'A Shelter in the Time of Storm', favorite: false },
  ],
  // Add more artists as needed
};

// Add more songs for demonstration
const allSongs = [
  ...songsByArtist['a1'],
  ...songsByArtist['a2'],
  { id: 's6', title: 'Amazing Grace', artist: 'John Newton', favorite: true },
  { id: 's7', title: 'Joy to the World', artist: 'Isaac Watts', favorite: false },
  { id: 's8', title: 'It Is Well With My Soul', artist: 'Horatio Spafford', favorite: true },
  { id: 's9', title: 'How Great Is Our God', artist: 'Chris Tomlin', favorite: true },
  { id: 's10', title: 'What a Beautiful Name', artist: 'Hillsong', favorite: false },
].sort((a, b) => a.title.localeCompare(b.title));

const SongListScreen = ({ route, navigation }) => {
  const { artistId, artistName } = route.params || {};
  const [songs, setSongs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFavorites, setShowFavorites] = useState(false);

  useEffect(() => {
    if (artistId) {
      setSongs(songsByArtist[artistId] || []);
    } else {
      // If no artistId is provided, show all songs (for search functionality)
      setSongs(allSongs);
    }
  }, [artistId]);

  const filteredSongs = songs.filter(song => {
    const matchesSearch = song.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFavorite = !showFavorites || song.favorite;
    return matchesSearch && matchesFavorite;
  });

  const toggleFavorite = (songId) => {
    setSongs(prevSongs => 
      prevSongs.map(song => 
        song.id === songId ? { ...song, favorite: !song.favorite } : song
      )
    );
  };

  const renderSong = ({ item }) => (
    <TouchableOpacity 
      style={styles.songCard}
      onPress={() => navigation.navigate('Lyrics', { songId: item.id, songTitle: item.title })}
    >
      <View style={styles.songInfo}>
        <Text style={styles.songTitle}>{item.title}</Text>
        {item.artist && <Text style={styles.artistName}>{item.artist}</Text>}
      </View>
      <TouchableOpacity 
        onPress={(e) => {
          e.stopPropagation();
          toggleFavorite(item.id);
        }}
        style={styles.favoriteButton}
      >
        <Text style={[
          styles.favoriteIcon,
          item.favorite && styles.favoriteIconActive
        ]}>
          {item.favorite ? '★' : '☆'}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <ImageBackground 
      source={require('../../assets/background.jpg')} 
      style={styles.background} 
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Text style={styles.title}>{artistName || 'All Songs'}</Text>
        
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search songs..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#95a5a6"
          />
          
          <TouchableOpacity 
            style={[styles.filterButton, showFavorites && styles.filterButtonActive]}
            onPress={() => setShowFavorites(!showFavorites)}
          >
            <Text style={[styles.filterButtonText, showFavorites && styles.filterButtonTextActive]}>
              Favorites {showFavorites ? '✓' : ''}
            </Text>
          </TouchableOpacity>
        </View>
        
        <FlatList
          data={filteredSongs}
          renderItem={renderSong}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.noResults}>
              {showFavorites ? 'No favorite songs found' : 'No songs found'}
            </Text>
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
    marginBottom: 10,
  },
  filterButton: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  filterButtonActive: {
    backgroundColor: '#e3f2fd',
    borderColor: '#90caf9',
  },
  filterButtonText: {
    color: '#495057',
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: '#1976d2',
  },
  listContainer: {
    paddingBottom: 20,
  },
  songCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  songInfo: {
    flex: 1,
  },
  songTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  artistName: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  favoriteButton: {
    padding: 8,
  },
  favoriteIcon: {
    fontSize: 24,
    color: '#bdc3c7',
  },
  favoriteIconActive: {
    color: '#f1c40f',
  },
  noResults: {
    textAlign: 'center',
    marginTop: 40,
    color: '#7f8c8d',
    fontSize: 16,
  },
});

export default SongListScreen;
