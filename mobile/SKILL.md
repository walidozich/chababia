# Chababia Mobile — Skill Activation Mandate

> **Ce fichier est chargé à chaque prompt. Il dicte l'activation obligatoire
> de TOUS les skills avant toute génération de code.**

---

## 🔴 RÈGLE IMPÉRATIVE

**Avant chaque réponse contenant du code, du design, de l'architecture ou
une décision technique, le modèle DOIT activer les 13 skills ci-dessous.**

Aucune exception. Aucune shortcut. Aucune réponse sans skills activés.

---

## 📋 SKILLS OBLIGATOIRES

| Ordre | Skill | Source | Rôle |
|-------|-------|--------|------|
| 1 | `frontend-design` | anthropics/skills | UX patterns frontend |
| 2 | `vercel-react-best-practices` | vercel-labs/agent-skills | Best practices React |
| 3 | `web-design-guidelines` | vercel-labs/agent-skills | Design guidelines |
| 4 | `grill-me` | mattpocock/skills | **Revue TypeScript — code review critique obligatoire** |
| 5 | `impeccable` | pbakaus/impeccable | Qualité de code |
| 6 | `ui-ux-polish` | oakoss/agent-skills | Polish UI/UX |
| 7 | `ui-ux-designer` | sickn33/antigravity-awesome-skills | Design UI/UX |
| 8 | `uxui-principles` | sickn33/antigravity-awesome-skills | Principes UX/UI |
| 9 | `ui-ux-reviewer` | arjenschwarz/agentic-coding | Revue UI/UX |
| 10 | `vercel-react-native-skills` | vercel-labs/agent-skills | Expertise React Native |
| 11 | `react-native-best-practices` | callstackincubator/agent-skills | Best practices RN |
| 12 | `react-native-design` | wshobson/agents | Design RN mobile-first |
| 13 | `react-native-architecture` | wshobson/agents | Architecture RN |

---

## 🔄 WORKFLOW D'ACTIVATION

```
[Prompt] → [Skills: ALL 13] → [DESIGN.md validation] → [Code generation] → [grill-me review] → [Output]
```

1. **Skills :** Activer les 13 skills. `grill-me` est particulièrement critique
   car il audite le TypeScript et détecte les bugs avant l'output.
2. **Design.md :** Valider que chaque composant respecte `DESIGN.md` (couleurs, typo, spacing, radius).
3. **PRD.md :** Valider que chaque feature respecte les user stories et contraintes Green Tech.
4. **Génération :** Produire le code en respectant :
   - StyleSheet natif (pas de lib UI tierce)
   - Fetch natif (pas d'Axios)
   - TypeScript strict
   - `accessibilityLabel` sur tout élément interactif
   - Mobile-first : `useWindowDimensions`, `SafeAreaView`, `maxFontSizeMultiplier`
5. **Grill-me :** Passer le code en revue TypeScript avant output. Vérifier :
   - Pas de `any`
   - Pas de `as` cast abusif
   - Pas de `null` non géré
   - Types exportés correctement
   - Hooks customs dans `useCallback`/`useMemo` quand nécessaire

---

## 🚫 INTERDICTIONS

- ❌ Générer du code sans activer les 13 skills
- ❌ Utiliser une librairie UI tierce (NativeWind, Tamagui, etc.)
- ❌ Utiliser Axios
- ❌ Ignorer `DESIGN.md`
- ❌ Ajouter des features hors PRD
- ❌ Ignorer les contraintes Green Tech
- ❌ Rendre une carte interactive par défaut
- ❌ Ajouter des images dans la liste
- ❌ Faire du polling réseau

---

## ✅ CHECKLIST PRE-COMMIT

- [ ] 13 skills activés
- [ ] DESIGN.md respecté
- [ ] TypeScript strict, 0 `any`
- [ ] `StyleSheet.create()` pour tous les styles
- [ ] `accessibilityLabel` sur tout élément interactif
- [ ] `maxFontSizeMultiplier={1.3}` sur tout `Text`
- [ ] `SafeAreaView` présent
- [ ] `numberOfLines` + `ellipsizeMode` sur tout texte
- [ ] RTL support via `I18nManager.isRTL`
- [ ] 0 librairie UI tierce
- [ ] Fetch natif, pas d'Axios
