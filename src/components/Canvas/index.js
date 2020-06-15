import React, { createRef, useEffect, useContext } from 'react';
import { CanvasContext } from '../../contexts/CanvasContext';
import './Canvas.css';
export default () => {
    const parentRef = createRef();
    const canvasRef = createRef();
    const canvasctx = useContext(CanvasContext);
    useEffect(() => {
        canvasRef.current.width = parentRef.current.clientWidth;
        canvasRef.current.height = parentRef.current.clientHeight;

        canvasctx.setCanvas(canvasRef.current);

    }, [canvasRef, parentRef, canvasctx]);
    return <div className="canvas" ref = {parentRef}>
        <canvas ref={canvasRef}/>
    </div>
}