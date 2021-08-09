import { Widget } from '../../lib/Widget';
import { Constant, cssPrefix } from '../../const/Constant';
import { h } from '../../lib/Element';
import { DragPanel } from '../dragpanel/DragPanel';
import { XEvent } from '../../lib/XEvent';

class Alert extends Widget {

  constructor({
    title = '提示',
    message = '',
    closeDestroy = true,
  } = {}) {
    super(`${cssPrefix}-alert`);
    this.title = title;
    this.message = message;
    this.closeDestroy = closeDestroy;
    // 创建 UI
    this.closeEle = h('div', `${cssPrefix}-alert-close`);
    this.titleEle = h('div', `${cssPrefix}-alert-title`);
    this.contentEle = h('div', `${cssPrefix}-alert-content`);
    this.okEle = h('div', `${cssPrefix}-alert-ok`);
    this.buttonsEle = h('div', `${cssPrefix}-alert-buttons`);
    // 显示内容消息
    this.titleEle.html(title);
    this.contentEle.html(message);
    this.okEle.html('确定');
    // 添加UI
    this.buttonsEle.children(this.okEle);
    this.children(this.closeEle);
    this.children(this.titleEle);
    this.children(this.contentEle);
    this.children(this.buttonsEle);
    // 拖拽组件
    this.dragPanel = new DragPanel().children(this);
  }

  setTitle(title) {
    this.titleEle.html(title);
    return this;
  }

  setMessage(message) {
    this.message = message;
    this.contentEle.html(message);
    return this;
  }

  bind() {
    const { okEle } = this;
    XEvent.bind(okEle, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, () => {
      this.close();
    });
  }

  unbind() {
    const { okEle } = this;
    XEvent.unbind(okEle);
  }

  open() {
    const { dragPanel } = this;
    dragPanel.open();
    this.bind();
    return this;
  }

  close() {
    const { closeDestroy, dragPanel } = this;
    dragPanel.close();
    if (closeDestroy) {
      this.destroy();
    }
    return this;
  }

  destroy() {
    super.destroy();
    this.unbind();
    this.dragPanel.destroy();
  }

}

export {
  Alert,
};
