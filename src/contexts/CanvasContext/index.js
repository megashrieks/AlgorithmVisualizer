import React,{ useState, createContext } from 'react';
import { Representation } from './Representation/Representation';
import { Dispatcher } from './Representation/Dispatcher';
import {run} from './Representation/run'
const CanvasContext = createContext();

const ContextProvider = ({ children }) => {
    let [state, setState] = useState({
        canvas: null,
        drawCtx: null,
        dimension: { width: 0, height: 0 },
        representation: null,
        dispatcher: null,
        selected: false,
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
    const runProgram = async () => {
        await run({
            input: state.dispatcher.input,
            show: state.representation.add_to_queue,
            repr:state.representation
        });
        state.representation.start_execution();
    }
    return <CanvasContext.Provider value={{
        setCanvas,runProgram, ...state
    }}>
        {children}
    </CanvasContext.Provider>
}

export { CanvasContext, ContextProvider };