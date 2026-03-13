export default function getCanvasConfigured(){
    
    const canvas = document.querySelector("canvas")

    if( !canvas ) throw new Error("No Canvas???")

    const ctx = canvas.getContext('2d')

    if( !ctx ) throw new Error("No Context???")

    canvas.width  = innerWidth
    canvas.height = innerHeight

    return ctx

}

