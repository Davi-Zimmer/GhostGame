import Player from "../Entity/Player.js"
import Rect from "./Rect.js"
import Vec2 from "./Vec2.js"

class Camera extends Vec2 {

    public followTargetOverlap = { x: 0, y: 0 }

    private zoom: number

    private followTarget: Rect | null = null

    constructor( x: number, y: number, zoom?: number ){

        super( x, y )

        this.zoom = zoom ?? 1

    }

    public subtract( rect: Rect ){

        return {

            x: this.subtractX( rect.getX() ),
            y: this.subtractY( rect.getY() ),
            w: rect.getW() * this.zoom,
            h: rect.getH() * this.zoom

        }

    }

    public subtractX = ( x: number ) =>  x - this.getX()
    public subtractY = ( y: number ) =>  y - this.getY()

    private lerp( start: number, end: number, t: number ) {
        return start + (end - start) * t;
    }

    private getTargetX = ( x: number, targ: Rect ) =>  ( x + targ.getW() / 2 ) - innerWidth / 2
    private getTargetY = ( y: number, targ: Rect ) =>  ( y + targ.getH() / 2 ) - innerHeight / 2

    public tick(){

        if( !this.followTarget ) return

        const xx = this.followTargetOverlap.x ? this.followTarget.getX() : this.followTarget.extractX()
        const yy = this.followTargetOverlap.y ? this.followTarget.getY() : this.followTarget.extractY()

        let x = this.getTargetX( xx, this.followTarget )
        let y = this.getTargetY( yy, this.followTarget )

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