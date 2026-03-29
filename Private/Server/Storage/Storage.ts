import fs from 'fs'
import { fileURLToPath } from 'url'
import path from 'path'

class Storage {

    private storagePath: string 

    constructor(){
        
        const filepath = fileURLToPath( import.meta.url )

        this.storagePath = path.join( path.dirname( filepath ), 'Data' )

    }

    private joinPath( filePath: string ){
        
        const p = path.join( this.storagePath, filePath )

        if( p.includes('../') ) throw new Error('"../" is not enabled') 

        return p

    }

    public write( filePath: string, data: string ){

        const path = this.joinPath( filePath )

        const splited = path.split('\\')

        splited.pop()

        const folderPath = splited.join('\\')

        if( !fs.existsSync( folderPath ) ) this.createFolder( folderPath )

        fs.writeFileSync( path, data, { encoding: 'utf-8' })

    }

    public read( filePath: string ){

        return fs.readFileSync( this.joinPath( filePath ), { encoding: 'utf-8' } )

    }

    public createFolder( folderPath: string ){

        fs.mkdirSync( folderPath, { recursive: true } )
        
    }


}

export default Storage