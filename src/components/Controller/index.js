import React, {  useContext } from 'react';
import { CanvasContext } from '../../contexts/CanvasContext';
import { Node } from '../../contexts/CanvasContext/Representation/UserClasses';
import { GArray } from '../../contexts/CanvasContext/Representation/GArray';
import './Controller.css';
export default () => {
    let context = useContext(CanvasContext);
    return <div className="canvas-controller">
        <button onClick={() => {
            new Node(context.representation);
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
        <div>
        {(context.edge_selected || context.node_selected) && <div>
            <label>{(context.edge_selected && "weight") || (context.node_selected && "value")}</label>
            <input value={context.element_value} onChange={({ target: { value } }) => {
                context.setValue(value);
                context.change_value(value);
            }} />
            </div>}
        </div>
        <div>
            <button onClick={() => {
                let arr = [];
                let x = Math.random() * 10;
                for (let i = 0; i < ~~x; ++i){
                    let y = Math.random() * 10;
                    let tarr = [];
                    for (let j = 0; j < ~~y; ++j) tarr.push(~~(Math.random() * 500));
                    arr.push(tarr);
                }
                new GArray(context.representation, {
                    value: arr,
                    dimensions: 2,
                    measure:{x:50,y:30}
                });
                context.representation.draw();
            }}>GArray</button>
        </div>
    </div>
}