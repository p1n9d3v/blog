---
title: Pagination
tags: [react]
---

# Nvim Lua

## Module

```lua
require('module')
require('directory/module')
require('directory.module')
```

- `require` 키워드를 통해 모듈을 불러올 수 있다.
- `/`, `.`를 통해서 경로를 구분할 수 있다.

> [!TIP]
> init.lua아 파일이 있다면 `require('directory')`형태로 모듈을 불러올 수 있다.

### pcall

```lua
local ok, _ = pcall(require, 'module_with_error')
if not ok then
  -- not loaded
end
```

`pcall()`함수를 사용하여 현재 실행중인 스크립트가 어떠한 에러로 인해 스크립트가 종료되는 것을 방지할 수 있다.

## lua, luado

```cmd
:lua <lua script>
:luado <lua script>
```

CmdLine을 통해서 lua를 실행할 수 있다.

- `:lua` : 각각의 스코프를 가지고 있으며 외부에서 접근할 수 없다.

```lua
:lua local foo = 1
:lua print(foo)
" prints 'nil' instead of '1'
```

- `:luado` : 현재 버퍼에 라인들의 특정한 범위를 대상으로 루아 코드를 실행한다.

```lua
aaaaaa
aaaaaa
aaaaaa
aaaaaa
aaaaaa
aaaaaa
aaaaaa
aaaaaa
aaaaaa

// CmdLine
// :luado if linenr % 2 == 0 then return line:upper() end

aaaaaa
AAAAAA
aaaaaa
AAAAAA
aaaaaa
AAAAAA
aaaaaa
AAAAAA
aaaaaa
```

> [!TIP]
> 버퍼(Buffer)는 버퍼는 파일의 내용을 메모리에 불러와 수정할 수 있는 임시 작업 공간이다.

## luaeval

`luaeval()` 함수는 인자로 입력 받은 문자열을 루아 표현식 변경하여 값을 도출하고 그 값을 리턴한다.

```lua
" 결과값을 변수에 담을 수 있습니다.
let variable = luaeval('1 + 1')
echo variable
" 2
let concat = luaeval('"Lua".." is ".."awesome"')
echo concat
" 'Lua is awesome'

" 루아의 리스트 형태의 테이블은 빔의 리스트로 변환됩니다.
let list = luaeval('{1, 2, 3, 4}')
echo list[0]
" 1
echo list[1]
" 2
" 알림 루아의 테이블은 1부터 인덱싱 되지만 빔의 리스트는 0부터입니다.

" 딕셔너리 형태의 테이블은 빔의 딕셔너리로 변환됩니다.
let dict = luaeval('{foo = "bar", baz = "qux"}')
echo dict.foo
" 'bar'
```

두 번째 인자를 통해서 데이터를 전달할 수 있다.

```lua
echo luaeval('_A[1] + _A[2]', [1,1])
```

## v:lua

`v:lua`는 루아의 전역 공간(`_G`)에 존재하는 함수들을 vim script에서 접근할 수 있게 해준다.

```lua
function _G.call_hello_world()
 print("Hello World")
end
```

위의 함수를 CmdLine에서 `call v:lua.call_hello_world()`로 호출할 수 있다.

### \_G

A global variable (not a function) that holds the global environment (that is, `_G._G = _G`). Lua itself does not use this variable; changing its value does not affect any environment, nor vice-versa. (Use [`setfenv`](https://www.lua.org/manual/5.1/manual.html#pdf-setfenv) to change environments.)

## 알아두면 좋을 모듈

- `vim.inspect` : lua object를 읽기 편한 문자열로 변환하는 모듈.
- `vim.regex` : lua에서 vim regex를 사용할 수 있는 모듈.
- `vim.api` : API 함수들을 사용할 수 있는 모듈.
- `vim.ui` : 오버라이드 가능한 UI 함수들.
- `vim.loop` : neovim의 event-loop의 기능을 사용할 수 있는 모듈.(libuv 사용)
- `vim.lsp` : 내장 LSP 클라이언트에 접근할 수 있는 모듈.
- `vim.treesitter` : `tree-sitter`라이브러리 기능을 사용할 수 있는 모듈.

## 커스텀 유틸리티

nvim에서 자신이 만든 유틸리티 모듈을 사용하고 싶다면 파일 생성 후 `init.lua`에 모듈을 불러와주면 된다.

```lua
-- utils/put.lua

function _G.put(...)
    local objects = {}
    for i = 1, select("#", ...) do
        local v = select(i, ...)
        table.insert(objects, vim.inspect(v))
    end

    print(table.concat(objects, "\n"))
    return ...
end
```

```lua
require("utils.put")
require("config.lazy")
```

## Lua에서 Vim script 사용 방법

### vim.api.nvim_eval()

```lua
-- 데이터 타입 변환 예
print(vim.api.nvim_eval('1 + 1')) -- 2
print(vim.inspect(vim.api.nvim_eval('[1, 2, 3]'))) -- { 1, 2, 3 }
print(vim.inspect(vim.api.nvim_eval('{"foo": "bar", "baz": "qux"}'))) -- { baz = "qux", foo = "bar" }
print(vim.api.nvim_eval('v:true')) -- true
print(vim.api.nvim_eval('v:null')) -- nil
```

해당 함수는 Vim script 표현식을 평가하고 값을 리턴한다.

> [!Caution] >`luaeva()`과 동일하지만 표현식에 데이터를 넘길 수 있는 변수 `_A`를 제공하지 않는다.

### vim.api.nvim_command()

```lua
vim.api.nvim_command('new')
vim.api.nvim_command('wincmd H')
vim.api.nvim_command('set nonumber')
vim.api.nvim_command('%s/foo/bar/g')
```

해당 함수는 인자로 입력 받은 문자열로 된 커맨드를 실행할 수 있다.

### vim.cmd()

해당 함수는 커맨드 `vim.api.nvim_exec()`함수와 같이 vim script 코드 조각을 평가할 수 있다.

```lua
vim.cmd([[%s/\Vfoo/bar/g]])
```

### vim.api.nvim_replace_termcodes()

해당 함수는 터미널 코드와 vim 키코드를 escape 할 수 있게 해준다.

```vim
// vim script
inoremap <expr> <Tab> pumvisible() ? "\<C-N>" : "\<Tab>"
```

```lua
local function t(str)
    return vim.api.nvim_replace_termcodes(str, true, true, true)
end

function _G.smart_tab()
    return vim.fn.pumvisible() == 1 and t'<C-N>' or t'<Tab>'
end

vim.api.nvim_set_keymap('i', '<Tab>', 'v:lua.smart_tab()', {expr = true, noremap = true})
```

둘 다 동일한 기능을 하는 함수이다. `t()`함수 내부의 `nvim_replace_termcodes()`를 통해서 `t'<Key>'`와 같은 문법으로 escape를 해줄 수 있다.

현재는 `vim.keymap.set()` 함수를 사용할 때 opts의 `expr`이 `true`일 경우 자동적으로 키코드를 변환해주기 때문에 따로 escape 처리할 필요가 없다.

```lua
vim.keymap.set('i', '<Tab>', function()
    return vim.fn.pumvisible() == 1 and '<C-N>' or '<Tab>'
end, {expr = true})
```

## Keymap

Vim에는 다양한 Mode가 존재한다. 특정한 Mode에 따라서 `vim.keymap`을 통해서 키를 조작할 수 있다.

### Arguments

- `{mode}` : Mode prefix.
- `{lhs}` : 맵핑할 키.
- `{rhs}` : 맵핑한 키를 통해 실행할 command 또는 lua funciton.

### Option

key를 맵핑할 때 4번째 인자에 옵션을 지정할 수 있다.

- `buffer` : 특정 버퍼(`0` 또는 `true`이면 현재 버퍼를 의미).
- `silent` : `true`이면 에러 메시지를 출력하지 않는다.
- `expr` : `true`이면 `{rhs}`를 실행하지 않고 `return` 값을 실행한다. "표현식을 평가"해서 실행한다고 생각하면 된다.

  ```lua
  vim.keymap.set('c', '<down>', function()
    if vim.fn.pumvisible() == 1 then return '<c-n>' end
    return '<down>'
  end, { expr = true })
  ```

- `desc` : 설명.
- `remap` : 맵핑된 키에 대한 (비)재귀적 여부. 기본값은 비재귀적이다.

#### (Non-)recursive

- Non-recursive(default) : `vim.keymap.set()`을 통해서 키를 맵핑하면 다른 맵핑된 `{rhs}`는 실행되지 않는다.
- recursive : 다른 맵핑된 `{rhs}` 실행을 허용한다.

```lua
-- Non-recursive mapping (default behavior)
vim.keymap.set('n', '<leader>a', ':echo "Hello"<CR>')

-- Recursive mapping
vim.keymap.set('n', '<leader>b', '<leader>a', { remap = true })
```

`{remap = true}`로 설정하게 되면 `<leader>b`를 누르면 `<leader>a`가 실행되고 `:echo "Hello"<CR>`이 실행되게 된다. 반대로 기본값으로 설정하게 되면 `:echo "Hello"<CR>`는 실행되지 않는다.

> [!TIP] >`noremap`을 통해서도 Non-recursive가 적용된 키 맵핑을 할 수 있다. `vim.keymap.set()`을 사용한 것과 동일하다.

### Mode

| String value           | Help page     | Affected modes                           | Vimscript equivalent |
| ---------------------- | ------------- | ---------------------------------------- | -------------------- |
| `''` (an empty string) | `mapmode-nvo` | Normal, Visual, Select, Operator-pending | `:map`               |
| `'n'`                  | `mapmode-n`   | Normal                                   | `:nmap`              |
| `'v'`                  | `mapmode-v`   | Visual and Select                        | `:vmap`              |
| `'s'`                  | `mapmode-s`   | Select                                   | `:smap`              |
| `'x'`                  | `mapmode-x`   | Visual                                   | `:xmap`              |
| `'o'`                  | `mapmode-o`   | Operator-pending                         | `:omap`              |
| `'!'`                  | `mapmode-ic`  | Insert and Command-line                  | `:map!`              |
| `'i'`                  | `mapmode-i`   | Insert                                   | `:imap`              |
| `'l'`                  | `mapmode-l`   | Insert, Command-line, Lang-Arg           | `:lmap`              |
| `'c'`                  | `mapmode-c`   | Command-line                             | `:cmap`              |
| `'t'`                  | `mapmode-t`   | Terminal                                 | `:tmap`              |

### vim.keymap.set()

```lua
vim.keymap.set('n', '<Leader>ex1', '<Cmd>lua vim.notify("Example 1")<CR>')

vim.keymap.set({'n', 'c'}, '<Leader>ex2', '<Cmd>lua vim.notify("Example 2")<CR>')

vim.keymap.set('i', '<Tab>', function()
    return vim.fn.pumvisible == 1 and '<C-N>' or '<Tab>'
end, {expr = true})
```

### vim.keymap.del()

```lua
vim.keymap.del('n', '<Leader>ex1')
vim.keymap.del({'n', 'c'}, '<Leader>ex2', {buffer = true})
```

## Commands

![[lua-for-nvim-1.png]]

`vim.cmd()` 함수를 통해서 cmdline에 직접적으로 값을 넣어 실행할 수 있다.

```lua
vim.cmd("echo 'hello world'")
```

또한 `[[ ]]`를 이용하여 다수의 커맨드를 실행시킬 수 있으며, literal string도 가능하다.

```lua
vim.cmd([[%s/\Vfoo/bar/g]]) -- literal string

vim.cmd([[
  highlight Error guibg=red
  highlight link Warning Error
]])
```

## Function

Vim은 `vim.fn`을 통하여 Vimscript function을 lua에서 호출할 수 있다.

```lua
print(vim.fn.printf('Hello from %s', 'Lua'))

local reversed_list = vim.fn.reverse({ 'a', 'b', 'c' })

vim.print(reversed_list) -- { "c", "b", "a" }

local function print_stdout(chan_id, data, name)
  print(data[1])
end
```

## Variable

Vim에는 `global`, `buffer`, `window`, `tab`, `predefined`, `env`의 환경에서 변수를 설정할 수 있다.

- `vim.g` : 전역 변수.
- `vim.b` : 현재 버퍼의 변수.
- `vim.w` : 현재 윈도우의 변수.
- `vim.t` : 현재 탭 페이지의 변수.
- `vim.v` : 미리 정의된 변수.
- `vim.env` : 에디터 세션 내의 정의한 환경 변수.

### Data type

데이터 타입에 대해서는 자동적으로 변경된다.

```lua
vim.g.some_global_variables = {
 key1 = 'value',
 key2 = 300
}

vim.print(vim.g.some_global_variables.key2) -- 300
```

### Target specific something

숫자를 통해서 특정 buffer, window, tabpage에 접근할 수 있다.

```lua
vim.b[2].myvar = 1               -- set myvar for buffer number 2
vim.w[1005].myothervar = true    -- set myothervar for window ID 1005
```

### Can access a property using `#`

아래의 코드와 같이 `#`을 통해서 변수 프로퍼티에 접근할 수 있다.

```lua
vim.g['my#variable'] = 1
```

### Delete a variable

변수를 삭제할 때는 `nil`을 할당해주면 된다.

```lua
vim.g['my#variable'] = nil
```

## Option

`vim.opt`를 통해서 옵션에 대한 설정을 할 수 있다. vim의 옵션에는 `set number`, `set cursorline`, `set smarttab` 등을 지정할 수 있다.

```lua
vim.opt.smarttab = true
vim.opt.smarttab = false
```

또한 `vim.o`를 통해서도 다음과 같이 특정 환경의 옵션을 지정할 수 있다.

- `vim.o` : `:set`과 동일하다.
- `vim.go` : 전역 옵션.
- `vim.bo` : 버퍼 스코프 옵션.
- `vim.wo` : 윈도우 스코프 옵션.
