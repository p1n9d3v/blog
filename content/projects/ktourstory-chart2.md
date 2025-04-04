---
title: [Chart.js를 활용한 데이터 시각화 2]
tags: [project]
---

이전에 구현했던 [[ktourstory-chart1.md|Chart.js를 활용한 데이터 시각화 1]]에 대한 성능 최적화 및 기능 확장 작업을 완료했다. 주요 개선 사항으로는 렌더링 속도와 상태 관리 최적화가 있으며, 새롭게 파일 내보내기/가져오기, Bar 차트, 월 단위 데이터 등을 추가했다.

# 개선

## 렌더링 속도 개선

![[ktourstory-chart-improve-2.png]]

이전에는 새로운 폼을 추가할 때 렌더링 속도가 느렸다. 폼을 추가할 때마다 182.7ms가 걸렸다. 시간 복잡도가 높은 로직과 무거운 컴포넌트는 `useMemo()`, `memo()`를 사용하여 최적화를 하였는데도 여전히 렌더링 속도가 느렸다.

![[ktourstory-chart-improve-1.png]]

가장 큰 원인은 지출표, 입금표에 대한 입력값 처리였다. 입금표, 지출표는 MUI의 `<DataGrid />`와 각 셀에 react hook form의 `<Controller />`를 사용하여 입력값을 처리하였는데 해당 부분이 문제였다.

각 셀 컴포넌트에 `memo()`를 사용하여 불필요한 리렌더링을 줄일 수 있겠지만, `<DataGrid />`의 column에 `editable` 속성을 활성화하면 입력이 가능하고 `processRowUpdate` 프로퍼티를 통해서 수정된 값을 가져올 수 있어 내장된 기능을 사용하였다. (원래 기능을 알고 있었는데 생각을 못했다...)

```tsx
const columns: GridColDef[] = useMemo(() => {
  const fields = []

  return fields.map((field) => ({
    //...properties
    editable: true,
  }))
}, [])

const handleExpenseChange = (
  newRow: Expense & {
    id: string
    product: string
  },
) => {
  const { id, product, ...rest } = newRow

  for (const key in rest) {
    const expenseKey = key as ExpenseKey
    rest[expenseKey] = rest[expenseKey] ?? 0
  }

  onUpdate({
    expense: {
      ...form.expense,
      [id]: {
        ...rest,
      },
    },
  })
  return newRow
}

;<DataGrid
  // ...properties
  columns={columns}
  processRowUpdate={handleRevenueChange}
/>
```

이밖에도 `memo()`로 감싼 컴포넌트의 프로퍼티에 직접적으로 `flat()`과 같은 새로운 참조를 반환하는 함수를 사용하는 부분과 불필요한 dependencies를 제거하니 81ms(대략 2배) 까지 줄일 수 있었다.

코드를 개선하다 보니 전체적으로 react hook form이 불필요하다고 생각해서 react hook form을 제거하고 reducer와 hook을 사용하여 모든 입력값 처리를 하였다.

```ts
import { useEffect, useReducer, useState } from "react"

import _ from "lodash"
import { nanoid } from "nanoid"

import { FilterForm } from "../types"

export interface FilterFormState {
  forms: FilterForm[]
}

export type FilterFormAction =
  | {
      type: "ADD_FORM"
    }
  | { type: "REMOVE_FORM"; payload: { formIdx: number } }
  | { type: "UPDATE_FORM"; payload: { formIdx: number; formData: Partial<FilterForm> } }
  | { type: "IMPORT_FORMS"; payload: { forms: FilterForm[] } }

const reducer = (state: FilterFormState, action: FilterFormAction) => {
  switch (action.type) {
    case "ADD_FORM": {
      if (state.forms.length >= 4) return state
      const prevForm = state.forms[state.forms.length - 1]
      return {
        forms: [
          ...state.forms,
          {
            ...prevForm,
            id: nanoid(),
            name: `필터 ${state.forms.length + 1}`,
          },
        ],
      }
    }
    case "REMOVE_FORM": {
      if (state.forms.length <= 1) return state
      const { formIdx } = action.payload
      return {
        forms: [...state.forms.slice(0, formIdx), ...state.forms.slice(formIdx + 1)],
      }
    }
    case "UPDATE_FORM": {
      const { formIdx, formData } = action.payload
      return {
        forms: [
          ...state.forms.slice(0, formIdx),
          {
            ...state.forms[formIdx],
            ...formData,
          },
          ...state.forms.slice(formIdx + 1),
        ],
      }
    }
    case "IMPORT_FORMS": {
      const { forms } = action.payload
      const limitedForms = forms.slice(0, 4)
      return {
        forms: limitedForms.map((form) => ({
          ...form,
          id: form.id || nanoid(),
        })),
      }
    }
    default: {
      return state
    }
  }
}

export const useFilterFormReducer = (initialState: FilterForm) => {
  const [draft, dispatch] = useReducer(reducer, {
    forms: [initialState],
  })

  const [final, setFinal] = useState({
    forms: [initialState],
  })

  const [isDirty, setIsDirty] = useState(false)

  const addForm = () => {
    dispatch({ type: "ADD_FORM" })
  }

  const removeForm = (formIdx: number) => {
    dispatch({ type: "REMOVE_FORM", payload: { formIdx } })
  }

  const updateForm = (formIdx: number, formData: Partial<FilterForm>) => {
    dispatch({ type: "UPDATE_FORM", payload: { formIdx, formData } })
  }

  const submitForm = () => {
    setFinal({
      forms: draft.forms.map((form) => ({ ...form })),
    })
  }

  const importForms = (forms: FilterForm[]) => {
    dispatch({ type: "IMPORT_FORMS", payload: { forms } })
  }

  useEffect(() => {
    setIsDirty(!_.isEqual(draft.forms, final.forms))
  }, [draft.forms, final.forms])

  return {
    draftForms: draft.forms,
    finalForms: final.forms,
    isDirty,
    addForm,
    removeForm,
    updateForm,
    submitForm,
    importForms,
  }
}
```

## 서버 상태 관리 최적화

서버 상태 관리를 React Query를 사용했다. 데이터를 가져올 때 폼에 입력된 기간에 해당하는 데이터를 가져오기 때문에 query key도 시작, 끝 날짜로 구성하였다.

문제가 되었던 것은 아니지만 25.01.01 ~ 25.12.31와 같이 기간이 긴 데이터가 캐시된 상태에서 25.01.15 ~ 25.01.31 데이터와 같이 캐시된 데이터에서 해당 기간의 데이터가 포함되어 있어, 캐시된 데이터에서 데이터를 가져오면 불필요한 데이터 패치를 줄일 수 있다고 판단했다.

이를 개선하기 위해 기존의 query key 기반 캐싱 대신 캐시된 데이터를 확인하여 불필요한 네트워크 요청을 줄이는 방식으로 변경하였다:

```js
const makeQueryConfigs = (dateRange: DateRange, queryClient: QueryClient) => {
    const key = ["데이터", ...dateRange.map((d) => d?.format("YYYY-MM-DD"))]
    return {
        queryKey: key,
        queryFn: () => {
            const cachedQueries = queryClient.getQueryCache().findAll({
                predicate: (queryCache) => {
                    const { queryKey } = queryCache
                    if (key === queryKey) return false
                    const isQuery = queryKey[0] === "데이터"

                    return (
                        isQuery &&
                        dateRange[0]!.isSameOrAfter(queryKey[1], "day") &&
                        dateRange[1]!.isSameOrBefore(queryKey[2], "day")
                    )
                },
            })

            if (cachedQueries.length > 0) {
                return (cachedQueries[0].state.data as Reservation[]).filter((data) => {
                    return (
                        dateRange[0]?.isSameOrBefore(data.date, "day") &&
                        dateRange[1]?.isSameOrAfter(data.date, "day")
                    )
                })
            }

   // 서버 데이터 패치 코드
        },
        staleTime: 1000 * 60 * 10,
        cacheTime: 1000 * 60 * 10,
    }
}

```

`queryClient.getQueryCache()`를 통해 캐시된 데이터를 가져와 패치할 데이터 기간에 해당하는 데이터를 필터링하여 반환하였다.

# 추가 기능

## 폼 가져오기 및 내보내기

![[ktourstory-chart-improve-3.gif]]

전체 폼 데이터를 JSON 형태로 저장하고 가져올 수 있는 기능을 추가하였다. 현재는 파일로 저장하지만 향후에는 JSON 형태로 데이터베이스에 저장하고 가져오는 방식으로 변경할 계획이다.

![[ktourstory-chart-improve-4.png]]

폼 데이터 뿐만 아니라 입금표와 지출표를 개별적으로 xlsx 파일로 업로드할 수 있는 기능을 구현하여 금액 데이터를 더 편리하게 구성할 수 있도록 하였다.

## 차트 결과 테이블

![[ktourstory-chart-improve-5.png]]

차트 결과를 각 폼 기준으로 데이터를 나타내는 테이블을 추가하여 시각적 데이터와 함께 수치 데이터도 확인할 수 있도록 하였다.

## Bar 차트

![[ktourstory-chart-improve-6.png]]

Bar 차트 추가 요청이 있어 구현하였다. Line 차트와 옵션 차이가 크지 않아 비교적 쉽게 구성할 수 있었다.

![[ktourstory-chart-improve-7.png]]

스택 기능도 추가하였는데, 폼 단위로 구분되어야 했기 때문에 dataset 구성 시 `stack` 프로퍼티에 폼 id를 지정하여 각 폼별로 데이터가 스택되도록 구현하였다.

```ts
{
 data,
 borderColor: form.borderColor,
 borderWidth: 4,
 backgroundColor: colorMap[productId],
 pointBackgroundColor: colorMap[productId],
 pointRadius: 7,
 pointBorderWidth: 4,
 pointHoverRadius: 7,
 pointHoverBorderWidth: 4,
 stack: barType === "stacked" ? form.id : undefined, // stack
 spanGaps: true,
}
```

## 그 외

이 밖에도 월 단위 데이터 비교 기능을 추가하였고, 주요 로직에 대한 테스트 코드도 작성하였다. 테스트 코드 작성 시 faker 라이브러리를 활용하여 목업 데이터를 생성했는데 쉽게 데이터를 만들 수 있어 매우 유용했다.
