import Game from "../../Game.js"
import NormalizeVector from "../../Utils/Normalize.js"
import Entity, { EntityInterface } from "./Entity.js"

class Player extends Entity {

    constructor( props: EntityInterface ){

        super( props )

        const game = Game.GetInstance()
        game.events.onPress( 'w', this.up    )
        game.events.onPress( 'a', this.down  )
        game.events.onPress( 's', this.left  )
        game.events.onPress( 'd', this.right )

        game.events.onUp( 'w', () => this.orientation.setY( 0 ) )
        game.events.onUp( 'a', () => this.orientation.setX( 0 ) )
        game.events.onUp( 's', () => this.orientation.setY( 0 ) )
        game.events.onUp( 'd', () => this.orientation.setX( 0 ) )

        this.setSpeed( 10 )

        this.setMass( 6 )
    }



    public tick(){

        this.updatePosition()
        
    }


    private up    = () => this.orientation.setY( -1  )
    private down  = () => this.orientation.setX( -1  ) 
    private left  = () => this.orientation.setY(  1  ) 
    private right = () => this.orientation.setX(  1  ) 

}


export default Player