import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useState, useCallback } from 'react';
import { colors, typography, spacing } from '../../src/design-system';
import {
  OpportunityItem,
  type OpportunityData,
} from '../../src/components/OpportunityItem';
import { Chip } from '../../src/components/Chip';

const MOCK_OPPORTUNITIES: OpportunityData[] = [
  {
    id: 'evt_1',
    title: 'Tournoi de Handball Inter-quartiers',
    category: 'Sport',
    distanceM: 1240,
    dateTs: 1751500800,
    slotsLeft: 8,
    establishmentName: 'Maison de Jeunes Bir Mourad Raïs',
  },
  {
    id: 'evt_2',
    title: 'Atelier de Photographie Numérique',
    category: 'Culture',
    distanceM: 850,
    dateTs: 1751587200,
    slotsLeft: 3,
    establishmentName: 'Maison de Jeunes Hydra',
  },
  {
    id: 'evt_3',
    title: 'Formation Initiation au Développement Web',
    category: 'Formation',
    distanceM: 2300,
    dateTs: 1751673600,
    slotsLeft: 12,
    establishmentName: 'Complexe Sportif Kouba',
  },
  {
    id: 'evt_4',
    title: 'Sortie Nature et Randonnée au Jardin d\'Essai',
    category: 'Loisirs',
    distanceM: 3400,
    dateTs: 1751760000,
    slotsLeft: 15,
    establishmentName: 'Maison de Jeunes El Harrach',
  },
  {
    id: 'evt_5',
    title: 'Club de Théâtre et Expression Artistique',
    category: 'Culture',
    distanceM: 560,
    dateTs: 1751846400,
    slotsLeft: 1,
    establishmentName: 'Maison de Jeunes Sidi M\'hamed',
  },
];

const CATEGORIES = ['Tout', 'Sport', 'Culture', 'Formation', 'Loisirs'];

export default function OpportunitiesScreen() {
  const [activeCategory, setActiveCategory] = useState('Tout');

  const filteredData =
    activeCategory === 'Tout'
      ? MOCK_OPPORTUNITIES
      : MOCK_OPPORTUNITIES.filter((o) => o.category === activeCategory);

  const handlePress = useCallback((id: string) => {
    console.log('Navigate to opportunity:', id);
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: OpportunityData }) => (
      <OpportunityItem opportunity={item} onPress={handlePress} />
    ),
    [handlePress]
  );

  return (
    <View style={styles.container}>
      <FlatList
        horizontal
        data={CATEGORIES}
        keyExtractor={(item) => item}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chips}
        renderItem={({ item }) => (
          <Chip
            label={item}
            selected={activeCategory === item}
            onPress={() => setActiveCategory(item)}
          />
        )}
      />
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.canvasSoft,
  },
  chips: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  list: {
    paddingBottom: spacing.xl,
  },
});
