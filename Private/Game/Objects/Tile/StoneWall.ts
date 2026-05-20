import { GameObject } from "../../Utils/GameObject.js"
import Tile, { TileInterface } from "./Tile.js"

class StoneWall extends Tile {

    public static SpriteIcon = [ 184, 1, 32, 32 ]

    constructor( proprs: TileInterface ){

        super( proprs )

        this.setGameObjectID( GameObject.StoneWall )

        this.setUniqueSpriteList( StoneWall.SpriteIcon )

        this.setSolid( true )
        
        this.setCollision( true )

    }

}

export default StoneWall