class Animation {

    private frame = 0
    private animationRuning = false
    private animationName = "down"

    private animationDelay = 0

    private sprites: Record< string, Array< [ number, number, number, number, number ]> > = {}


    public createAnimations( ...names: string[] ){

        for( let i = 0; i < names.length - 1; i++ ){

            this.sprites[ names[ i ] ] = []

        }

    }

    public forSprites( x: number, y: number, w: number, h: number, frames: number, animationName: string, franeDelay: number ){

        this.sprites[ animationName ] = []

        for( let i = 0; i < frames; i++ ){

            this.sprites[ animationName ].push( [ x + i * w + i * 2, y, w, h, franeDelay ] )

        }

    }

    private nextFrame(){

        this.frame++

        if( this.frame > this.sprites[ this.animationName ].length -1 ){
            this.frame = 0
        }

    }

    public stepAnimationDelay(){
        
        this.animationDelay++

        if( this.animationDelay > this.sprites[ this.animationName ][this.frame][ 4 ] ){
            this.animationDelay = 0

            this.nextFrame()
        }

    }

    public changeAnimationTo = ( name: string ) => this.animationName = name

    public getFrameCoords = () => this.sprites[ this.animationName ][ this.frame ]

    public playAnimation = () => this.animationRuning = true
    public stopAnimation = () => this.animationRuning = false
    public isRunning = () => this.animationRuning

    public getFrame = () => this.frame


}

export default Animation