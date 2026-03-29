export default async function Post( endPoint: string, body?: Object ){
    const p = window.location + endPoint
    
    return (await fetch( p, {
        method: "POST",
        headers: {
            'Content-Type': 'Application/json'
        },
        body: body ? JSON.stringify( body ) : null 
    }  ))

}