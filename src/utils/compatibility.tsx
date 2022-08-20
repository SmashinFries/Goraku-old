import React, { useEffect, useState } from "react";
import { useWindowDimensions } from "react-native";

const calcColumns = (width: number, itemSize: number) => {
    return Math.floor(width / itemSize);
}

export const useDynamicColumns = (itemSize: number) => {
    // Get screen width
    const { width } = useWindowDimensions();
    const [listKey, setListKey] = useState(0);
    // Calculate number of columns based on item width and any margins
    const [numColumns, setNumColumns] = useState(calcColumns(width, itemSize));

    useEffect(() => {
        // Get random key to force re-render when screen width changes
        setListKey(Math.random() * (50 - 1) + 1);
        // 
        setNumColumns(calcColumns(width, itemSize));
    },[width]);

    return { numColumns, listKey };
}