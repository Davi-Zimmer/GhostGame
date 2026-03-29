import Game, { ObjectNames } from "../Game.js";
import Camera from "../Objects/Basics/Camera.js";
import Rect from "../Objects/Basics/Rect.js";
import RenderableObject from "../Objects/Basics/Renderable.js";
import Entity, { EntityInterface } from "../Objects/Entity/Entity.js";
import Player from "../Objects/Entity/Player.js";
import Tile, { TileInterface } from "../Objects/Tile/Tile.js";
import { ClickCollision, IsColliding } from "../Physics/Collision.js";
import Post from "../Utils/Post.js";
import Commands from "./Commands.js";

type stackItens = { name: string, z: number }

type showInfo = { content: string, color: string, ticks: number }


class MapCreator {

    public game: Game
    private commands: Commands

    private position = { x: 0, y: 0 }
    private tilesize = 100
    private current = 0

    private posX = innerWidth / 2
    private posY = 20
    private slotSize = 50
    private margin = 10
    private showItens = 10

    private shift = false

    private zIndex = 0

    private selectedItem: RenderableObject | null = null
    private selectionStack: stackItens[] = []
    private infoList: showInfo[] = []
    private selectedMapName: string = "level-1"

    private tileList = Object.keys( Game.Objects )

    constructor( game: Game ) {

        this.game = game

        this.addEvents()

        //@ts-ignore
        window.mapCreator = this

        this.commands = new Commands( this )


    }

    private getSprite( selected: number ){
        return Game.Objects[ this.tileList[ selected ] ]
    }

    public loadTile( i: TileInterface, spriteIndex?: number | undefined ){

        const index = spriteIndex === undefined ? this.current : spriteIndex

        i.uniqueSprite = this.getSprite( index  )

        i.spriteIndex = index

        return new Tile( i ) as RenderableObject

    }

    private load(){

        const mapName = `Maps/${ this.selectedMapName }.json`
        
        Post( `storage/map/load`, { mapName: mapName }).then( async res => {
            
            const dataString = await res.json()

            let player: Player | null = null

            const data = JSON.parse( dataString ) as ( EntityInterface | TileInterface )[]
    
            const mapItems = data.map( i => {
                 
                if( i.type === 'Tile' )   return this.loadTile( i, (i as TileInterface).spriteIndex )
                if( i.type === 'Entity' ) return new Entity( i ) as RenderableObject
                if( i.type === 'Player' )   {
                    const p = new Player( i )
                    player = p
                    return p as RenderableObject
                }
    
                this.error(`Unknown map item type: ${ i.type }`)
            
            })

            if( !player ) {
                this.error(`Missing Player in map`)
                return
            }

            this.game.camera.startFollow( player )
    
            this.game.map = mapItems.filter( i => i !== undefined )


        })
        .then( () => this.info("Map Loaded"))
        .catch( ( err ) => {
            this.error("Fail to load map")
            console.log( err )
        })

    }

    private save(){

        const mapItems = this.game.map.map( i => {

            if( i instanceof Tile ) return Tile.ToJson( i )
                
            if( i instanceof Player ) return Player.ToJson( i )

            if( i instanceof Entity ) return Entity.ToJson( i )

            this.error(`Unknown map item type: ${ i.getType() }`)

        }).filter( i => i !== undefined )


        const mapName = `Maps/${ this.selectedMapName }.json`
        
        Post( 'storage/map/save', {
            mapName,
            data: mapItems
        })
        .then( () => this.info("Map Saved"))
        .catch( ( err ) => {
            this.error("Fail to save map")
            console.log( err )
        })

    }

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

    private calcMouseX = ( x: number ) => Math.floor( ( x + this.game.camera.getX() ) / this.tilesize ) * this.tilesize 
    private calcMouseY = ( y: number ) => Math.floor( ( y + this.game.camera.getY() ) / this.tilesize ) * this.tilesize 

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

            this.selectionStack = collidingObjects.map( m => ({ z: m.getZ(), name: m.getName() }))

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

        events.onMouseWheel( e => {
            
            const delta = Math.sign( e.deltaY)

            delta < 1 ? this.previus() : this.next() 

        })

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


    }

    public addToMap( item: RenderableObject ){
        
        for( const e of this.game.map ){

            if( IsColliding( e, item ) && item.getZ() === e.getZ() ){

                this.error( 'Ja tem coisa ae' )
                
                return
            }

        }
        
        this.game.addToMap( item )

    }

    public placeItem( x: number, y: number ){

        this.addToMap( this.loadTile({
            x, y,
            z: this.zIndex,
            w: this.tilesize,
            h: this.tilesize,
            color: "purpe",

        } as EntityInterface) )

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
        ctx.fillRect(  this.position.x - cam.getX() , this.position.y - cam.getY() , this.tilesize, this.tilesize )

    }

    private renderInfos( ctx: CanvasRenderingContext2D, cam: Camera  ){
        ctx.font = "10px arial"

        ctx.fillStyle = "white" 

        ctx.fillText( `Z: ${this.zIndex}`, this.margin, this.margin )
        
        if( this.selectedItem ) {

            this.renderSelectedItem( ctx, cam )
            ctx.fillStyle = "white" 

            ctx.fillText( `Name: ${ this.selectedItem.getName() }`, this.margin, this.margin + 15 )

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

    private renderHud( ctx: CanvasRenderingContext2D, cam: Camera ){
        ctx.font = "10px arial"

        ctx.fillStyle = "purple" 
        ctx.fillRect( ( this.getPos() + this.current * this.slotSize + this.current * this.margin) - 5, this.posY -5 , this.slotSize + 10, this.slotSize + 10 )


        ctx.fillStyle = "gray" 
        for( let x = 0; x < this.showItens; x++ ){
            
            
            if( x >= this.tileList.length ){

                ctx.fillRect(  this.getPos() + x * this.slotSize + x * this.margin, this.posY, this.slotSize, this.slotSize )
                
                continue

            }

            const s = Game.Objects[ this.tileList[ x ] ]

            ctx.drawImage( this.game.getSpriteSheet(), s[0], s[1], s[2], s[3],
                this.getPos() + x * this.slotSize + x * this.margin, this.posY, this.slotSize, this.slotSize 
            )

        }

        if( this.shift ){
            ctx.font = "15px arial"

            ctx.fillStyle = 'blue'

            ctx.fillText('Selection mode', this.margin, innerHeight - this.margin - 100 )
        }

    }

    public render( ctx: CanvasRenderingContext2D, cam: Camera ){

        this.renderCursor( ctx, cam )

        this.renderHud( ctx, cam )
        
        this.renderInfos( ctx, cam )
       

    }

    public getTileSize = () => this.tilesize

    public getZIndex = () => this.zIndex

}




export default MapCreator