import KeyEvent from "./KeyEvent.js"

type MouseFunc = ( e: MouseEvent ) => void
type KeyFunc = ( event: KeyEvent ) => void

interface KeyHandlersInterface {
    onPress : Set< KeyFunc >
    onDown  : Set< KeyFunc >
    onUp    : Set< KeyFunc >
    pressed : boolean
}


class EventManager {
    
    public addEvents( canvas: HTMLCanvasElement ) {

        canvas.addEventListener('keydown'  , e => this.keyDownTrigger( e ) )
        canvas.addEventListener('keyup'    , e => this.keyUpTrigger( e ) )

        canvas.addEventListener('mousedown'  , e => this.mouseDownTrigger( e ))
        canvas.addEventListener('mousemove'  , e => this.mouseMoveTrigger( e ))
        canvas.addEventListener('contextmenu', e => this.mouseContextMenuTrigger( e ))


        // canvas.addEventListener('mouseup'    , e => this.mouseUpTrigger( e ))
        // canvas.addEventListener('wheel'      , e => this.mouseWheelTrigger( e ))

    }
    

    private keyMap: Record< string, KeyHandlersInterface > = {}
    
    private keyDownTrigger( e: KeyboardEvent ) {

        const key = e.key.toLowerCase()

        const data = this.keyMap[ key ]

        if( !data ) return
        
        if( !data.pressed ){
            
            data.pressed = true
            
            const event = new KeyEvent(
                key, 
                e.ctrlKey,
                () => e.preventDefault() 
            )

            for( const callback of data.onDown ) callback( event )

        }


    }

    private keyUpTrigger( e: KeyboardEvent ) {

        const key = e.key.toLowerCase()

        const data = this.keyMap[ key ]

        if( !data ) return

        if( data.pressed ){

            data.pressed = false

            const event = new KeyEvent(
                key,
                e.ctrlKey,
                () => e.preventDefault()
            )

            for( const callback of data.onUp ) callback( event )
            
        }


    }

    private ensureKey( key: string ) {

        if( this.keyMap[ key ] ) return

        this.keyMap[ key ] = {
            
            onDown  : new Set(),
            onPress : new Set(),
            onUp    : new Set(),
            pressed : false

        }

    }

    public executeKeyPressed(){
        for( const key in this.keyMap ){
            
            const data = this.keyMap[ key ]

            if( data.pressed ){
                const event = new KeyEvent(
                    key,
                    false,
                    () => console.log('no preventDefault')
                )

                for( const callback of data.onPress ) callback( event )

            }
            
        }

    }

    public onDown = ( key: string, callback: KeyFunc ) => {
        
        this.ensureKey( key )

        this.keyMap[ key ].onDown.add( callback )
        
    }

    public onUp = ( key: string, callback: KeyFunc ) => {
        
        this.ensureKey( key )

        this.keyMap[ key ].onUp.add( callback )

    }

    public onPress = ( key: string, callback: KeyFunc ) => {
        
        this.ensureKey( key )
        
        this.keyMap[ key ].onPress.add( callback )

    }


    private mouseDownCallbacks : Record< string, Function[] > = {}
    private mouseUpCallbacks   : Record<string, Function[]> = {}

    private mouseMoveCallbacks:Function[] = []

    
    private mouseDownTrigger( e: MouseEvent ) {

        this.mouseDownCallbacks[ e.button ]?.forEach( callback => callback( e ) )

    }

    private mouseMoveTrigger( e: MouseEvent ){
        
        this.mouseMoveCallbacks.forEach( callback => callback( e ) )
        
    }

    private mouseContextMenuTrigger( e: PointerEvent ) {
        
        e.preventDefault()

        this.mouseDownCallbacks[ e.button ]?.forEach( cb => cb( e ) )


    }
     
    
    public onMouseDown = ( button: number, callback: MouseFunc ) => {

        if( !this.mouseDownCallbacks[ button ] ) this.mouseDownCallbacks[ button ] = []

        this.mouseDownCallbacks[button].push( callback )

    }

    public onMouseUp = ( button: number, callback: MouseFunc) => {

        if( !this.mouseUpCallbacks[ button ] ) this.mouseUpCallbacks[ button ] = []

        this.mouseUpCallbacks[button].push( callback )
        
    }

}


export default EventManager