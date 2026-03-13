import EventManager from "./Engine/EventManager.js"
import Camera from "./Objects/Basics/Camera.js"
import Rect from "./Objects/Basics/Rect.js"
import RenderableObject from "./Objects/Basics/Renderable.js"
import Entity from "./Objects/Entity/Entity.js"
import Player from "./Objects/Entity/Player.js"
import { GetOverlap, IsColliding } from "./Physics/Collision.js"

type InputeFunc = ( e: Event ) => void

interface InputFunctionInterface {

    keyDownMap   : Map< string, InputeFunc >,
    keyUpMap     : Map< string, InputeFunc >,
    mouseMoveMap : InputeFunc[],
    mouseDownMap : InputeFunc[]

}

class Game {
    
    private static Instance: Game

    public static GetInstance(){
        
        if( !this.Instance ) this.Instance = new Game()
        
        return this.Instance

    }
    /*
    private inputFunctions = {

        keyDownMap   : new Map< string, InputeFunc >,
        keyUpMap     : new Map< string, InputeFunc >,
        mouseMoveMap : [],
        mouseDownMap : []

    } as InputFunctionInterface

    private keyDownExecution: Record< string, InputeFunc > = {}


    public keyDown( e: KeyboardEvent ) {

        const exec = this.inputFunctions.keyDownMap.get( e.key )

        if( exec ) this.keyDownExecution[ e.key ] = exec

    }
    
    public keyUp( e: KeyboardEvent ) {

        const exec = this.inputFunctions.keyUpMap.get( e.key )

        if( exec ) exec( e )

    }
    
    public mouseDown( e: Event ) {

        //@ts-ignore
        const exec = this.inputFunctions.mouseDownMap[ e.button ]

        if( exec ) exec( e )

    }
    
    public mouseMove( e: MouseEvent ) {

        for( const f of this.inputFunctions.mouseMoveMap ){

            f( e )

        }

    }

        public addKeyDownEvent   = ( key: string, func: InputeFunc  ) => this.inputFunctions.keyDownMap.set( key, func )
        public addKeyUpEvent     = ( key: string, func: InputeFunc  ) => this.inputFunctions.keyUpMap.set( key, func )
        public addMouseDownEvent = ( btn: number, func: InputeFunc  ) => this.inputFunctions.mouseDownMap[ btn ] = func
        
        public removeKeyDownEvent   = ( key: string ) => this.inputFunctions.keyDownMap.delete( key )
        public removeKeyUpEvent     = ( key: string ) => this.inputFunctions.keyUpMap.delete( key )
        public removeMouseDownEvent = ( btn: number ) => delete this.inputFunctions.mouseDownMap[ btn ]

    */
    
    public events = new EventManager()

    constructor(){

        this.camera = new Camera( 0, 0, 1 )

    }

    public setup(){
        
        const player = 
            new Player( {
                x: 0,
                y: 0,
                z: 10,
                w: 100,
                h: 100,
                color: "blue",
            })
        

        this.addToMap( player )

        this.addToMap(
            new Entity( {
                x: 0,
                y: 0,
                z: 0,
                w: 200,
                h: 200
            })
        )

        this.camera.startFollow( player )

    }

    // ------------------------------ Game Stuff ------------------------------ \\

    public camera: Camera

    public map: RenderableObject[] = []

    public addToMap( x: RenderableObject ){
        
        this.map.push( x )

        this.map = this.map.sort( ( a, b ) => a.getZ() - b.getZ() )
    
    }

    public removeOfMap( x: RenderableObject ){

        this.map = this.map.filter( n => n !== x ) 

    }

    public killEntities(){

        this.map = this.map.filter( n => !( n instanceof Entity ) )

    }

    private executeKeys(){
        
        this.events.executeKeyPressed()

    }

    private collision( e: RenderableObject ){

        for( const other of this.map ){

            if( other === e ) continue

            /// solid?
            if( !other.getSolid() ) continue


            if( !IsColliding( e, other ) ) continue

            const overlap = GetOverlap( e, other )

            if( !overlap ) continue
            
            
            const horizontal = Math.abs( overlap.x ) < Math.abs( overlap.y )
            
            if( horizontal ){
                
                // empurrar entidade
                e.applyX( overlap.x )

            } else {

                // if( overlap.y < 0 ){ // Top collision }
                e.applyY( overlap.y )

            }

        }

    }

    public update( ctx: CanvasRenderingContext2D ){
        
        if( this.camera.isFollowing() ) this.camera.tick()

        this.executeKeys()

        ctx.fillStyle = "gray"

        ctx.fillRect( 0, 0, innerWidth, innerHeight )

        for( const n of this.map ){

            if( n instanceof RenderableObject && n.getSolid() ) this.collision( n )

            n.tick()

            n.render( ctx, this.camera )

        }

    }

}


export default Game