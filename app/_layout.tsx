import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet
} from 'react-native';
import { usePlayerName } from '@/hooks/use-player-name';

export default function RootLayout() {
  const { myName, loaded, saveName } = usePlayerName();
  const [input, setInput] = useState('');

  if (!loaded) return null;

  if (!myName) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Welcome to PickleBall Queue</Text>
        <Text style={styles.sub}>Enter your name to get started</Text>
        <TextInput
          style={styles.input}
          placeholder="Your name"
          value={input}
          onChangeText={setInput}
          autoFocus
          returnKeyType="done"
          onSubmitEditing={() => input.trim() && saveName(input.trim())}
        />
        <TouchableOpacity
          style={[styles.btn, !input.trim() && styles.btnDisabled]}
          onPress={() => input.trim() && saveName(input.trim())}
          disabled={!input.trim()}
        >
          <Text style={styles.btnText}>Join</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center',
    padding: 32, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: '600', marginBottom: 8,
    textAlign: 'center' },
  sub: { fontSize: 15, color: '#666', marginBottom: 32, textAlign: 'center' },
  input: { width: '100%', borderWidth: 0.5, borderColor: '#ccc',
    borderRadius: 10, padding: 14, fontSize: 16, marginBottom: 16 },
  btn: { width: '100%', backgroundColor: '#4f46e5', padding: 14,
    borderRadius: 10, alignItems: 'center' },
  btnDisabled: { backgroundColor: '#a5b4fc' },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '500' },
});
