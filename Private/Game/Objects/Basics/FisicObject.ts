import { GameObject } from "../../Utils/GameObject.js";
import NormalizeVector from "../../Utils/Normalize.js";
import Collidable, { CollidableInterface } from "./Collidable.js";
import SimplePoint from "./SimpleRect.js";
import Vec2 from "./Vec2.js";

export interface FisicObjectInterface extends CollidableInterface {
    mass               ?: number
    speed              ?: number
    friction           ?: number
    collisionException ?: GameObject[]
    acceleration       ?: [ number, number ]
}

class FisicObject extends Collidable {

    private mass  : number
    private speed : number
    private friction: number
    private collisionException: Set< GameObject >
    private knockback: number = 1
    private fixed : boolean = false

    protected mask = new SimplePoint( 0, 0 )

    protected acceleration: Vec2 = new Vec2( 0, 0 ) // [ 1000.5, 50 ]
    protected orientation : Vec2 = new Vec2( 0, 0 ) // [ -1, 1 ]

    constructor( props: FisicObjectInterface ){

        super( props )

        this.mass  = props.mass  ?? 100
        this.speed = props.speed ?? 1

        this.friction = props.friction ?? .9

        this.collisionException = new Set( props.collisionException ?? [] )

        this.setGameObjectID( GameObject.None )

        if( props.acceleration ){
            this.getAcceleration().setVector( props.acceleration[ 0 ], props.acceleration[ 1 ] )
        } 

    }

    public getMass  = () => this.mass
    public getSpeed = () => this.speed
    public getAcceleration = () => this.acceleration
    public getOrientation  = () => this.orientation
    public getFriction = () => this.friction
    public getCollisionException = () => this.collisionException
    public getKnockback = () => this.knockback
    public getFixed = () => this.fixed

    public setMass  = ( mass : number )  => this.mass = mass
    public setSpeed = ( s: number ) => this.speed = s
    public setFriction = ( f: number) => this.friction = f
    public setKnockback = ( n: number ) => this.knockback = n
    public setFixed = ( b: boolean ) => this.fixed = b 

    public applyMass = ( mass : number )  => this.mass += mass

    protected updatePosition(){

        const vec = NormalizeVector (
            this.orientation.getX(),
            this.orientation.getY(),
            this.getSpeed()
        )

        this.setX( this.getX() + this.acceleration.getX() + vec.dx )
        this.setY( this.getY() + this.acceleration.getY() + vec.dy )

        this.acceleration.multiply( this.friction, this.friction )
    }

    public extractX = () => (this.getX() + this.mask.x ) + this.acceleration.getX() + this.orientation.getX() * this.getSpeed()
    public extractY = () => (this.getY() + this.mask.y ) + this.acceleration.getY() + this.orientation.getY() * this.getSpeed()

    public extractW = () => this.getW() - this.mask.x * 2
    public extractH = () => this.getH() - this.mask.y * 2


    public pushX = ( direction: number, otherMass: number, knockback: number ) => {
        
        const inverseMass      = 1 / this.getMass()
        const otherInverseMass = 1 / otherMass

        if ( inverseMass === 0 ) return

        const force = knockback * ( inverseMass / ( inverseMass + otherInverseMass ) )

        this.acceleration.applyX( direction * force )

    }

    public pushY = ( direction: number, otherMass: number, knockback: number ) => {

        const inverseMass      = 1 / this.getMass()
        const otherInverseMass = 1 / otherMass

        if( inverseMass === 0 ) return

        const force = knockback * ( inverseMass / ( inverseMass + otherInverseMass ) )

        this.acceleration.applyY( direction * force )

    }



}


export default FisicObject