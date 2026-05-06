import { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Modal, FlatList, ActivityIndicator, Alert
} from 'react-native';
import { usePickleballState } from '@/hooks/usePickleballState';

export default function CourtsScreen() {
  const {
    state, loading, availablePlayers,
    assignPlayer, removeFromCourt, suggestNext, scorePlayer
  } = usePickleballState();

  const [modal, setModal] = useState<{courtId:number, slotIdx:number} | null>(null);

  if (loading) return (
    <View style={styles.center}>
      <ActivityIndicator size="large" />
    </View>
  );

  const avail = availablePlayers();
  const activeCourt = modal ? state.courts.find(c => c.id === modal.courtId)! : null;
  const existing = activeCourt
    ? activeCourt.players.filter(Boolean) as string[]
    : [];
  const sorted = avail.slice().sort(
    (a, b) => scorePlayer(a, existing) - scorePlayer(b, existing)
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={state.courts}
        keyExtractor={c => String(c.id)}
        renderItem={({ item: court }) => {
          const filled = court.players.filter(Boolean).length;
          const suggested = suggestNext(court);
          return (
            <View style={styles.courtCard}>
              <View style={styles.courtHeader}>
                <Text style={styles.courtName}>Court {court.id}</Text>
                <View style={[styles.badge,
                  filled === 4 ? styles.badgeGreen : styles.badgeBlue]}>
                  <Text style={[styles.badgeText,
                    filled === 4 ? styles.badgeTextGreen : styles.badgeTextBlue]}>
                    {filled === 4 ? 'Playing' : `${filled}/4`}
                  </Text>
                </View>
              </View>
              {suggested && filled < 4 && (
                <Text style={styles.suggestion}>
                  Suggested next: {suggested}
                </Text>
              )}
              <View style={styles.slots}>
                {court.players.map((player, i) => (
                  <TouchableOpacity
                    key={i}
                    style={[styles.slot, player ? styles.slotFilled : styles.slotEmpty]}
                    onPress={() => player
                      ? Alert.alert('Remove player?', `Remove ${player}?`, [
                          { text: 'Cancel', style: 'cancel' },
                          { text: 'Remove', style: 'destructive',
                            onPress: () => removeFromCourt(court.id, i) }
                        ])
                      : setModal({ courtId: court.id, slotIdx: i })
                    }
                  >
                    <Text style={player ? styles.slotNameText : styles.slotEmptyText}>
                      {player || '+ Add'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          );
        }}
      />

      <Modal visible={!!modal} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>
              Add to Court {modal?.courtId}
            </Text>
            {sorted.length === 0
              ? <Text style={styles.emptyText}>No players in queue</Text>
              : sorted.map(name => (
                <TouchableOpacity
                  key={name}
                  style={styles.modalRow}
                  onPress={() => {
                    assignPlayer(modal!.courtId, modal!.slotIdx, name);
                    setModal(null);
                  }}
                >
                  <Text style={styles.modalName}>{name}</Text>
                  <Text style={styles.modalInfo}>
                    {scorePlayer(name, existing) === 0
                      ? 'Fresh matchup'
                      : `Played together ${scorePlayer(name, existing)}x`}
                  </Text>
                </TouchableOpacity>
              ))
            }
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => setModal(null)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  courtCard: { backgroundColor: '#fff', borderRadius: 12, padding: 14,
    marginBottom: 12, borderWidth: 0.5, borderColor: '#ddd' },
  courtHeader: { flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 8 },
  courtName: { fontSize: 16, fontWeight: '500' },
  badge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20 },
  badgeGreen: { backgroundColor: '#E1F5EE' },
  badgeBlue: { backgroundColor: '#E6F1FB' },
  badgeText: { fontSize: 12 },
  badgeTextGreen: { color: '#085041' },
  badgeTextBlue: { color: '#0C447C' },
  suggestion: { fontSize: 12, color: '#854F0B', backgroundColor: '#FAEEDA',
    padding: 6, borderRadius: 6, marginBottom: 8 },
  slots: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  slot: { width: '47%', padding: 10, borderRadius: 8, alignItems: 'center' },
  slotFilled: { backgroundColor: '#f0f0f0', borderWidth: 0.5,
    borderColor: '#ccc' },
  slotEmpty: { borderWidth: 1, borderColor: '#ccc', borderStyle: 'dashed' },
  slotNameText: { fontSize: 14, fontWeight: '500' },
  slotEmptyText: { fontSize: 13, color: '#999' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center', alignItems: 'center' },
  modalBox: { backgroundColor: '#fff', borderRadius: 14, padding: 16,
    width: '85%', maxHeight: '70%' },
  modalTitle: { fontSize: 16, fontWeight: '500', marginBottom: 12 },
  modalRow: { padding: 12, borderBottomWidth: 0.5, borderColor: '#eee',
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  modalName: { fontSize: 14, fontWeight: '500' },
  modalInfo: { fontSize: 12, color: '#888' },
  emptyText: { color: '#999', textAlign: 'center', padding: 16 },
  cancelBtn: { marginTop: 12, padding: 12, alignItems: 'center',
    borderWidth: 0.5, borderColor: '#ddd', borderRadius: 8 },
  cancelText: { color: '#666', fontSize: 14 },
});
