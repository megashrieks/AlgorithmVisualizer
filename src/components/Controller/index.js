import React, {  useContext } from 'react';
import { CanvasContext } from '../../contexts/CanvasContext';
import { Node, VArray } from '../../contexts/CanvasContext/Representation/UserClasses';
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
        {(context.selected) && <div>
            <label>value</label>
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
                let z = Math.random();
                for (let i = 0; i < ~~x; ++i){
                    let y = Math.random() * 10;
                    let tarr = [];
                    for (let j = 0; j < ~~y; ++j) tarr.push(~~(Math.random() * 500));
                    if (z > 0.5) arr.push(tarr);
                    else arr.push(tarr[0] || 1)
                }
                new VArray(context.representation, {
                    value: arr,
                    measure: { x: 30, y: 30 },
                    name:"Array-"+~~(Math.random()*20)
                });
                context.representation.draw();
            }}>GArray</button>
        </div>
    </div>
}