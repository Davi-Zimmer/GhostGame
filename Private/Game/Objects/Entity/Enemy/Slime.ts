import Counter from "../../../Utils/Counter.js"
import Animation from "../../Animation/Animation.js"
import Camera from "../../Basics/Camera.js"
import Entity, { EntityInterface } from "../Entity.js"

export interface SlimeInterface extends EntityInterface {
    
    quantity: number

}

class Slime extends Entity {

    private animation = new Animation()

    private counter

    constructor( props: SlimeInterface ){

        super( props )

        this.fillSprites()

        this.animation.playAnimation()

        this.counter = new Counter( 20, () => {
            this.animation.playAnimation()
        })

    }

    private fillSprites(){

        const anim = this.animation

        anim.createAnimations( 'jump' )

        anim.forSprites( 1,  158, 48, 42, 3, "jump" , 5 )

    }

    public render( ctx: CanvasRenderingContext2D, cam: Camera, spriteSheet: HTMLImageElement ){

        const pos = cam.subtract( this )

        const frame = this.animation.getFrameCoords()

        ctx.drawImage( spriteSheet, frame[0], frame[1], frame[2], frame[3], pos.x, pos.y, pos.w, pos.h  )

        if( this.animation.isRunning() ){
            
            this.animation.stepAnimationDelay()

        }
            
    }

    public tick(){
        
        // this.counter.update()

    }


}

export default Slime