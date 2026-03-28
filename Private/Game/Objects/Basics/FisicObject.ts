import NormalizeVector from "../../Utils/Normalize.js";
import Collidable, { CollidableInterface } from "./Collidable.js";
import Vec2 from "./Vec2.js";

export interface FisicObjectInterface extends CollidableInterface {
    mass     ?: number
    speed    ?: number
    friction ?: number
}

class FisicObject extends Collidable {

    private mass  : number
    private speed : number
    private friction: number

    protected acceleration: Vec2 = new Vec2( 0, 0 ) // [ 1000.5, 50 ]
    protected orientation : Vec2 = new Vec2( 0, 0 ) // [ -1, 1 ]

    constructor( props: FisicObjectInterface ){

        super( props )

        this.mass  = props.mass  ?? 100
        this.speed = props.speed ?? 1

        this.friction = props.friction ?? .9

    }

    public getMass  = () => this.mass
    public getSpeed = () => this.speed
    public getAcceleration = () => this.acceleration
    public getOrientation  = () => this.orientation
    public getFriction = () => this.friction

    public setMass  = ( mass : number )  => this.mass = mass
    public setSpeed = ( s: number ) => this.speed = s
    public setFriction = ( f: number) => this.friction = f

    public applyMass = ( mass : number )  => this.mass += mass

    protected updatePosition(){

        const vec = NormalizeVector (
            this.orientation.getX(),
            this.orientation.getY(),
            this.getSpeed()
        )

        this.setX( this.getX() + this.acceleration.getX() + vec.dx )
        this.setY( this.getY() + this.acceleration.getY() + vec.dy )

        this.acceleration.multiply( .9, .9 )
    }

    public extractX = () => this.getX() + this.acceleration.getX() + this.orientation.getX() * this.getSpeed()
    public extractY = () => this.getY() + this.acceleration.getY() + this.orientation.getY() * this.getSpeed()

    public pushX = ( x: number ) => {
        const a = x / this.getMass()
        Math.abs( a ) > .5 ? this.getAcceleration().applyX( x ) : null
    }

    public pushY = ( y: number ) => {
        const a = y / this.getMass()
        Math.abs( a ) > .5 ? this.getAcceleration().applyY( a ) : null
    }

}


export default FisicObject