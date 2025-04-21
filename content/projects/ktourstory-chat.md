---
title: [PWA를 활용한 채팅 서비스]
tags: [project]
---

이번에 가이드와 관광객간의 투어 중 소통할 수 있는 매개체가 필요하다고 요구사항을 받았다. 외국인들은 카카오톡을 사용하지 않기 때문에 투어 중 소통할 수 있는 매개체가 필요했다. 처음에는 모바일 앱도 생각했지만 투어 중에만 사용하기 때문에 웹 기반으로 동작하는 PWA가 접근성이 더 좋다고 판단하여 PWA로 채팅 앱을 구현하게 되었다.

> [!NOTE]
> 프로그레시브 웹 앱(Progressive Web App, PWA)은 웹 기술로 개발되었지만 네이티브 앱과 유사한 사용자 경험을 제공하는 웹 애플리케이션.

# 요구 사항

1. 기본적인 채팅
2. 메시지 번역
3. 알림
4. 이미지 업로드 / 다운로드
5. 채팅 모니터링
6. 답장
7. 이미지 프리뷰어

# 채팅

해당 프로젝트는 기존에 이미 firebase를 사용하고 있었기에 데이터베이스는 firestore, 알림은 FCM을 사용하였다. 백엔드는 functions를 이용하였다.

## 데이터 구조 설계

설계할 때 firestore는 문서-컬렉션 구조를 가지고 있는 NoSQL 데이터베이스여서 중복 데이터에 대한 포함 여부를 고려할 때 많은 고민을 했다. 초반에는 최대한 중복을 최소화 해보려 했는데 역시 중복을 최소화 할 수록 오히려 코드가 더 복잡해지고 다른 불필요한 문서,데이터를 참조해야하는 일이 발생하는 경우가 생겨 개발하면서 많은 조정이 필요했다.

![[ktourstory-chat-1.png]]

기본 구조는 채팅방 문서 -> 메시지 컬렉션 -> 메시지 문서(들) 형태로 구조를 구성했다.

![[ktourstory-chat-2.png]]

채팅방 문서 필드는 최신 메시지, 참여자 정보, 투어 정보, 메시지 읽음 상태 등 채팅방에 관련된 메타 데이터를 저장하였다.

![[ktourstory-chat-3.png]]

![[ktourstory-chat-4.png]]

메시지 문서는 메시지(텍스트, 이미지, 파일), 번역, 메시지 타입(이미지, 파일, 답장, 메타), 보낸 사람 등의 채팅 메시지에 관련된 정보를 저장하였다.

## 메시지 그룹화

![[ktourstory-chat-5.png]]

1분 내외로 발생했던 메시지들은 위와 같이 그룹화를 해주었다. 나름 디테일을 살려 처음 메시지와 이후 메시지의 UI도 다르게 스타일링을 해주었다.

```ts
export const separateMessages = (messages: IMessage[]): IMessage[][] => {
  const separatedMessages: IMessage[][] = []
  let messageGroup: IMessage[] = []
  let prevSenderId: string | null = null
  let lastMinute: number = 0

  messages.forEach((message: IMessage, index: number) => {
    const { type, sender, date: messageDate } = message

    const nowDate = new Date(messageDate.seconds * 1000)
    const currentMinute = nowDate.getHours() * 60 + nowDate.getMinutes()

    if (type === "exit" || type === "enter" || type === "date") {
      if (messageGroup.length > 0) {
        separatedMessages.push(messageGroup)
        messageGroup = []
      }
      separatedMessages.push([message])
      messageGroup = []
      return
    }
    if (messageGroup.length > 0 && (currentMinute !== lastMinute || prevSenderId !== sender.id)) {
      separatedMessages.push(messageGroup)
      messageGroup = []
    }

    messageGroup.push(message)
    lastMinute = currentMinute
    prevSenderId = sender.id

    if (index === messages.length - 1) {
      if (messageGroup.length > 0) {
        separatedMessages.push(messageGroup)
      }
    }
  })

  return separatedMessages
}
```

별 특이한 점은 없고, 현재 메시지의와 마지막 메시지의 시간을 비교하여 메시지의 그룹을 나눠 줬다.

## isCompsing

입력 폼에 한글을 작성하다 보면 마지막 글자가 포함되는 경우가 있다. 한글의 경우 자음과 모음의 조합으로 한 음절이 만들어지는 조합 문자이기 때문에 글자가 조합 중인지, 조합이 끝난 상태인지를 알 수 없기 때문이다.

이를 해결하기 위해서는 React의 `SyntheticEvent`가 아닌 `nativeEvent`의 `isComposing` 프로퍼티를 사용하여 문자가 조합 중일 경우에는 입력이 안되도록 처리하면 문제를 해결할 수 있다.

- "ㅇ" 입력 → isComposing = true
- "아" 입력 중 → isComposing = true
- "안" 입력 완료 → isComposing = true
- "안ㄴ" 입력 중 → isComposing = true
- "안녀" 입력 중 → isComposing = true
- "안녕" 입력 완료 → isComposing = false (조합 완료 시점)

![[ktourstory-chat-6.gif]]

또한 Enter키를 사용하여 submit 할 때 `isComposing` 처리를 하지 않게되면 `\n`이 발생하는 경우가 있는데, 이 부분도 `isComposing` 프로퍼티를 통해서 해결할 수 있다.

## 자동 스크롤

![[ktourstory-chat-7.gif]]

새 메시지가 생성되면 자동으로 스크롤이 하단으로 내려가게 만드는 과정에서 텍스트는 문제가 없었지만 이미지는 비동기적으로 로드되므로 DOM 요소가 생성되어도 크기를 특정할 수 없어 스크롤이 발생하지 않는 문제가 있었다.

```ts
const scrollEl = messagesRef.current
if (!scrollEl) return

const images: any = scrollEl.querySelectorAll(".MuiImageList-root li img")
if (images.length) {
  images[images.length - 1].loading = "eager"
  images[images.length - 1].addEventListener("load", () => {
    scrollEl.scrollTop = scrollEl.scrollHeight
  })
}
```

해결한 방법은 가장 마지막 이미지의 `loading` 속성에 `eager` 값을 할당하여 브라우저에게 우선적으로 이미지가 로드되도록 지시하고, 이미지가 로드되었을 때 발생하는 이벤트에 컨테이너의 `scrollTop`을 변경하는 핸들러를 추가하여 해결하였다.

## 채팅 메시지 캐시

채팅을 구현하면서 데이터 조회 비용을 감소시킬 수 있을 것 같아 이전 대화 내용을 `indexedDB`에 저장하여 초기 로딩 개선, 데이터 조회 비용을 감축 하였다.

```tsx
export function openIndexedDB() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const openRequest = window.indexedDB.open(DB_NAME, VERSION)

    openRequest.onupgradeneeded = function () {
      const db = openRequest.result

      if (db.objectStoreNames.contains(STORAGE_NAME)) {
        db.deleteObjectStore(STORAGE_NAME)
      }
      if (!db.objectStoreNames.contains(STORAGE_NAME)) {
        db.createObjectStore(STORAGE_NAME, { keyPath: "id" })
      }
    }

    openRequest.onsuccess = function () {
      resolve(openRequest.result)
    }

    openRequest.onerror = function (e) {
      reject(e)
    }
  })
}

export function getMessagesFromIndexedDB(db: IDBDatabase, chatId: string) {
  return new Promise<IMessage[]>((resolve, reject) => {
    const tx = db.transaction(STORAGE_NAME, "readonly")
    const request = tx.objectStore(STORAGE_NAME).get(chatId)

    request.onsuccess = (event) => {
      const result: IMessage[] = request.result?.messages || []
      const sortedMessages = Object.values(result).sort((a, b) => a.date.seconds - b.date.seconds)
      resolve(sortedMessages)
    }

    request.onerror = (e) => {
      reject(e)
    }
  })
}

export function saveMessagesToIndexedDB(db: IDBDatabase, chatId: string, messages: IMessage[]) {
  const tx = db.transaction(STORAGE_NAME, "readwrite")
  const store = tx.objectStore(STORAGE_NAME)
  const messagesObj = messages.reduce((acc, cur) => {
    return {
      ...acc,
      [cur.id]: cur,
    }
  }, {})
  store.put({ id: chatId, messages: messagesObj })
}

useEffect(() => {
  openIndexedDB()
    .then((openDB) => {
      indexedDB = openDB
      return getMessagesFromIndexedDB(indexedDB, chatId)
    })
    .then((messages) => {
      const lastMessage = messages.pop()
      oldMessages = messages
      const lastMessageDate = lastMessage ? new Date(lastMessage.date.seconds * 1000) : new Date(0)
      unsub = subscribeToNewMessages(chatId, lastMessageDate, (querySnapshot) => {
        newMessages = querySnapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            }) as IMessage,
        )
        const sortedMessages = [...oldMessages, ...newMessages].sort((a, b) => {
          return a.date > b.date ? 1 : 0
        })
        setRawMessages(sortedMessages)
      })
    })

  return () => {
    if (unsub) unsub()
    if (indexedDB) {
      saveMessagesToIndexedDB(indexedDB, chatId, [...oldMessages, ...newMessages])
      indexedDB.close()
    }
  }
}, [])
```

`indexedDB`에 존재하는 이전 대화 내용을 가져와서 가장 최근 메시지의 날짜 이후의 메시지만 firestore에서 가져오도록 설정하였다. 이후 컴포넌트가 언마운트 될 때 현재 대화 내용을 `indexedDB`에 저장하도록 했다.

모든 데이터를 가져와서 렌더링하는 방법으로 사용하고 있는데 채팅이 투어 중에만 사용하기 때문에 데이터가 크지 않아서 가능했던 것 같다. 만약 대규모 서비스 였다면 Scroll Pagination을 통해서 데이터를 가져오고 가상화 Virtualized Scrolling을 통해 보이는 구간만 렌더링하는 방법으로 최적화를 해야 되지 않았을까 싶다.

---

현재는 채팅 데이터가 많은 경우도 존재해서 초기 로딩 속도 저하로 페이지네이션을 통해 데이터를 가져오는 방법으로 변경하였다.

## 그외

### 답장

![[ktourstory-chat-8.png]]

### 입장, 퇴장 메시지

![[ktourstory-chat-9.png]]

### 번역

![[ktourstory-chat-10.png]]

# FCM

FCM은 firebase에서 제공하는 메시징 솔루션이다. 안드로이드, iOS, 웹 애플리케이션에 메시지를 안정적으로 전송할 수 있다. 채팅 서비스를 만들면서 제일 고통 받았던 부분이었다. 특히 iOS ㅎㄷㄷ...

## 동작 과정

1. 클라이언트 FCM 구독 요청: 클라이언트 앱은 사용자의 알림 허용 동의를 받은 후, FCM에 연결하여 디바이스 토큰을 요청
2. FCM 토큰 발급: FCM은 요청을 처리하고 해당 디바이스를 위한 고유 토큰을 생성하여 클라이언트에게 반환
3. 디바이스 토큰 서버 전송: 클라이언트는 FCM에서 받은 디바이스 토큰을 자체 백엔드 서버로 전송
4. 서버의 토큰 관리: 백엔드 서버는 디바이스 토큰을 사용자 ID와 매핑하여 데이터베이스에 저장
5. FCM의 알림 전송: FCM은 서버로부터 받은 메시지와 디바이스 토큰을 사용하여 해당 기기에 푸시 알림을 전송

## iOS

iOS는 Webpush를 지원하지 않고 있었는데 2023년 iOS 16.4 베타 버전부터 옵션 설정을 통해 사용이 가능해졌고 iOS 17 부터는 기본적으로 활성화 되도록 변경되었다. iOS는 "홈화면에 추가"를 통해 앱을 다운로드 받아야 알림 설정이 가능하다.

> [!NOTE]
> 웹 푸시 알림(Web Push Notification)이란?
>
> 웹 푸시 알림은 웹사이트가 사용자의 브라우저를 통해 실시간 알림을 전송할 수 있게 해주는 기술이다. 모바일 앱의 푸시 알림과 유사하게, 웹 푸시 알림을 통해 웹사이트는 사용자가 현재 해당 사이트를 방문하고 있지 않더라도 중요한 정보나 업데이트를 전달할 수 있다.

## 알림 허용, 토큰 등록

```ts
export async function requestNotificationPermission() {
    try {
        const permission = await Notification.requestPermission()
        return permission
    } catch (e) {
     return null
    }
}

export async function getDeviceToken() {
    const messaging = (await isSupported()) ? getMessaging(app) : null

    if (messaging) {
        return await getToken(messaging, {
            vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY,
        })
    } else {
        return null
    }
}

const registerDeviceToken = async () => {
 const token = await getDeviceToken()
 return token
}

const permission = await requestNotificationPermission()
    if (permission === "granted") {
  try {
   return await registerDeviceToken()
  }
  catch(e) {}
 }
}

```

`Notification.requestPermission()` 함수를 사용하여 알림 허용을 요청할 수 있다. 사용자가 허용하게 되면 `getToken()` 함수를 통해 디바이스 토큰을 가져와 DB에 저장 후 디바이스 토큰 기반으로 알림을 전송할 수 있다.

### PWA 알림 권한

```
FirebaseError: Messaging: The notification permission was not granted and blocked instead. (messaging/permission-blocked)
```

웹은 자동으로 알림 권한 창이 표시되도록 할 수 있지만 PWA는 사용자 인터렉션을 통해서 `Notification.requestPermission()` 함수가 호출되도록 해야한다. 이는 자동으로 알림 권한을 요청하면 사용자가 권한 설정할 준비가 안 된 상태일 수 있기 때문에 iOS나 일부 브라우저는 사용자 인터렉션 이벤트 없이는 알림 권한을 요청하는 것을 금지하고 있다.

## 알림 전송

```ts
export const pushNotificationForMSG = runWithGmailSecrets.firestore.document(
  'message path').onCreate(async (snap, context) => {
 // ...code
    try {
      await sendNotification(tokens, undefined, {
        title: 'New Message',
        body: `${!text ? 'image' : text}`,
        name: sender.nameEn ?? sender.name,
        slug: 'chat',
        chatId,
      })
    } catch (e) {
      console.error(e)
    }
  }
})
```

새로운 채팅 메시지 문서가 생성되면 `sendNotification()` 함수를 통해 알림이 전송되어진다.

## 알림 받기

```ts
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js")
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js")

const config = {}

firebase.initializeApp(config)
const messaging =
  firebase.messaging && firebase.messaging.isSupported() ? firebase.messaging() : null

self.addEventListener("notificationclick", function (event) {
  event.waitUntil(
    clients
      .matchAll({
        includeUncontrolled: true,
        type: "all",
      })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url.includes(self.location.origin)) {
            client.focus()
            client.postMessage({
              action: "chat-notification-clicked",
              url: event.notification.data.url,
            })
            return
          }
        }
        return clients.openWindow(event.notification.data.url)
      }),
  )
})

if (messaging) {
  messaging.onBackgroundMessage(function (payload) {
    const urlOrigin = new URL(self.location.origin).origin
    if (payload.data.chatId) {
      const notificationOptions = {
        body: `${payload.data.name}\n${payload.data.body}`,
        icon: "./logo192_3_0_0.png",
        data: {
          url: `${urlOrigin}/chat/${payload.data.chatId}`,
        },
      }

      self.registration.showNotification("New Chat", notificationOptions)
      return
    }
  })
}
```

푸시 알림을 백그라운드에서 처리하기 위해서는 서비스 워커를 사용해야한다. 위의 알림 코드를 `public/firebase-messaging-sw.js`에 정의하여 서비스 워커에서 실행되도록 해야한다.

> [!NOTE]
> 서비스 워커(Service Worker)란?
>
> 서비스 워커는 웹 애플리케이션의 메인 자바스크립트 실행 스레드와 별도로 백그라운드에서 실행되는 스크립트이다. 웹 브라우저와 서버 사이에 위치하며, 네트워크 요청을 가로채고 수정할 수 있는 프록시 역할을 한다.

### 중복 알림

FCM은 payload의 `notification` 프로퍼티에 값이 정의되어 있으면, 자동으로 알림 객체를 감지하여 알림을 생성하여 중복 알림이 발생하였는데, `notification` 대신 `data` 프로퍼티를 사용하여 데이터를 전달하였다.

- <https://stackoverflow.com/questions/66697332/firebase-web-push-notifications-is-triggered-twice-when-using-onbackgroundmessag>

### URL 이동

```ts
// service worker
client.postMessage({
  action: "chat-notification-clicked",
  url: event.notification.data.url,
})

// app
const chatNotificationClickHandler = useCallback((event: any) => {
  if (event.data.action === "chat-notification-clicked") {
    window.focus()
    window.location.href = event.data.url
  }
}, [])
window.navigator.serviceWorker.addEventListener("message", chatNotificationClickHandler)
```

알림을 클릭하면 채팅 방으로 이동되는 기능은 제대로 동작되지 않아 우여곡절이 많았다. 결국에는 서비스 워커에서 `postMessage()` 함수를 사용하여 이동할 URL데이터를 전달한 후 앱 내부에서 메시지를 받아 리다이렉트 하는 방법으로 해결하였다.

# 모니터링

![[ktourstory-chat-11.png]]

백오피스에도 채팅 관련 모니터링 기능을 추가했다. 관리자는 전체 채팅 내역을 조회할 수 있으며, 사용자의 알림 허용 상태, 채팅 활성도, 참여도 등의 데이터를 확인할 수 있도록 했다. 또한 메시지 삭제나 채팅방 생성과 같은 관리 기능을 통해 효율적으로 채팅 서비스를 운영할 수 있도록 구성했다.
