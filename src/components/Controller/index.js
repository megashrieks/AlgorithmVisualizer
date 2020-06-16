import React, { useContext } from 'react';
import { CanvasContext } from '../../contexts/CanvasContext';
import { GNode } from '../../contexts/CanvasContext/Representation';
import './Controller.css';
export default () => {
    let context = useContext(CanvasContext);
    return <div className="canvas-controller">
        <button onClick={() => {
            new GNode(context.representation);
            context.representation.draw();
        }}>circle</button>
    </div>
}