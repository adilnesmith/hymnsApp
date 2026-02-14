import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock data for regions with icons and colors
const regions = [
  { id: '1', name: 'North America', songCount: 250, icon: '🗽', colors: ['#667eea', '#764ba2'] },
  { id: '2', name: 'Latin America', songCount: 180, icon: '🌎', colors: ['#f093fb', '#f5576c'] },
  { id: '3', name: 'Europe', songCount: 320, icon: '🏰', colors: ['#4facfe', '#00f2fe'] },
  { id: '4', name: 'Africa', songCount: 150, icon: '🦁', colors: ['#43e97b', '#38f9d7'] },
  { id: '5', name: 'Asia', songCount: 200, icon: '🏯', colors: ['#fa709a', '#fee140'] },
  { id: '6', name: 'Oceania', songCount: 90, icon: '🏝️', colors: ['#30cfd0', '#330867'] },
];

export default function RegionScreen() {
  const router = useRouter();

  const handleRegionSelect = async (item) => {
    try {
      await AsyncStorage.setItem('selectedRegion', JSON.stringify({ regionId: item.id, regionName: item.name }));
      router.push({
        pathname: '/artist',
        params: { regionId: item.id, regionName: item.name }
      });
    } catch (error) {
      console.error('Error saving region:', error);
      // Still navigate even if save fails
      router.push({
        pathname: '/artist',
        params: { regionId: item.id, regionName: item.name }
      });
    }
  };

  const handleAlphabeticalSelect = async () => {
    try {
      await AsyncStorage.setItem('selectedRegion', JSON.stringify({ alphabetical: true }));
      router.push({
        pathname: '/artist',
        params: { alphabetical: true }
      });
    } catch (error) {
      console.error('Error saving alphabetical selection:', error);
      router.push({
        pathname: '/artist',
        params: { alphabetical: true }
      });
    }
  };

  const renderRegion = ({ item }) => (
    <TouchableOpacity 
      onPress={() => handleRegionSelect(item)}
      style={styles.cardWrapper}
    >
      <LinearGradient
        colors={item.colors}
        style={styles.regionCard}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.iconCircle}>
          <Text style={styles.regionIcon}>{item.icon}</Text>
        </View>
        <Text style={styles.regionName}>{item.name}</Text>
        <Text style={styles.songCount}>{item.songCount} hymns available</Text>
        <View style={styles.arrowContainer}>
          <Text style={styles.arrow}>→</Text>
        </View>
      </LinearGradient>
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
        <Text style={styles.title}>Select a Region</Text>
        <Text style={styles.subtitle}>Browse hymns by region of origin</Text>
      </LinearGradient>
      
      <FlatList
        data={regions}
        renderItem={renderRegion}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={styles.row}
      />
      
      <TouchableOpacity 
        style={styles.alphabeticalButton}
        onPress={handleAlphabeticalSelect}
      >
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          style={styles.alphabeticalGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={styles.alphabeticalButtonText}>📚 View All Hymns (A-Z)</Text>
        </LinearGradient>
      </TouchableOpacity>
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
    marginBottom: 8,
    textAlign: 'center',
    color: '#ffffff',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#ffffff',
    opacity: 0.9,
  },
  listContainer: {
    padding: 16,
  },
  row: {
    justifyContent: 'space-between',
  },
  cardWrapper: {
    width: '48%',
    marginBottom: 16,
  },
  regionCard: {
    padding: 20,
    borderRadius: 20,
    minHeight: 160,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  regionIcon: {
    fontSize: 28,
  },
  regionName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 6,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  songCount: {
    fontSize: 13,
    color: '#ffffff',
    opacity: 0.9,
  },
  arrowContainer: {
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  arrow: {
    fontSize: 24,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  alphabeticalButton: {
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  alphabeticalGradient: {
    padding: 18,
  },
  alphabeticalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
});
