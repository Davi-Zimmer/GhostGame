import Game from "../../Game.js"
import { GameObject } from "../../Utils/GameObject.js"
import Animation from "../Animation/Animation.js"
import Camera from "../Basics/Camera.js"
import SimplePoint from "../Basics/SimpleRect.js"
import Entity, { EntityInterface } from "./Entity.js"
import Item from "./Items/Item.js"
import Projectile from "./Projectile/Projectile.js"


interface PlayerInterface extends EntityInterface {
    game: Game

}


class Player extends Entity {

    private animation = new Animation()

    public static SpriteIcon = [ 0, 0, 27, 36 ]

    private inventory: Item | null = null

    private game: Game

    constructor( props: PlayerInterface ){

        super( props )

        this.game = props.game

        this.setup()

        this.setGameObjectID( GameObject.Ghost )

    }

    private addEvents(){

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

        events.onMouseDown( 0, this.attack )

    }

    private setup(){

        this.addEvents()

        this.setSpeed( 10 )

        this.setMass( 6 )

        this.fillSprites()

        this.setSolid( true )

        const scale = 3
        
        const w = 27 * scale
        const h = 36 * scale

        this.setW( w )
        this.setH( h )

        this.mask.x = 10

        this.setType( 'Player' )

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

    private attack = ( e: MouseEvent ) => {
       
        const cam  = this.game.camera 

        const screenX = this.getX() - cam.getX()
        const screenY = this.getY() - cam.getY()

        const centerX = screenX + this.getW() / 2
        const centerY = screenY + this.getH() / 2

        const dx = e.clientX - centerX
        const dy = e.clientY - centerY

        const lenght = Math.hypot( dx, dy )

        const dir = new SimplePoint( dx / lenght, dy / lenght )
        
        const projectile = new Projectile({

            x: this.getMiddleX(),
            y: this.getMiddleY(),
            w: 10,
            h: 10,
            z: 100,
            sender: this,
            speed: 20,
            acceleration: [ dir.x, dir.y ]
            
        })

        this.game.addTickExecutionStack( () => {
            
            this.game.addToMap( projectile )

        })


        // botar no game
        
    }

    private up    = () => { this.orientation.setY( -1  ); this.animation.changeAnimationTo( "up"    ) }
    private left  = () => { this.orientation.setX( -1  ); this.animation.changeAnimationTo( "left"  ) }
    private down  = () => { this.orientation.setY(  1  ); this.animation.changeAnimationTo( "down"  ) }
    private right = () => { this.orientation.setX(  1  ); this.animation.changeAnimationTo( "right" ) }

    public pickItem = ( item: Item ) => this.inventory = item
    public getInventory = () => this.inventory
    // public setInventory = () => this.inventory

}


export default Player