window.addEventListener('load', function() {

    "use strict";

    /**
     * Function to check if we clicked inside an element with a particular class
     * name.
     *
     * @param {Object} e The event
     * @param {String} className The class name to check against
     * @return {Boolean}
     */
    function clickInsideElement( e, className ) {
        var el = e.srcElement || e.target;

        if ( el.classList.contains(className) ) {
            return el;
        } else {
            while ( el = el.parentNode ) {
                if ( el.classList && el.classList.contains(className) ) {
                    return el;
                }
            }
        }

        return false;
    }

    /**
     * Get's exact position of event.
     *
     * @param {Object} e The event passed in
     * @return {Object} Returns the x and y position
     */
    function getPosition(e) {
        var posx = 0;
        var posy = 0;

        if (!e) var e = window.event;

        if (e.pageX || e.pageY) {
            posx = e.pageX;
            posy = e.pageY;
        } else if (e.clientX || e.clientY) {
            posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }

        return {
            x: posx,
            y: posy
        }
    }

    //////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////
    //
    // C O R E    F U N C T I O N S
    //
    //////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////

    /**
     * Variables.
     */
    var contextMenuActive = "context-menu--active";
    var taskItemClassName = "event-layer";
    var menu = document.querySelector("#context-menu");
    var menuState = 0;



    menu.addEventListener('click', function (e) {
        let el = e.target;
        let command = el.getAttribute('data-action');
        if(!command)return;
        app.event.emit(command);
    });

    /**
     * Listens for contextmenu events.
     */
     document.addEventListener( "contextmenu", function(e) {
         var taskItemInContext = clickInsideElement( e, taskItemClassName );

         if ( taskItemInContext ) {
             chooseFile(taskItemInContext);
             e.preventDefault();
             app.event.emit('open-context-menu');
             positionMenu(e);
         } else {
             taskItemInContext = null;
             app.event.emit('close-context-menu');
         }
     });

    function chooseFile(el) {
        var _class = 'choose';
        var elements = document.getElementsByClassName(_class);
        // clear
        for (var i = 0; i < elements.length; i++) {
            elements[i].classList.remove(_class);
        }

        if (!el) {
            return false;
        }
        // choose one
        el.classList.add(_class);
    }

    /**
     * Listens for click events.
     */
    function clickListener() {
        document.addEventListener( "click", function(e) {
            var clickeElIsLink = clickInsideElement( e, taskItemClassName );

            chooseFile(clickeElIsLink);

            if ( clickeElIsLink ) {
                e.preventDefault();
                menuItemListener( clickeElIsLink );
            } else if (!e.target.closest('a[data-action]') ) {
                var button = e.which || e.button;
                if ( button === 1 ) {
                    app.event.emit('close-context-menu');
                }
            }
        });
    }

    /**
     * Listens for keyup events.
     */
    function keyupListener() {
        window.onkeyup = function(e) {
            if ( e.keyCode === 27 ) {
                app.event.emit('close-context-menu');
            }
        }
    }

    /**
     * Window resize event listener
     */
    function resizeListener() {
        window.onresize = function(e) {
            app.event.emit('close-context-menu');
        };
    }

    /**
     * Turns the custom context menu on.
     */
    app.event.on('open-context-menu', function () {
        if ( menuState !== 1 ) {
            menuState = 1;
            menu.classList.add( contextMenuActive );
        }

        app.event.once.oneOf([
            'context-menu-item-open',
            'context-menu-item-copy',
            'context-menu-item-rename',
            'context-menu-item-delete',
            'close-context-menu'
        ], function (data) {
            // не обрабатываем ничего, если срабатывает событие закрытия меню
            if (data._eventName === 'close-context-menu') {
                return false;
            }

            let chooseFiles = document.getElementsByClassName('choose');
            let triggerEvent = data._eventName.split('-');
            // тригерим событие и отправляем файлы на обработку
            app.event.emit(triggerEvent[triggerEvent.length - 1], {
                files: Array.prototype.slice.call(chooseFiles, 0)
            });
            // скрываем меню
            app.event.emit('close-context-menu');
        })
    });

    /**
     * Turns the custom context menu off.
     */
    app.event.on('close-context-menu', function () {
        if ( menuState !== 0 ) {
            menuState = 0;
            menu.classList.remove( contextMenuActive );
        }
    });

    /**
     * Positions the menu properly.
     *
     * @param {Object} e The event
     */
    function positionMenu(e) {
        let clickCoords = getPosition(e);
        let clickCoordsX = clickCoords.x;
        let clickCoordsY = clickCoords.y;

        let menuWidth = menu.offsetWidth + 4;
        let menuHeight = menu.offsetHeight + 4;

        let windowWidth = window.innerWidth;
        let windowHeight = window.innerHeight;

        if ( (windowWidth - clickCoordsX) < menuWidth ) {
            menu.style.left = windowWidth - menuWidth + "px";
        } else {
            menu.style.left = clickCoordsX + "px";
        }

        if ( (windowHeight - clickCoordsY) < menuHeight ) {
            menu.style.top = windowHeight - menuHeight + "px";
        } else {
            menu.style.top = clickCoordsY + "px";
        }
    }

    /**
     * Dummy action function that logs an action when a menu item link is clicked
     *
     * @param {HTMLElement} link The link that was clicked
     */
    function menuItemListener( link ) {
        console.log( "Task ID - " , link);
        app.event.emit('close-context-menu');
    }

    /**
     * Initialise our application's code.
     */
      clickListener();
      keyupListener();
      resizeListener();


      app.event.on('delete', function (data) {
          ajax('command/', {'files': data.files}, function (list) {

          });
      })
});