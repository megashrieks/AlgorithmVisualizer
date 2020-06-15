import React,{ createContext } from 'react';

const CanvasContext = createContext();

const ContextProvider = ({ children }) => {
    let canvas = null;
    let drawCtx = null;
    let dimension = { width: 0, height: 0 };
    const setCanvas = can => {
        canvas = can;
        dimension.width = can.width;
        dimension.height = can.height;

        drawCtx = canvas.getContext("2d");
        
        drawCtx.fillStyle = "#eee";
        drawCtx.fillRect(0, 0, can.width, can.height);
    }

    return <CanvasContext.Provider value={{
        canvas, setCanvas, drawCtx
    }}>
        {children}
    </CanvasContext.Provider>
}

export { CanvasContext, ContextProvider };