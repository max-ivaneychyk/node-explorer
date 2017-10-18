import React from'react';
import '../css/modal.css';

let styleModalClose = {
  display: 'none'
};

let styleModalOpen = {
  display: 'block'
};

class Modal extends React.Component {
    constructor(props){
        super(props);
        this.state = {opened: false, nameFolder: '', warnMessage: ''};

        this.changeStateVisible = this.changeStateVisible.bind(this);
        this.addFolder = this.addFolder.bind(this);
        this.onChange = this.onChange.bind(this);
    }
    componentDidMount(){
        let btnOpenModal = document.getElementById('open-modal');
        btnOpenModal.addEventListener('click', this.changeStateVisible);
    }
    changeStateVisible () {
        this.setState({opened: !this.state.opened})
    }
    addFolder (e) {
        let nameFolder = this.state.nameFolder.trim();
        let hasBadSymbols = /[\/:*?"<>|]/.test(nameFolder);
        if (hasBadSymbols || !nameFolder.length) {
            this.setState({warnMessage: 'Имя папки не должно быть пустым или содержать символы \\/ : * ? " < > | '})
            return;
        }

        this.changeStateVisible();
        this.setState({nameFolder: '', warnMessage: ''});
        // todo emit event and onReload folder
    }
    onChange(e) {
        let val = e.target.value;
        this.setState({nameFolder: val, warnMessage: ''});
    }
    render() {
        return(
            <div className="modal-wrap" style={this.state.opened ? styleModalOpen : styleModalClose}>
                <div id="modal-custom" >
                    <header>
                        <p> Веедите имя папки  </p>
                    </header>
                    <section>
                        <label> {this.state.warnMessage} </label>
                        <input type="text" placeholder="Name folder" value={this.state.nameFolder} onChange={this.onChange}/>
                        <button onClick={this.changeStateVisible}>Отменить</button>
                        <button onClick={this.addFolder}>Создать</button>
                    </section>
                </div>
            </div>
        );
    }
}


export default Modal;