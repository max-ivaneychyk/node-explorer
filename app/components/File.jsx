import React from 'react';
import Event from './Event';

class File extends React.Component {
    constructor(props) {
        super(props);
        this.state = {info: props.info, refresh: props.refresh};
        this.onOpen = this.onOpen.bind(this);
        this.onRename = this.onRename.bind(this);
        this.contextMenu = this.contextMenu.bind(this);
    }
    onOpen (e) {
      let elem = e.target;
      let path = elem.getAttribute('data-path');

      Event.emit('explorer-update', path);
    }
    onRename (e) {

    }
    isDrive () {
        return !!this.state.info.mounted;
    }
    contextMenu () {

    }
    render() {
        let info = this.props.info;
        let driveFlag = this.isDrive();
        let name = driveFlag ? info.mounted : info.name;

        let format;
        let path;

        if (info.format === 'directory') {
            path = name + '/';
            format = 'folder';
        } else if (info.format === 'file') {
            path = name;
            format = 'file-';
        } else if (driveFlag) {
            path = name + '//';
            format = 'drive';
        }

        return (
            <div className="file" >
                <div className={[format, 'icon'].join(' ')}> </div>
                <h3 className="title"> {name} </h3>
                <div onDoubleClick={this.onOpen}
                     onContextMenu={this.contextMenu}
                     onClick={this.onRename}
                     className="event-layer" data-path={path}> </div>
            </div>
        );
    }
}

export default File;
