/**
 * @file модуль управления событями приложения Конструкторы: {@link Event}.
 * Методы: {@link event.addEvent}, {@link event.hasEvent}, {@link event.on}, {@link event.once}, {@link event.onDel}, {@link event.getEventList},
 */

window.app = {};
(function (app) {
    app.event = {};
	var event = app.event;
	var events = {};


	/**
	 * @global
	 * @param {String} name название события
	 * @param {{}} objEvent объект события
	 * @param {{}} ctx контекст события
	 * @param {array} listners массив слушателей события
	 * @constructor
	 * @desc записываеться в {@link event.utils~instance}
	 */
	function Event(name) {
		this.name = name;
		this.listners = [];
	}

	/**
	 * @memberOf Event
	 * @type {{constructor: Event, once: Event.once, on: Event.on, onDel: Event.onDel, trigger: Event.trigger}}
	 */
	Event.prototype = {
		constructor: Event,
		lastListenerRunFirst: function () {
			var lastFunc = this.listners.splice(this.listners.length - 1)[0];
			this.listners.unshift(lastFunc);
		},
		/**
		 * @desc добавить одноразовый ивент
		 * @param {Function} handler обработчик события
		 */
		once: function (handler) {
			var action = function () {
					handler.evently(this, arguments);
					this.onDel(action);
				}.bind(this);

			action.onceNameFunc = true;
			this.on(action);
			return this;
		},
		/**
		 * @desc добавить ивент
		 * @param {Function} handler обработчик события
		 */
		on: function (handler) {
			if (handler && handler.call) {
				this.listners.push(handler);
			} else {
				console.warn(handler, 'is not a function');
			}
			return this;
		},
		/**
		 * @desc удалить ивент
		 * @param {Function} link обработчик события
		 */
		onDel: function (link) {
			var key = this.listners.length;
			for (; key--;) {
				if (this.listners[key] === link) {
					this.listners.splice(key, 1);
				}
			}
			return null;
		},
		/**
		 * @desc вызвать (action) ивента, заставить ивент сработать
		 * @param data
		 */
		emit: function (data) {
			// clone handlers
			var listeners = [].concat(this.listners);
			// event data
			data = data || {};
			data._eventName = this.name;
			// exe all handlers
			listeners.forEach(function (handler, num) {
				handler(data, num);
			});
		}
	};
	/**
	 * @memberOf event
	 * @desc проверить наличие события
	 * @param {String} name имя события
	 * @returns {{}} объект события
	 */
	event.hasEvent = function (name) {
		return events[name];
	};
	/**
	 * @memberOf event
	 * @desc вернет уже существующее или новосозданое событие
	 * @param {String} name имя события
	 * @returns {{}} объект события
	 */
	event.event = function (name) {
		if (!event.hasEvent(name)) {
			event.addEvent(name);
		}
		return events[name];
	};

    event.addEvent = function (name) {
        try {
            if (!event.hasEvent(name)) {
                events[name] = new Event(name);
            }
        } catch (err) {
            console.error('create event error =>', err);
        }
        return events[name];
    };
	/**
	 * @memberOf event
	 * @desc проверяет наличие ивента и тригерит его
	 * @param {String} name имя события
	 */
	event.emit = function (name, data) {
		if (event.hasEvent(name)) {
			events[name].emit(data);
		} else {
			console.warn('Not found event -> ' + name);
		}
	};
	/**
	 * @memberOf event
	 * @desc добавить обработчик к событию
	 * @param {String} name имя события
	 * @param {Function} handler обработчик события
	 */
	event.on = function (name, handler) {
		return event.event(name).on(handler);
	};
    /**
     * @memberOf event
     * @desc если проскочат все именты, то выполнить обработчик
     * @param {array} arrNamesEvents массив имен событий
     * @param {Function} handler обработчик события
     */
	event.on.everyEvent = function (arrNamesEvents, handler) {
		arrNamesEvents.forEach(function (eventName) {
			event.on(eventName, handler);
		});
	};
	/**
	 * @memberOf event
	 * @desc добавить однократный обработчик к событию
	 * @param {String} name имя события
	 * @param {Function} handler обработчик события
	 */
	event.once = function (name, handler) {
		return event.event(name).once(handler);
	};
	/**
	 * @memberOf event
	 * @desc добавить однократный обработчик к массиву событий
	 * @param {array} arrNamesEvents имена событий
	 * @param {Function} handler обработчик события
	 */
	event.once.every = function (arrNamesEvents, handler) {
		var countEvents = arrNamesEvents.length;

		arrNamesEvents.forEach(function (eventName) {
			event.once(eventName, function f() {
				countEvents--;
				// all events triggered
				if (!countEvents) {
					handler();
					// clear memory
					arrNamesEvents = null;
					handler = null;
				}
			});
		});
	};

    /**
     * @memberOf event
     * @desc если хоть один ивент проскочит, то выполнить обработчик
     * @param {array} arrNamesEvents массив имен событий
     * @param {Function} handler обработчик события
     */
    event.once.oneOf = function (arrNamesEvents, handler) {
        var f = function (data) {
            arrNamesEvents.forEach(function (eventName) {
                event.onDel(eventName, f);
            });

            handler(data);
        };

        arrNamesEvents.forEach(function (eventName) {
            event.on(eventName, f);
        });
    };
	/**
	 * @memberOf event
	 * @desc удалить обработчик события
	 * @param {String} name имя события
	 * @param {Function} link обработчик события
	 */
	event.onDel = function (name, link) {
		if (events[name]) {
			events[name].onDel(link);
		}
	};
	/**
	 * @memberOf event
	 * @desc получить объект всех событий
	 * @returns {{}} объект всех событий
	 */
	event.getEventList = function () {// dev only
		return events;
	};

})(window.app);


