import React from 'react';

class File extends React.Component {
    constructor(props) {
        super(props);
        this.state = {renameFlag: false};
        this.onOpen = this.onOpen.bind(this);
        this.onSelect = this.onSelect.bind(this);
        this.onRename = this.onRename.bind(this);
        this.onDelete = this.onDelete.bind(this);
    }
    onOpen (e) {
      let elem = e.target;
      let path = elem.getAttribute('data-path');
      this.props.changeCurrentPath( this.props.currentPath.concat(path) )
    }
    onSelect (e) {
        e.target.classList.add('selected-file');
        this.props.onFocus(this)
    }
    onRename () {
        console.log('rename');
    }
    onDelete () {
        console.log('delete');
    }
    editNameRender (name) {
        let inputStyle = {zIndex: 100};
        return (
            <input className='title' value={name} type="text" style={inputStyle} />
        );
    }
    normalNameRender (name) {
        return (
            <h3 className="title"> {name} </h3>
        )
    }
    render() {
        let data = this.props.data;

        return (
            <div className="one-file" >
                <div className={[data.format, 'icon'].join(' ')}> </div>
                {
                    this.state.renameFlag ? this.editNameRender(data.name) : this.normalNameRender(data.name)
                }
                <div onDoubleClick={this.onOpen}
                     onClick={this.onSelect}
                     className="event-layer" data-path={data.path}> </div>
            </div>
        );
    }
}

export default File;
