import Counter from "../../../Utils/Counter.js"
import { GameObject } from "../../../Utils/GameObject.js"
import Animation from "../../Animation/Animation.js"
import Camera from "../../Basics/Camera.js"
import Entity, { EntityInterface } from "../Entity.js"
import Player from "../Player.js"

export interface SlimeInterface extends EntityInterface {
    
    quantity: number

}

class Slime extends Entity {

    private animation = new Animation()
    public static SpriteIcon = [ 1, 158, 48, 42 ]

    private counter

    constructor( props: SlimeInterface ){

        // props.solid = true
        
        // props.mass = 1

        super( props )

        this.setSpeed( 4.5 )

        this.fillSprites()

        this.animation.playAnimation()

        this.counter = new Counter( 20, () => {

            this.animation.playAnimation()

        })

        this.setGameObjectID( GameObject.Slime )

    }

    private fillSprites(){

        const anim = this.animation

        anim.createAnimations( 'jump' )

        anim.forSprites( 1,  158, 48, 42, 3, "jump", 5 )

    }

    public render( ctx: CanvasRenderingContext2D, cam: Camera, spriteSheet: HTMLImageElement ){

        this.renderMe( ctx, cam )

        const pos = cam.subtract( this )

        const frame = this.animation.getFrameCoords()

        ctx.drawImage( spriteSheet, frame[0], frame[1], frame[2], frame[3], pos.x, pos.y, pos.w, pos.h  )
            
    }

    private jumpCooldown = 0

    private jump(){

        // @ts-ignore
        const player = window.game.player as Player
        
        const dx = ( player.getMiddleX() > this.getMiddleX() ? 1 : -1 ) * this.getSpeed()
        const dy = ( player.getMiddleY() > this.getMiddleY() ? 1 : -1 ) * this.getSpeed()
        

        // this.getAcceleration().applyX( dx )
        // this.getAcceleration().applyY( dy )

        this.getAcceleration().apply( dx, dy )

    }

    public tick(){
        
        this.updatePosition()

        
        if( this.jumpCooldown > 50 + Math.random() * 20 ){
            this.jumpCooldown = 0
            this.animation.playAnimation()

            this.jump()

        }

        this.jumpCooldown++


        if( this.animation.isRunning() ){
            
            const finished = this.animation.stepAnimationDelay()

            this.animation.setAnimationRunning( !finished )

        }


    }

    public setJumpCooldown = ( b: number ) => this. jumpCooldown = b

}

export default Slime