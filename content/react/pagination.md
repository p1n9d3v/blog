---
title: Pagination
tags: [react]
---

![[pagination-2.gif]]

서버와 클라이언트 간의 페이지네이션을 구현하게 되면 기본적으로 서버에서 아래와 같이 데이터를 받기 때문에 보다 쉽게 페이지네이션을 구현할 수 있다.

```json
{
  "data": [
    { "id": 1, "name": "Item 1" },
    { "id": 2, "name": "Item 2" },
    { "id": 3, "name": "Item 3" }
    // ... more items
  ],
  "metadata": {
    "totalItems": 100,
    "currentPage": 1,
    "totalPages": 10,
    "pageSize": 10,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

- `totalItems` : 전체 데이터 항목의 수
- `currentPage` : 현재 페이지 번호
- `totalPages` : 전체 페이지 수
- `pageSize` : 한 페이지에 포함된 항목의 수
- `hasNextPage` : 다음 페이지 존재 여부
- `hasPreviousPage` : 이전 페이지 존재 여부

# 구현

## 목업 데이터

```ts
interface DataItem j{
  id: number
  name: string
  email: string
}j

const datas: DataItem[] = Array.from({ length: 110 }, (_, i) => ({
  id: i,
  name: customFaker.person.fullName(),
  email: customFaker.internet.email(),
}))
```

`fakerjs`를 사용하여 목업 데이터를 생성.

## 페이지네이션 설정

```tsx
const PAGINATION_CONFIG = {
  ITEMS_PER_PAGE: 5,
  VISIBLE_PAGES: 5,
} as const
```

- `ITEMS_PER_PAGE` : 한 페이지에 보여질 데이터 수
- `VISIBLE_PAGES` : 보여질 페이지 범위

## 전체 페이지 수

```tsx
const totalPages = Math.ceil(datas.length / PAGINATION_CONFIG.ITEMS_PER_PAGE)
```

- 전체 데이터의 크기와 한 페이지에 보여질 데이터 수를 나누어 전체 페이지 수를 구한다

> [!example]
>
> - 총 데이터 수: 103개
> - 페이지당 항목: 10개
> - 계산: 103 ÷ 10 = 10.3 → 11 페이지

## 데이터

```tsx
const [currentPage, setCurrentPage] = useState(1)
const startIndex = (currentPage - 1) * PAGINATION_CONFIG.ITEMS_PER_PAGE
const endIndex = startIndex + PAGINATION_CONFIG.ITEMS_PER_PAGE
const currentItems = datas.slice(startIndex, endIndex)
```

현재 페이지에 해당하는 데이터를 계산하는 로직이다. 서버 통신을 할 때는 서버에서 해당 페이지의 데이터를 직접 제공하므로 이 계산이 필요 없을 수 있다.

## 페이지 범위

![[pagination-1.png]]

```tsx
const startPage =
  (Math.ceil(currentPage / PAGINATION_CONFIG.VISIBLE_PAGES) - 1) * PAGINATION_CONFIG.VISIBLE_PAGES +
  1
const endPage = Math.min(startPage + PAGINATION_CONFIG.VISIBLE_PAGES - 1, totalPages)
const pageNumbers = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i)
```

`startPage`, `endPage`를 이용하여 페이지 범위에 대한 번호를 구할 수 있다.

> [!example]
>
> - VISIBLE_PAGES가 5일 때
> - 현재 페이지가 7이면: 6, 7, 8, 9, 10이 표시
> - 현재 페이지가 13이면: 11, 12, 13, 14, 15가 표시

`endPage` 계산 시 `Math.min`을 사용하는 이유는 마지막 페이지 그룹이 `VISIBLE_PAGES`보다 적은 페이지를 가질 수 있기 때문이다.

## 페이지 네비게이션 핸들러

```tsx
const handlePageChange = (pageNumber: number) => {
  if (currentPage === pageNumber) return
  setCurrentPage(pageNumber)
}

const handlePrev = () => {
  setCurrentPage((prev) => Math.max(1, prev - 1))
}

const handleNext = () => {
  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
}
```

## 컴포넌트

```tsx
<div className={styles.container}>
  {/* 테이블 컴포넌트*/}
  <div className={styles.tableContainer}>
    <table className={styles.table}>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Email</th>
        </tr>
      </thead>
      <tbody>
        {currentItems.map((data) => (
          <tr key={data.id}>
            <td>{data.id}</td>
            <td>{data.name}</td>
            <td>{data.email}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  {/* 페이지 핸들러 컴포넌트 */}
  <div className={styles.pagination}>
    <button
      type="button"
      onClick={handlePrev}
      disabled={currentPage === 1}
      className={styles.navigationButton}
    >
      Prev
    </button>

    {pageNumbers.map((number) => (
      <button
        key={number}
        type="button"
        onClick={() => handlePageChange(number)}
        className={`${styles.pageButton} ${currentPage === number ? styles.active : ""}`}
      >
        {number}
      </button>
    ))}

    <button
      type="button"
      onClick={handleNext}
      disabled={currentPage === totalPages}
      className={styles.navigationButton}
    >
      Next
    </button>
  </div>
</div>
```
