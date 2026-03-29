import Point3d from "./Point3d.js"

export interface RectInterface {
    x: number
    y: number
    z: number
    w: number
    h: number
    scale?: number
}

class Rect extends Point3d {
    
    private w: number 
    private h: number 
    // private scale: number


    constructor( props : RectInterface ){

        super( props.x, props.y, props.z )

        let multiplier = props.scale ?? 1 

        // this.scale = multiplier
        this.w = props.w //* multiplier
        this.h = props.h //* multiplier
    }

    public getW = () => this.w
    public getH = () => this.h
    // public getScale = () => this.scale

    public setW = ( w: number ) => this.w = w
    public setH = ( h: number ) => this.h = h
    // public setScale = ( s: number) => this.scale = s

    public ApllyW = ( w: number ) => this.w += w
    public ApllyH = ( h: number ) => this.h += h

}

export default Rect