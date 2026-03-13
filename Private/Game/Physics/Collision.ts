import Rect from "../Objects/Basics/Rect.js"

export function IsColliding( a: Rect, b: Rect ){

    return (
        a.extractX() + a.getW() > b.extractX() &&
        a.extractY() + a.getH() > b.extractY() &&
        b.extractX() + b.getW() > a.extractX() &&
        b.extractY() + b.getH() > a.extractY()
    )

}

export function IsInside( a: Rect, b: Rect ){

    return (
        a.extractX() + a.getW() < b.extractX() &&
        a.extractY() + a.getH() < b.extractY() &&
        b.extractX() + b.getW() < a.extractX() &&
        b.extractY() + b.getH() < a.extractY()
    )

}

export function GetOverlap( a: Rect, b: Rect ){

    const dx = ( a.extractX() + a.getW() / 2 ) - ( b.extractX() + b.getW() / 2 ) 
    const dy = ( a.extractY() + a.getH() / 2 ) - ( b.extractY() + b.getH() / 2 ) 

    const px = ( a.getW() / 2  + b.getW() / 2 ) - Math.abs( dx )
    const py = ( a.getH() / 2  + b.getH() / 2 ) - Math.abs( dy )

    if( px <= 0 || py <= 0 ) return null

    return {
        x: dx > 0 ? px : -px,
        y: dy > 0 ? py : -py,
    }

}