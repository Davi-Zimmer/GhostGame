import express from "express"
import url from "url"
import path from "path"
import Storage from "./Storage/Storage.js"

{
    const app = express()

    app.use( express.json() )

    const filepath = url.fileURLToPath( import.meta.url ) 
    const dirname = path.dirname( filepath )
    const root = path.join( dirname, "../Game",)

    app.use( '/', express.static( root ) )

    app.get( '/', ( _, res ) => { 
        
        const mainFile = path.join( root, "Pages", "Main.html" )
        
        res.sendFile( mainFile )

    })

    app.post('/storage/map/save', ( req, res ) => {

        const b = req.body

        if( !b.mapName || !b.data ) {
            
            res.status( 400 )
            
            return

        }

        try {
            new Storage().write( b.mapName, JSON.stringify( b.data ) )

            res.sendStatus( 200 )

        } catch( err ) {
            res.sendStatus( 500 )
            console.log( err )
        
            return
        }

    })

    app.post('/storage/map/load', ( req, res ) => {
        const b = req.body

        if( !b.mapName ) {
            
            res.status( 400 )
            
            return

        }

        try {

            res.status( 200 ).json(
                new Storage().read( b.mapName )
            )
            
            return

        } catch( err ) {
            res.sendStatus( 500 )
            console.log( err )
        }


    })


    const port = 5500
    const host = "localhost"

    app.listen( port, host, () => {

        console.log( `http://${host}:${port}` )

    })

}