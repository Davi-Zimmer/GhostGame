import Camera from "../Basics/Camera.js"
import Collidable, { CollidableInterface } from "../Basics/Collidable.js"

export interface TileInterface extends CollidableInterface {
    spriteIndex  ?: number

}

class Tile extends Collidable {

    private spriteIndex: number

    constructor( props: TileInterface ){
        
        super( props )

        this.setType( props.type ?? "Tile" )
        this.spriteIndex = props.spriteIndex ?? 0

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
            spriteIndex: t.getSpriteIndex()

        } as TileInterface

    }


}

export default Tile