/**
 * Application strings
 */
app.value('strings', {
    days: ['понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота', 'воскресенье'],
    lAlga: 'Сборка',
    lRules: 'Правила',
    lPreview: 'Предпросмотр',
    lCopyHere: 'Щелкните тут два раза и вставьте содержимое канала',
    rules: {
        replace: {
            'title': "Удалять дату из строк с именем дня недели",
            'desc': "Оставлять только слова 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'."
        },
        dropEmptyLines: {
            'title': 'Удаление пустых строк',
            'desc': 'Будут удалены совершенно пустые строчки. Сохранятся строчки, состоящие только из пробелов или табуляций.'
        },
        daySplitter: {
            'title': 'Найти дни недели',
            'desc': 'Вспомогательное правило для последующей подборки каналов по дням или группировки передач',
            'tooMany': 'Что-то пошло не так...',
            'notEnough': 'Не найдены ',
        },
    }
});
