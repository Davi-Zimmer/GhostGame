class KeyEvent {

    private key: string
    private ctrl: boolean
    public preventDefault: () => void


    constructor( key: string, ctrl: boolean, preventDefault: () => void ){
        
        this.key = key

        this.ctrl = ctrl

        this.preventDefault = preventDefault

    }

    private getKey  = () => this.key
    private getCtrl = () => this.ctrl

}

export default KeyEvent