class Point2d {
        
    private x: number 
    private y: number

    constructor( x: number, y: number ){
        this.x = x
        this.y = y
    }

    public getX = () => this.x
    public getY = () => this.y

    public setX = ( x: number ) => this.x = x
    public setY = ( y: number ) => this.y = y

    public apply   = ( x: number , y: number ) => {
        this.x += x
        this.y += y
    }
    
    public applyX   = ( x: number ) => this.x += x
    public applyY   = ( y: number ) => this.y += y


    public extractX = () => this.x
    public extractY = () => this.y

}


export default Point2d