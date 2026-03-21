import Camera from "./Camera.js"
import Rect, { RectInterface } from "./Rect.js"

export interface RenderableObjectInterface extends RectInterface {
    name         ?: string
    uniqueSprite ?: [ number, number, number, number ]

}

class RenderableObject extends Rect {

    private name: string

    private uniqueSprite: [ number, number, number, number ]

    constructor( props : RenderableObjectInterface ){

        super( props )

        this.name = props.name ?? "Unknown"

        this.uniqueSprite = props.uniqueSprite ?? [ 0, 0, 0, 0 ]

    }

    public tick(){}

    public render( ctx: CanvasRenderingContext2D, cam: Camera, spriteSheet: HTMLImageElement ){ }

    public getName = () => this.name 

    public setUniqueSprite = ( x: number, y: number, w: number, h: number ) => this.uniqueSprite = [ x, y, w, h ] 

    public getUniqueSprite = () => this.uniqueSprite

    public getSolid = () => false 

}


export default RenderableObject