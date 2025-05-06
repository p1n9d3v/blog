---
title: Naver boostcamp
tags: [experience]
---

![[boostcamp-1.png]]

# 도전

블록체인 외주 회사에서 프론트엔드 개발을 담당했다. 외주 특성상 짧은 기한 내에 결과물을 내야 했고, 개발자보다는 '코더'로 일하는 느낌이었다.

회사 입사 전까지 프론트엔드 경험이 전무했던 터라, 기본기 없이 오직 '만드는 것'에만 집중했다. 시간이 지나면서 기본기의 중요성을 절실히 느꼈고, 동시에 성장의 한계에 부딪혔다.

그러던 중 우연히 네이버 부스트캠프 모집 공고를 보게 되었다. 사실 지원을 많이 망설였다. 초기 지원부터 멤버십, 챌린지까지 여러 단계의 테스트를 거쳐야 했기 때문이다. 최종 테스트까지 통과해야 멤버십 과정에 들어갈 수 있다는 점이 특히 부담스러웠다.

하지만 더 늦기 전에 도전해야겠다고 결심했다. 결국 회사를 퇴사하고 부스트캠프에 지원했다. 늦은 나이지만, 제대로 된 개발자로 성장하기 위한 새로운 도전을 시작한 것이다.

# 베이직

![[boostcamp-2.png]]

베이직은 부스트캠프 9기부터 새로 생긴 과정이다. 1차 코딩 테스트 결과에 따라 베이직 과정을 건너뛸 수 있다. 개발 경험이 있는 분들은 굳이 참여할 필요가 없지만, 나의 경우 베이직 과정을 통해 챌린지 과정에 더 수월하게 적응할 수 있었다.

# 챌린지

## ![[boostcamp-3.png]]

부스트캠프에서 가장 힘들었던 과정은 단연 챌린지 과정이었다. CS 관련 내용을 배우는 이 과정에서 나는 "모든 미션을 반드시 완료한다"는 목표를 세웠다. 이 목표를 이루기 위해 평일 5일 동안 잠을 거의 자지 않았다. 일주일에 12시간도 채 자지 못한 적도 있었고, 밤을 새우는 날이 대부분이었다. 매일 새로운 미션이 주어졌기에 정말 힘들었지만, 거의 모든 미션을 완료했다. 기간내에 완료하지 못한 미션은 주말에 시간을 투자하여 완료하였다.

운영진 분들은 늘 "건강이 먼저"라고 강조했지만, 나는 내가 세운 목표를 위해 잠을 희생하며 미션에 매달렸다. 그 결과 6kg이나 체중이 줄었다. 돌이켜보면 그때가 진정한 몰입과 열정의 순간이었던 것 같다. 만약 다시 그렇게 하라고 하면 못할 것 같다.

가장 후회되는 점은 기록을 제대로 남기지 않은 것이다. 과제를 완료하는 데만 집중하다 보니, 문제 해결 과정이나 배운 내용을 충분히 기록하지 못했다. 그나마 매주 회고록을 작성하며 한 주를 돌아보는 시간을 가진 것이 큰 도움이 되었다(회고록을 쓸 때는 고통스러웠지만...). 이 경험을 계기로 지금은 최대한 많은 기록을 남기려고 노력하고 있다.

챌린지 마지막 날, Zep에서 진행된 수료식에서 "가장 도움이 많이 되었던 팀원"으로 선정되어 네이버 포인트를 상으로 받았다(웹툰 쿠키 냠냠). 전혀 예상하지 못한 일이라 이름이 호명되었을 때 내가 불린 건지 몰랐다. 소감으로 무슨 말을 했는지 기억도 나지 않는다...ㅋㅋㅋ.

이때 얻은 별명이 하나 있는데, 바로 'Vim신'이다. 보안 공부를 시작했을 때부터 에디터로 vim을 사용해왔고, 지금도 개발할 때 vim을 사용한다(I love vim). 부스트캠프를 하면서 많은 사람들에게 vim의 매력을 전파하고 다녔다.

![[boostcamp-4.png]]

또 하나의 상은 내가 나 자신에게 준 "포기는 배추 셀 때만" 상이다. 끝까지 포기하지 않고 모든 미션을 완료했고, 시간 내에 끝내지 못한 부분은 주말에 마무리했다.

# 멤버십

![[boostcamp-5.png]]

챌린지 이후 테스트를 보게 된다. 멤버십 합격은 테스트와 챌린지 때 과정을 기반으로 합격자를 선발한다고 한다. 이 때 굉장히 피 말렸다. 모두 풀지는 못했지만 다행히 합격할 수 있었다.

멤버십 과정에서는 웹 풀스택과 관련된 과제와 기획부터 개발까지 진행하는 팀 프로젝트를 경험할 수 있었다. 초반 과제에서 과제 완료보다는 리액트 바벨 플러그인과 간단한 리액트를 직접 만들면서 리액트에 대해 자세히 공부하려고 노력했다(이 때 예비군 이슈도 있었는데.. 정말 더웠다.. 그리고 사격장이 그냥 절벽 수준이다..).

## Custom Babel Plugin

```ts
import { NodePath, PluginObj } from "@babel/core"
import * as t from "@babel/types"

const parseExpressionContainer = (expression: t.Expression | t.JSXEmptyExpression) => {
  const isEmpty =
    t.isNullLiteral(expression) ||
    t.isJSXEmptyExpression(expression) ||
    (t.isStringLiteral(expression) && expression.value === "") ||
    (t.isBooleanLiteral(expression) && expression.value === false) ||
    (t.isIdentifier(expression) && expression.name === "undefined")

  return isEmpty ? t.nullLiteral() : expression
}

const createAttributes = (attributes: (t.JSXAttribute | t.JSXSpreadAttribute)[]) => {
  return attributes
    .map((attr) => {
      if (t.isJSXAttribute(attr)) {
        const { name, value } = attr
        const attrName = name.name
        let attrValue = null

        if (t.isStringLiteral(value)) {
          attrValue = t.stringLiteral(value.value)
        } else if (t.isJSXExpressionContainer(value)) {
          attrValue = parseExpressionContainer(value.expression)
        }

        return t.objectProperty(
          t.identifier(attrName as string),
          attrValue ?? t.booleanLiteral(true),
        )
      }

      return null
    })
    .filter(Boolean) as t.ObjectProperty[]
}

type Children = Array<
  t.JSXText | t.JSXExpressionContainer | t.JSXSpreadChild | t.JSXElement | t.JSXFragment
>

const createChildren = (children: Children) => {
  return children
    .map((child) => {
      if (t.isJSXText(child)) {
        return t.stringLiteral(child.value.trim())
      } else if (t.isJSXExpressionContainer(child)) {
        return parseExpressionContainer(child.expression)
      }
      return child
    })
    .filter((child) => !t.isNullLiteral(child))
}

const isComponent = (path: NodePath<t.JSXElement>, tagName: string) => {
  const binding = path.scope.getBinding(tagName)
  if (binding) {
    return t.isFunctionDeclaration(binding.path.node) || t.isClassDeclaration(binding.path.node)
  }

  return false
}

export default function customJsxPlugin(): PluginObj {
  return {
    visitor: {
      JSXElement(path) {
        const openingElement = path.node.openingElement
        const tagName = (openingElement.name as t.JSXIdentifier).name

        const attributes = createAttributes(openingElement.attributes)
        const children = createChildren(path.node.children)

        const prefix = t.memberExpression(
          t.identifier("CustomReact"),
          t.identifier("createElement"),
        )

        const createElement = t.callExpression(prefix, [
          isComponent(path, tagName) ? t.identifier(tagName) : t.stringLiteral(tagName),
          attributes.length > 0 ? t.objectExpression(attributes) : t.nullLiteral(),
          ...(children as t.Expression[]),
        ])

        path.replaceWith(createElement)
      },
    },
  }
}
```

바벨에서 이미 `isJSXEmptyExpression`, `isJSXText`와 같이 다양한 JSX에 관련된 메소드를 제공하고 있어서 어렵지 않게 구현을 했다. 직접 구현을 하게 되면서 JSX 파싱 과정을 더 자세히 이해할 수 있게 되었다.

## Custom React

```ts
import { Fiber, ReactElement, Props } from "packages/custom-react/types"

function createTextElement(text: string) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
    },
  }
}

function createElement(
  type: string | Function,
  props: { [key: string]: any } | null,
  ...children: any[]
): ReactElement {
  const flatChildren = children.flat()

  return {
    type,
    props: {
      ...props,
      children: flatChildren.map((child) => {
        if (typeof child === "object") {
          return child
        } else {
          return createTextElement(String(child))
        }
      }),
    },
  }
}

function syncRender(element: ReactElement, container: HTMLElement) {
  if (element.type === "TEXT_ELEMENT") {
    return container.appendChild(document.createTextNode(element.props.nodeValue as string))
  }

  const dom = document.createElement(element.type as string) // Not yet Function component

  const isProperty = (key: string) => key !== "children"

  Object.keys(element.props)
    .filter(isProperty)
    .forEach((name) => {
      if (name.startsWith("on")) {
        const eventName = name.slice(2).toLowerCase()
        dom.addEventListener(eventName, element.props[name])

        return
      } else {
        dom.setAttribute(name, element.props[name])
      }
    })

  element.props.children.forEach((child: ReactElement) => syncRender(child, dom))
  container.appendChild(dom)
}

/* Fiber */

let nextUnitOfWork: Fiber | null = null
let wipRoot: Fiber | null = null
let current: Fiber | null = null
let deletions: any = []
let wipFiber: Fiber | null = null
let hookIndex = 0

function createRoot(container: HTMLElement) {
  wipRoot = {
    type: container.tagName.toLowerCase(),
    dom: container,
    props: {
      children: [],
    },
    parent: null,
    sibling: null,
    child: null,
    alternate: current,
  }

  nextUnitOfWork = wipRoot

  return {
    render: (element: ReactElement) => {
      if (!nextUnitOfWork) throw new Error("No root found")

      nextUnitOfWork.props!.children.push(element)
      requestIdleCallback(workLoop)
    },
  }
}

function workLoop(deadline: IdleDeadline) {
  while (nextUnitOfWork && deadline.timeRemaining() > 1) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
  }

  if (!nextUnitOfWork && wipRoot) {
    commitRoot()
  }

  requestIdleCallback(workLoop) // React doesn't use this anymore now it uses Scheduler, this code occur infinite loop
}

function createDom(fiber: Fiber) {
  const dom =
    fiber.type === "TEXT_ELEMENT"
      ? document.createTextNode(fiber.props!.nodeValue as string)
      : document.createElement(fiber.type as string)

  if (dom instanceof HTMLElement) {
    updateDom(dom, fiber.alternate ? fiber.alternate.props : null, fiber.props)
  }

  return dom
}

function updateFunctionComponent(fiber: Fiber) {
  wipFiber = fiber
  hookIndex = 0
  wipFiber.hooks = []
  const children = [(fiber.type as Function)(fiber.props)]
  reconcileChildren(fiber, children)
}

function updateHostComponent(fiber: Fiber) {
  if (!fiber.dom) fiber.dom = createDom(fiber)
  const children = fiber.props?.children
  if (children) {
    reconcileChildren(fiber, children)
  }
}

function performUnitOfWork(fiber: Fiber): Fiber | null {
  if (fiber.type instanceof Function) {
    updateFunctionComponent(fiber)
  } else {
    updateHostComponent(fiber)
  }

  if (fiber.child) return fiber.child

  let nextFiber: Fiber | null | undefined = fiber
  while (nextFiber) {
    if (nextFiber.sibling) return nextFiber.sibling
    nextFiber = nextFiber.parent
  }

  return null
}

function reconcileChildren(wipFiber: Fiber, children: ReactElement[]) {
  let prevSibling: Fiber | null = null
  let oldFiber = wipFiber.alternate && wipFiber.alternate.child
  let index = 0

  while (index <= children?.length || oldFiber) {
    let newFiber: Fiber | null = null
    const child = children[index]

    const sameType = oldFiber && child && child.type === oldFiber.type

    if (sameType) {
      if (oldFiber) {
        newFiber = {
          type: oldFiber.type,
          props: child.props,
          dom: oldFiber.dom,
          parent: wipFiber,
          alternate: oldFiber,
          effectTag: "UPDATE",
        }
      }
    } else {
      if (child) {
        // Add
        newFiber = {
          type: child.type,
          props: child.props,
          parent: wipFiber,
          effectTag: "PLACEMENT",
        }
      } else if (oldFiber) {
        // Remove
        oldFiber.effectTag = "DELETE"
        deletions.push(oldFiber)
      }
    }
    if (oldFiber) {
      oldFiber = oldFiber.sibling
    }

    if (prevSibling) prevSibling.sibling = newFiber

    if (index === 0) {
      wipFiber.child = newFiber
    } else if (prevSibling && child) {
      prevSibling.sibling = newFiber
    }

    prevSibling = newFiber
    index++
  }
}

function updateDom(dom: HTMLElement, oldProps: Props, newProps: Props) {
  const isProperty = (key: string) => key !== "children" && key !== "nodeValue" && key !== "style"
  const isNodeValue = (key: string) => key === "nodeValue"
  const isEvent = (key: string) => key.startsWith("on")
  const isNotEvent = (key: string) => !key.startsWith("on")
  const isGone = (key: string) => {
    if (newProps === null) return true

    return !(key in newProps)
  }
  const isNew = (key: string) => {
    if (oldProps === null) return true
    if (newProps === null) return false

    return oldProps[key] !== newProps[key]
  }
  const isCamelCase = (key: string) => /[A-Z]/.test(key)
  const convertCamelToKebeb = (key: string) => key.replace(/([A-Z])/g, (g) => `-${g.toLowerCase()}`)
  const convertStyle = (style: { [key: string]: string }) => {
    return Object.entries(style ?? {})
      .map(([key, value]) => {
        if (isCamelCase(key)) {
          return `${convertCamelToKebeb(key)}: ${value}`
        }

        return `${key}: ${value}`
      })
      .join(";")
  }

  // remove event
  Object.keys(oldProps ?? {})
    .filter(isProperty)
    .filter(isEvent)
    .filter(isGone)
    .forEach((name: string) => {
      const eventName = name.slice(2).toLowerCase()
      dom.removeEventListener(eventName, oldProps![name])
    })

  // add event
  Object.keys(newProps ?? {})
    .filter(isProperty)
    .filter(isEvent)
    .filter(isNew)
    .forEach((name: string) => {
      const eventName = name.slice(2).toLowerCase()
      dom.addEventListener(eventName, newProps![name])
    })

  // add Style Object
  if (newProps?.style) {
    dom.setAttribute("style", convertStyle(newProps.style))
  }

  // remove property
  Object.keys(oldProps ?? {})
    .filter(isProperty)
    .filter(isNotEvent)
    .filter(isGone)
    .forEach((name: string) => {
      dom.removeAttribute(name)
    })

  // add property
  Object.keys(newProps ?? {})
    .filter(isProperty)
    .filter(isNotEvent)
    .filter(isNew)
    .forEach((name: string) => {
      dom.setAttribute(name, newProps![name])
    })

  // replace text node
  if (newProps?.nodeValue) {
    dom.textContent = newProps.nodeValue
  }
}

function commitRoot() {
  deletions.forEach(commitWork)
  commitWork(wipRoot!.child as Fiber)
  current = wipRoot
  wipRoot = null
}

function commitWork(fiber: Fiber) {
  if (!fiber) return

  let parent = fiber.parent
  while (parent && !parent.dom) {
    parent = parent.parent
  }

  const parentDom = parent!.dom

  if (fiber.effectTag === "PLACEMENT" && fiber.dom) {
    parentDom!.appendChild(fiber.dom)
  } else if (fiber.effectTag === "UPDATE" && fiber.dom) {
    updateDom(fiber.dom as HTMLElement, fiber.alternate ? fiber.alternate.props : null, fiber.props)
  } else if (fiber.effectTag === "DELETE") {
    commitDelete(fiber, parentDom as HTMLElement | null)
  }

  commitWork(fiber.child as Fiber)
  commitWork(fiber.sibling as Fiber)
}

function commitDelete(fiber: Fiber, parentDom: HTMLElement | null = null) {
  if (fiber.dom && parentDom) {
    parentDom.removeChild(fiber.dom)
  } else {
    commitDelete(fiber.child as Fiber)
  }
}

function useState(initialState: any) {
  const oldHook = wipFiber?.alternate?.hooks?.[hookIndex]

  const hook: {
    queue: any[]
    state: any
  } = {
    queue: [],
    state: oldHook ? oldHook.state : initialState,
  }

  const actions = oldHook ? oldHook.queue : []
  actions.forEach((action: any) => {
    hook.state = action instanceof Function ? action(hook.state) : action
  })

  if (wipFiber && wipFiber.hooks) {
    wipFiber.hooks.push(hook)
  }
  hookIndex++

  function setState(newState: any) {
    hook.queue.push(newState)

    wipRoot = {
      type: current!.type,
      dom: current!.dom,
      props: current!.props,
      alternate: current,
    }

    nextUnitOfWork = wipRoot
    deletions = []
  }

  return [hook.state, setState]
}

export default {
  createElement,
  createTextElement,
  syncRender,
  createRoot,
  useState,
}
```

React Fiber도 간단하게 구현을 해보았는데 처음에 어떻게 구현을 해야할지 정말 막막했는데 미친듯이 React Fiber 코드를 직접 분석하고 유튜브와 다른 사람들이 구현한 코드들을 찾아가면서 구현을 완료했다. 사실 거의 복붙이나 다름 없긴 하지만 찾아가면서 공부하고 한줄 한줄 코드를 직접 작성하다 보니 확실히 React의 이해도가 높아진 것 같다.

## Redo, Undo와 Virtual DOM

과제를 진행하면서 Redo, Undo 기능을 구현하고 싶어서 Virtual DOM 이라는 개념을 이용하여 구현을 해보았다.

### VDOM

```ts
class VNode {
  constructor(element) {
    const { tagName, attributes, nodeType, childNodes } = element
    const props = attributes
      ? [...attributes].reduce((acc, attr) => ({ ...acc, [attr.name]: attr.value }), {})
      : {}

    this.tag = tagName
    this.nodeType = nodeType
    this.props = props
    this.children = [...childNodes].map(createVNodeFromElement)
  }
}

const nodeCreators = {
  [Node.TEXT_NODE]: (element) => document.createTextNode(element.textContent),
  default: (element) => new VNode(element),
}

const elementCreators = {
  [Node.TEXT_NODE]: (vNode) => document.createTextNode(vNode.textContent),
  [Node.COMMENT_NODE]: () => document.createComment(""),
  default: ({ tag, props, children }) => {
    const element = document.createElement(tag)
    Object.entries(props).forEach(([key, value]) => element.setAttribute(key, value))
    children.forEach((child) => element.appendChild(createElementFromVNode(child)))
    return element
  },
}

const nodeUpdaters = {
  [Node.TEXT_NODE]: (parent, oldNode, newNode, index) => {
    if (oldNode.textContent !== newNode.textContent) {
      parent.replaceChild(createElementFromVNode(newNode), parent.childNodes[index])
    }
  },
  [Node.ELEMENT_NODE]: (parent, oldNode, newNode, index) => {
    const mergedProps = { ...oldNode.props, ...newNode.props }
    Object.entries(mergedProps).forEach(([key, value]) => {
      if (key === "value" && newNode.tag === "INPUT") {
        // Textarea를 안씀으로 예외
        parent.childNodes[index].value = value
      }
      if (oldNode.props[key] !== value) {
        parent.childNodes[index].setAttribute(key, value)
      }
      if (newNode.props && !(key in newNode.props)) {
        parent.childNodes[index].removeAttribute(key)
      }
    })

    const maxLen = Math.max(oldNode.children?.length, newNode.children?.length)
    for (let i = 0; i < maxLen; i++) {
      updateElements(parent.childNodes[index], oldNode.children[i], newNode.children[i], i)
    }
  },
  default: (parent, oldNode, newNode, index) => {
    if (oldNode.tag !== newNode.tag) {
      parent.replaceChild(createElementFromVNode(newNode), parent.childNodes[index])
    }
  },
}

export const createElementFromVNode = (vNode) => {
  if (!vNode) return null
  return (elementCreators[vNode.nodeType] || elementCreators.default)(vNode)
}

export const createVNodeFromElement = (element) => {
  if (!element) return null
  return (nodeCreators[element.nodeType] || nodeCreators.default)(element)
}

export const updateElements = (parent, oldNode, newNode, index) => {
  if (!oldNode) {
    parent.appendChild(createElementFromVNode(newNode))
  } else if (!newNode) {
    parent.removeChild(parent.childNodes[index])
  } else {
    const updater = nodeUpdaters[oldNode.nodeType] || nodeUpdaters.default
    updater(parent, oldNode, newNode, index)
  }
}
```

### Redo, Undo

```ts
import { createVNodeFromElement, updateElements } from "./vdom"

const MAX_UNDO_REDO = 5

const _redo = []
const _undo = []

const updateUndo = (selector, snapshot) => {
  if (_undo.length >= MAX_UNDO_REDO) {
    _undo.shift()
  }

  _undo.push({ selector, snapshot })
}

const updateRedo = (selector, snapshot) => {
  if (_redo.length >= MAX_UNDO_REDO) {
    _redo.shift()
  }

  _redo.push({ selector, snapshot })
}

const redo = () => {
  if (_redo.length <= 0) return false

  const { snapshot, selector } = _redo.pop()

  const current = document.querySelector(selector)
  const vCurrent = createVNodeFromElement(current)

  updateElements(current.parentElement, vCurrent, snapshot, 0)
  updateUndo(selector, vCurrent)

  return true
}

const undo = () => {
  if (_undo.length <= 0) return false

  const { snapshot, selector } = _undo.pop()

  const current = document.querySelector(selector)
  const vCurrent = createVNodeFromElement(current)

  updateElements(current.parentElement, vCurrent, snapshot, 0)
  updateRedo(selector, vCurrent)

  return true
}

const updateDOMSnapshot = (selector) => {
  const snapshot = createVNodeFromElement(document.querySelector(selector))

  _undo.push({ selector, snapshot })
}

export default { redo, undo, updateDOMSnapshot }
```

이벤트가 발생했을 때 DOM 트리를 리스트에 저장하고, Redo, Undo가 발생했을 때 React와 같이 tag, key, name, attribute 등을 비교하여 변경된 부분만 DOM을 업데이트하는 방법으로 구현했다. 처음에는 root 노드를 변경하여 모든 DOM 트리를 변경하는 방법을 생각했지만, Virtual DOM을 직접 구현하고 활용해보고 싶어 직접 구현했다. 완벽하게 구현한 것이 아니어서 성능적으로 그렇게 차이가 있지는 않았으나 좋은 경험이었다고 생각한다.

## 팀 프로젝트

![[boostcamp-6.png]]

나는 [Cloud Canvas](https://github.com/p1n9d3v/web37-cloud-canvas)라는 Naver Cloud의 GUI 기반 인프라 관리 도구 프로젝트의 프론트엔드로 참여했다. UI는 [Cloud Craft](https://www.cloudcraft.co/)를 모방해서 만들었고 차이점은 다이어그램을 Terraform 코드로 변환하는 것이었다.

6~7주라는 짧은 기간에 기획부터 개발까지 진행하기 쉽지 않았다. 특히 우리 팀은 중간에 기획이 변경되면서 성공적으로 프로젝트를 완수할 수 있을지에 대해 많은 걱정이 있었다. 특히 내가 맡은 프론트 부분이 문제였는데, 라이브러리 없이 2D, 3D를 구현해야 했고 컴퓨터 그래픽스 지식도 부족했을 뿐더러 혼자 프론트를 맡다 보니 시간이 너무 부족했다. 나 때문에 최종 발표에서 발표도 못할까 봐 걱정이 많았다. 이때는 챌린지 때보다 잠을 더 안 잔 것 같다.

다행히도 문제가 발생했을 때 팀원들이 같이 고민해주고 같이 구현해 나가면서 성공적으로 최종 발표를 마칠 수 있었다. 역시 팀 프로젝트에서 중요한 것은 문제와 코드가 나만의 책임이 아닌 모두의 책임이라는 마인드로 참여해야 하는 것 같다.

# 마무리

기나긴 여정 끝에 무사히 부스트캠프 여정을 완료할 수 있었다. 학습적인 측면에서도 많은 성장을 이루었지만, 가장 좋았던 것은 좋은 동료와 멘토님들을 만날 수 있었던 것이라고 생각한다(최근에 멘토님 결혼식도 다녀왔다!!).

이 모든 성장의 여정을 함께 해준 네이버 부스트캠프 운영진 분들, 든든한 버팀목이 되어준 팀원들, 그리고 아낌없는 지도와 조언을 해주신 멘토님들께 깊은 감사의 마음을 전하며, 지속적으로 성장할 수 있는 개발자가 되도록 노력하겠다.
