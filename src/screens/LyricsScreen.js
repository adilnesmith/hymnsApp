import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ImageBackground, 
  Share,
  Animated,
  Easing
} from 'react-native';

// Mock data for song lyrics
const songLyrics = {
  's1': {
    title: 'Blessed Assurance',
    artist: 'Fanny Crosby',
    lyrics: `Blessed assurance, Jesus is mine!
Oh, what a foretaste of glory divine!
Heir of salvation, purchase of God,
Born of His Spirit, washed in His blood.

Perfect submission, perfect delight,
Visions of rapture now burst on my sight;
Angels descending, bring from above
Echoes of mercy, whispers of love.

Perfect submission, all is at rest,
I in my Savior am happy and blest;
Watching and waiting, looking above,
Filled with His goodness, lost in His love.`,
    year: '1873',
    favorite: true,
  },
  // Add more songs as needed
};

const LyricsScreen = ({ route, navigation }) => {
  const { songId } = route.params;
  const song = songLyrics[songId] || {
    title: 'Song Not Found',
    artist: 'Unknown',
    lyrics: 'The lyrics for this song are not available at the moment.',
    year: 'N/A',
    favorite: false,
  };

  const [isFavorite, setIsFavorite] = useState(song.favorite);
  const [fontSize, setFontSize] = useState(16);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const toggleFavorite = () => {
    // Animate the favorite button
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.3,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
    
    setIsFavorite(!isFavorite);
    // In a real app, you would save this to your state management or database
  };

  const shareSong = async () => {
    try {
      await Share.share({
        message: `Check out this hymn: ${song.title} by ${song.artist}\n\n${song.lyrics}\n\nShared via Christian Hymns App`,
        title: song.title,
      });
    } catch (error) {
      console.error('Error sharing song:', error);
    }
  };

  const adjustFontSize = (increase) => {
    setFontSize(prevSize => {
      const newSize = increase ? prevSize + 1 : prevSize - 1;
      return Math.max(12, Math.min(24, newSize)); // Limit font size between 12 and 24
    });
  };

  return (
    <ImageBackground 
      source={require('../../assets/background.jpg')} 
      style={styles.background} 
      resizeMode="cover"
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>‹</Text>
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={styles.title} numberOfLines={1}>{song.title}</Text>
            <Text style={styles.artist} numberOfLines={1}>{song.artist} • {song.year}</Text>
          </View>
          <TouchableOpacity 
            onPress={toggleFavorite}
            style={styles.favoriteButton}
          >
            <Animated.Text 
              style={[
                styles.favoriteIcon,
                { transform: [{ scale: scaleAnim }] },
                isFavorite && styles.favoriteIconActive
              ]}
            >
              {isFavorite ? '★' : '☆'}
            </Animated.Text>
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.lyricsContainer}
          contentContainerStyle={styles.lyricsContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={[styles.lyrics, { fontSize }]}>{song.lyrics}</Text>
        </ScrollView>

        <View style={styles.footer}>
          <View style={styles.fontSizeControls}>
            <TouchableOpacity 
              onPress={() => adjustFontSize(false)}
              style={styles.fontSizeButton}
              disabled={fontSize <= 12}
            >
              <Text style={[
                styles.fontSizeButtonText,
                fontSize <= 12 && styles.disabledButton
              ]}>A-</Text>
            </TouchableOpacity>
            <Text style={styles.fontSizeLabel}>Size</Text>
            <TouchableOpacity 
              onPress={() => adjustFontSize(true)}
              style={styles.fontSizeButton}
              disabled={fontSize >= 24}
            >
              <Text style={[
                styles.fontSizeButtonText,
                fontSize >= 24 && styles.disabledButton
              ]}>A+</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            onPress={shareSong}
            style={styles.shareButton}
          >
            <Text style={styles.shareButtonText}>Share</Text>
          </TouchableOpacity>
        </View>
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
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    backgroundColor: 'white',
    elevation: 2,
  },
  backButton: {
    padding: 8,
    marginRight: 10,
  },
  backButtonText: {
    fontSize: 24,
    color: '#3498db',
    fontWeight: 'bold',
    marginTop: -4,
  },
  headerText: {
    flex: 1,
    marginRight: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  artist: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 2,
  },
  favoriteButton: {
    padding: 8,
  },
  favoriteIcon: {
    fontSize: 28,
    color: '#bdc3c7',
  },
  favoriteIconActive: {
    color: '#f1c40f',
  },
  lyricsContainer: {
    flex: 1,
    padding: 20,
  },
  lyricsContent: {
    paddingBottom: 30,
  },
  lyrics: {
    fontSize: 16,
    lineHeight: 28,
    color: '#2c3e50',
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    backgroundColor: 'white',
  },
  fontSizeControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fontSizeButton: {
    padding: 8,
  },
  fontSizeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3498db',
  },
  fontSizeLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    marginHorizontal: 5,
  },
  shareButton: {
    backgroundColor: '#3498db',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  shareButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  disabledButton: {
    color: '#bdc3c7',
  },
});

export default LyricsScreen;
