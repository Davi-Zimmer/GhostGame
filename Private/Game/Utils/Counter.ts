class Counter {

    private current = 0
    private max

    private callback

    constructor( max: number, callback: () => any | undefined  ){

        this.max = max

        this.callback = callback

    }

    public update(){

        if( this.current > this.max ){

            this.current = 0

            this.callback()

        }
        
        this.current++

    }

    public setMax = ( m: number ) => this.max = m
    

}


export default Counter