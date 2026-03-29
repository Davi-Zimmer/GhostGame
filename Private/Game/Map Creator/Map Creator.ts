import Game, { ObjectNames } from "../Game.js";
import Camera from "../Objects/Basics/Camera.js";
import Rect from "../Objects/Basics/Rect.js";
import RenderableObject from "../Objects/Basics/Renderable.js";
import Entity, { EntityInterface } from "../Objects/Entity/Entity.js";
import Player from "../Objects/Entity/Player.js";
import Tile from "../Objects/Tile/Tile.js";
import { ClickCollision } from "../Physics/Collision.js";

class MapCreator {

    private game: Game
    private position = { x: 0, y: 0 }
    private tilesize = 100
    private current = 0

    private posX = innerWidth / 2
    private posY = 20
    private slotSize = 50
    private margin = 10
    private showItens = 10

    private zIndex = 0

    private selectedItem: RenderableObject | null = null

    private tileList = [
        ObjectNames.Grass,
        ObjectNames.Player,
        ObjectNames.Tile,
        ObjectNames.Entity

    ]

    constructor( game: Game ) {

        this.game = game

        this.addMouseEvents()


        //@ts-ignore
        window.mapCreator = this


    }

    private next(){
        this.current++

        if( this.current > this.tileList.length - 1) {
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

    private addMouseEvents(){

        const events = this.game.events
        
        events.onMouseMove( e => {
            this.position.x = this.calcMouseX( e.clientX )
            this.position.y = this.calcMouseY( e.clientY )
        })

        events.onMouseDown( 0, e => {
           
            const a = this.game.map.filter( x => 
                    ClickCollision(
                        this.exactClicX( e.clientX ),
                        this.exactClicY( e.clientY ), x
                    )
                )

            if( a.length === 0 ) {
                
                this.selectedItem = null
                
                return
            }

            a.forEach( x => {
                console.log( `Z: ${x.getZ()}, Name: ${x.getName()}`)

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
            this.leftClick(
                this.position.x,
                this.position.y
            )

        })

    }

    private middleClick( x: number, y: number ){
        // const e = this.game.map.find( item => !ClickCollision( x + this.tilesize / 2, y  + this.tilesize / 2, item ) )

    }

    private rightClick( x: number, y: number, e: MouseEvent ){
        
        this.game.map = this.game.map.filter( item => !ClickCollision( x, y, item ) )

    }

    private leftClick( x: number, y: number ){

        const name = this.tileList[ this.current ]

        const property = Game.Objects[ name ]

        const a = {
            x, y,
            z: property.z,
            w: this.tilesize,
            h: this.tilesize,
            color: "purpe",
            
        } as EntityInterface

        if( property ){
            a.solid = property.isSolid,
            a.uniqueSprite = property.sprite
            a.mass = property.mass
        }

        const aa = new Tile( a )

        console.log( aa )  

        this.game.addToMap( aa )


        /* 
        this.game.addToMap(
            new Entity( {
                x, y,
                z: 0,
                w: this.tilesize,
                h: this.tilesize,
                color: "purpe"
            })
        )
        */

    }

    private getPos(){
        return  this.posX - (this.showItens * this.slotSize + this.showItens * this.margin) / 2
    }

    private renderSelectedItem( ctx:CanvasRenderingContext2D, cam: Camera ){

        ctx.fillStyle = '#ff00ee55'

        const pos = cam.subtract( this.selectedItem! )

        ctx.fillRect( pos.x, pos.y, pos.w, pos.h )

    }

    public renderCursor( ctx: CanvasRenderingContext2D, cam: Camera ){

        ctx.fillStyle = "#ffffff5f"
        ctx.fillRect(  this.position.x - cam.getX() , this.position.y - cam.getY() , this.tilesize, this.tilesize )


        ctx.fillStyle = "purple" 
        ctx.fillRect( ( this.getPos() + this.current * this.slotSize + this.current * this.margin) - 5, this.posY -5 , this.slotSize + 10, this.slotSize + 10 )


        ctx.fillStyle = "gray" 
        for( let x = 0; x < this.showItens; x++ ){
            
            ctx.fillRect(  this.getPos() + x * this.slotSize + x * this.margin, this.posY, this.slotSize, this.slotSize )

        }
        
        
        ctx.fillText( `Z: ${this.zIndex}`, this.margin, this.margin )
        
        if( this.selectedItem ) {

            this.renderSelectedItem( ctx, cam )

            ctx.fillText( `Name: ${ this.selectedItem.getName() }`, this.margin, this.margin + 15 )


        }

    }


}




export default MapCreator