let ReactDOM = require("react-dom");
let React = require("react");
import Explorer from "./components/Explorer.jsx";

import  './less/index.less'

const propsValues = {
	files: []
};

ReactDOM.render(
	<Explorer data={propsValues}/>,
	document.getElementById("container")
);

