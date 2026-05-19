import EventManager from "../Engine/EventManager.js";
import Game from "../Game.js";
import Camera from "../Objects/Basics/Camera.js";
import Slime from "../Objects/Entity/Enemy/Slime.js";
import Entity from "../Objects/Entity/Entity.js";
import Player from "../Objects/Entity/Player.js";
import CrackedStoneWall from "../Objects/Tile/CrackedStoneWall.js";
import Grass from "../Objects/Tile/Grass.js";
import StoneWall from "../Objects/Tile/StoneWall.js";
import Tile from "../Objects/Tile/Tile.js";
import { GameObject } from "../Utils/GameObject.js";

type classMapType = {

    [ GameObject.None ]             : {},
    [ GameObject.Ghost ]            : Player,
    [ GameObject.Slime ]            : Slime,
    [ GameObject.Entity ]           : Entity,
    [ GameObject.GenericEntity ]    : Entity,
    [ GameObject.GenericTile ]      : Tile,
    [ GameObject.Grass ]            : Grass,
    [ GameObject.StoneWall ]        : StoneWall,
    [ GameObject.CrachedStoneWall ] : CrackedStoneWall,
}

export default class MapCreator {

    private tileSize: number
    private game: Game 
    private showUI = false
    private renderThings:{ sprite: number[]; x: number; y: number; gameObject: number; w: number; h: number }[] = []
 
    private selected: { sprite: [ number, number, number, number ], gameObject: number } | null = null

    constructor( game: Game, tileSize: number ){

        this.tileSize = tileSize

        this.game = game

        this.addEvents()

        this.organizeGameObjects()

    }
    
    private addEvents() {

        const event = this.game.events
        
        event.onMouseDown( 0, e => {

            
            if( !this.showUI ) {

                this.addSelectedItem( e.clientX, e.clientY )

                return
            }


            this.pickItem( e.clientX, e.clientY )

        })


        event.onDown( 'tab', e => {
            e.preventDefault()

            this.showUI = !this.showUI

        })

    }

    private addSelectedItem( x: number, y: number ) {

    }

    private pickItem( x: number, y: number ){

        const paddong = 5

        for( const item of this.renderThings ){

            if( 
                x > item.x - paddong  &&
                y > item.y - paddong &&
                x < (item.x - paddong) + (item.w + paddong * 2 ) &&
                y < (item.y - paddong) + (item.h + paddong * 2 )
            ){

                this.selected = {
                    sprite: item.sprite as [ number, number, number, number ],
                    gameObject: item.gameObject
                }

            }

        }

    }

    private classMap = {
        [ GameObject.None ]             : {SpriteIcon: [ 184, 34, 32, 32 ]},
        [ GameObject.Ghost ]            : Player,
        [ GameObject.Slime ]            : Slime,
        [ GameObject.Entity ]           : Entity,
        [ GameObject.GenericEntity ]    : Entity,
        [ GameObject.GenericTile ]      : Tile,
        [ GameObject.Grass ]            : Grass,
        [ GameObject.StoneWall ]        : StoneWall,
        [ GameObject.CrachedStoneWall ] : CrackedStoneWall
    }

    private organizeGameObjects(){
        
        const declaredGameObjects = [
            GameObject.Slime,
            GameObject.Ghost,
            
            GameObject.CrachedStoneWall,
            GameObject.Grass,
            GameObject.StoneWall,
        ]

        const COLUNAS = 10

        const ESPACO_X = 70
        const ESPACO_Y = 70

        const START_X = 10
        const START_Y = 10

        const itens = Array.from({ length: declaredGameObjects.length }, (_, i) => {
            const coluna = i % COLUNAS
            const linha = Math.floor(i / COLUNAS)

            const sprite = this.getByGameOBjectID( declaredGameObjects[ i ] ).SpriteIcon

            return {
                sprite,
                gameObject: declaredGameObjects[ i ],
                w: 50,
                h: 50,
                x: START_X + coluna * ESPACO_X,
                y: START_Y + linha  * ESPACO_Y,
            }

        })

        this.renderThings = itens
    }

    private renderUI( ctx: CanvasRenderingContext2D, cam: Camera  ){

        if( this.selected ) {

            const s = this.selected.sprite

            ctx.drawImage( this.game.getSpriteSheet(), s[0], s[1], s[2], s[3], 10, 10, 50, 50 )

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

            ctx.drawImage( this.game.getSpriteSheet(), s[0], s[1], s[2], s[3],

                i.x, i.y, i.w, i.h

            )

        })

    }

    public render( ctx: CanvasRenderingContext2D, cam: Camera ) {

        this.renderUI( ctx, cam )

    }

    public getTileSize = () => this.tileSize 

    private getByGameOBjectID< T extends GameObject >( t: T ): ( typeof this.classMap )[T] {

        return this.classMap[ t ]

    }

}