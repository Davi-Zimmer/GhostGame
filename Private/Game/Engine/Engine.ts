import Game from "../Game.js"
import getCanvasContext from "./Canvas.js"
import EventManager from "./EventManager.js"

class Engine {

    private game: Game


    constructor(){

        this.game = Game.GetInstance()

    }

    public startGame(){

        const ctx = getCanvasContext() 

        this.loop( ctx )

        this.game.events.addEvents( ctx.canvas )

        this.game.setup()

        return this.game

    }

    private loop( ctx: CanvasRenderingContext2D ){

        const loop2 = () => {

            this.update( ctx )

            requestAnimationFrame( loop2 )
        }

        loop2()

    }

    private update( ctx: CanvasRenderingContext2D ){

        this.game.update( ctx )

    }


}


const engine = new Engine()

engine.startGame()


export default Engine