import { GameObject } from "../../Utils/GameObject.js"
import Tile, { TileInterface } from "./Tile.js"

class CrackedStoneWall extends Tile {

    constructor( proprs: TileInterface ){

        super( proprs )

        this.setGameObjectID( GameObject.CrachedStoneWall )

    }


}

export default CrackedStoneWall