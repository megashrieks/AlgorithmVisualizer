import React,{ useState, createContext } from 'react';
import { Representation } from './Representation/';
const CanvasContext = createContext();

const ContextProvider = ({ children }) => {
    let [state, setState] = useState({
        canvas: null,
        drawCtx: null,
        dimension: { width: 0, height: 0 },
        representation:null
    });
    const setCanvas = can => {
        let canvas = can;
        let dimension = {};
        dimension.width = can.width;
        dimension.height = can.height;

        let drawCtx = canvas.getContext("2d");
        let representation = new Representation(can, drawCtx);
        setState({
            canvas, dimension, drawCtx, representation
        });
    }

    return <CanvasContext.Provider value={{
        setCanvas, ...state
    }}>
        {children}
    </CanvasContext.Provider>
}

export { CanvasContext, ContextProvider };