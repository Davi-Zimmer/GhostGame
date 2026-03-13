import Point3d from "./Point3d.js"

export interface RectInterface  {
    x: number
    y: number
    z: number
    w: number
    h: number
}

class Rect extends Point3d {
    
    private w: number 
    private h: number 

    constructor( props : RectInterface ){

        super( props.x, props.y, props.z )

        this.w = props.w
        this.h = props.h
    }


    public getW = () => this.w
    public getH = () => this.h

    public setW = ( w: number ) => this.w = w
    public setH = ( h: number ) => this.h = h

}

export default Rect