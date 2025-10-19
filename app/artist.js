import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

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
  '3': [ // Europe
    { id: 'a6', name: 'John Newton', songCount: 38 },
    { id: 'a7', name: 'Isaac Watts', songCount: 52 },
  ],
  '4': [ // Africa
    { id: 'a8', name: 'Horatio Spafford', songCount: 28 },
  ],
  '5': [ // Asia
    { id: 'a9', name: 'Chris Tomlin', songCount: 95 },
  ],
  '6': [ // Oceania
    { id: 'a10', name: 'Hillsong', songCount: 110 },
  ],
};

// All artists for alphabetical view
const allArtists = [
  ...artistsData['1'],
  ...artistsData['2'],
  ...artistsData['3'],
  ...artistsData['4'],
  ...artistsData['5'],
  ...artistsData['6'],
].sort((a, b) => a.name.localeCompare(b.name));

export default function ArtistScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { regionId, alphabetical } = params;
  
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
      onPress={() => router.push({
        pathname: '/songs',
        params: { artistId: item.id, artistName: item.name }
      })}
    >
      <View style={styles.artistInfo}>
        <Text style={styles.artistName}>{item.name}</Text>
        <Text style={styles.songCount}>{item.songCount} hymns</Text>
      </View>
      <Text style={styles.arrow}>›</Text>
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
        <Text style={styles.title}>Select an Artist</Text>
        
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search artists..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
        </View>
      </LinearGradient>
      
      <FlatList
        data={filteredArtists}
        renderItem={renderArtist}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🎤</Text>
            <Text style={styles.emptyText}>No artists found</Text>
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
  listContainer: {
    padding: 20,
  },
  artistCard: {
    backgroundColor: '#fff',
    padding: 20,
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
    borderLeftColor: '#667eea',
  },
  artistInfo: {
    flex: 1,
  },
  artistName: {
    fontSize: 19,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 6,
  },
  songCount: {
    fontSize: 14,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  arrow: {
    fontSize: 28,
    color: '#667eea',
    fontWeight: 'bold',
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
