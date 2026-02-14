import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import {
  Animated,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

/* -----------------------------
   Chord Parsing
------------------------------*/
const parseChordLine = (line) => {
  const parts = [];
  const regex = /\[([^\]]+)\]([^\[]*)/g;

  let lastIndex = 0;
  let match;

  while ((match = regex.exec(line)) !== null) {
    if (match.index > lastIndex) {
      parts.push({
        chord: null,
        text: line.slice(lastIndex, match.index),
      });
    }

    parts.push({
      chord: match[1],
      text: match[2],
    });

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < line.length) {
    parts.push({
      chord: null,
      text: line.slice(lastIndex),
    });
  }

  return parts;
};

/* -----------------------------
   Chord Transpose Logic
------------------------------*/
const NOTES = [
  'C','C#','D','D#','E','F',
  'F#','G','G#','A','A#','B'
];

const FLAT_MAP = {
  Db: 'C#',
  Eb: 'D#',
  Gb: 'F#',
  Ab: 'G#',
  Bb: 'A#',
};

const normalizeNote = (note) => FLAT_MAP[note] || note;

const transposeChord = (chord, shift) => {
  if (!chord) return chord;

  const match = chord.match(/^([A-G][b#]?)(.*)$/);
  if (!match) return chord;

  let [, root, suffix] = match;
  root = normalizeNote(root);

  const index = NOTES.indexOf(root);
  if (index === -1) return chord;

  const newIndex = ((index + shift) % 12 + 12) % 12;

  return NOTES[newIndex] + suffix;
};

/* -----------------------------
   Mock Songs
------------------------------*/
const songLyrics = {
  s11: {
    title: 'Amazing Grace',
    artist: 'John Newton',
    lyrics: `[C]Amazing [G]grace how [Am]sweet the [F]sound
That saved a wretch like me!

[C]I once was [G]lost, but now am [F]found;
Was blind, but now I see.`,
    year: '1779',
    favorite: true,
  },
};

/* -----------------------------
   Screen
------------------------------*/
export default function LyricsScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { songId, songTitle } = params;

  const song = songLyrics[songId] || {
    title: songTitle || 'Song Not Found',
    artist: 'Unknown',
    lyrics: 'Lyrics not available.',
    year: 'N/A',
    favorite: false,
  };

  const [isFavorite, setIsFavorite] = useState(song.favorite);
  const [fontSize, setFontSize] = useState(16);
  const [showChords, setShowChords] = useState(true);
  const [keyShift, setKeyShift] = useState(0);

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
    if (fontSize < 26) setFontSize(fontSize + 2);
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
      >
        <View style={styles.headerContent}>
          <View style={styles.songInfo}>
            <Text style={styles.songTitle}>{song.title}</Text>
            <Text style={styles.artistName}>{song.artist}</Text>
          </View>

          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <TouchableOpacity
              onPress={toggleFavorite}
              style={styles.favoriteButton}
            >
              <Text style={styles.favoriteIcon}>
                {isFavorite ? '★' : '☆'}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </LinearGradient>

      {/* Back Button */}
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Text style={styles.backButtonText}>← Back to Songs</Text>
      </TouchableOpacity>

      {/* Controls */}
      <View style={styles.controls}>
        <View style={styles.fontControls}>
          <TouchableOpacity
            onPress={decreaseFontSize}
            style={styles.controlButton}
          >
            <Text style={styles.controlButtonText}>A-</Text>
          </TouchableOpacity>

          <Text style={styles.fontSizeLabel}>{fontSize}px</Text>

          <TouchableOpacity
            onPress={increaseFontSize}
            style={styles.controlButton}
          >
            <Text style={styles.controlButtonText}>A+</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setShowChords(!showChords)}
            style={styles.controlButton}
          >
            <Text style={styles.controlButtonText}>
              {showChords ? '🎵' : '🎶'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setKeyShift((s) => s - 1)}
            style={styles.controlButton}
          >
            <Text style={styles.controlButtonText}>-½</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setKeyShift(0)}
            style={styles.controlButton}
          >
            <Text style={styles.controlButtonText}>Key</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setKeyShift((s) => s + 1)}
            style={styles.controlButton}
          >
            <Text style={styles.controlButtonText}>+½</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={shareLyrics} style={styles.shareButton}>
          <LinearGradient
            colors={['#27ae60', '#2ecc71']}
            style={styles.shareGradient}
          >
            <Text style={styles.shareButtonText}>Share</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Lyrics */}
      <ScrollView
        style={styles.lyricsContainer}
        contentContainerStyle={styles.lyricsContent}
      >
        {song.lyrics.split('\n').map((line, idx) => {
          const parts = parseChordLine(line);

          return (
            <View key={idx} style={styles.lineRow}>
              {parts.map((p, i) => (
                <View key={i} style={styles.wordBlock}>
                  <Text
                    style={[
                      styles.chordText,
                      {
                        opacity: showChords ? 1 : 0,
                        fontSize: fontSize * 0.75,
                      },
                    ]}
                  >
                    {p.chord
                      ? transposeChord(p.chord, keyShift)
                      : ' '}
                  </Text>

                  <Text style={[styles.lyrics, { fontSize }]}>
                    {p.text}
                  </Text>
                </View>
              ))}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

/* -----------------------------
   Styles
------------------------------*/
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },

  header: {
    paddingTop: 20,
    paddingBottom: 25,
    paddingHorizontal: 20,
  },

  backButton: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: -10,
    marginBottom: 10,
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

  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  songTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
  },

  artistName: { color: '#fff', opacity: 0.9 },
  year: { color: '#fff', opacity: 0.8 },

  favoriteButton: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
  },

  favoriteIcon: { fontSize: 32, color: '#f39c12' },

  controls: {
    backgroundColor: '#fff',
    padding: 16,
    margin: 16,
    borderRadius: 16,
  },

  fontControls: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    alignItems: 'center',
  },

  controlButton: {
    backgroundColor: '#667eea',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
  },

  controlButtonText: {
    color: '#fff',
    fontWeight: '700',
  },

  fontSizeLabel: { minWidth: 40, textAlign: 'center' },

  shareButton: { marginTop: 10, borderRadius: 12, overflow: 'hidden' },

  shareGradient: { padding: 12, alignItems: 'center' },

  shareButtonText: { color: '#fff', fontWeight: '700' },

  lyricsContainer: { flex: 1 },

  lyricsContent: {
    padding: 20,
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 16,
  },

  lineRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },

  wordBlock: {
    alignItems: 'flex-start',
    marginRight: 2,
  },

  chordText: {
    height: 20,
    color: '#e67e22',
    fontWeight: '700',
  },

  lyrics: {
    lineHeight: 32,
    color: '#2c3e50',
  },
});