import Camera from "../Basics/Camera.js";
import { RectInterface } from "../Basics/Rect.js";
import RenderableObject from "../Basics/Renderable.js";
import Vec2 from "../Basics/Vec2.js";

export interface EntityInterface extends RectInterface {
    speed ?: number
    color ?: string
    name  ?: EntityNames
}

export enum EntityNames {
    Unknown = "Unknown",
    Player  = "Player"
}

class Entity extends RenderableObject {

    private speed: number

    private color: string

    private name: string = "Unknown"

    // [ 1000.5, 50 ]
    protected acceleration: Vec2 = new Vec2( 0, 0 )

    // [ -1, 1 ]
    protected orientation: Vec2 = new Vec2( 0, 0 )

    constructor( props : EntityInterface ){

        super( props )

        this.color = props.color ?? 'red'
        this.name  = props.name ?? EntityNames.Unknown
        this.speed = props.speed ?? 1

    }

    public renderMe( ctx: CanvasRenderingContext2D, cam: Camera ){

        ctx.fillStyle = this.color

        const pos = cam.subtract( this )

        ctx.fillRect( pos.x, pos.y, pos.w, pos.h )

    }

    public tick(){

    }

    public render( ctx: CanvasRenderingContext2D, cam: Camera ){

        this.renderMe( ctx, cam )
       
    }

    public getName  = () => this.name 
    public getSpeed = () => this.speed

    public setSpeed = ( s: number ) => this.speed = s

    public extractX = () => this.getX() + this.acceleration.getX() + this.orientation.getX() * this.getSpeed()
    public extractY = () => this.getY() + this.acceleration.getY() + this.orientation.getY() * this.getSpeed()

    public getOrientation  = () => this.orientation
    public getAcceleration = () => this.acceleration

}

export default Entity