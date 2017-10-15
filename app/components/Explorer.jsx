import React from 'react';

import Header from './Header';
import File from './File';
import Modal from './Modal';
import Event from './Event';
import ajax from './ajax';

import '../css/main.css';


class Explorer extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            files: props.data.files,
            currentPath: 'D://'
        };

        this.refresh = this.refresh.bind(this);
        this.filterList = this.filterList.bind(this);
        this.renderComponentsFiles = this.renderComponentsFiles.bind(this);
    }

    refresh (path) {
        let newPath = this.state.currentPath.concat(path || '');

        ajax('ls/', {'url': newPath})
            .then(list => {
                this.props.data.files = list;
                this.setState({files: list, currentPath: newPath});
                Event.emit('path-change', newPath);
            })
            .catch(error => {
                console.log((error));
            });

    }
    componentDidMount () {
       Event.on('explorer-update', this.refresh);
       Event.on('explorer-search', this.filterList);

       Event.emit('explorer-update');
    }
    filterList(text){
        let filteredList = this.props.data.filter(function(file){
            return file.name.toLowerCase().search(text.toLowerCase())!== -1;
        });

        this.setState({files: filteredList});
    }
    renderComponentsFiles () {
        return this.state.files.map(function(data, key){
            return <File key={key} info={data} />
        })
    }
    render() {
        return(
            <div className="explorer">
                <Header path={this.state.currentPath}/>
                <Modal/>
                <div>
                    { this.renderComponentsFiles() }
                </div>
            </div>
        );
    }
}

export default Explorer;
