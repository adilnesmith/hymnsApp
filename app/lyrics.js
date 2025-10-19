import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Share,
  Animated
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

// Mock data for song lyrics
const songLyrics = {
  's1': {
    title: 'Blessed Assurance',
    artist: 'Fanny Crosby',
    lyrics: `Blessed assurance, Jesus is mine!
Oh, what a foretaste of glory divine!
Heir of salvation, purchase of God,
Born of His Spirit, washed in His blood.

This is my story, this is my song,
Praising my Savior all the day long;
This is my story, this is my song,
Praising my Savior all the day long.

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
  's11': {
    title: 'Amazing Grace',
    artist: 'John Newton',
    lyrics: `Amazing grace! How sweet the sound
That saved a wretch like me!
I once was lost, but now am found;
Was blind, but now I see.

'Twas grace that taught my heart to fear,
And grace my fears relieved;
How precious did that grace appear
The hour I first believed.

Through many dangers, toils and snares,
I have already come;
'Tis grace hath brought me safe thus far,
And grace will lead me home.`,
    year: '1779',
    favorite: true,
  },
  's14': {
    title: 'It Is Well With My Soul',
    artist: 'Horatio Spafford',
    lyrics: `When peace like a river attendeth my way,
When sorrows like sea billows roll;
Whatever my lot, Thou hast taught me to say,
It is well, it is well with my soul.

It is well with my soul,
It is well, it is well with my soul.

Though Satan should buffet, though trials should come,
Let this blest assurance control,
That Christ hath regarded my helpless estate,
And hath shed His own blood for my soul.`,
    year: '1873',
    favorite: true,
  },
};

export default function LyricsScreen() {
  const params = useLocalSearchParams();
  const { songId, songTitle } = params;
  
  const song = songLyrics[songId] || {
    title: songTitle || 'Song Not Found',
    artist: 'Unknown',
    lyrics: 'The lyrics for this song are not available at the moment.',
    year: 'N/A',
    favorite: false,
  };

  const [isFavorite, setIsFavorite] = useState(song.favorite);
  const [fontSize, setFontSize] = useState(16);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const toggleFavorite = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.3,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    
    setIsFavorite(!isFavorite);
  };

  const increaseFontSize = () => {
    if (fontSize < 24) setFontSize(fontSize + 2);
  };

  const decreaseFontSize = () => {
    if (fontSize > 12) setFontSize(fontSize - 2);
  };

  const shareLyrics = async () => {
    try {
      await Share.share({
        message: `${song.title} by ${song.artist}\n\n${song.lyrics}`,
        title: song.title,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View style={styles.headerContent}>
          <View style={styles.songInfo}>
            <Text style={styles.songTitle}>{song.title}</Text>
            <Text style={styles.artistName}>{song.artist}</Text>
            {song.year && <Text style={styles.year}>📅 {song.year}</Text>}
          </View>
          
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <TouchableOpacity onPress={toggleFavorite} style={styles.favoriteButton}>
              <Text style={styles.favoriteIcon}>{isFavorite ? '★' : '☆'}</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </LinearGradient>

      <View style={styles.controls}>
        <View style={styles.fontControls}>
          <TouchableOpacity onPress={decreaseFontSize} style={styles.controlButton}>
            <Text style={styles.controlButtonText}>A-</Text>
          </TouchableOpacity>
          
          <Text style={styles.fontSizeLabel}>{fontSize}px</Text>
          
          <TouchableOpacity onPress={increaseFontSize} style={styles.controlButton}>
            <Text style={styles.controlButtonText}>A+</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity onPress={shareLyrics} style={styles.shareButton}>
          <LinearGradient
            colors={['#27ae60', '#2ecc71']}
            style={styles.shareGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.shareIcon}>📤</Text>
            <Text style={styles.shareButtonText}>Share</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.lyricsContainer}
        contentContainerStyle={styles.lyricsContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.lyrics, { fontSize }]}>{song.lyrics}</Text>
      </ScrollView>
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
    paddingBottom: 25,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  songInfo: {
    flex: 1,
  },
  songTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  artistName: {
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 6,
    opacity: 0.9,
  },
  year: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.8,
  },
  favoriteButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
  },
  favoriteIcon: {
    fontSize: 32,
    color: '#f39c12',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  fontControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  controlButton: {
    backgroundColor: '#667eea',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 12,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  controlButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  fontSizeLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    fontWeight: '600',
    minWidth: 40,
    textAlign: 'center',
  },
  shareButton: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#27ae60',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  shareGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    gap: 6,
  },
  shareIcon: {
    fontSize: 16,
  },
  shareButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  lyricsContainer: {
    flex: 1,
  },
  lyricsContent: {
    padding: 24,
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lyrics: {
    lineHeight: 32,
    color: '#2c3e50',
    textAlign: 'left',
    letterSpacing: 0.3,
  },
});
