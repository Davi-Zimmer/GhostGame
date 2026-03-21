import { clamp } from "../../Utils/Clamp.js";
import NormalizeVector from "../../Utils/Normalize.js";
import Camera from "../Basics/Camera.js";
import FisicObject, { FisicObjectInterface } from "../Basics/FisicObject.js";
import { RectInterface } from "../Basics/Rect.js";
import RenderableObject from "../Basics/Renderable.js";
import Vec2 from "../Basics/Vec2.js";

export interface EntityInterface extends FisicObjectInterface {
    color ?: string
}

export enum EntityNames {
    Unknown = "Unknown",
    Player  = "Player"
}

class Entity extends FisicObject {


    private color: string

    constructor( props : EntityInterface ){

        super( props )

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
   
}

export default Entity