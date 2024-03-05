// PalContext.js
import React, { createContext, useState } from 'react';

export const PalContext = createContext({
    sharedValue: '',
    updateSharedValue: () => {}
});

export const PalProvider = ({ children }) => {
    const [sharedValue, setSharedValue] = useState('初始值');

    const updateSharedValue = (value) => {
        setSharedValue(value);
    };

    return (
        <PalContext.Provider value={{ sharedValue, updateSharedValue }}>
            {children}
        </PalContext.Provider>
    );
};
