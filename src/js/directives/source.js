/**
 * Левая колонка с исходником канала
 *
 * Состояния:
 * В фокусе -- <textarea> с текстом канала
 * Вне фокуса -- блок с текстом канала
 */
app.directive('tvmSource', function($compile, $timeout) {
    var link = function(scope, element) {
        var debounceValue = 500;
        /**
         * Формирование <textarea> (режим редактирования)
         */
        function setTextArea() {
            var textarea = '<textarea ' + 
                'ng-change="setChannelContent(channel)" ' + 
                'ng-model="channel.content" ' + 
                'ng-model-options="{debounce: ' + debounceValue + '}">' + 
            '</textarea>';
            element[0].innerHTML = textarea;
            $compile(element.contents())(scope);
            textarea = element.find('textarea');
            element.off('click');
            textarea.on('blur', setContents);
            textarea.focus();
        }

        /**
         * Исходник канала в режиме просмотра
         */
        function setContents() {
            /**
             * Тут Race condition. Модель обновится не сразу (потому что debounce),
             * и в момент `onblur` channel.content может оказаться undefined;
             *
             * Покажем короткую анимацию.
             */
            element[0].innerHTML = '<div class="source-loading" layout="row" layout-align="center center">' +
                '<md-progress-linear class="md-primary" md-mode="indeterminate"></md-progress-linear>' +
            '</div>';
            $compile(element.contents())(scope);

            $timeout(function() {
                var lines = scope.splitChannel(scope.channel);
                /**
                 * Не хочу использовать тут `ng-repeat`, потому что вотчеров *может*
                 * получится очень много (в зависимости от количества строк в канале)
                 */
                var content = '<div>';
                lines.forEach(function(value, index) {
                    content += '<p data-index="' + index + '" class="source-line">' + value + '</p>';
                });
                content +='</div>';
                element[0].innerHTML = content;
                $compile(element.contents())(scope);
                element.on('click', setTextArea);
            }, debounceValue + 100);
        }

        element.on('click', setTextArea); 
    };
    return {
        templateUrl: 'dir/source.html',
        link : link
    };
});
