import { DefaultTheme, DarkTheme } from '@react-navigation/native';

export const DimTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      primary: '#28c922',
      inactive: '#d1d1d1',
    }
  };
  
export const LightTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: '#28c922',
      inactive: '#000',
    }
  };