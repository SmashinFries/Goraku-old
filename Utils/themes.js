import { DefaultTheme, DarkTheme } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const themeColors = {
  prime: 'rgba(40, 201, 34, 1)',
  ocean: 'rgba(11, 168, 189, 1)',
  crimson: 'rgba(153, 0, 0, 1)',
  spooky: 'rgba(255, 132, 0, 1)',
  flamingo: 'rgba(252, 142, 172,1)',
};

// Light Theme
export const LightTheme = {
  ...DefaultTheme,
  dark: false,
  colors: {
    ...DefaultTheme.colors,
    primary: themeColors.prime,
    inactive: '#000',
  }
};

export const SpookyLightTheme = {
  ...DefaultTheme,
  dark: false,
  colors: {
    ...DefaultTheme.colors,
    primary: themeColors.spooky,
    inactive: '#000',
  }
};

export const OceanLightTheme = {
  ...DefaultTheme,
  dark: false,
  colors: {
    ...DefaultTheme.colors,
    primary: themeColors.ocean,
    inactive: '#000',
  }
};

export const CrimsonLightTheme = {
  ...DefaultTheme,
  dark: false,
  colors: {
    ...DefaultTheme.colors,
    primary: themeColors.crimson,
    inactive: '#000',
  }
};

export const FlamingoLightTheme = {
  ...DefaultTheme,
  dark: false,
  colors: {
    ...DefaultTheme.colors,
    primary: themeColors.flamingo,
    inactive: '#000',
  }
};

// Dark Theme
export const DimTheme = {
  ...DarkTheme,
  dark: true,
  colors: {
    ...DarkTheme.colors,
    primary: themeColors.prime,
    inactive: '#d1d1d1',
  }
};

export const SpookyDarkTheme = {
  ...DarkTheme,
  dark: true,
  colors: {
    ...DarkTheme.colors,
    primary: themeColors.spooky,
    inactive: '#d1d1d1',
  }
};

export const OceanDarkTheme = {
  ...DarkTheme,
  dark: true,
  colors: {
    ...DarkTheme.colors,
    primary: themeColors.ocean,
    inactive: '#d1d1d1',
  }
};

export const CrimsonDarkTheme = {
  ...DarkTheme,
  dark: true,
  colors: {
    ...DarkTheme.colors,
    primary: themeColors.crimson,
    inactive: '#d1d1d1',
  }
};

export const FlamingoDarkTheme = {
  ...DarkTheme,
  dark: true,
  colors: {
    ...DarkTheme.colors,
    primary: themeColors.flamingo,
    inactive: '#d1d1d1',
  }
};

// Theme Array
export const themes = [
  { theme: 'Light', object:LightTheme, title:'Default'},
  { theme: 'Light Crimson', object:CrimsonLightTheme, title:'Crimson'},
  { theme: 'Light Ocean', object:OceanLightTheme, title:'Ocean'},
  { theme: 'Light Spooky', object:SpookyLightTheme, title:'Spooky'},
  { theme: 'Light Flamingo', object:FlamingoLightTheme, title:'Flamingo'},
  { theme: 'Dark', object:DimTheme, title:'Default'}, 
  { theme: 'Dark Crimson', object:CrimsonDarkTheme, title:'Crimson'},
  { theme: 'Dark Ocean', object:OceanDarkTheme, title:'Ocean'},
  { theme: 'Dark Spooky', object:SpookyDarkTheme, title:'Spooky'},
  { theme: 'Dark Flamingo', object:FlamingoDarkTheme, title:'Flamingo'},
];

// Get Theme
export const getTheme = async () => {
  try {
    const themeSet = await AsyncStorage.getItem('@Theme');
    let currentTheme = {theme: '', object:{}};
    if (typeof themeSet === 'string') {
      for (let thm in themes) {
        if (themeSet === themes[thm].theme) {
          currentTheme = themes[thm];
          break;
        }
      }
    }
    if (typeof themeSet !== 'string') {
      currentTheme = themes[0];
      await AsyncStorage.setItem('@Theme', themes[0].theme);
    }
    return currentTheme;
  } catch (e) {
    console.error(e);
  }
}