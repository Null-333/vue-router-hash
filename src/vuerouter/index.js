let _Vue = null;
class VueRouter {
  static install(Vue) {
    _Vue = Vue;
    _Vue.mixin({
      // 把创建Vue实例的时候传入router对象注入到Vue实例上
      beforeCreate() {
          if (this.$options.router) {
              _Vue.prototype.$router = this.$options.router;
          }
      },
    });
  }
  constructor(options) {
    // 注册router-link和router-view组件
    // 监听hashChange事件，当路由变化时更新组件显示
    // 构建routeMap方便查找路由
    this.routeMap = {};
    this.options = options;
    this.current = _Vue.observable({
      data: location.hash.slice(1),
    })
    this.init();
  }
  init() {
    this.initRouteMap();
    this.initComponent();
    this.initEvent();
  }
  initRouteMap() {
    this.options.routes.forEach(route => {
      this.routeMap[route.path] = route.component;
    });
  }
  initComponent() {
    const self = this;
    _Vue.component('RouterLink', {
      render(h) {
        return h('a', {
          on: {
            click: () => {
              const { to } = this.$attrs;
              self.current.data = to;
              location.hash = `#${to}`;
            }
          },
        }, this.$slots.default);
      },
    });
    _Vue.component('RouterView', {
      render: (h) => {
        const component = this.routeMap[this.current.data];
        return h(component);
      },
    });
  }
  initEvent() {
    window.addEventListener("hashchange", () => {
      this.current.data = location.hash.slice(1);
    });
  }
}
export default VueRouter;