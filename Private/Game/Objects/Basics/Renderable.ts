import Camera from "./Camera.js"
import Rect, { RectInterface } from "./Rect.js"

export interface RenderableObjectInterface extends RectInterface {
    solid ?: boolean
}

class RenderableObject extends Rect {

    private solid: boolean

    constructor( props : RenderableObjectInterface ){

        super( props )

        this.solid = props.solid ?? true

    }

    public tick(){}

    public render( ctx: CanvasRenderingContext2D, cam: Camera ){ }


    public getSolid = () => this.solid

    public setSolid = ( solid: boolean ) => this.solid = solid


}


export default RenderableObject