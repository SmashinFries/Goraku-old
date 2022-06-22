import { createContext, Dispatch, SetStateAction } from "react";

type RefreshContext = {
    refresh: boolean;
    setRefresh: Dispatch<SetStateAction<boolean>>;
}
export const RefreshContext = createContext<RefreshContext>({
    refresh: false, 
    setRefresh: () => {}
});

type ThemeContextType = {
    theme: string;
    setTheme: Dispatch<SetStateAction<string>>;
}
export const ThemeContext = createContext<ThemeContextType>({
    theme: '',
    setTheme: () => {}
});

type AccountContextType = {
    isAuth: boolean;
    setIsAuth: Dispatch<SetStateAction<boolean>>;
    isDevArtAuth?: boolean;
    setIsDevArtAuth?: Dispatch<SetStateAction<boolean>>;
}
export const AccountContext = createContext<AccountContextType>({
    isAuth: false, 
    setIsAuth: () => {},
    // isDevArtAuth: false,
    // setIsDevArtAuth: () => {},
});

type NotificationContextType = {
    isAllowed: boolean;
    toggleFetchTask: () => void;
}
export const NotificationContext = createContext<NotificationContextType>({
    isAllowed: false,
    toggleFetchTask: () => {}
});