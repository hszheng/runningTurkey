/**
 * 根据配置文件中的内容生成所有的route
 *
 * @author  Vincent Zheng
 * @version 1.0
 * @since   2015-09-18
 * @review
 */

// route的onBeforeAction事件
Router.onBeforeAction(function () {
    var self = this;

    self.next();
});

// 通过配置文件的参数生成route
_.each(SYS_ROUTES, function (route, index) {
    Router.route(route.route, {
        path: route.path,
        template: route.template,
        onBeforeAction: function (pause) {
            var self = this;

            if (self.ready()) {
                self.render();
            } else {
                self.render('loading');
            }
        }
    });
});