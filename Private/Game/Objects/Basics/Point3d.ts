import Point2d from "./Point2d.js"

class Point3d extends Point2d {

    private z: number = 0

    constructor( x: number, y: number, z: number ){

        super( x, y )

        this.z = z

    }

    public getZ = () => this.z

    public setZ = ( z: number ) => this.z = z 


}


export default Point3d