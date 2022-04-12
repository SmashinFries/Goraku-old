import { DarkTheme, DefaultTheme } from "@react-navigation/native"

type AvailableThemes = 'Light' | 'Dark' | 'Taco' | 'Noodles' | 'Water' | 'Alien' | 'Cupcake' | 'TacoDark' | 'NoodlesDark' | 'WaterDark' | 'AlienDark' | 'CupcakeDark';
// Light Color
const TacoTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: 'rgb(241, 191, 97)',
    }
}

const NoodlesTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: 'rgb(255, 37, 25)',
    }
}

const WaterTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: 'rgb(2, 186, 227)',
    }
}
// rgb(0, 255, 255)

const AlienTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: 'rgb(81, 173, 16)',
    }
}

const CupcakeTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: 'rgb(238, 130, 164)',
    }
}

// Dark Colors
const TacoDarkTheme = {
    ...DarkTheme,
    colors: {
        ...DarkTheme.colors,
        primary: 'rgb(241, 191, 97)',
    }
}

const NoodlesDarkTheme = {
    ...DarkTheme,
    colors: {
        ...DarkTheme.colors,
        primary: 'rgb(255, 37, 25)',
    }
}

const WaterDarkTheme = {
    ...DarkTheme,
    colors: {
        ...DarkTheme.colors,
        primary: 'rgb(2, 186, 227)',
    }
}

const AlienDarkTheme = {
    ...DarkTheme,
    colors: {
        ...DarkTheme.colors,
        primary: 'rgb(81, 173, 16)',
    }
}

const CupcakeDarkTheme = {
    ...DarkTheme,
    colors: {
        ...DarkTheme.colors,
        primary: 'rgb(238, 130, 164)',
    }
}

// Util
const themeSwitch = (name:string) => {
    switch(name) {
        case 'Light':
            return DefaultTheme;
        case 'Dark':
            return DarkTheme;
        case 'Taco':
            return TacoTheme;
        case 'Noodles':
            return NoodlesTheme;
        case 'Water':
            return WaterTheme;
        case 'Alien':
            return AlienTheme;
        case 'Cupcake':
            return CupcakeTheme;

        case 'TacoDark':
            return TacoDarkTheme;
        case 'NoodlesDark':
            return NoodlesDarkTheme;
        case 'WaterDark':
            return WaterDarkTheme;
        case 'AlienDark':
            return AlienDarkTheme;
        case 'CupcakeDark':
            return CupcakeDarkTheme;
    }
}

export {themeSwitch, AvailableThemes, TacoTheme, NoodlesTheme, WaterTheme, AlienTheme, CupcakeTheme, TacoDarkTheme, NoodlesDarkTheme, WaterDarkTheme, AlienDarkTheme, CupcakeDarkTheme};