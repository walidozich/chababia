import { View, Text, StyleSheet } from 'react-native';
import { Chip } from '../../src/components/Chip';
import { Button } from '../../src/components/Button';
import { colors, typography, spacing } from '../../src/design-system';
import { useState } from 'react';

const INTERESTS = [
  { id: 'sport', label: 'Sport' },
  { id: 'culture', label: 'Culture' },
  { id: 'formation', label: 'Formation' },
  { id: 'loisirs', label: 'Loisirs' },
  { id: 'volontariat', label: 'Volontariat' },
  { id: 'science', label: 'Science' },
];

export default function InterestsScreen() {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggleInterest = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Vos centres d'intérêt</Text>
        <Text style={styles.subtitle}>
          Sélectionnez au moins un centre d'intérêt pour recevoir des
          opportunités pertinentes.
        </Text>
      </View>

      <View style={styles.chips}>
        {INTERESTS.map((interest) => (
          <Chip
            key={interest.id}
            label={interest.label}
            selected={selected.has(interest.id)}
            onPress={() => toggleInterest(interest.id)}
          />
        ))}
      </View>

      <Button
        title="Continuer"
        disabled={selected.size === 0}
        onPress={() => console.log('Continue with:', [...selected])}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.canvasSoft,
    padding: spacing.xl,
    justifyContent: 'center',
    gap: spacing['2xl'],
  },
  header: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  title: {
    ...typography.displaySm,
    color: colors.ink,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.bodyMd,
    color: colors.body,
    textAlign: 'center',
    lineHeight: 24,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.sm,
  },
});
