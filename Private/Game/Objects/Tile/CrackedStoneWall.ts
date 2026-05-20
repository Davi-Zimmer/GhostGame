import { GameObject } from "../../Utils/GameObject.js"
import Tile, { TileInterface } from "./Tile.js"

class CrackedStoneWall extends Tile {
    
    public static SpriteIcon = [ 217, 34, 32, 32 ]

    constructor( proprs: TileInterface ){

        super( proprs )

        this.setGameObjectID( GameObject.CrachedStoneWall )

        this.setUniqueSpriteList( CrackedStoneWall.SpriteIcon )

        this.setSolid( true )

        this.setCollision( true )

        this.getCollisionException().add( GameObject.Slime )

        this.setZ( 5 )

    }


}

export default CrackedStoneWall