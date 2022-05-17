import { escape } from '../utils/string'

export function element(el: Document | Element | null) {
  return {
    query: (selector: string) => element(el.querySelector(selector)),
    queryAll: (selector: string) => el.querySelectorAll(selector),
    attr: (attribute: string) => {
      if ((el as Element).getAttribute) {
        return escape((el as Element).getAttribute(attribute))
      }
    },
    children: () => el.children,
    textContent: () => el.textContent,
    text: () => escape(el.textContent),
    textUnsafe: () => el.textContent,
  }
}
