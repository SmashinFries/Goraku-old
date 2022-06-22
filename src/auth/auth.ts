import React, { useEffect, useState } from 'react';
import { getToken } from '../Storage/authToken';

export const useAnilistAuth = () => {
    const [isAuth, setIsAuth] = useState(false);

    useEffect(() => {
        getToken().then(token => (token) ? setIsAuth(true) : setIsAuth(false));
    },[]);

    return {isAuth, setIsAuth};

}

// export const useDevArtAuth = () => {
//     const [isDevArtAuth, setIsDevArtAuth] = useState(false);

//     useEffect(() => {
//         getDAToken().then(token => (token) ? setIsDevArtAuth(true) : setIsDevArtAuth(false));
//     },[]);

//     return {isDevArtAuth, setIsDevArtAuth};
// }