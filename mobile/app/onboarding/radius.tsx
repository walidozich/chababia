import { View, Text, StyleSheet } from 'react-native';
import { useState } from 'react';
import { Button } from '../../src/components/Button';
import { Card } from '../../src/components/Card';
import { colors, typography, spacing } from '../../src/design-system';

const RADIUS_OPTIONS = [
  { value: 1000, label: '1 km' },
  { value: 2000, label: '2 km' },
  { value: 5000, label: '5 km' },
];

export default function RadiusScreen() {
  const [selected, setSelected] = useState(5000);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Votre rayon de recherche</Text>
        <Text style={styles.subtitle}>
          Nous afficherons les opportunités dans un rayon autour de votre
          position. Votre position n'est demandée qu'une seule fois.
        </Text>
      </View>

      <View style={styles.options}>
        {RADIUS_OPTIONS.map((option) => (
          <Card
            key={option.value}
            variant={selected === option.value ? 'featureGreen' : 'content'}
            style={[
              styles.optionCard,
              selected === option.value && styles.selectedCard,
            ]}
          >
            <Button
              title={option.label}
              variant={selected === option.value ? 'primary' : 'secondary'}
              onPress={() => setSelected(option.value)}
            />
          </Card>
        ))}
      </View>

      <Button
        title="Démarrer"
        onPress={() => console.log('Start with radius:', selected)}
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
  options: {
    gap: spacing.md,
  },
  optionCard: {
    alignItems: 'center',
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: colors.primary,
  },
});
