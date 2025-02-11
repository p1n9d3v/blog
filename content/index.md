---
title: Test Post
---

# Reconciliation

DOM에 "무엇"인가를 추가하거나 삭제하는 것은 속도가 느리다. React를 사용하지 않고 아래의 코드의 `placeholder`를 변경하기 위해서는 DOM에 접근하여 직접적으로 `<input />` 태그의 `placeholder`에 값을 넣어줘야 한다.

```jsx
const Input = ({ placeholder }) => {
  return <input type="text" id={id} placeholder={placeholder} />
}

// somewhere else
;<Input placeholder="Input something here" />
```

```javascript
const input document.getElementById('input-id')
input.placeholder = 'something'
```

하지만 React를 사용한다면 수동적으로 추가하지 않고 DOM을 조작할 수 있다. React는 "Virtual DOM"이라는 개념(트리 구조)을 사용하여 렌더링을 관리한다.

## Fiber Tree(Virtual DOM)

```json
{
  type: "input", // type of element that we need to render
  props: {...}, // input's props like id or placeholder
  ... // bunch of other internal stuff
}
```

Virtual DOM에서 노드 표현은 오브젝트 형식으로 표현한다.

> [!NOTE]
> React에서는 Virtual DOM 용어 사용을 금기하고 있다.

### Element, Component

DOM의 엘레멘트(`input`, `label`..)들은 `type` 프로퍼티 자료형은 문자열이고 컴포넌트의 자료형은 함수이다.

- HTML Element

```json
{
  type: 'label',
  ... // other stuff
},
```

- Component

```json
{
  type: Input, // type is Function
  ... // other stuff
},
```

### Children

```jsx
const Component = () => {
  return (
    <div>
      <Input placeholder="Text1" id="1" />
      <Input placeholder="Text2" id="2" />
    </div>
  )
}
```

```json
{
  type: 'div',
  props: {
    // children are props!
    children: [
      {
        type: Input,
        props: { id: "1", placeholder: "Text1" }
      },
      {
        type: Input,
        props: { id: "2", placeholder: "Text2" }
      }
    ]
  }
}
```

## State Update

상태 업데이트에 따라서 이전 / 이후로 앞서 본 오브젝트를 비교하여 unmount를 하거나 mount를 한다.

```jsx
const Component = () => {
  if (isCompany) return <Input />

  return <TextPlaceholder />
}
```

`isCompany` 변수에 따라서 `<Input />` 또는 `<TextPlaceholder />` 컴포넌트가 렌더링 된다.

```json
// Before update, isCompany was "true"
{
  type: Input,
  //...
}

// After update, isCompany is "false"
{
  type: TextPlaceholder,
  //...
}
```

`isCompany`가 `false`가 되면 `type` 프로퍼티의 참조가 다르기 떄문에 `<Input />` 컴포넌트는 unmount되고 `<TextPlaceholder />` 컴포넌트가 mount된다.

## Same Type

```tsx
const Form = () => {
  const [isCompany, setIsCompany] = useState(false);

  return (
    <>
      ... // checkbox somewhere here
      {isCompany ? (
        <Input id="company-tax-id-number" placeholder="Enter you company Tax ID" ... />
      ) : (
        <Input id="person-tax-id-number" placeholder="Enter you personal Tax ID" ... />
      )}
    </>
  )
}
```

`type` 프로퍼티가 같을 경우는 컴포넌트를 제거하고 다시 생성(umount -> mount)하지 않고 기존 컴포넌트를 가져와서 업데이트된 데이터만 교체한고 리렌더링을 한다. 위의 코드에서는 `id` 프로퍼티가 변경된다. 따라서 `<input />` 태그에 입력값이 있다면 입력값은 그대로 유지된다.
![recon-1](inkdrop://file:VHBOD77r)

## Arrays

리렌더링하는 동안 React는 개별 항목이 아닌 `children` 배열내의 위치에 해당되는 이전 / 이후 `type` 프로퍼티를 비교한다.

```jsx
const Form = () => {
  const [isCompany, setIsCompany] = useState(false);

  return (
    <>
      <Checkbox onChange={() => setIsCompany(!isCompany)} />
      {isCompany ? <Input id="company-tax-id-number" ... /> : null}
      {!isCompany ? <Input id="person-tax-id-number" ... /> : null}
    </>
  )
}
```

위치를 기반으로 비교하기 때문에 위의 코드와 같이 작성하게 되면 `isCompany`의 값에 따라 아래와 같은 형태가 된다.

```json
// isCompany === true
[{ type: Checkbox }, null, { type: Input }];

// isCompany === false
[{ type: Checkbox }, { type: Input }, null];
```

각 비교되는 위치가 다르기 때문에 기존 `<Input />` 컴포넌트를 재사용하지 않고 삭제 및 생성을 하게 된다.

## Key

React의 `key`는 `type` 프로퍼티가 동일하더라도 `key`를 이용하여 컴포넌트를 구분하여 배열의 위치와 상관없이 재사용이 가능하다.

```json
[
  { type: Input, key: '1' }, // "1" data item
  { type: Input, key: '2' }, // "2" data item
];
```

![recon-1](inkdrop://file:SMUVAJIz)

이를 이용하여 같은 위치에 있는 컴포넌트의 `type` 프로퍼티가 같더라도 `key` 프로퍼티를 이용하여 변경됨을 React에게 명시할 수 있다.

```json
{isCompany ? (
  <Input id="company-tax-id-number" key="company-tax-id-number" ... />
) : (
  <Input id="person-tax-id-number" key="person-tax-id-number" ... />
)}
```

### React는 왜 key를 동적 배열에서만 강제할까?

React는 리렌더링할 때 해당 배열에 항목을 추가, 삭제, 정렬을 할지 아니면 그대로 유지할지를 알 수 없다. 따라서 배열 내부의 요소들의 구분의 예방 조치로 `key` 를 추가하도록 권고하고 있다.

```tsx
const data = ["1", "2"]

const Component = () => {
  // "key" is mandatory here!
  return (
    <>
      {data.map((value) => (
        <Input key={value} />
      ))}
    </>
  )
}
```

반면에 동적 배열이 아닌경우는 따로 `key`를 권고하고 있지 않다. 만약 서로 다른 위치의 `key

```tsx
const Component = () => {
  const [isReverse, setIsReverse] = useState(false)
  // no-one cares about "key" here
  return (
    <>
      <Input key={isReverse ? "some-key" : null} />
      <Input key={!isReverse ? "some-key" : null} />
    </>
  )
}
```

서로 위치가 다르지만 렌더링 되는 조건이 다르기 때문에 실질적으로는 같은 위치에 존재하게 되며 `type`, `key` 프로퍼티의 값이 같기 때문에 컴포넌트가 재사용된다.
![recon-1](inkdrop://file:PmQ8P7SN)

## 동적 요소와 정적 요소

```tsx
const data = ["1", "2"]

const Component = () => {
  return (
    <>
      {data.map((i) => (
        <Input key={i} id={i} />
      ))}
      <Input id="3" />
    </>
  )
}
```

만약 `data` 배열에 "3"의 값을 추가하면 정적 요소인 `<Input id="3" />` 컴포넌트가 재마운트가 될 수 있다고 생각될 수 있다.

```json
[
  { type: Input, key: 1 }, // input from the array
  { type: Input, key: 2 }, // input from the array
  { type: Input }, // input after the array
];
```

하지만 실질적으로 React는 동적 요소와 정적 요소를 혼합할 때는 동적 요소들을 하나의 배열로 그룹화 하여 정적 요소의 위치가 변경되지 않도록 처리한다.

```json
[
  [ { type: Input, key: '1' }, { type: Input, key: '2' } ], // 동적 요소들
  { type: Input, id: '3' } // 정적 요소
]
```

## 다른 컴포넌트를 컴포넌트 내부 로직에 정의하면 안되는 이유

```tsx
const Component = () => {
  const Input = () => <input />

  return <Input />
}
```

```javascript
const a = () => {}
const b = () => {}

a === b // will always be false
```

컴포넌트의 `type` 프로퍼티는 함수이다. 컴포넌트가 리렌더링이 될 때마다 새로운 함수를 생성하게 되므로 `type` 프로퍼티의 컴포넌트 이름이 같더라도 서로 다른 컴포넌트라고 인식하여 재사용하지 않고 unmount / mount 과정을 거치게 된다.

# References

- [React reconciliation: how it works and why should we care](https://www.developerway.com/posts/reconciliation-in-react#part5)
