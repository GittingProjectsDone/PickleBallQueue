import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { usePickleballState } from '@/hooks/usePickleballState';
import { usePlayerName } from '@/hooks/use-player-name';

export default function HistoryScreen() {
  const { myName } = usePlayerName();
  const { state, loading } = usePickleballState(myName);

  if (loading) return (
    <View style={styles.center}><ActivityIndicator size="large" /></View>
  );

  return (
    <View style={styles.container}>
      {state.history.length === 0
        ? <Text style={styles.empty}>No matches recorded yet.</Text>
        : <FlatList
            data={state.history}
            keyExtractor={(_, i) => String(i)}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.courtLabel}>{item.court}</Text>
                  <Text style={styles.time}>{item.time}</Text>
                </View>
                <View style={styles.teams}>
                  <View style={styles.team}>
                    <Text style={styles.teamLabel}>Team 1</Text>
                    <Text style={styles.teamPlayers}>
                      {item.team1.join(' & ')}
                    </Text>
                  </View>
                  <Text style={styles.vs}>vs</Text>
                  <View style={styles.team}>
                    <Text style={styles.teamLabel}>Team 2</Text>
                    <Text style={styles.teamPlayers}>
                      {item.team2.join(' & ')}
                    </Text>
                  </View>
                </View>
              </View>
            )}
          />
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  card: { backgroundColor: '#fff', borderRadius: 10, padding: 12,
    marginBottom: 8, borderWidth: 0.5, borderColor: '#ddd' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between',
    marginBottom: 8 },
  courtLabel: { fontSize: 14, fontWeight: '500' },
  time: { fontSize: 12, color: '#999' },
  teams: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  team: { flex: 1 },
  teamLabel: { fontSize: 11, color: '#999', marginBottom: 2 },
  teamPlayers: { fontSize: 13, fontWeight: '500' },
  vs: { fontSize: 12, color: '#999' },
  empty: { textAlign: 'center', color: '#999', marginTop: 40, fontSize: 14 },
});
