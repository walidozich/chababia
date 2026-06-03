import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Button } from './Button';
import { spacing, typography } from '../design-system';
import { useTheme } from '../theme/ThemeContext';
import type { ReactNode } from 'react';

interface OnboardingFrameProps {
  step: number;
  totalSteps: number;
  title: string;
  subtitle: string;
  accessibilityLabel: string;
  onBack?: () => void;
  hideProgress?: boolean;
  children: ReactNode;
  footer?: ReactNode;
}

export function OnboardingFrame({
  step, totalSteps, title, subtitle, accessibilityLabel, onBack, hideProgress = false, children, footer,
}: OnboardingFrameProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.canvas }]} accessibilityLabel={accessibilityLabel}>
      <View style={styles.topRow}>
        {onBack ? <Button title="←" variant="icon-circular" accessibilityLabel="Retour" onPress={onBack} /> : <View style={styles.backSpacer} />}
        {!hideProgress ? (
          <View style={styles.dots} accessibilityRole="none">
            {Array.from({ length: totalSteps }).map((_, i) => <View key={i} style={[styles.dot, i + 1 === step ? styles.dotActive : styles.dotInactive]} />)}
          </View>
        ) : <View style={styles.dots} />}
      </View>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.ink }]} maxFontSizeMultiplier={1.2}>{title}</Text>
          <Text style={[styles.subtitle, { color: colors.body }]} maxFontSizeMultiplier={1.2}>{subtitle}</Text>
        </View>
        <View style={styles.content}>{children}</View>
        {footer ? <View style={styles.footer}>{footer}</View> : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: spacing.xl, paddingTop: spacing.xl, paddingBottom: spacing.xl },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xl },
  backSpacer: { width: 40, height: 40 },
  dots: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  dot: { width: 8, height: 8, borderRadius: 9999 },
  dotActive: { backgroundColor: '#163300' },
  dotInactive: { backgroundColor: '#e6e4d8' },
  header: { marginBottom: spacing['2xl'], maxWidth: 260 },
  scroll: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: 'space-between' },
  title: { ...typography['display-sm'], marginBottom: spacing.md },
  subtitle: { ...typography['body-md'] },
  content: { flex: 1 },
  footer: { paddingTop: spacing.lg },
});
