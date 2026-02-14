import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{
          title: 'Christian Hymns',
          headerShown: false
        }}
      />
      <Stack.Screen 
        name="region" 
        options={{
          title: 'Select Region',
          headerShown: true
        }}
      />
      <Stack.Screen 
        name="artist" 
        options={{
          title: 'Artists',
          headerShown: false
        }}
      />
      <Stack.Screen 
        name="songs" 
        options={{
          title: 'Songs',
          headerShown: false
        }}
      />
      <Stack.Screen 
        name="lyrics" 
        options={{
          title: 'Lyrics',
          headerShown: false
        }}
      />
    </Stack>
  );
}
