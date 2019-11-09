/**
 * command: document.execCommand存在一些缺陷，此函数进行一些修复
 */
import Editor from './editor';

export default function(editor: Editor, commandName: string, showDefaultUI: boolean, ...args: string[]) {
  if (commandName === 'link') {
    const startContainer = editor.range.startContainer;
    const parentNode = (<HTMLElement>startContainer.parentNode);
    if (parentNode.tagName === 'A') {
      parentNode.setAttribute('href', args[0]);
      parentNode.setAttribute('title', args[2]);
      parentNode.textContent = args[1];
    } else {
      const a = document.createElement('a');
      a.setAttribute('href', args[0]);
      a.setAttribute('title', args[2]);
      a.textContent = args[1];
      parentNode.insertBefore(a, startContainer);
    }
    return;
  }

  document.execCommand(commandName, showDefaultUI, args[0]);
}