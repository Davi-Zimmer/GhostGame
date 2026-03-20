import Game from "../../Game.js"
import Camera from "../Basics/Camera.js"
import Entity, { EntityInterface } from "./Entity.js"

class Player extends Entity {

    constructor( props: EntityInterface ){

        super( props )

        const events = Game.GetInstance().events

        events.onPress( 'w', () => { this.up    (); this.playAnimation() } )
        events.onPress( 'a', () => { this.left  (); this.playAnimation() } )
        events.onPress( 's', () => { this.down  (); this.playAnimation() } )
        events.onPress( 'd', () => { this.right (); this.playAnimation() } )

        events.onUp( 'w', () => { this.orientation.setY( 0 ); ( this.stopAnimation() ) } )
        events.onUp( 'a', () => { this.orientation.setX( 0 ); ( this.stopAnimation() ) } )
        events.onUp( 's', () => { this.orientation.setY( 0 ); ( this.stopAnimation() ) } )
        events.onUp( 'd', () => { this.orientation.setX( 0 ); ( this.stopAnimation() ) } )

        this.setSpeed( 10 )

        this.setMass( 6 )

        this.fillSprites()
    }

    private playAnimation = () => this.animationRuning = true
    private stopAnimation = () => this.animationRuning = false

    private frame = 0
    private animationDelay = 0
    private animationName = "down"

    private animationRuning = false

    private sprites: Record< string, number[][] > = {
        up: [],
        down: []
    }

    private forSprites( x: number, y: number, w: number, h: number, frames: number, animationName: string, franeDelay: number ){

        this.sprites[ animationName ] = []

        for( let i = 0; i < frames; i++ ){

            this.sprites[ animationName ].push( [ x + i * w + i * 2, y, w, h, franeDelay ] )

        }

    }

    private setAnimationName( name: string ) {
       
        if( !this.sprites[ name ] ) return

        this.animationName = name

        this.stopAnimation()

    } 

    private nextFrame(){

        this.frame++

        if( this.frame > this.sprites[ this.animationName ].length -1 ){
            this.frame = 0
        }

    }

    private stepAnimationDelay(){
        
        this.animationDelay++

        if( this.animationDelay > this.sprites[ this.animationName ][this.frame][ 4 ] ){
            this.animationDelay = 0

            this.nextFrame()
        }

    }

    private getFrameCoords(){
        return this.sprites[ this.animationName ][ this.frame ]
    }

    private fillSprites(){

        this.sprites.down = []

       this.forSprites( 0,  0, 27, 36, 4, "down" , 5 )
       this.forSprites( 0, 37, 27, 36, 4, "left" , 5 )
       this.forSprites( 0, 75, 27, 36, 4, "right", 5 )
       this.forSprites( 0, 115, 27, 36, 4, "up"  , 5 )

    }

    public render( ctx: CanvasRenderingContext2D, cam: Camera, spriteSheet: HTMLImageElement  ){

        const pos = cam.subtract( this )
        const frame = this.getFrameCoords()

        ctx.drawImage( spriteSheet, frame[0], frame[1], frame[2], frame[3], pos.x, pos.y, pos.w, pos.h  )

        if( this.animationRuning ) {
            console.log("AAAA")
            this.stepAnimationDelay()
        }
    }

    public tick(){

        this.updatePosition()
        
    }

    private up    = () => this.orientation.setY( -1  ) && this.setAnimationName( "up"    )
    private left  = () => this.orientation.setX( -1  ) && this.setAnimationName( "left"  )
    private down  = () => this.orientation.setY(  1  ) && this.setAnimationName( "down"  )
    private right = () => this.orientation.setX(  1  ) && this.setAnimationName( "right" )

}


export default Player