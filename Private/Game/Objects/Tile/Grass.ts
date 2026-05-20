import { GameObject } from "../../Utils/GameObject.js"
import Tile, { TileInterface } from "./Tile.js"

class Grass extends Tile {

    public static SpriteIcon = [ 151, 1, 32, 32 ]

    constructor( proprs: TileInterface ){

        super( proprs )

        this.setGameObjectID( GameObject.Grass )

        this.setUniqueSpriteList( Grass.SpriteIcon )

        this.setCollision( false )
        
        this.setSolid( false )

    }

}

export default Grass