import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ImageBackground } from 'react-native';

// Mock data for regions
const regions = [
  { id: '1', name: 'North America', songCount: 250 },
  { id: '2', name: 'Latin America', songCount: 180 },
  { id: '3', name: 'Europe', songCount: 320 },
  { id: '4', name: 'Africa', songCount: 150 },
  { id: '5', name: 'Asia', songCount: 200 },
  { id: '6', name: 'Oceania', songCount: 90 },
];

const RegionScreen = ({ navigation }) => {
  const renderRegion = ({ item }) => (
    <TouchableOpacity 
      style={styles.regionCard}
      onPress={() => navigation.navigate('Artist', { regionId: item.id, regionName: item.name })}
    >
      <Text style={styles.regionName}>{item.name}</Text>
      <Text style={styles.songCount}>{item.songCount} hymns</Text>
    </TouchableOpacity>
  );

  return (
    <ImageBackground 
      source={require('../../assets/background.jpg')} 
      style={styles.background} 
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Text style={styles.title}>Select a Region</Text>
        <Text style={styles.subtitle}>Browse hymns by region of origin</Text>
        
        <FlatList
          data={regions}
          renderItem={renderRegion}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
        
        <TouchableOpacity 
          style={styles.alphabeticalButton}
          onPress={() => navigation.navigate('Artist', { alphabetical: true })}
        >
          <Text style={styles.alphabeticalButtonText}>View All Hymns (A-Z)</Text>
        </TouchableOpacity>
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 20,
    marginBottom: 5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 25,
  },
  listContainer: {
    paddingBottom: 20,
  },
  regionCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  regionName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
  },
  songCount: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  alphabeticalButton: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  alphabeticalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default RegionScreen;
