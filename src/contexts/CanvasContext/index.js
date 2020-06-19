import React,{ useState, createContext } from 'react';
import { Representation } from './Representation/';
import { Dispatcher } from './Representation/Dispatcher';
const CanvasContext = createContext();

const ContextProvider = ({ children }) => {
    let [state, setState] = useState({
        canvas: null,
        drawCtx: null,
        dimension: { width: 0, height: 0 },
        representation: null,
        dispatcher: null,
        edge_selected: false,
        node_selected: false,
        change_value: null,
        element_value:"",
    });
    const setValue = value => {
        setState(state => ({ ...state, element_value: value }));
    }
    const setCanvas = can => {
        let canvas = can;
        let dimension = {};
        dimension.width = can.width;
        dimension.height = can.height;

        let drawCtx = canvas.getContext("2d");
        let representation = new Representation(can, drawCtx);
        let dispatcher = new Dispatcher(representation, setState);
        setState({
            ...state, canvas, dimension, drawCtx, representation, dispatcher,setValue
        });
    }

    return <CanvasContext.Provider value={{
        setCanvas, ...state
    }}>
        {children}
    </CanvasContext.Provider>
}

export { CanvasContext, ContextProvider };