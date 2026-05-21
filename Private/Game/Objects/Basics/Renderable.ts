import { GameObject } from "../../Utils/GameObject.js"
import Camera from "./Camera.js"
import Rect, { RectInterface } from "./Rect.js"

export interface RenderableObjectInterface extends RectInterface {
    name         ?: string
    uniqueSprite ?: [ number, number, number, number ]
    type         ?: string
}

class RenderableObject extends Rect {

    private type: string

    private name: string

    private uniqueSprite: [ number, number, number, number ]
    private gameObjectID: GameObject = GameObject.None


    constructor( props : RenderableObjectInterface ){

        super( props )

        this.name = props.name ?? "Unknown"

        this.uniqueSprite = props.uniqueSprite ?? [ 0, 0, 0, 0 ]
        this.type = props.type ?? "RenderableObject"


    }

    public tick(){}

    public render( ctx: CanvasRenderingContext2D, cam: Camera, spriteSheet: HTMLImageElement ){

        const s = this.getUniqueSprite()

        const pos = cam.subtract( this )

        ctx.drawImage( spriteSheet, s[0], s[1], s[2], s[3], pos.x, pos.y, pos.w, pos.h )

    }

    public getName = () => this.name 
    public setName = ( n: string ) => this.name = n 

    public setUniqueSprite = ( x: number, y: number, w: number, h: number ) => this.uniqueSprite = [ x, y, w, h ] 
    public setUniqueSpriteList = ( s: number[] ) => this.setUniqueSprite( s[0], s[1], s[2], s[3] )

    public getUniqueSprite = () => this.uniqueSprite

    public getSolid = () => false 

    public getType = () => this.type
    public setType = ( t: string ) => this.type = t

    public static ToJson( e: RenderableObject ) {

        return {
            x: e.getX(),
            y: e.getY(),
            z: e.getZ(),
            w: e.getW(),
            h: e.getH(),
            name: e.getName(),
            solid: e.getSolid(),
        } as RenderableObjectInterface

    }

    public getGameObjectID = () => this.gameObjectID
    public setGameObjectID = ( id: GameObject ) => this.gameObjectID = id

}


export default RenderableObject