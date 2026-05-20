class Animation {

    private frame = 0
    private animationRuning = false
    private animationName: string = ""

    private animationDelay = 0

    private sprites: Record< string, Array< [ number, number, number, number, number ]> > = {}

    public createAnimations( ...names: string[] ){

        for( let i = 0; i < names.length - 1; i++ ){

            this.sprites[ names[ i ] ] = []

        }

    }

    public forSprites( x: number, y: number, w: number, h: number, frames: number, animationName: string, frameDelay: number ){

        this.sprites[ animationName ] = []

        for( let i = 0; i < frames; i++ ){

            this.sprites[ animationName ].push( [ x + i * w + i * 2, y, w, h, frameDelay ] )

        }

        if( this.animationName === "" ) this.animationName = animationName

    }

    private nextFrame(){

        this.frame++

        if( this.frame > this.sprites[ this.animationName ].length -1 ){
            this.frame = 0
            
            return true 
        }

        return false

    }

    public stepAnimationDelay(){
        
        this.animationDelay++

        if( this.animationDelay > this.sprites[ this.animationName ][this.frame][ 4 ] ){
            this.animationDelay = 0

            return this.nextFrame()

        }

        return false

    }

    public changeAnimationTo = ( name: string ) => this.animationName = name

    public getFrameCoords = () => this.sprites[ this.animationName ][ this.frame ]

    public playAnimation = () => this.animationRuning = true
    public stopAnimation = () => this.animationRuning = false
    public isRunning = () => this.animationRuning

    public getFrame = () => this.frame

    public setAnimationRunning = ( b: boolean ) => this.animationRuning = b


}

export default Animation