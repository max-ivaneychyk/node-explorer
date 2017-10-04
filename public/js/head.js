window.addEventListener('load', function () {
    let head = document.getElementsByTagName('header')[0];
    head.addEventListener('click', function (e) {
        let elem = e.target;
        let command;

        if (!elem) {
            return;
        }

        if (! (command = elem.getAttribute('data-command')) ) {
            return false;
        }

        console.log(command);
    });
});