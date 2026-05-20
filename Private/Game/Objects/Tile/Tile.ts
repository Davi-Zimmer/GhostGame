import { GameObject } from "../../Utils/GameObject.js"
import Camera from "../Basics/Camera.js"
import Collidable, { CollidableInterface } from "../Basics/Collidable.js"

export interface TileInterface extends CollidableInterface {
    spriteIndex        ?: number
    collisionException ?: GameObject[]
    gameObject         ?: GameObject
    
}

class Tile extends Collidable {

    public static SpriteIcon = [ 184, 34, 32, 32 ]

    private spriteIndex: number
   
    private collisionException: Set<GameObject> 

    constructor( props: TileInterface ){
        
        super( props )

        this.setType( props.type ?? "Tile" )
        this.spriteIndex = props.spriteIndex ?? 0
        this.collisionException = new Set( props.collisionException ?? [] )

    }

    private renderMe( ctx: CanvasRenderingContext2D, cam: Camera, spriteSheet: HTMLImageElement  ){

        const sprite = this.getUniqueSprite()
        
        const pos = cam.subtract( this )

        ctx.drawImage( spriteSheet, sprite[0], sprite[1], sprite[2], sprite[3], pos.x, pos.y, pos.w + 1, pos.h + 1 )

    }

    public tick(){
        
    }

    public render( ctx: CanvasRenderingContext2D, cam: Camera, spriteSheet: HTMLImageElement ){

        this.renderMe( ctx, cam, spriteSheet)
        
    }


    public getSpriteIndex = () => this.spriteIndex
    public getCollisionException = () => this.collisionException

    public setUniqueSpriteList = ( s: number[] ) => this.setUniqueSprite( s[0], s[1], s[2], s[3] )

    public static ToJson( t: Tile ){

        return {
            x: t.getX(),
            y: t.getY(),
            z: t.getZ(),
            w: t.getW(),
            h: t.getH(),
            type: t.getType(),
            name: t.getName(),
            collision: t.useCollision(),
            solid: t.getSolid(),
            spriteIndex: t.getSpriteIndex(),
            gameObject: t.getGameObjectID()

        } as TileInterface

    }

}

export default Tile