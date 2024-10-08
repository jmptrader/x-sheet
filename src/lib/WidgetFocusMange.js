/* global document */
import { Constant } from '../const/Constant';
import { XEvent } from './XEvent';
import { Element, h } from './Element';
import { SheetUtils } from '../utils/SheetUtils';

/**
 * WidgetFocusMange
 */
class WidgetFocusMange {

  /**
   * WidgetFocusMange
   */
  constructor(options) {
    this.items = [];
    this.activate = {};
    this.native = {};
    this.element = null;
    this.options = SheetUtils.copy({
      root: h(document.body),
    }, options);
    this.downHandle = (event) => {
      const element = new Element(event.target);
      const find = this.include(element);
      this.element = element;
      if (find) {
        const { target } = find;
        this.forward({
          target, event,
        });
      } else {
        this.forward({
          target: null, event: null,
        });
      }
    };
    this.focusHandle = (event) => {
      const element = new Element(event.target);
      const find = this.include(element);
      this.element = element;
      if (find) {
        const { target } = find;
        this.forward({
          target, event,
        });
      } else {
        this.forward({
          target: null, event: null,
        });
      }
    };
    this.bind();
  }

  /**
   * 绑定事件处理程序
   */
  bind() {
    const { downHandle } = this;
    const { focusHandle } = this;
    XEvent.bind(document, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, downHandle, true);
    XEvent.bind(document, Constant.SYSTEM_EVENT_TYPE.FOCUS, focusHandle, true);
  }

  /**
   * 解绑事件处理程序
   */
  unbind() {
    const { downHandle } = this;
    const { focusHandle } = this;
    XEvent.unbind(document, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, downHandle, true);
    XEvent.unbind(document, Constant.SYSTEM_EVENT_TYPE.FOCUS, focusHandle, true);
  }

  /**
   * 组件是否注册
   * @param el
   * @return {null|*}
   */
  exist(el) {
    for (let i = 0, len = this.items.length; i < len; i += 1) {
      const item = this.items[i];
      const { target } = item;
      if (target.equals(el)) {
        return item;
      }
    }
    return null;
  }

  /**
   * el 是否是注册的组件元素的子元素
   * @param el
   * @return {null|*}
   */
  include(el) {
    const docu = new Element(document);
    const body = new Element(document.body);
    const { options } = this;
    const { root } = options;
    while (true) {
      if (el.equals(root)) {
        break;
      }
      if (el.equals(docu)) {
        break;
      }
      if (el.equals(body)) {
        break;
      }
      const find = this.exist(el);
      if (find) {
        return find;
      }
      el = el.parent();
    }
    return null;
  }

  /**
   * 删除当前组件
   * @param el
   */
  remove(el) {
    this.items = this.items.filter((item) => {
      const { target } = item;
      return !target.equals(el);
    });
  }

  /**
   * 设置焦点组件
   * @param target
   * @param event
   */
  forward({
    target, event,
  }) {
    if (target) {
      this.activate = { target };
    } else {
      this.activate = {};
    }
    if (event) {
      this.native = event;
    } else {
      this.native = event || {};
    }
  }

  /**
   * 注册组件元素
   * @param target
   */
  register({ target }) {
    this.items.push({ target });
  }

  /**
   * 销毁
   */
  destroy() {
    this.unbind();
    this.items = [];
  }

}

export {
  WidgetFocusMange,
};
