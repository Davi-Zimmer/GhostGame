import { GameObject } from "../../Utils/GameObject.js"
import Tile, { TileInterface } from "./Tile.js"

class StoneWall extends Tile {

    constructor( proprs: TileInterface ){

        super( proprs )

        this.setGameObjectID( GameObject.StoneWall )

    }


}

export default StoneWall