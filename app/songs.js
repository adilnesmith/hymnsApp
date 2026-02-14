import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

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
  'a3': [ // Charles Wesley
    { id: 's6', title: 'Hark! The Herald Angels Sing', favorite: true },
    { id: 's7', title: 'Love Divine, All Loves Excelling', favorite: false },
  ],
  'a4': [ // Marcos Witt
    { id: 's8', title: 'Gracias', favorite: false },
    { id: 's9', title: 'Tu Mirada', favorite: true },
  ],
  'a5': [ // Alex Campos
    { id: 's10', title: 'El Alfarero', favorite: false },
  ],
  'a6': [ // John Newton
    { id: 's11', title: 'Amazing Grace', favorite: true },
  ],
  'a7': [ // Isaac Watts
    { id: 's12', title: 'Joy to the World', favorite: false },
    { id: 's13', title: 'When I Survey the Wondrous Cross', favorite: true },
  ],
  'a8': [ // Horatio Spafford
    { id: 's14', title: 'It Is Well With My Soul', favorite: true },
  ],
  'a9': [ // Chris Tomlin
    { id: 's15', title: 'How Great Is Our God', favorite: true },
    { id: 's16', title: 'Good Good Father', favorite: false },
  ],
  'a10': [ // Hillsong
    { id: 's17', title: 'What a Beautiful Name', favorite: false },
    { id: 's18', title: 'Oceans (Where Feet May Fail)', favorite: true },
  ],
};

export default function SongListScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { artistId, artistName } = params;
  
  const [songs, setSongs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFavorites, setShowFavorites] = useState(false);

  useEffect(() => {
    if (artistId) {
      setSongs(songsByArtist[artistId] || []);
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
      onPress={() => router.push({
        pathname: '/lyrics',
        params: { songId: item.id, songTitle: item.title }
      })}
    >
      <View style={styles.songInfo}>
        <Text style={styles.songTitle}>{item.title}</Text>
        {artistName && <Text style={styles.artistName}>{artistName}</Text>}
      </View>
      <TouchableOpacity 
        onPress={() => toggleFavorite(item.id)}
        style={styles.favoriteButton}
      >
        <Text style={styles.favoriteIcon}>{item.favorite ? '★' : '☆'}</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text style={styles.title}>{artistName || 'Songs'}</Text>
        
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search songs..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
        </View>
        
        <TouchableOpacity 
          style={[styles.filterButton, showFavorites && styles.filterButtonActive]}
          onPress={() => setShowFavorites(!showFavorites)}
        >
          <Text style={[styles.filterButtonText, showFavorites && styles.filterButtonTextActive]}>
            {showFavorites ? '★ Favorites Only' : '☆ Show All'}
          </Text>
        </TouchableOpacity>
      </LinearGradient>
      
      {/* Back Button */}
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Text style={styles.backButtonText}>← Back to Artists</Text>
      </TouchableOpacity>
      
      <FlatList
        data={filteredSongs}
        renderItem={renderSong}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🎵</Text>
            <Text style={styles.emptyText}>No songs found</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#ffffff',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    padding: 14,
    fontSize: 16,
    color: '#2c3e50',
  },
  filterButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  filterButtonActive: {
    backgroundColor: '#ffffff',
    borderColor: '#ffffff',
  },
  filterButtonText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
  },
  filterButtonTextActive: {
    color: '#667eea',
  },
  listContainer: {
    padding: 20,
  },
  backButton: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: -10,
    marginBottom: 20,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignSelf: 'flex-start',
  },
  backButtonText: {
    fontSize: 16,
    color: '#667eea',
    fontWeight: '600',
  },
  songCard: {
    backgroundColor: '#fff',
    padding: 18,
    marginBottom: 14,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
    borderLeftWidth: 4,
    borderLeftColor: '#f39c12',
  },
  songInfo: {
    flex: 1,
  },
  songTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 6,
  },
  artistName: {
    fontSize: 14,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  favoriteButton: {
    padding: 8,
  },
  favoriteIcon: {
    fontSize: 28,
    color: '#f39c12',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#7f8c8d',
    fontWeight: '500',
  },
});
