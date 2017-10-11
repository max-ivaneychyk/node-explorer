let ReactDOM = require('react-dom');
let React = require('react');
let ItemsList = require('./components/ItemsList');

const propsValues = {
    title: "Список смартфонов",
    items: [
        "HTC U Ultra",
        "iPhone 7",
        "Google Pixel",
        "Huawei P9",
        "Meizu Pro 6",
        "Asus Zenfone 3"
    ]
};

ReactDOM.render(
    <ItemsList data={propsValues} />,
    document.getElementById("container")
);
