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
         * Как <div> превращается в <textarea>
         */
        var transformTrigger = 'dblclick';
        
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
            element.off(transformTrigger);
            textarea.on('blur', setContents);
            textarea.focus();
            textarea.on('paste', autoBlur);
        }

        /**
         * Автоматическое снятие фокуса с <textarea> после вставки канала
         *
         * После `Ctrl+V` в левой колонке непонятно, что делать дальше.
         * Пусть инициативу возьмёт приложение.
         *
         * Таймаут тут для "солидности", типа, "осмысленная анимация". 
         */
        function autoBlur(event) {
            $timeout(function() {
                event.target.blur();
            }, debounceValue);
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
                element.on(transformTrigger, setTextArea);
            }, debounceValue + 100);
        }

        element.on(transformTrigger, setTextArea);

        /**
         * Подсветка изменений, вызванных определенным правилом
         *
         * @param {object} rule Правило
         * @param {boolean} state Включение/отключение подсветки
         */
        scope.renderRule = function(rule, state) {
            var src = rule.matchesSrc,
                lines = element.find('p');
            src.forEach(function(value,index) {
                var hl = lines[index];
                if (state) {
                    angular.element(hl).addClass('source-line--highlighted');
                } else {
                    angular.element(hl).removeClass('source-line--highlighted');
                }
            });
        };

    };
    return {
        templateUrl: 'dir/source.html',
        link : link
    };
});
