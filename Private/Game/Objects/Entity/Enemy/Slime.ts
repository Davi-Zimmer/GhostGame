import Entity, { EntityInterface } from "../Entity.js"

export interface SlimeInterface extends EntityInterface {
    
    quantity: number

}

class Slime extends Entity {

    constructor( props: SlimeInterface ){

        super( props )

    }


}

export default Slime