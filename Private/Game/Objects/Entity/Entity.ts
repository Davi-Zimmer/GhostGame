import { GameObject } from "../../Utils/GameObject.js";
import Camera from "../Basics/Camera.js";
import FisicObject, { FisicObjectInterface } from "../Basics/FisicObject.js";
import SimplePoint from "../Basics/SimpleRect.js";

export interface EntityInterface extends FisicObjectInterface {
    color      ?: string
    gameObject ?: GameObject

}

export enum EntityNames {
    Unknown = "Unknown",
    Player  = "Player"
}

class Entity extends FisicObject {

    private color: string
    public static SpriteIcon = [ 184, 34, 32, 32 ]

    constructor( props : EntityInterface ){

        super( props )
        
        this.setType( props.type ?? "Entity" )

        this.color = props.color ?? 'red'

    }

    public renderMe( ctx: CanvasRenderingContext2D, cam: Camera ){
        
        ctx.fillStyle = this.color
        const pos = cam.subtract( this )
        // ctx.fillRect( pos.x + cam.getX() / this.getZ(), pos.y +  cam.getY() / this.getZ(), pos.w, pos.h )
        
        ctx.fillRect( pos.x , pos.y , pos.w, pos.h )

    }
    
    public tick(){
        this.updatePosition()
    }

    public render( ctx: CanvasRenderingContext2D, cam: Camera, spriteSheet: HTMLImageElement ){

        this.renderMe( ctx, cam )
       
    }

    public static ToJson( e: Entity ){
        return {
            x: e.getX(),
            y: e.getY(),
            z: e.getZ(),
            w: e.getW(),
            h: e.getH(),
            type: e.getType(),
            name: e.getName(),
            collision: e.useCollision(),
            solid: e.getSolid(),
            speed: e.getSpeed(),
            friction: e.getFriction(),
            color: e.color,
            mass: e.getMass(),
            gameObject: e.getGameObjectID()
        } as EntityInterface

    }

    public getMiddleX = () => this.extractX() + this.extractW() / 2
    public getMiddleY = () => this.extractY() + this.extractH() / 2

    

}

export default Entity