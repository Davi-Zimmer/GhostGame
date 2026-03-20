import Camera from "./Camera.js"
import Rect, { RectInterface } from "./Rect.js"

export interface RenderableObjectInterface extends RectInterface {
}

class RenderableObject extends Rect {

    constructor( props : RectInterface ){

        super( props )

    }

    public tick(){}

    public render( ctx: CanvasRenderingContext2D, cam: Camera ){ }

}


export default RenderableObject