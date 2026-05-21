import { GameObject } from "../../../Utils/GameObject.js"
import Collidable, { CollidableInterface } from "../../Basics/Collidable.js"
import Player from "../Player.js"

interface ItemInterface extends CollidableInterface {

}


class Item extends Collidable {

    public static SpriteIcon = [ 184, 34, 32, 32 ]

    constructor( props: ItemInterface ){

        super( props )

        this.setup()

    }

    private centralize(){
        return

        const sprite = Item.SpriteIcon

        const newX = ( this.getX() + this.getW() / 2 ) - sprite[ 2 ] / 2
        const newY = ( this.getY() + this.getH() / 2 ) - sprite[ 3 ] / 2

        this.setX( newX )
        this.setX( newY )

    }

    private setup(){

        this.setGameObjectID( GameObject.GenericItem )

        this.setUniqueSpriteList( Item.SpriteIcon )

        this.setCollision( true )
        
        this.setSolid( true )

        this.centralize()
        
    }


    public collisionTrigger( player: Collidable ): boolean {
        
        console.log('pegou')
        
        if( player instanceof Player ){

            player.pickItem( this )
            return true
        }

        return false

    }


}


export default Item 