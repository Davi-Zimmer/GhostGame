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

        this.setMass( 1 )

        this.setCanOverlapOthers( false )

        this.setCanPushOthers( false )

    }

    public collisionTrigger( item: Collidable ): boolean {
        
        this.acceleration.setVector( 0, 0 )

        if( item instanceof Entity ){

            console.log( 'damage' )

            return true
        }

        return true

    }


    public tick(){

        this.setX( this.getX() + this.acceleration.getX() * this.getSpeed() )
        this.setY( this.getY() + this.acceleration.getY() * this.getSpeed() )

        // this.updatePosition()
        // console.log( this.getSpeed() )

    }

    public render( ctx: CanvasRenderingContext2D, cam: Camera, spriteSheet: HTMLImageElement ) {
        
        const pos = cam.subtract( this )

        ctx.fillStyle = 'yellow'

        ctx.fillRect( pos.x, pos.y, pos.w, pos.h )

    }

}

export default Projectile