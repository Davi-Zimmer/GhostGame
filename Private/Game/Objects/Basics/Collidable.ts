import RenderableObject, { RenderableObjectInterface } from "./Renderable.js"

export interface CollidableInterface extends RenderableObjectInterface {
    solid              ?: boolean
    collision          ?: boolean
    canOverlapOthers   ?: boolean
    canPushOthers      ?: boolean

    
}

class Collidable extends RenderableObject {
    
    private solid     : boolean = false
    private collision : boolean = false
    private canOverlapOthers: boolean
    private canPushOthers   : boolean
    
    constructor( props: CollidableInterface ){
        
        super( props )
        
        this.setSolid( props.solid ?? false )
        
        if( props.solid ) props.collision = true
        
        this.canOverlapOthers = props.canOverlapOthers ?? true
        
        this.canPushOthers = props.canPushOthers ?? true

        this.setCollision( props.collision ?? false )

        this.setZ( props.z ?? -1 )

    }

    public collisionTrigger( item: Collidable ): boolean{

        // console.log( this.getName(), item.getName() )

        return false
    }

    public getSolid = () => this.solid
    public useCollision = () => this.collision
    public getCanOverlapOthers = () => this.canOverlapOthers
    public getCanPushOthers = () => this.canPushOthers

    public setCanOverlapOthers = ( b: boolean ) => this.canOverlapOthers = b 
    public setCollision = ( c: boolean ) => this.collision = c
    public setCanPushOthers = ( b: boolean ) => this.canPushOthers = b

    public setSolid     = ( s: boolean ) => {
        if( s ) this.collision = true
        this.solid = s
    }


}


export default Collidable 