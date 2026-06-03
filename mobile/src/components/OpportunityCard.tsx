import { Pressable, View, Text, StyleSheet } from 'react-native';
import { Clock3, Heart, MapPin, X } from 'lucide-react-native';
import { Svg, Path } from 'react-native-svg';
import { typography, spacing } from '../design-system';
import { useTheme } from '../theme/ThemeContext';
import { Tag } from './Tag';
import { t, type Locale } from '../i18n';
import type { FormattedOpportunity } from '../hooks/useOpportunities';

interface OpportunityCardProps {
  opportunity: FormattedOpportunity;
  locale: Locale;
  onLike: () => void;
  onDislike: () => void;
  onSeeMore: () => void;
}

const CATEGORY_LABELS: Record<string, Record<Locale, string>> = {
  sport: { fr: 'Sport', ar: 'رياضة', tzm: 'ⵙⴱⵓⵕⵜ' },
  culture: { fr: 'Culture', ar: 'ثقافة', tzm: 'ⵉⴷⵍⴻⵙ' },
  formation: { fr: 'Formation', ar: 'تكوين', tzm: 'ⴰⵙⴻⵍⵎⴻⴷ' },
  musique: { fr: 'Musique', ar: 'موسيقى', tzm: 'ⴰⵥⴰⵡⴰⵏ' },
  ecologie: { fr: 'Écologie', ar: 'بيئة', tzm: 'ⵜⴰⵡⵏⵏⴰⴹⵜ' },
  benevolat: { fr: 'Bénévolat', ar: 'تطوع', tzm: 'ⴰⵙⴻⵡⵡⴰⵚ' },
};

const CARD_THEMES: Record<string, { gradientA: string; gradientB: string; accent: string }> = {
  sport: { gradientA: '#e8f5e0', gradientB: '#f4f8f1', accent: '#4d7f16' },
  culture: { gradientA: '#fdf6e0', gradientB: '#f8f6f0', accent: '#c2860e' },
  formation: { gradientA: '#e0f0f5', gradientB: '#f0f4f6', accent: '#1a6070' },
  musique: { gradientA: '#fde8ed', gradientB: '#f8f4f5', accent: '#b83a5c' },
  ecologie: { gradientA: '#e0f5e8', gradientB: '#f1f6f2', accent: '#2c7a4a' },
  benevolat: { gradientA: '#e8f5ec', gradientB: '#f2f6f3', accent: '#2c7a4a' },
};

function getCategoryLabel(category: string, locale: Locale): string {
  return CATEGORY_LABELS[category]?.[locale] ?? category;
}

function getTheme(category: string) {
  return CARD_THEMES[category] ?? CARD_THEMES.formation;
}

function formatPlaces(slotsLeft: number, locale: Locale): string {
  if (slotsLeft <= 0) {
    if (locale === 'ar') return 'مكتمل';
    if (locale === 'tzm') return 'ⵢⴻⵛⵄⴰ';
    return 'Complet';
  }
  if (locale === 'ar') return `${slotsLeft} أماكن`;
  if (locale === 'tzm') return `${slotsLeft} ⵉⴷⵉⴳⴻⵏ`;
  return `${slotsLeft} places`;
}

function IconButton({
  icon: Icon,
  onPress,
  accessibilityLabel,
  variant,
}: {
  icon: typeof Heart;
  onPress: () => void;
  accessibilityLabel: string;
  variant: 'like' | 'dislike';
}) {
  const { colors } = useTheme();
  const isLike = variant === 'like';
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={({ pressed }) => [
        styles.actionButton,
        isLike ? styles.actionButtonLike : [styles.actionButtonDislike, { backgroundColor: colors.canvas }],
        pressed && styles.actionButtonPressed,
      ]}
    >
      <Icon size={32} color={isLike ? '#3f6a13' : colors.ink} strokeWidth={2.4} />
    </Pressable>
  );
}

export function OpportunityCard({
  opportunity,
  locale,
  onLike,
  onDislike,
  onSeeMore,
}: OpportunityCardProps) {
  const theme = getTheme(opportunity.category);
  const { colors } = useTheme();
  const categoryLabel = getCategoryLabel(opportunity.category, locale);
  const placesLabel = formatPlaces(opportunity.slotsLeft, locale);
  const likeLabel = t(locale, 'discovery.like');
  const dislikeLabel = t(locale, 'discovery.dislike');
  const seeMoreLabel = locale === 'fr' ? 'Voir plus' : locale === 'ar' ? 'المزيد' : 'ⵥⵕ ⵓⴳⴰⵔ';

  return (
    <View style={[styles.card, { backgroundColor: colors.canvas, borderColor: colors.cardBorder, shadowColor: colors.cardShadow }]}>
      <View style={[styles.headerGradient, { backgroundColor: theme.gradientA }]}>
        <View style={[styles.headerBottom, { backgroundColor: theme.gradientB }]} />
      </View>

      <View style={styles.body}>
        <View style={[styles.categoryBadge, { backgroundColor: theme.accent }]}>
          <Text style={styles.categoryBadgeText} maxFontSizeMultiplier={1.2} numberOfLines={1}>
            {categoryLabel}
          </Text>
        </View>

        <Text style={[styles.title, { color: colors.ink }]} maxFontSizeMultiplier={1.2} numberOfLines={3}>
          {opportunity.title}
        </Text>

        <View style={styles.metaRow}>
          <MapPin size={15} color={colors.mute} strokeWidth={2} />
          <Text style={[styles.metaText, { color: colors.body }]} maxFontSizeMultiplier={1.2} numberOfLines={1}>
            {opportunity.establishmentName}
          </Text>
        </View>

        <View style={styles.metaRow}>
          <Clock3 size={15} color={colors.mute} strokeWidth={2} />
          <Text style={[styles.metaText, { color: colors.body }]} maxFontSizeMultiplier={1.2} numberOfLines={1}>
            {opportunity.date}
          </Text>
          <Text style={[styles.metaDot, { color: colors.mute }]} maxFontSizeMultiplier={1.2}>
            {'  \u2022  '}
          </Text>
          <Text style={[styles.metaText, { color: colors.body }]} maxFontSizeMultiplier={1.2} numberOfLines={1}>
            {opportunity.distance}
          </Text>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={seeMoreLabel}
          onPress={onSeeMore}
          style={({ pressed }) => [styles.seeMore, pressed && styles.seeMorePressed]}
        >
          <Text style={[styles.seeMoreText, { color: colors.brandLink }]} maxFontSizeMultiplier={1.2}>
            {seeMoreLabel}
          </Text>
          <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={colors.brandLink} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
            <Path d="m9 18 6-6-6-6" />
          </Svg>
        </Pressable>

        <View style={styles.tagsRow}>
          <Tag label={categoryLabel} variant="solid" accessibilityLabel={`Catégorie : ${categoryLabel}`} />
          <Tag label={opportunity.distance} variant="soft" accessibilityLabel={`Distance : ${opportunity.distance}`} />
          <Tag label={placesLabel} variant={opportunity.slotsLeft > 0 ? 'outline' : 'soft'} accessibilityLabel={`Places : ${placesLabel}`} />
        </View>
      </View>

      <View style={styles.actionsRow}>
        <IconButton icon={X} onPress={onDislike} variant="dislike" accessibilityLabel={dislikeLabel} />
        <Text style={[styles.actionDivider, { color: colors.mute }]} maxFontSizeMultiplier={1.2}>
          {locale === 'fr' ? 'Balaye ou appuie' : locale === 'ar' ? 'اسحب أو اضغط' : 'ⵙⵡⵉⵀ ⵏⴻⵖ ⴰⴹⵙ'}
        </Text>
        <IconButton icon={Heart} onPress={onLike} variant="like" accessibilityLabel={likeLabel} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    shadowOpacity: 0.22,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  headerGradient: {
    height: 140,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  body: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    borderRadius: 9999,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xxs + 2,
    marginBottom: spacing.md,
  },
  categoryBadgeText: {
    ...typography['body-sm-strong'],
    color: '#ffffff',
    fontSize: 13,
  },
  title: {
    ...typography['display-xs'],
    fontSize: 26,
    lineHeight: 33,
    marginBottom: spacing.md,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  metaText: {
    ...typography['body-md'],
  },
  metaDot: {
    ...typography['body-md'],
  },
  seeMore: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: spacing.xxs,
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderRadius: 10,
  },
  seeMorePressed: {
    opacity: 0.7,
  },
  seeMoreText: {
    ...typography['body-md-strong'],
    fontSize: 16,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: '#f0ede4',
    gap: spacing.sm,
  },
  actionButton: {
    width: 72,
    height: 72,
    borderRadius: 72,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonLike: {
    backgroundColor: '#99e65f',
    borderColor: '#99e65f',
    shadowColor: '#9cd85c',
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  actionButtonDislike: {
    borderColor: '#ece9de',
  },
  actionButtonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.96 }],
  },
  actionDivider: {
    ...typography['body-sm'],
  },
});
