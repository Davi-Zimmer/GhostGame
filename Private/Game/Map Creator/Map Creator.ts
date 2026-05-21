import Game, { ObjectNames } from "../Game.js";
import Camera from "../Objects/Basics/Camera.js";
import Rect from "../Objects/Basics/Rect.js";
import RenderableObject from "../Objects/Basics/Renderable.js";
import Slime, { SlimeInterface } from "../Objects/Entity/Enemy/Slime.js";
import Entity, { EntityInterface } from "../Objects/Entity/Entity.js";
import Item from "../Objects/Entity/Items/Item.js";
import Player from "../Objects/Entity/Player.js";
import CrackedStoneWall from "../Objects/Tile/CrackedStoneWall.js";
import Grass from "../Objects/Tile/Grass.js";
import StoneWall from "../Objects/Tile/StoneWall.js";
import Tile, { TileInterface } from "../Objects/Tile/Tile.js";
import { ClickCollision, IsColliding } from "../Physics/Collision.js";
import { GameObject } from "../Utils/GameObject.js";
import Post from "../Utils/Post.js";
import Commands from "./Commands.js";

type stackItens = { name: string, z: number }

type showInfo = { content: string, color: string, ticks: number }

type storedObject = { x: 0, y: 0, gameObject: GameObject }


class MapCreator {

    public game: Game
    private commands: Commands

    private position = { x: 0, y: 0 }
    private current = 0
    private posX      = innerWidth / 2
    private posY      = 20
    private slotSize  = 50
    private margin    = 10
    private showItens = 10
    private shift     = false
    private zIndex    = 0
    
    private tileSize        : number
    private selectedItem    : RenderableObject | null = null
    private selectionStack  : stackItens[] = []
    private infoList        : showInfo  [] = []
    private selectedMapName : string = "level-1"
    private backup          : any
    private selected        : { sprite: [ number, number, number, number ], gameObject: GameObject } | null = null

    private showUI = false

    private classMap = {
        [ GameObject.None ]             : { SpriteIcon: [ 184, 34, 32, 32 ] },
        [ GameObject.Ghost ]            : Player,
        [ GameObject.Slime ]            : Slime,
        [ GameObject.Entity ]           : Entity,
        [ GameObject.GenericEntity ]    : Entity,
        [ GameObject.GenericTile ]      : Tile,
        [ GameObject.Grass ]            : Grass,
        [ GameObject.StoneWall ]        : StoneWall,
        [ GameObject.CrachedStoneWall ] : CrackedStoneWall,
        [ GameObject.GenericItem ]      : Item
    }

    private tileList = [
        GameObject.Ghost,        
        GameObject.Grass,        
        GameObject.Slime,        
        GameObject.StoneWall,
        GameObject.CrachedStoneWall,
    ]

    private lastPlaced: RenderableObject | null = null

    private renderThings = this.organizeGameObjects()

    constructor( game: Game, tileSize: number ) {

        this.game = game

        this.tileSize = tileSize

        this.addEvents()

        //@ts-ignore
        window.mapCreator = this

        this.commands = new Commands( this )

        this.load()

    }

    /*
        private getSprite( selected: number ){
            return Game.Objects[ this.tileList[ selected ] ]
        }
    */

    private switchGameObject( i: storedObject ): RenderableObject | undefined {
        /*
        switch( i.type ){

            case 'Tile'  : return this.loadTile( i, (i as TileInterface).spriteIndex )
            case 'Entity': return new Entity( i ) as RenderableObject
            case 'Slime' : return new Slime( i as SlimeInterface ) as RenderableObject
            case 'Player': return new Player( i )  as RenderableObject

            default: {

                if( !Game.Objects[ i.type! ]  ) break

                return this.loadTile( i, (i as TileInterface).spriteIndex )
            }

        }
        */

        const obj = {
            x: i.x,
            y: i.y,
            z: this.zIndex,
            w: this.tileSize,
            h: this.tileSize,
            game: this.game
        }

        switch( i.gameObject ){

            case GameObject.GenericTile      : return new Tile   ( obj ) 
            case GameObject.GenericEntity    : return new Entity ( obj ) 
            case GameObject.Slime            : return new Slime  ( obj ) as RenderableObject
            case GameObject.Ghost            : return new Player ( obj ) 
            case GameObject.Grass            : return new Grass  ( obj )  
            case GameObject.CrachedStoneWall : return new CrackedStoneWall( obj )
            case GameObject.StoneWall        : return new StoneWall( obj )
            case GameObject.Entity           : return new Entity( obj )
            case GameObject.GenericItem      : return new Item( obj )
            
            default: {

                // if( !Game.Objects[ i.type! ]  ) break

                // return this.loadTile( i, (i as TileInterface).spriteIndex )
                this.error(`Unknown map item type: ${ i.gameObject }`)

                return

            }

        }

    }

    private loadMapData( dataString: string ){

        let player: Player | null = null

        const data = JSON.parse( dataString ) as Array< storedObject >

        const mapItems = data.map( i => {
            
            const a = this.switchGameObject( i )

            if( i.gameObject === GameObject.Ghost ) player = ( a as Player )
            
            return a

        })

        if( !player ) {
            this.error(`Missing Player in map`)
            return
        }

        this.game.camera.startFollow( player )
        this.game.player = player
        this.game.map = mapItems.filter( i => i !== undefined )
    }

    private load(){
        /*
        const mapName = `Maps/${ this.selectedMapName }.json`
        
        Post( `storage/map/load`, { mapName: mapName }).then( async res => {
            
            const dataString = await res.json() as string

            this.loadMapData( dataString )

            this.backup = dataString

        })
        .then( () => this.info("Map Loaded"))
        .catch( ( err ) => {
            this.error("Fail to load map")
            console.log( err )
        })
        */

        const mapName = `Maps/${ this.selectedMapName }.json`
        
        Post( `storage/map/load`, { mapName: mapName }).then( async res => {
            
            const dataString = await res.json() as string

            this.loadMapData( dataString )


        })
        .then( () => this.info("Map Loaded"))
        .catch( ( err ) => {
            this.error("Fail to load map")
            console.log( err )
        })

    }

    private save(){
        /*
            const mapItems = this.game.map.map( i => {

                if( i instanceof Tile ) return Tile.ToJson( i )
                    
                if( i instanceof Player ) return Player.ToJson( i )

                if( i instanceof Entity ) return Entity.ToJson( i )

                if( i instanceof Slime ) return Slime.ToJson( i )

                this.error(`Unknown map item type: ${ i.getType() }`)

            }).filter( i => i !== undefined )


            const mapName = `Maps/${ this.selectedMapName }.json`
            
            Post( 'storage/map/save', {
                mapName,
                data: mapItems
            })
            .then( () => {
                this.info("Map Saved")
            })
            .catch( ( err ) => {
                this.error("Fail to save map")
                console.log( err )
            })

        */

        const mapItems = this.game.map.map( i => {

            return  {
                x          : i.getX(),
                y          : i.getY(),
                gameObject : i.getGameObjectID()
            }

        })

        const mapName = `Maps/${ this.selectedMapName }.json`
        
        Post( 'storage/map/save', {
            mapName,
            data: mapItems
        })
        .then( () => this.info("Map Saved") )
        .catch( ( err ) => {
            this.error("Fail to save map")
            console.log( err )
        })

    }

    private restore(){
        this.loadMapData( this.backup )
    }

    /*
        private next(){
            this.current++

            if( this.current > this.tileList.length - 1 ) {
                this.current = 0
                return
            }
        }

        private previus(){
            this.current--

            if( this.current < 0 ) {
                this.current = this.tileList.length - 1
                return
            }

        }

    */

    private organizeGameObjects(){
        
        const declaredGameObjects = [
            GameObject.Slime,
            GameObject.Ghost,
            GameObject.CrachedStoneWall,
            GameObject.Grass,
            GameObject.StoneWall,
            GameObject.GenericItem
        ]

        const COLUNAS = 10

        const ESPACO_X = 70
        const ESPACO_Y = 70

        const START_X = 50
        const START_Y = 50

        const itens = Array.from({ length: declaredGameObjects.length }, (_, i) => {
            const coluna = i % COLUNAS
            const linha = Math.floor( i / COLUNAS )

            const sprite = this.classMap[ declaredGameObjects[ i ] ].SpriteIcon
            
            return {
                sprite,
                gameObject: declaredGameObjects[ i ],
                w: 50,
                h: 50,
                x: START_X + coluna * ESPACO_X,
                y: START_Y + linha  * ESPACO_Y,
            }

        })

        return itens
    }

    private calcMouseX = ( x: number ) => Math.floor( ( x + this.game.camera.getX() ) / this.tileSize ) * this.tileSize 
    private calcMouseY = ( y: number ) => Math.floor( ( y + this.game.camera.getY() ) / this.tileSize ) * this.tileSize 

    private exactClicX = ( x: number ) => x + this.game.camera.getX()
    private exactClicY = ( y: number ) => y + this.game.camera.getY()

    private addEvents(){

        const events = this.game.events
        
        events.onMouseMove( e => {
            this.position.x = this.calcMouseX( e.clientX )
            this.position.y = this.calcMouseY( e.clientY )
        })

        events.onDown( 'shift', e => {
            this.shift = true
        })

        events.onUp( 'shift', () => {
            this.shift = false

            if( this.commands.coordsStart && this.commands.coordsEnd ){

                this.commands.fill()
                this.commands.coordsStart = null
                this.commands.coordsEnd   = null
            }

        })

        events.onMouseDown( 0, e => {
           
            if( this.showUI ){

                const paddong = 5

                const x = e.clientX
                const y = e.clientY

                for( const item of this.renderThings ){

                    if( 
                        x > item.x - paddong &&
                        y > item.y - paddong &&
                        x < (item.x - paddong) + (item.w + paddong * 2 ) &&
                        y < (item.y - paddong) + (item.h + paddong * 2 )
                    ){

                        this.selected = {
                            sprite     : item.sprite as [ number, number, number, number ],
                            gameObject : item.gameObject
                        }

                    }

                }

                return
            }

            if( this.shift ){
                
                if( !this.commands.coordsStart ) {

                    this.commands.coordsStart = {
                        x: this.calcMouseX( e.clientX ),
                        y: this.calcMouseY( e.clientY ),
                    }

                }
                else {
                    this.commands.coordsEnd = {
                        x: this.calcMouseX( e.clientX ),
                        y: this.calcMouseY( e.clientY ),
                    }
                    
                }

            }

            const collidingObjects = this.game.map.filter( x => 
                ClickCollision(
                    this.exactClicX( e.clientX ),
                    this.exactClicY( e.clientY ), x
                )
            )

            if( collidingObjects.length === 0 ) {
                
                this.selectedItem = null
                
                return
            }

            this.selectionStack = collidingObjects.map( m => ( { z: m.getZ(), name: m.getName() } ) )

            collidingObjects.forEach( x => {

                if( x.getZ() === this.zIndex ) this.selectedItem = x

            })

        })

        events.onMouseDown( 1, e => {
            this.middleClick(
                this.calcMouseX( e.clientX ),
                this.calcMouseY( e.clientY )
            )
        })

        events.onMouseDown( 2, e => {
            this.rightClick(
                this.exactClicX( e.clientX ),
                this.exactClicY( e.clientY ),
                e
            )
        })

        /*
            events.onMouseWheel( e => {
                
                const delta = Math.sign( e.deltaY)

                delta < 1 ? this.previus() : this.next()

            })
        */

        events.onDown( 'arrowup'  , () => this.zIndex += 1 )
        events.onDown( 'arrowdown', () => this.zIndex -= 1 )

        events.onDown( '1', () => {
            this.placeItem(
                this.position.x,
                this.position.y
            )
        })

        events.onDown( 'f1', e => { e.preventDefault(); this.save() } )
        events.onDown( 'f2', e => { e.preventDefault(); this.load() } )
        events.onDown( 'f3', e => { e.preventDefault(); this.restore() } )

        events.onDown( 'tab', e => {
            e.preventDefault()
            this.showUI = !this.showUI
        })

    }

    public addToMap( item?: RenderableObject  ){
        
        if( !item ){
            this.warn('No Entity selected')
            return
        }

        for( const e of this.game.map ){

            if( IsColliding( e, item ) && item.getZ() === e.getZ() ){

                this.error( 'Ja tem coisa ae' )
                
                return
            }

        }
        
        this.game.addToMap( item )

    }

    public placeItem( x: number, y: number ){ 

        if( this.selected ){

            const a = this.switchGameObject({ x, y, gameObject: this.selected?.gameObject } as storedObject )
    
            this.lastPlaced = a!

            if( a ) this.game.addToMap( a )

            return
        }

        this.error('No Game Object Selected')

    }

    private middleClick( x: number, y: number ){
        // const e = this.game.map.find( item => !ClickCollision( x + this.tilesize / 2, y  + this.tilesize / 2, item ) )

    }

    private rightClick( x: number, y: number, e: MouseEvent ){

        if( e.ctrlKey ){

            this.game.map = this.game.map.filter( item => !ClickCollision( x, y, item )  )
            
            return
        }
        
        this.game.map = this.game.map.filter( item => !(ClickCollision( x, y, item ) && item.getZ() === this.zIndex) )

    }

    private info( content: string, ticks: number = 500 ){
        this.infoList.push({ content, color: "blue", ticks })
    }

    private error( content: string, ticks: number = 500 ){
        this.infoList.push({ content, color: "red", ticks })
    }

    private warn( content: string, ticks: number = 500 ){
        this.infoList.push({ content, color: "yellow", ticks })
    }

    private getPos(){
        return  this.posX - (this.showItens * this.slotSize + this.showItens * this.margin) / 2
    }

    private renderSelectedItem( ctx:CanvasRenderingContext2D, cam: Camera ){

        ctx.fillStyle = '#ff00ee55'

        const pos = cam.subtract( this.selectedItem! )

        ctx.fillRect( pos.x, pos.y, pos.w, pos.h )

    }

    private renderCursor( ctx: CanvasRenderingContext2D, cam: Camera ){
        ctx.fillStyle = "#ffffff5f"
        ctx.fillRect(  this.position.x - cam.getX() , this.position.y - cam.getY() , this.tileSize, this.tileSize )

    }

    private renderInfos( ctx: CanvasRenderingContext2D, cam: Camera  ){
        ctx.font = "10px arial"

        ctx.fillStyle = "white" 

        ctx.fillText( `Z: ${this.zIndex}`, this.margin, this.margin )
        
        if( this.selectedItem ) {

            this.renderSelectedItem( ctx, cam )
            ctx.fillStyle = "white" 

            ctx.fillText( `Name: ${ this.selectedItem.getName() }`, this.margin, this.margin + 15 )
            ctx.fillText( `Type: ${ this.selectedItem.getType() }`, this.margin, this.margin + 30 )

        }

        this.selectionStack.forEach( ( item, index ) => {
            ctx.fillText( `Z:${ item.z } Name: ${ item.name }`, this.margin, this.margin + 50 +  (15 * index) )
        })

        ctx.font = "20px arial"

        this.infoList = this.infoList.filter( i => i.ticks > 0 )
        
        this.infoList.forEach( ( info, index ) => {
            
            info.ticks--

            ctx.fillStyle = info.color
            
            ctx.fillText( info.content, ( innerWidth - 50 ) - info.content.length * 10, 50 + index * 20 )
            
        })
    }

    private getSprite( index: number ){

        const spritesIcons = {
            [GameObject.Entity] : Entity.SpriteIcon,
            [GameObject.Ghost ] : Player.SpriteIcon,
            [GameObject.Slime ] : Slime.SpriteIcon,
        } as Record< any, number[] >
        

        const spr = spritesIcons[ index ] as [ number, number, number, number ]
        
        if( !spr ) return [ 184, 34, 32, 32 ]

        return spr

    }

    private renderHud( ctx: CanvasRenderingContext2D, cam: Camera ){

        if( this.selected ) {

            const s = this.selected.sprite

            ctx.drawImage( this.game.getSpriteSheet(), s[0], s[1], s[2], s[3], 100, 10, 50, 50 )

        }

        if( !this.showUI ) return

        ctx.fillStyle = 'rgb( 0, 0, 100 )'

        ctx.fillRect( 0, 0, innerWidth, innerHeight )

        const slotSize = 50

        const paddong = 5

        this.renderThings.forEach( i => {
            
            const s = i.sprite
            
            ctx.fillStyle = 'black'
            ctx.fillRect( i.x - paddong, i.y - paddong , slotSize + paddong * 2, slotSize + paddong * 2  )

            ctx.drawImage( this.game.getSpriteSheet(), s[0], s[1], s[2], s[3], i.x, i.y, i.w, i.h )

        })

    }

    public render( ctx: CanvasRenderingContext2D, cam: Camera ){

        this.renderCursor( ctx, cam )

        this.renderHud( ctx, cam )
        
        this.renderInfos( ctx, cam )

    }

    public getTileSize = () => this.tileSize

    public getZIndex = () => this.zIndex

}




export default MapCreator
