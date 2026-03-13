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

}


export default Vec2