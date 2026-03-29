import RenderableObject, { RenderableObjectInterface } from "../Objects/Basics/Renderable.js";
import MapCreator from "./Map Creator.js";

class Commands {
    
    private mapCreator: MapCreator

    public coordsStart: { x: number, y: number } | null = null
    public coordsEnd  : { x: number, y: number } | null = null

    constructor( mapCreator: MapCreator ){

        this.mapCreator = mapCreator

    }

    public fill(){

        const startX = Math.min(this.coordsStart!.x, this.coordsEnd!.x)
        const endX   = Math.max(this.coordsStart!.x, this.coordsEnd!.x)

        const startY = Math.min(this.coordsStart!.y, this.coordsEnd!.y)
        const endY   = Math.max(this.coordsStart!.y, this.coordsEnd!.y)

        for( let x = startX; x <= endX; x += this.mapCreator.getTileSize() ) {

            for( let y = startY; y <= endY; y += this.mapCreator.getTileSize() ) {

                this.mapCreator.addToMap(
                    this.mapCreator.loadTile({
                        x, y,
                        z: this.mapCreator.getZIndex(),
                        w: this.mapCreator.getTileSize(),
                        h: this.mapCreator.getTileSize(),
                        color: "purpe",
                    } as RenderableObjectInterface)
                    
                )

            }

        }

    }


}


export default Commands