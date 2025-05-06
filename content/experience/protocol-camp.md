---
title: 프로토콜 캠프
tags: [experience]
---

![[protocol-camp-4.png]]

[Antibug](https://github.com/p1n9d3v/antibug-vsc-plugin?tab=readme-ov-file)

한화, 해시드에서 주최하는 Protocol Camp 5기 Anti-Bug팀에 외부 개발자로 참여하게 되었다. Anti-Bug팀은 스마트 컨트랙트 정적 분석 및 시뮬레이션을 할 수 있는 VSC Extension을 만들고자 하였다. 나는 프론트와 시뮬레이션이 가능한 로컬 체인을 맡아 참여하게 되었다.

# VSC Extension

VSC Extension을 개발해 본적이 없어서 빠르게 [VSC Extension API](https://code.visualstudio.com/api)에 관해 살펴보았다. Docs가 매우 잘되어 있기 때문에 VSC Extension에 관련해서는 문제되는 부분이 거의 없었다. 특히 [샘플 코드](https://github.com/microsoft/vscode-extension-samples/blob/main/webview-sample/README.md)가 많은 도움이 되었다.

초반에는 팀원들의 개발 경험이 많지 않아서 HTML, Typescript로만 개발을 하였는데, 코드 복잡도가 높아지고 개발 기간에 완성을 못할 수 있을 것 같아 상의 끝에 jquery와 ejs를 도입하였다. 확실히 코드가 간소화되고 편리했다.

## Webview

![[protocol-camp-1.png]]

개발하려는 기능들은 파일 선택, Solidity 컴파일, Chain 선택, Gas, ETH 입력 등 다양한 사용자 인터랙션이 필요했기 때문에 네이티브 UI만 제공하는 View 보다는 커스터마이징이 가능한 Webview를 활용하였다.

### HTML

Webview는 `WebviewView.webview.html` 속성을 통해 HTML 콘텐츠를 정의할 수 있다. `vscode.WebviewViewProvider` 인터페이스의 `resolveWebviewView()` 메서드는 Webview 패널이 처음 생성되거나 숨겨진 후 다시 표시될 때의 로직을 정의하여 실행시킬 수 있다.

```ts
public getHtmlForWebview(
 webview: vscode.Webview,
 htmlPath: string,
 controller: vscode.Uri,
 style: vscode.Uri,
 options?: string[]
) {
 const ejsData = {
   common: {
  reset: this.getPath(webview, "style", "common", "reset.css"),
  global: this.getPath(webview, "style", "common", "global.css"),
   },
   controller,
   style,
   cspSource: webview.cspSource,
   nonce: this.getNonce(),
 };

 const ejsOption = {
   views: [
  this.getPath(webview, "template", "common").fsPath,
  ...(options ?? []),
   ],
 };

 const html = fs.readFileSync(htmlPath, "utf-8");
 return ejs.render(html, ejsData, ejsOption);
}
protected getNonce() {
 let text = "";
 const possible =
   "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
 for (let i = 0; i < 32; i++) {
   text += possible.charAt(Math.floor(Math.random() * possible.length));
 }
 return text;
}
```

```ts
public resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext<State>,
    token: vscode.CancellationToken
  ): void | Thenable<void> {
    this.view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this.extensionUri],
    };

    const htmlPath = this.getPath(
      webviewView.webview,
      "template",
      "compile-and-interaction",
      "index.ejs"
    ).fsPath;
    const style = this.getPath(
      webviewView.webview,
      "style",
      "compile-and-interaction",
      "index.css"
    );
    const controller = this.getPath(
      webviewView.webview,
      "controller",
      "compile-and-interaction",
      "index.js"
    );

    const options = [
      this.getPath(webviewView.webview, "template", "compile-and-interaction")
        .fsPath,
    ];

    webviewView.webview.html = this.getHtmlForWebview(
      webviewView.webview,
      htmlPath,
      controller,
      style,
      options
    );
    // ... code
}
```

> [!Notice]
> CSP 정책 때문에 script를 사용한다면 nonce를 지정해줘야 한다. CSP는 XSS 공격 등을 방지하기 위한 메커니즘으로 리소스(script, stylesheet, image, etc..)가 웹페이지에 로드되고 실행됨을 제한한다. nonce(단 한 번만 사용되는 숫자)를 통해 해당 nonce가 있는 스크립트만 실행을 허용할 수 있도록 제한한다.

### postMessage

VS Code에서는 `postMessage()`를 사용하여 익스텐션 코드와 Webview 사이의 통신이 가능하다. 익스텐션 코드에서는 `Webview.webview.onDidReceiveMessage()`를 통해 Webview에서 전달한 메시지를 받을 수 있다.

```ts
webviewView.webview.onDidReceiveMessage(async (data) => {
  const { type, payload } = data

  switch (type) {
    case "init": {
      break
    }
  }
  // ... code
})
```

반대로 메시지 전달은 `Webview.postMessage()`를 사용하여 Webview로 데이터를 전달할 수 있다.

```ts
export const postMessage = (webview: vscode.Webview, type: string, payload: any) => {
  webview.postMessage({
    type,
    payload,
  })
}
```

Webview는 `window.addEventListener("message", listener)`를 통해 익스텐션 코드에서 전달한 메시지를 받을 수 있다.

```ts
window.addEventListener("message", ({ data: { type, payload } }) => {
  switch (type) {
    case "init": {
      break
    }
  }
  // ... code
})
```

메시지 전달은 `acquireVsCodeApi()`의 `postMessage()`를 사용하여 메시지를 전달할 수 있다.

```ts
const vscode = acquireVsCodeApi()
$(window).ready(() => {
  vscode.postMessage({
    type: "init",
  })
})
```

# Blockchain

컨트랙트 시뮬레이션과 로컬 체인은 [ethereumjs](https://github.com/ethereumjs/ethereumjs-monorepo)를 사용하여 구현하였다. 이미 제공되는 기능들이 많았기에 쉽게 구현할 수 있겠다 싶었는데 막상 해보니 어려움이 많았다.

## 체인 구성

### common

[@ethereumjs/common](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/common)은 이더리움 블록체인 네트워크의 다양한 설정을 정의하고 관리하는 라이브러리이다. 체인, 네트워크, eip 등 체인 환경을 설정할 수 있다.

```ts
const common = new Common({ chain: Mainnet, hardfork: Hardfork.London })

const common = Common.custom(
  {
    chainId: Chain.Mainnet,
    networkId: Chain.Mainnet,
    genesis: genesisHeader,
  },
  {
    hardfork: Hardfork.Shanghai,
    eips: [1559, 4895],
  },
)
```

체인 종류와 버전을 사용자가 선택할 수 있도록 구현하려 했으나, 시간 제약으로 인해 완성하지 못했다.

### vm

[@ethereumjs/vm](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/vm)은 EVM과 컨트랙트가 실행될 때 필요한 모든 상태와 환경을 제공하는 라이브러리이다. 해당 라이브러리를 통해서 트랜잭션 생성, 실행할 수 있으며 상태를 관리할 수 있다.

```ts
const vm = await VM.create({
  common,
  activatePrecompiles: true,
  genesisState: makeGenesisState(DEFAULT_ACCOUNTS),
})

export const makeGenesisState = (accounts: any) => {
  const convertedAccounts = accounts.map((account: any) => {
    return {
      [privateKeyToAddress(account.privateKey).toString()]: [
        bigIntToHex(account.balance),
        "0x", // EOA : 스마트 컨트랙트면 바이트 코드가 들어감
        [], // 스토리지
        "0x00", // nonce : 계정에서 발생한 트랜잭션 수를 추적하는 카운터
      ],
    }
  })

  return Object.assign({}, ...convertedAccounts)
}
```

`Common`을 통해 만든 설정에 대한 vm을 만들고 시뮬레이션에 필요한 지갑을 미리 만들어 genesis block에 넣어주었다.

## 트랜잭션

### call

함수를 호출하기 위해서는 인코딩 해야하기 때문에 함수 시그니쳐가 필요하다. 호출할 함수 시그니처를`Keccak-256`으로 해시 한 후 4바이트를 취해 선택자로 사용하고 선택자 뒤에는 인코딩된 인자 값들이 위치시켜 callData를 만든다. 만든 callData를 트랜잭션에 포함시킨 후 개인키로 서명하여 실행시키면 함수를 호출할 수 있다.

```ts
const iface = new Interface(contract.abis)
const callData = iface.encodeFunctionData(functionName, args)

const tx = await this.node.makeFeeMarketEIP1559Transaction({
  to: contract.address,
  value: "0x0",
  callData,
  privateKey: currentAccount.privateKey,
})

const receipt = await this.node.runTx({ tx })
```

트랜잭션은 메인 네트워크와의 호환성을 유지하기 위해 EIP-1559 형식을 사용했지만, 순수한 시뮬레이션 측면에서만 보면 이는 필수적이지 않았다.

```ts
async makeFeeMarketEIP1559Transaction({
    value,
    privateKey,
    to,
    callData,
  }: {
    value: string;
    privateKey: string;
    to?: string;
    callData: string;
  }): Promise<FeeMarketEIP1559Transaction> {
    const latestBlock = this.getLatestBlock();
    const nonce = await this.getNonce(privateKey);
    const gasLimit = this.getEstimatedGasLimit(latestBlock);
    const baseFee = latestBlock.header.calcNextBaseFee();

    const txData = {
      gasLimit: bigIntToHex(BigInt(gasLimit)),
      value,
      maxFeePerGas: baseFee,
      nonce,
      to,
      data: callData,
    };

    return FeeMarketEIP1559Transaction.fromTxData(txData).sign(
      hexToBytes(privateKey)
    );
  }
}
```

> [!Tip]
> EIP-1559는 London 하드포크에 도입된 가스 가격 메커니즘으로 네트워크 수요에 따라 자동으로 조정되는 기본 수수료를 도입하여 가스 가격을 최적화하는 솔루션이다.

### send

함수를 호출하고 실제로 블록체인 상태를 변경하기 위해서는 트랜잭션을 생성하고 채굴하는 과정이 필요하다. 상태를 변경하는 함수를 호출할 때는 단순히 트랜잭션을 실행(`runTx`)하는 것이 아니라, 해당 트랜잭션을 블록에 포함시켜 채굴(`mine`)해야 한다.

```ts
const iface = new Interface(contract.abis)
const callData = iface.encodeFunctionData(functionName, args)

const value = convertBalanceByType(this.state.value.amount, this.state.value.type)
const tx = await this.node.makeFeeMarketEIP1559Transaction({
  to: contract.address,
  value: bigIntToHex(BigInt(value)),
  callData,
  privateKey: currentAccount.privateKey,
})

const { receipt } = await this.node.mine(tx)
```

트랜잭션이 포함된 블록을 생성하고 블록체인에 추가하는 과정은 다음과 같다.

```ts
  public async mine(
    tx: FeeMarketEIP1559Transaction | LegacyTransaction | BlobEIP4844Transaction
  ): Promise<{ block: Block; receipt: RunTxResult }> {
    const latestBlock = this.blockchain.getLatestBlock();
    const mineBlock = Block.fromBlockData(
      {
        header: {
          timestamp: latestBlock.header.timestamp + 1n,
          number: latestBlock.header.number + 1n,
          gasLimit: this.getEstimatedGasLimit(latestBlock),
        },
      },
      {
        common: this.common,
      }
    );

    const buildBlock = await this.vm.buildBlock({
      parentBlock: latestBlock,
      headerData: mineBlock.header,
      blockOpts: {
        freeze: false,
        putBlockIntoBlockchain: true,
      },
    });

    const receipt = await buildBlock.addTransaction(tx);
    const block = await buildBlock.build();

    this.blockchain.putReceipt(bytesToHex(tx.hash()), receipt);
    this.blockchain.putBlock(block);

    return {
      block,
      receipt,
    };
  }
```

과정은 "블록 데이터 준비 -> 블록 빌더 생성 -> 트랜잭션 추가 및 실행 -> 블록 완성 -> 블록체인에 저장"이다. 트랜잭션 실행은 `addTransaction()` 함수가 내부적으로 `runTx()` 함수를 실행하기 때문에 `addTransaction()` 함수 호출 시점에 트랜잭션이 실행된다.

![[protocol-camp-2.png]]

실행된 트랜잭션 결과에 대한 데이터도 Webview를 통해 보여줬다. 추가적으로 git과 같이 특정 트랜잭션 상태로 롤백하는 기능도 만들고 싶었는데 최종 발표일이 별로 남지 않는 상황이어서 버그 수정에 집중했다.

## 정적 분석

![[protocol-camp-5.png]]

정적 분석 도구는 [Slither](https://github.com/crytic/slither)를 사용했다. Slither에서 제공하는 분석 룰을 선택할 수 있으며 분석 후 Webview를 통해 결과를 보여주도록 하였다.

# 후기

![[protocol-camp-3.png]]

우리 팀은 최우수상을 수상했다. 이런 성과를 예상하지 못했는데 심사위원분들이 좋게 봐주신 것 같다. 아마도 첫 보안 관련 프로젝트를 개발한 유일한 팀이었던 점이 심사에 긍정적으로 작용한 것 같다.

회사 업무와 병행하느라 수면 시간을 희생해가며 프로젝트를 진행했는데, 좋은 결과를 얻어 노력에 대한 보상을 받은 것 같아 보람찼다.
