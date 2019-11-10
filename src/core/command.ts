/**
 * command: document.execCommand存在一些缺陷，此函数进行一些修复
 */
import Editor from './editor';

export default function(editor: Editor, commandName: string, showDefaultUI: boolean, ...args: string[]) {
  if (commandName === 'createLink') {
    let range = editor.range;
    let startContainer = editor.range.startContainer;
    let parentNode = (<HTMLElement>startContainer.parentNode);

    // 光标不在a标签内，先通过document.execCommand创建链接
    if (parentNode.tagName !== 'A') {
      document.execCommand(commandName, showDefaultUI, args[0]);
      range = editor.selection.getRangeAt(0); // 内部range对象是异步更新的，所以直接获取最新range
      startContainer = range.startContainer;
      parentNode = (<HTMLElement>startContainer.parentNode);
    }

    // 设置属性、链接、文字
    parentNode.setAttribute('href', args[0]);
    parentNode.setAttribute('title', args[2]);
    parentNode.textContent = args[1];

    // 设置范围对象起始点
    const node = <Text>parentNode.firstChild;
    range.setStart(node, 0);
    range.setEnd(node, node.length);
    return;
  }

  document.execCommand(commandName, showDefaultUI, args[0]);
}