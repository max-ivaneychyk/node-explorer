import React from 'react';

import Header from './Header';
import File from './File';
import Event from './Event';
import ajax from './ajax';

import '../css/main.css';


class Explorer extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            files: props.data.files,
            currentPath: ''
        };

        this.refresh = this.refresh.bind(this);
        this.filterList = this.filterList.bind(this);
        this.updateFiles = this.updateFiles.bind(this);
        this.changeCurrentPath = this.changeCurrentPath.bind(this);
        this.renderComponentsFiles = this.renderComponentsFiles.bind(this);
    }

    refresh ( newPath = this.state.currentPath) {

        ajax('ls/', {'url': newPath})
            .then(list => this.updateFiles(list))
            .catch(error => { console.log(error); });
    }
    updateFiles (list) {
        this.props.data.files = list;
        this.setState({files: list});
    }
    changeCurrentPath (fullPath) {
        this.setState({currentPath: fullPath});
        this.refresh(fullPath);
    }
    componentDidMount () {
       this.refresh();
    }
    filterList(text){
        let filteredList = this.props.files.filter(function(file){
            return file.name.toLowerCase().search(text.toLowerCase())!== -1;
        });

        this.setState({files: filteredList});
    }
    renderComponentsFiles () {
        let pathFix = {
            'drive': '//',
            'directory': '/'
        };

        return this.state.files.map( (data, key) => {
            data.name = data.mounted || data.name
            data.path = data.name + (pathFix[data.format] || '');

            return <File key={key}
                         data={data}
                         currentPath={this.state.currentPath}
                         changeCurrentPath={this.changeCurrentPath}/>
        })
    }
    render() {
        return(
            <div className="explorer">
                <Header path={this.state.currentPath}/>
                <div>
                    { this.renderComponentsFiles() }
                </div>
            </div>
        );
    }
}

export default Explorer;
