import EventManager from "./Engine/EventManager.js"
import MapCreator from "./Map Creator/Map Creator.js"
import Camera from "./Objects/Basics/Camera.js"
import FisicObject from "./Objects/Basics/FisicObject.js"
import RenderableObject from "./Objects/Basics/Renderable.js"
import Slime from "./Objects/Entity/Enemy/Slime.js"
import Entity from "./Objects/Entity/Entity.js"
import Player from "./Objects/Entity/Player.js"
import Tile from "./Objects/Tile/Tile.js"
import { GetOverlap, HasCollisionException, IsColliding } from "./Physics/Collision.js"
import { clamp } from "./Utils/Clamp.js"

type InputeFunc = ( e: Event ) => void

interface InputFunctionInterface {

    keyDownMap   : Map< string, InputeFunc >,
    keyUpMap     : Map< string, InputeFunc >,
    mouseMoveMap : InputeFunc[],
    mouseDownMap : InputeFunc[]

}

export enum ObjectNames {
    Grass  = "Grass",
    Player = "Player",
    Tile   = "Tile",
    Entity = "Entity",
} 

class Game {

    //@ts-ignore
    public player: Player

    private static Instance: Game

    private tileSize = 100

    public static GetInstance(){
        
        if( !this.Instance ) this.Instance = new Game()
        
        return this.Instance

    }
    
    /*
    public static Objects: Record< string, [ number, number, number, number ] > = {
        Tombstone : [ 118, 100, 32, 32 ],
        Grass_Hole: [ 118, 1,   32, 32 ],
        Sign      : [ 118, 34,  32, 32 ],
        Sign2     : [ 118, 67,  32, 32 ],
        
        Grass     : [ 151, 1,   32, 32 ],
        Ghost     : [ 0,   0,   27, 36 ],
        Slime     : [ 1,   158, 48, 42 ],
    }

    */

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
    
    private mapCreator: MapCreator | null

    public events = new EventManager()

    private spriteSheet = new Image() 

    constructor(){
        
        this.load()

        //@ts-ignore
        window.game = this

        this.mapCreator = new MapCreator( this, this.tileSize )

    }

    private async load(){

        await this.loadSpriteSheet()

    }

    private loadSpriteSheet(){

        return new Promise(( resolve, reject ) => {

            this.spriteSheet.onload = () => resolve( true )

            this.spriteSheet.onerror = () => reject()

            this.spriteSheet.src = "./Assets/placeholder.png"

        })

    }

    public setup(){
        
        const player = 
            new Player( {
                x: 0,
                y: -100,
                z: 10,
                w: 100,
                h: 100,
                color: "blue",
                solid: true,
                name: "preie",

            })
        

        this.addToMap( player )

        this.addToMap(
            new Entity( {
                x: 0,
                y: 0,
                z: 0,
                w: 200,
                h: 200,
                solid: true,
                name: "birulu"

            })
            
        )

        this.addToMap(
            new Entity( {
                x: 300,
                y: 0,
                z: 0,
                w: 200,
                h: 200,
                mass: 5,
                solid: true,
                name: "juliano"

            })
        )

        this.camera.startFollow( player )

        this.player = player

    }

    // ------------------------------ Game Stuff ------------------------------ \\

    public camera: Camera = new Camera( 0, 0, 1 )

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

    private collisionPush( horizontal: boolean, overlap: { x: number, y: number }, other: RenderableObject, e: RenderableObject ){

        if( e instanceof FisicObject ){

            if( other instanceof Entity ){

                if( horizontal ){
        
                    other.applyX( -overlap.x )
                    other.getAcceleration().multiplyX( -.5 )

                    if( e.getFixed() ) return
                    e.pushX( Math.sign( overlap.x ), other.getMass(), other.getKnockback() )

                } else {

                    other.applyY( -overlap.y )
                    other.getAcceleration().multiplyY( -.5 )

                    if( e.getFixed() ) return
                    e.pushY( Math.sign( overlap.y ), other.getMass(), other.getKnockback() )
        
                }

                return

            }

        }

        if( horizontal ) other.applyX( -overlap.x )
        else             other.applyY( -overlap.y )

    }

    private collision( e: RenderableObject ){

        for( const other of this.map ){

            if( other === e ) continue

            if( !this.camera.isOutside( other, 2 * this.tileSize )  ) continue

            if( !other.getSolid() || !e.getSolid() ) continue

            if( e instanceof FisicObject || e instanceof Tile ){

                if( other instanceof FisicObject || other instanceof Tile ){

                    if(
                        e.getCollisionException().has( other.getGameObjectID() ) ||
                        other.getCollisionException().has( e.getGameObjectID() )
                    
                    ) continue

                    if( !IsColliding( e, other ) ) continue

                }

                e.collisionTrigger( other as FisicObject )

            } else {

                if( !IsColliding( e, other ) ) continue

            }

            const overlap = GetOverlap( e, other )
            
            if( !overlap ) continue
            
            const horizontal = Math.abs( overlap.x ) < Math.abs( overlap.y )
            
            this.collisionPush( horizontal, overlap, other, e )

            if( other instanceof Player ){ this.camera.followTargetOverlap = overlap }

        }

    }

    public update( ctx: CanvasRenderingContext2D ){

        ctx.imageSmoothingEnabled = false

        if( this.camera.isFollowing() ) this.camera.tick()

        this.executeKeys()

        ctx.fillStyle = "black"
        ctx.fillRect( 0, 0, innerWidth, innerHeight )

        for( const n of this.map ){

            if( !this.camera.isOutside( n, 2 * this.tileSize )  ) continue

            this.collision( n )
                
            n.tick()

            n.render( ctx, this.camera, this.spriteSheet )

        }

       this.mapCreator?.render( ctx, this.camera ) 

    }

    public getSpriteSheet = () => this.spriteSheet

    public extractSolidTiles(){
        
        return this.map.filter( i => i.getSolid() && i.getType() === "Tile" )

    }

}


export default Game