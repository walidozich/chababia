import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import type { TranslationLanguage } from '@/types/collections'

const LANG_LABELS: Record<TranslationLanguage, string> = {
  fr: 'Français',
  ar: 'العربية',
  tzm: 'Tamazight',
}

interface LanguageTabsProps {
  languages?: TranslationLanguage[]
  defaultLanguage?: TranslationLanguage
  children: (lang: TranslationLanguage) => React.ReactNode
}

export function LanguageTabs({
  languages = ['fr', 'ar', 'tzm'],
  defaultLanguage = 'fr',
  children,
}: LanguageTabsProps) {
  return (
    <Tabs defaultValue={defaultLanguage}>
      <TabsList>
        {languages.map((lang) => (
          <TabsTrigger key={lang} value={lang}>
            {LANG_LABELS[lang]}
          </TabsTrigger>
        ))}
      </TabsList>
      {languages.map((lang) => (
        <TabsContent key={lang} value={lang}>
          <div dir={lang === 'ar' || lang === 'tzm' ? 'auto' : undefined}>{children(lang)}</div>
        </TabsContent>
      ))}
    </Tabs>
  )
}
