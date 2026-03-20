export default function NormalizeVector( dx: number, dy: number, magnitude = 1  ){

    const length = Math.sqrt( dx * dx + dy * dy )

    if( length === 0 ) return { dx: 0, dy: 0 }

    return {
        dx: (dx / length) * magnitude,
        dy: (dy / length) * magnitude
    }

}