import Rect from "./Rect.js"
import Vec2 from "./Vec2.js"

class Camera extends Vec2 {

    private zoom: number

    private followTarget: Rect | null = null

    constructor( x: number, y: number, zoom?: number ){

        super( x, y )

        this.zoom = zoom ?? 1

    }

    public subtract( rect: Rect ){

        return {

            x: rect.getX() - this.getX(),
            y: rect.getY() - this.getY(),
            w: rect.getW() * this.zoom,
            h: rect.getH() * this.zoom

        }

    }

    private lerp( start: number, end: number, t: number ) {
        return start + (end - start) * t;
    }

    public tick(){

        if( !this.followTarget ) return

        const x = ( this.followTarget.extractX() + this.followTarget.getW() / 2) - innerWidth  / 2
        const y = ( this.followTarget.extractY() + this.followTarget.getH() / 2) - innerHeight / 2

        this.setX( this.lerp( this.getX(), x, .3 ) )
        this.setY( this.lerp( this.getY(), y, .3 ) )

    }

    public startFollow( target: Rect | null ){
    
        this.followTarget = target 
    
    }

    public isFollowing = () => !!this.followTarget

    public getZoom = () => this.zoom
    public setZoom = ( zoom: number ) => this.zoom = zoom

}


export default Camera