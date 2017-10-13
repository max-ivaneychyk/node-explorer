let ReactDOM = require('react-dom');
let React = require('react');
import Explorer from './components/Explorer.jsx';

const propsValues = {
    files: []
};



ReactDOM.render(
    <Explorer data={propsValues}/>,
    document.getElementById("container")
);

