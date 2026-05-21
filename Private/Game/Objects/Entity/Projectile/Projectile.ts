import Camera from "../../Basics/Camera.js"
import Collidable from "../../Basics/Collidable.js"
import FisicObject, { FisicObjectInterface } from "../../Basics/FisicObject.js"
import Entity from "../Entity.js"

interface ProjectileInterface extends FisicObjectInterface {
    sender: Entity
}


class Projectile extends FisicObject {

    constructor( props: ProjectileInterface ){

        super( props )

        this.setSolid( true )

        this.setFriction( 1 )

        this.getCollisionException().add( props.sender.getGameObjectID() )

    }

    public collisionTrigger( item: Collidable ): boolean {
        
        if( item instanceof Entity ){

            /// damage
            console.log( 'damage' )

            return true
        }

        return false

    }


    public tick(){

        this.updatePosition()

    }

    public render( ctx: CanvasRenderingContext2D, cam: Camera, spriteSheet: HTMLImageElement ) {
        
        const pos = cam.subtract( this )

        ctx.fillStyle = 'yellow'

        ctx.fillRect( pos.x, pos.y, pos.w, pos.h )

    }

}

export default Projectile