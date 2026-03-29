import RenderableObject, { RenderableObjectInterface } from "./Renderable.js";

export interface CollidableInterface extends RenderableObjectInterface {
    solid?: boolean
    collision?: boolean
}

class Collidable extends RenderableObject {

    private solid     : boolean = false
    private collision : boolean = false

    constructor( props: CollidableInterface ){

        super( props )

        this.setSolid( props.solid ?? false )

        if( props.solid ) props.collision = true

        this.setCollision( props.collision ?? false )

        this.setZ( props.z ?? -1 )

    }

    public collisionTrigger( item: Collidable ){

        console.log( this.getName(), item.getName() )

    }

    public getSolid = () => this.solid
    public useCollision = () => this.collision

    public setCollision = ( c: boolean ) => this.collision = c
    public setSolid     = ( s: boolean ) => {
        if( s ) this.collision = true
        this.solid = s
    }


}


export default Collidable 