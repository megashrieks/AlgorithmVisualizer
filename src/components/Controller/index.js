import React, {  useContext } from 'react';
import { CanvasContext } from '../../contexts/CanvasContext';
import { GNode } from '../../contexts/CanvasContext/Representation/Representation';
import './Controller.css';
export default () => {
    let context = useContext(CanvasContext);
    return <div className="canvas-controller">
        <button onClick={() => {
            new GNode(context.representation);
            context.representation.draw();
        }}>GNode</button>

        <button onClick={() => {
            context.dispatcher.createDirectedEdge();
        }}>DEdge</button>
        <button onClick={() => {
            context.dispatcher.createUnDirectedEdge();
        }}>UDEdge</button>
        <button onClick={() => {
            context.dispatcher.removeElement();
        }}>Remove Element</button>
        <button onClick={() => context.runProgram()}>Run Program</button>
        {(context.edge_selected || context.node_selected) && <div>
            <label>{(context.edge_selected && "weight") || (context.node_selected && "value")}</label>
            <input value={context.element_value} onChange={({ target: { value } }) => {
                context.setValue(value);
                context.change_value(value);
            }} />
        </div>}
    </div>
}