let React = require('react');

class Modal extends React.Component {
    constructor(props){
        super(props);
        this.state = {};
    }
    componentDidMount(){
        $("#modal").iziModal();
        /* Instantiating iziModal */
        $("#modal-custom").iziModal({
            overlayClose: false,
            overlayColor: 'rgba(0, 0, 0, 0.6)'
        });

        /*$(document).on('click', '.trigger-custom', function (event) {
            event.preventDefault();
            $('#modal-custom').iziModal('open');
        });*/

        /* JS inside the modal */

        $("#modal-custom").on('click', 'header a', function(event) {
            event.preventDefault();
            var index = $(this).index();
            $(this).addClass('active').siblings('a').removeClass('active');
            $(this).parents("div").find("section").eq(index).removeClass('hide').siblings('section').addClass('hide');

            if( $(this).index() === 0 ){
                $("#modal-custom .iziModal-content .icon-close").css('background', '#ddd');
            } else {
                $("#modal-custom .iziModal-content .icon-close").attr('style', '');
            }
        });

        $("#modal-custom").on('click', '.submit', function(event) {
            event.preventDefault();

            var fx = "wobble",  //wobble shake
                $modal = $(this).closest('.iziModal');

            if( !$modal.hasClass(fx) ){
                $modal.addClass(fx);
                setTimeout(function(){
                    $modal.removeClass(fx);
                }, 1500);
            }
        });


    }
    render() {
        return(
            <div id="modal-custom" data-iziModal-group="grupo1">
                <button data-iziModal-close className="icon-close">x</button>
                <header>
                    <a href="" id="signin">Sign in</a>
                    <a href="" className="active">New Account</a>
                </header>
                <section className="hide">
                    <input type="text" placeholder="Username"/>
                        <input type="password" placeholder="Password"/>
                            <footer>
                                <button data-iziModal-close>Cancel</button>
                                <button className="submit">Log in</button>
                            </footer>
                </section>
                <section>
                    <input type="text" placeholder="Username"/>
                        <input type="text" placeholder="Email"/>
                            <input type="password" placeholder="Password"/>
                                <label for="check">
                                    <input type="checkbox" name="checkbox" id="check" value="1"/> I agree to the <u>Terms</u>
                                </label>
                                <footer>
                                    <button data-iziModal-close>Cancel</button>
                                    <button className="submit">Create Account</button>
                                </footer>
                </section>
            </div>
        );
    }
}


module.exports = Modal;