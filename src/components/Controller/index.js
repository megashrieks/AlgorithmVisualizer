import React, { useContext } from 'react';
import { CanvasContext } from '../../contexts/CanvasContext';
import './Controller.css';
export default () => {
    let context = useContext(CanvasContext);
    return <div className="canvas-controller">
        <button onClick={() => {
            context.representation.circle(Math.random()*100,
                {
                    x: Math.random() * context.canvas.width,
                    y: Math.random() * context.canvas.height
                }).fill();
        }}>circle</button>
    </div>
}