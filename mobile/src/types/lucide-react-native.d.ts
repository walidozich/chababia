declare module 'lucide-react-native' {
  import type { FunctionComponent } from 'react';
  import type { SvgProps } from 'react-native-svg';

  export interface LucideProps extends SvgProps {
    size?: number;
    color?: string;
    strokeWidth?: number;
    absoluteStrokeWidth?: boolean;
  }

  export const Mail: FunctionComponent<LucideProps>;
  export const Eye: FunctionComponent<LucideProps>;
  export const EyeOff: FunctionComponent<LucideProps>;
  export const Search: FunctionComponent<LucideProps>;
  export const Palette: FunctionComponent<LucideProps>;
  export const GraduationCap: FunctionComponent<LucideProps>;
  export const Coffee: FunctionComponent<LucideProps>;
  export const ArrowRight: FunctionComponent<LucideProps>;
  export const Heart: FunctionComponent<LucideProps>;
  export const X: FunctionComponent<LucideProps>;
  export const MapPin: FunctionComponent<LucideProps>;
  export const Clock3: FunctionComponent<LucideProps>;
  export const Info: FunctionComponent<LucideProps>;
  export const Check: FunctionComponent<LucideProps>;
  export const Phone: FunctionComponent<LucideProps>;
  export const Navigation: FunctionComponent<LucideProps>;
}
