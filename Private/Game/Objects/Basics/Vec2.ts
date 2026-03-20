import Point2d from "./Point2d.js"

export interface Vec2Interface {
    dx?: number
    dy?: number
}

class Vec2 extends Point2d {

    constructor( x: number, y: number, dx? : number, dy? : number){

        super( x, y )

    }

    public setVector = ( dx: number, dy: number ) => {
        this.setX( dx )
        this.setY( dy )
    }

    public multiplyX = ( x: number ) => this.setX( this.getX() * x ) 
    public multiplyY = ( y: number ) => this.setY( this.getY() * y ) 

    public multiply( x: number, y: number ){
        this.multiplyX( x )
        this.multiplyY( y )
    }

    public get = () => ({ x: this.getX(), y: this.getY() })


}


export default Vec2