import { View, Text, StyleSheet } from 'react-native';
import { Button } from '../../src/components/Button';
import { Card } from '../../src/components/Card';
import { colors, typography, spacing } from '../../src/design-system';

export default function LanguageScreen() {
  const handleLanguageSelect = (lang: string) => {
    console.log('Selected language:', lang);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Choisissez votre langue</Text>
        <Text style={styles.subtitle}>اختر لغتك · ⵙⵜⵖⵉ ⵜⵓⵜⵍⴰⵢⵜ</Text>
      </View>

      <View style={styles.options}>
        <Card variant="content" style={styles.optionCard}>
          <Text style={styles.langLabel}>العربية</Text>
          <Text style={styles.langName}>Arabe</Text>
          <Button
            title="Sélectionner"
            variant="secondary"
            onPress={() => handleLanguageSelect('ar')}
          />
        </Card>

        <Card variant="featureGreen" style={styles.optionCard}>
          <Text style={styles.langLabel}>Français</Text>
          <Text style={styles.langName}>Français</Text>
          <Button
            title="Sélectionner"
            variant="primary"
            onPress={() => handleLanguageSelect('fr')}
          />
        </Card>

        <Card variant="content" style={styles.optionCard}>
          <Text style={styles.langLabel}>ⵜⴰⵎⴰⵣⵉⵖⵜ</Text>
          <Text style={styles.langName}>Tamazight</Text>
          <Button
            title="Sélectionner"
            variant="secondary"
            onPress={() => handleLanguageSelect('tzm')}
          />
        </Card>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.canvasSoft,
    padding: spacing.xl,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing['2xl'],
  },
  title: {
    ...typography.displaySm,
    color: colors.ink,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.bodySm,
    color: colors.mute,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  options: {
    gap: spacing.lg,
  },
  optionCard: {
    gap: spacing.md,
    alignItems: 'center',
  },
  langLabel: {
    ...typography.displayXs,
    color: colors.ink,
  },
  langName: {
    ...typography.bodyMd,
    color: colors.body,
  },
});
