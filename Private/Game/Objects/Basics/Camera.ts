import Rect from "./Rect.js"
import Vec2 from "./Vec2.js"

class Camera extends Vec2 {

    private zoom: number

    constructor( x: number, y: number, zoom?: number ){

        super( x, y )

        this.zoom = zoom ?? 1

    }

    public subtract( rect: Rect ){

        return {

            x: rect.getX() - this.getX() + this.getX(),
            y: rect.getY() - this.getY() + this.getY(),
            w: rect.getW() * this.zoom,
            h: rect.getH() * this.zoom
            
        }

    }


    public getZoom = () => this.zoom
    public setZoom = ( zoom: number ) => this.zoom = zoom
    

}


export default Camera