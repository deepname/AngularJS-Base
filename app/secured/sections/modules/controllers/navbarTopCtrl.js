define([], function() {
    return ['$scope', 'authService', '$location',
        function($scope, authService, $location) {

            $scope.logout = function() {
                authService.logout();
                $location.path("/login");
            };

            // Hal9000

            var seq = "hal9000";
            var seq2 = "badday";
            var input = "";
            var time_clean = 0;
            window.addEventListener("keypress", function(e) {
                input += String.fromCharCode(e.keyCode);
                for (var i = 0; i < seq.length; i++) {
                    if ((input[i] != seq[i] && input[i] != seq2[i]) && (input[i] !== undefined)) {
                        input = "";
                    }
                }

                if (input == seq) {

                    angular.element(document).ready(function() {
                        angular.element(document).on("mousemove", function(event) {
                            var x_pos = event.pageX / 20 < 20 ? event.pageX / 20 : 20;
                            var y_pos = event.pageY / 20 < 20 ? event.pageY / 20 : 20;

                            x_pos = x_pos > 7 ? x_pos : 7;
                            y_pos = y_pos > 7 ? y_pos : 7;

                            $('.ojo').css({
                                'top': y_pos,
                                'left': x_pos
                            });
                        });
                    });

                    angular.element('.hal9000').show();
                    angular.element('.navbar-brand').find('small').text('HAL 9.0').css('margin-left', 40);
                    input = "";

                    var msg_h9 = '<div class="alert alert-msg_sender hal_alert">message_hal</div>';
                    var frases = [
                        'Hola, HAL. ¿Me estás leyendo, HAL?',
                        '… Afirmativo, ' + $scope.authData.name + '. Te leo.',
                        'Abre las compuertas de la capsula, HAL.',
                        'Lo siento, ' + $scope.authData.name + '. Temo que no puedo hacer eso.',
                        '¿Cuál es el problema?',
                        'Creo que sabes al igual que yo cuál es el problema.',
                        '¿De qué estás hablando, HAL?',
                        'Esta misión también es importante para mí como para permitir que la pongas en peligro.',
                        'No sé de qué estás hablando, HAL.'
                    ];
                    var frase_f = '';
                    var dictar = setInterval(function() {
                        if (frases.length < 2) {
                            clearInterval(dictar);
                        }
                        if (frases.length % 2 !== 0) {
                            frase_f = msg_h9.replace('msg_sender', 'warning');
                            frase_f = frase_f.replace('message_hal', frases[0]);
                        } else {
                            frase_f = msg_h9.replace('msg_sender', 'danger');
                            frase_f = frase_f.replace('message_hal', frases[0]);
                        }
                        $('.sidebar').append(frase_f);
                        frases.shift();

                    }, 1500);

                } else if (input == seq2) {
                    angular.element.getScript("http://code.onion.com/fartscroll.js", function() {
                        fartscroll();
                    });
                    angular.element('img.img-responsive.img-center').attr("src", "https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Skynet.svg/256px-Skynet.svg.png");
                } else {
                    clearTimeout(time_clean);
                    time_clean = setTimeout(function() {
                        input = "";
                    }, 5000);
                }
            });

            $scope.$apply();
        }
    ];
});
