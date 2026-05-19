import { GameObject } from "../../Utils/GameObject.js"
import Tile, { TileInterface } from "./Tile.js"

class Grass extends Tile {

    constructor( proprs: TileInterface ){

        super( proprs )

        this.setGameObjectID( GameObject.Grass )


    }


}

export default Grass