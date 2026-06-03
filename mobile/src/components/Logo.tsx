import { Image, StyleSheet } from 'react-native';
import { Svg, Path, Circle } from 'react-native-svg';
import { useTheme } from '../theme/ThemeContext';

const logoFiles: { light: ReturnType<typeof require> | null; dark: ReturnType<typeof require> | null } = {
  light: null,
  dark: null,
};

try {
  logoFiles.light = require('@/assets/images/logo.png');
} catch {
  // fallback to SVG
}

try {
  logoFiles.dark = require('@/assets/images/logo1.png');
} catch {
  // fallback to SVG
}

function LogoSVG({ color = '#1e1e1e' }: { color?: string }) {
  return (
    <Svg width={74} height={22} viewBox="0 0 74 22" fill="none">
      <Path d="M4 16C8 8.8 13.5 5.2 20.5 5.2" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <Path d="M8.8 17.8c1.1-6 4.6-9.6 10.4-11" stroke={color} strokeWidth="2.1" strokeLinecap="round" />
      <Path d="M16 18.4c1-6.5 4.3-10.4 9.8-11.8" stroke={color} strokeWidth="2.1" strokeLinecap="round" />
      <Path d="M24.8 18.2c.9-6.4 4.1-10.1 9.4-11.5" stroke={color} strokeWidth="2.1" strokeLinecap="round" />
      <Path d="M33.8 17.8c1-5.8 4.1-9.2 9.1-10.4" stroke={color} strokeWidth="2.1" strokeLinecap="round" />
      <Circle cx="9.4" cy="15.9" r="0.9" fill={color} />
      <Circle cx="17.1" cy="14.7" r="0.9" fill={color} />
      <Circle cx="25.4" cy="13.8" r="0.9" fill={color} />
      <Circle cx="34" cy="13.1" r="0.9" fill={color} />
    </Svg>
  );
}

interface LogoProps {
  width?: number;
  height?: number;
}

export function Logo({ width = 74, height = 22 }: LogoProps) {
  const { isDark } = useTheme();

  const source = isDark ? logoFiles.dark : logoFiles.light;
  const svgColor = isDark ? '#9fe870' : '#1e1e1e';

  if (source) {
    return (
      <Image
        source={source}
        style={[styles.logo, { width, height }]}
        accessibilityRole="image"
        accessibilityLabel="Chababia logo"
        resizeMode="contain"
      />
    );
  }

  return <LogoSVG color={svgColor} />;
}

const styles = StyleSheet.create({
  logo: {},
});
