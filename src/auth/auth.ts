import React, { useEffect, useState } from 'react';
import { getToken } from '../Storage/authToken';

export const useAnilistAuth = () => {
    const [isAuth, setIsAuth] = useState(false);

    useEffect(() => {
        getToken().then(token => (token) ? setIsAuth(true) : setIsAuth(false));
    },[]);

    return {isAuth, setIsAuth};

}