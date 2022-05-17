import { escape } from '../utils/string'

export function element(el: Document | Element | null) {
  return {
    query: (selector: string) => element(el.querySelector(selector)),
    attr: (attribute: string) => {
      if (el.getAttribute) {
        return escape(el.getAttribute(attribute))
      }
    },
    innerHTML: () => el.innerHTML,
    innerText: () => el.innerText,
    textContent: () => el.textContent,
    text: () => escape(el.textContent),
    textUnsafe: () => el.textContent,
  }
}
