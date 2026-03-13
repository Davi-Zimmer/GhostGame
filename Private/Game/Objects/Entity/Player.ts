import Game from "../../Game.js"
import NormalizeVector from "../../Utils/Normalize.js"
import Entity, { EntityInterface } from "./Entity.js"

class Player extends Entity {

    constructor( props: EntityInterface ){

        super( props )

        const game = Game.GetInstance()
        game.events.onPress( 'w', () => this.orientation.setY( -1 ) )
        game.events.onPress( 'a', () => this.orientation.setX( -1 ) )
        game.events.onPress( 's', () => this.orientation.setY(  1 ) )
        game.events.onPress( 'd', () => this.orientation.setX(  1 ) )

        game.events.onUp( 'w', () => this.orientation.setY( 0 ) )
        game.events.onUp( 'a', () => this.orientation.setX( 0 ) )
        game.events.onUp( 's', () => this.orientation.setY( 0 ) )
        game.events.onUp( 'd', () => this.orientation.setX( 0 ) )

        this.setSpeed( 10 )
    }


    public tick(){

        const vec = NormalizeVector(
            this.orientation.getX(),
            this.orientation.getY()
        )

        this.setX( this.getX() + this.acceleration.getX() + vec.dx * this.getSpeed())
        this.setY( this.getY() + this.acceleration.getY() + vec.dy * this.getSpeed())

    }

}


export default Player