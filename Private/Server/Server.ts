import express from "express"
import url from "url"
import path from "path"

{
    const app = express()

    const filepath = url.fileURLToPath( import.meta.url ) 
    const dirname = path.dirname( filepath )
    const root = path.join( dirname, "../Game",)

    app.use( '/', express.static( root ) )

    app.get( '/', ( _, res ) => { 
        
        const mainFile = path.join( root, "Pages", "Main.html")
        
        res.sendFile( mainFile )

    })

    const port = 8080
    const host = "localhost"

    app.listen( port, host, () => {

        console.log( `http://${host}:${port}` )

    })

}