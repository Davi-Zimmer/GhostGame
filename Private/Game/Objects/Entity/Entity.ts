import NormalizeVector from "../../Utils/Normalize.js";
import Camera from "../Basics/Camera.js";
import FisicObject, { FisicObjectInterface } from "../Basics/FisicObject.js";
import { RectInterface } from "../Basics/Rect.js";
import RenderableObject from "../Basics/Renderable.js";
import Vec2 from "../Basics/Vec2.js";

export interface EntityInterface extends FisicObjectInterface {
    color ?: string
    name  ?: EntityNames
}

export enum EntityNames {
    Unknown = "Unknown",
    Player  = "Player"
}

class Entity extends FisicObject {


    private color: string
    private name: string = "Unknown"

    constructor( props : EntityInterface ){

        super( props )

        this.color = props.color ?? 'red'
        this.name  = props.name  ?? EntityNames.Unknown

    }

    public renderMe( ctx: CanvasRenderingContext2D, cam: Camera ){

        ctx.fillStyle = this.color

        const pos = cam.subtract( this )

        ctx.fillRect( pos.x, pos.y, pos.w, pos.h )

    }
    
    public tick(){
        this.updatePosition()
    }

    public render( ctx: CanvasRenderingContext2D, cam: Camera ){

        this.renderMe( ctx, cam )
       
    }


    public getName  = () => this.name 
   
}

export default Entity