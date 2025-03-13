---
title: React 배치 처리(batching)
tags: [react]
---

React에서의 리렌더링의 가장 기본적인 기준은 상태 변경이다. React18 이전에는 React 이벤트 핸들러 내부에서만 자동으로 배치 처리가 되었다. React18 이후에는 React 이벤트 핸들러 뿐만 아니라 `setTimeout`,`Promise`, 네이티브 이벤트 핸들러 등 비동기 콜백 내부에서도 배치 처리가 가능하게 되었다.

# 배치 처리란?

배치 처리는 React에서 여러 상태 업데이트를 하나로 묶어 단일 렌더링으로 처리하는 최적화 기법이다. 배치 처리가 적용되면 여러 상태 업데이트가 발생하여도 한 번만 렌더링을 하게된다.

# React 배치 처리

## React v16

```jsx
eexport default function App() {
  const [count, setCount] = React.useState(0)
  const [flag, setFlag] = React.useState(false)

  const handleClick = () => {
      setCount((c) => c + 1)
      setFlag((f) => !f)
  }

  console.log(count, flag)

  return (
    <div className="App">
      <button onClick={handleClick}>click</button>
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
    </div>
  )
}
```

![[batching-2.gif]]

React v16에서는 React 이벤트 핸들러를 통해서 여러 상태를 변경해도 오직 한번만 리렌더링이 된다. 하지만 아래와 같이 비동기 함수를 통해서 상태를 변경하게 되면 여러번 리렌더링이 발생하게 된다.

```jsx
export default function App() {
  const [count, setCount] = React.useState(0)
  const [flag, setFlag] = React.useState(false)

  const handleClick = () => {
    setTimeout(() => {
      setCount((c) => c + 1) // 첫 번째 렌더링 유발
      setFlag((f) => !f) // 두 번째 렌더링 유발
    }, 0)
  }

  console.log(count, flag)

  return (
    <div className="App">
      <button onClick={handleClick}>click</button>
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
    </div>
  )
}
```

![[batching-1.gif]]

## React v18

```jsx
function App() {
  const [count, setCount] = React.useState(0)
  const [flag, setFlag] = React.useState(false)

  const handleClick = () => {
    setTimeout(() => {
      setCount((c) => c + 1) // 첫 번째 렌더링 유발
      setFlag((f) => !f) // 두 번째 렌더링 유발
    }, 0)
  }

  console.log(count, flag)

  return (
    <div className="App">
      <button onClick={handleClick}>click</button>
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
    </div>
  )
}
```

![[batching-3.gif]]

React v18은 자동 배치 처리가 적용되어 모즌 상태 업데이트가 어디서 발생하든 자동으로 배치 처리가 된다.

# ReactDOM.flushSync

때로는 상태 업데이트가 즉시 반영되고 독립적으로 렌더링이 필요할 때가 있다. 이런 경우 `ReactDOM.flushSync`를 사용하여 배치 처리를 방지할 수 있다.

```jsx
import { flushSync } from "react-dom"

function handleClick() {
  // 즉시 렌더링 (첫 번째 렌더링)
  flushSync(() => {
    setCounter((c) => c + 1)
  })

  // 또 즉시 렌더링 (두 번째 렌더링)
  flushSync(() => {
    setFlag(!flag)
  })
}
```

상태 업데이트가 발생하면 업데트된 상태를 즉시 적용하고 DOM을 갱신하다.
