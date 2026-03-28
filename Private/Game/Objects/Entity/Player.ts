import Game from "../../Game.js"
import Animation from "../Animation/Animation.js"
import Camera from "../Basics/Camera.js"
import Entity, { EntityInterface } from "./Entity.js"

class Player extends Entity {

    private animation = new Animation()

    constructor( props: EntityInterface ){

        super( props )

        const events = Game.GetInstance().events

        const playAnim = () => this.animation.playAnimation()
        const stopAnim = () => this.animation.stopAnimation()

        events.onPress( 'w', () => { this.up    (); playAnim() } )
        events.onPress( 'a', () => { this.left  (); playAnim() } )
        events.onPress( 's', () => { this.down  (); playAnim() } )
        events.onPress( 'd', () => { this.right (); playAnim() } )

        events.onUp( 'w', () => { this.orientation.setY( 0 ); ( stopAnim() ) } )
        events.onUp( 'a', () => { this.orientation.setX( 0 ); ( stopAnim() ) } )
        events.onUp( 's', () => { this.orientation.setY( 0 ); ( stopAnim() ) } )
        events.onUp( 'd', () => { this.orientation.setX( 0 ); ( stopAnim() ) } )

        this.setSpeed( 10 )

        this.setMass( 6 )

        this.fillSprites()

        const scale = 3
        
        const w = 27 * scale
        const h = 36 * scale



        this.setW( w )
        this.setH( h )
    }

    private fillSprites(){
        const anim = this.animation

        anim.createAnimations( 'up', 'down', 'left', 'right' )

        anim.forSprites( 0,  0, 27, 36, 4, "down" , 5 )
        anim.forSprites( 0, 37, 27, 36, 4, "left" , 5 )
        anim.forSprites( 0, 75, 27, 36, 4, "right", 5 )
        anim.forSprites( 0, 115, 27, 36, 4,"up"   , 5 )

    }

    public render( ctx: CanvasRenderingContext2D, cam: Camera, spriteSheet: HTMLImageElement  ){

        const pos = cam.subtract( this )
        const frame = this.animation.getFrameCoords()

        ctx.drawImage( spriteSheet, frame[0], frame[1], frame[2], frame[3], pos.x, pos.y, pos.w, pos.h  )

        if( this.animation.isRunning() ) this.animation.stepAnimationDelay()
    
    }

    public tick(){

        this.updatePosition()
        
    }

    private up    = () => this.orientation.setY( -1  ) && this.animation.changeAnimationTo( "up"    )
    private left  = () => this.orientation.setX( -1  ) && this.animation.changeAnimationTo( "left"  )
    private down  = () => this.orientation.setY(  1  ) && this.animation.changeAnimationTo( "down"  )
    private right = () => this.orientation.setX(  1  ) && this.animation.changeAnimationTo( "right" )

}


export default Player