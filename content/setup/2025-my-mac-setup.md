---
aliases: [2025 My Mac Setup]
tags: [setup]
---

# 2025 My Mac Setup

전체적인 파일 설정은 [dotfiles](https://github.com/p1n9d3v/dotfiles/tree/v4)를 참고하기 바란다.

## Package Managers

### Nix

Nix는 Homebrew와 같은 Package Manager이다. nix라는 언어를 통해서 설정할 수 있으며 간단하게 설치가 가능하다. 또한 순수 함수형 패키지 관리 시스템으로 패키지의 빌드와 설치가 독립적으로 이루어져 다른 패키지에 영향을 주지 않도록 되어있다.

### Flake

Flake는 Nix 패키지의 설정을 정의하고 관리할 수 있게 해준다. 쉽게 package.json이라고 생각하면 된다.

### Nix-Darwin

Nix-Darwin은 macOS에서 Nix를 사용하여 시스템 설정을 관리할 수 있도록 해주는 프로젝트이다.

### Homebrew

Homebrew는 Mac에서 사용하는 Package Manager이다. Nix-homebrew를 통해서 homebrew를 통한 패키지를 관리 할 수 있다.

### Usage

```nix
  # Packages
  environment.systemPackages =
 [
   pkgs.neovim
   pkgs.mkalias
   pkgs.git
   pkgs.gcc14
   pkgs.nushell
   pkgs.eza
   pkgs.fzf
   pkgs.zoxide
   pkgs.oh-my-posh
   pkgs.stow
   pkgs.lazygit
   pkgs.ripgrep
   pkgs.pnpm
   pkgs.thefuck
   pkgs.tldr
   pkgs.bat
   pkgs.rip2
   pkgs.navi
   pkgs.nodejs_22
   pkgs.pngpaste
   pkgs.gh
 ];

  # Homebrew
  homebrew = {
 enable = true;
 brews = [ "posting" ];
 casks = [
   "hammerspoon"
   "ghostty"
   "espanso"
   "appcleaner"
   "devtoys"
   "ollama"
   "google-chrome"
   "slack"
   # "obsidian"
   # "raycast"
 ];
 onActivation.cleanup="zap";
 onActivation.autoUpdate = true;
 onActivation.upgrade = true;
  };
```

위의 코드와 같이 Nix package를 통해서 패키지를 다운로드 받을 수 있으며 homebrew(nix-homebrew)를 통해서도 패키지를 다운로드 할 수 있다.

또한, 시스템 설정도 할 수 있다. 아래의 코드는 Dock에 대해서 설정한 부분이다.

```nix
  system.defaults = {
 dock.autohide = true;
 dock.persistent-apps = [
   "/Applications/Obsidian.app"
   "/Applications/Ghostty.app"
   "/Applications/Arc.app"
   "/Applications/Google Chrome.app"
   "/Applications/Espanso.app"
   "/Applications/Raycast.app"
   "/Applications/DevToys.app"
   "/Applications/Ollama.app"
   "/Applications/AppCleaner.app"
 ];
  };
```

업데이트는 `darwin-rebuild switch --flake $HOME/dotfiles/.config/nix#$USER`의 커맨드를 이용하여 업데이트 할 수 있다.

전체적인 설치나 설정은 아래의 유튜브와 dotfiles 통해서 확인하기 바란다.

### References

- [Nix 설치 및 설정 방법](https://www.youtube.com/watch?v=Z8BL8mdzWHI&t=282)
- [Nix](https://search.nixos.org/packages)
- [Nix Darwin](https://github.com/LnL7/nix-darwin)
- [Nix Homebrew](https://github.com/zhaofengli/nix-homebrew)
- [My Nix OS](https://mynixos.com/)

## Applications

### [Ghostty](https://ghostty.org/)

GPU를 활용한 terminal emulator이며 설정도 간편하고 많은 기능들이 있다. wezterm, iterm, alacritty, kitty 등 많은 terminal emulator가 있지만 ghostty의 캐릭터가 귀엽다.
![[my-mac-setup-1.png]]

### [Obsidian](https://obsidian.md/)

Open source Markdown editor인 노트 앱이다. backup은 git을 통해서 관리하고 있고 폴더 구조는 P.A.R.A를 사용하고 있다.

> [!TIP] >[Obsidian.nvim](https://github.com/epwalsh/obsidian.nvim)을 통해서 nvim에서 obsidian을 사용할 수 있다.

### [Espanso](https://espanso.org/)

keyword를 통해서 사용자가 정의한 문장으로 변경할 수 있다.
![[my-mac-setup-2.gif]]

### [RayCast](https://www.raycast.com/)

Mac Spotlight보다 많은 기능을 제공하는 Application Launcher로 spotlight 기본 기능뿐만 아니라 번역, AI, Window Manage 등 다양한 기능을 사용할 수 있으며, store 기능을 통해 유저들이 만든 다양한 패키지를 사용할 수 있다.

### [DevToys](https://devtoys.app/)

개발자에게 필요한 기능들을 종합적으로 가지고 있는 application이다.
![[my-mac-setup-3.png]]

### [Ollama](https://ollama.com/?source=post_page-----60cf3879bad8--------------------------------)

Local에서 LLM을 실행할 수 있는 도구이다.
![[my-mac-setup-4.gif]]

### [App Cleaner](https://freemacsoft.net/appcleaner/)

Application을 제거하는 무료 도구로 관련된 파일까지 찾아서 제거해준다.

### [hammerspoon](https://www.hammerspoon.org/)

lua 언어를 활용하여 macOS의 윈도우, 키맵, 마우스 포인터, 파일 시스템 등을 조작할 수 있는 도구이다. 나는 현재 키맵만 정의해서 사용하고 있는데 키맵만 변경하려고 한다면 [karabiner](https://karabiner-elements.pqrs.org/)를 추천한다.

### [posting](https://posting.sh/)

터미널에서 사용할 수 있는 API Client 도구이다. nvim에서 활용하고 싶다면 [rest.nvim](https://github.com/rest-nvim/rest.nvim)을 확인해 보기 바란다.
![[my-mac-setup-5.gif]]

### [Gifski](https://gif.ski/)

Gifski는 비디오를 고품질 GIF로 변환하는 도구이다.

## Shell tools

shell은 zsh를 사용하고 있다. 아래의 리스트는 내가 자주 사용하는 shell 도구들이다. 관심 있는 도구들을 homebrew 또는 nix를 통해서 쉽게 설치할 수 있다.

- [zsh function](https://zsh.sourceforge.io/Doc/Release/Editor-Functions-Index.html) : zsh functions documentation.(not tool)
- [neovim](https://github.com/neovim/neovim) : A highly configurable text editor built to enable efficient and productive text editing.
- [git](https://github.com/git/git) : A distributed version control system for tracking changes in source code.
- [gcc14](https://github.com/gcc-mirror/gcc) : The GNU Compiler Collection, a set of compilers for various programming languages.
- [nushell](https://github.com/nushell/nushell) : A modern shell that brings a new approach to command line usage with structured data.
- [eza](https://github.com/eza-community/eza) : A modern replacement for `ls` with more features and better defaults.
- [fzf](https://github.com/junegunn/fzf) : A command-line fuzzy finder that enables quick searching and selection from lists.
- [zoxide](https://github.com/ajeetdsouza/zoxide) : A smarter cd command that tracks your most used directories.
- [oh-my-posh](https://github.com/JanDeDobbeleer/oh-my-posh) : A prompt theme engine for any shell that helps to create beautiful command line prompts.
- [stow](https://github.com/aspiers/stow) : A symlink manager that helps to manage your dotfiles and configurations.
- [lazygit](https://github.com/jesseduffield/lazygit) : A simple terminal UI for git commands, making git easier to use.
  - [aicommit2](https://github.com/tak-bro/aicommit2) : A tool generates automatic commits, and it can use Ollama too.
- [ripgrep](https://github.com/BurntSushi/ripgrep) : A line-oriented search tool that recursively searches your current directory for a regex pattern.
- [pnpm](https://github.com/pnpm/pnpm) : A fast, disk space-efficient package manager for JavaScript.
- [thefuck](https://github.com/nvbn/thefuck) : A tool that corrects your previous console commands.
- [tldr](https://github.com/tldr-pages/tldr) : A collection of simplified and community-driven man pages.
- [bat](https://github.com/sharkdp/bat) : A cat clone with syntax highlighting and Git integration.
- [rip2](https://github.com/MilesCranmer/rip2) : A tool for converting ripgrep results into a more user-friendly format.
- [navi](https://github.com/denisidoro/navi) : An interactive cheatsheet tool for the command line.
- [pngpaste](https://github.com/jcsalterego/pngpaste) : Paste PNG into files on MacOS, much like pbpaste does for text.
- [gh](https://cli.github.com/) : Github CLI.
  - notify : `gh ext install meiji163/gh-notify`
- [shell color script](https://gitlab.com/dwt1/shell-color-scripts) : A collection of terminal color scripts.

## Lazyvim

![[my-mac-setup-8.png]]
Layzvim은 `lazy.nvim`모듈을 활용하여 쉽게 패키지를 다운로드 할 수 있고 커스터마이징이 쉬운 vim이다.

### Keymaps

`keymaps.lua`에 정의한 키맵이다. "키"를 누르게 되면 "동작"이 실행되어 진다.

| 모드    | 키             | 동작                               | 설명                                      |
| ------- | -------------- | ---------------------------------- | ----------------------------------------- |
| Normal  | `<C-]>`        | `:` 명령어 입력을 시뮬레이션       | ESC 기능 대체                             |
| Normal  | `+`            | `<C-a>`                            | 숫자 증가                                 |
| Normal  | `-`            | `<C-x>`                            | 숫자 감소                                 |
| Normal  | `db`           | `vbd`                              | 단어 뒤로 삭제                            |
| Normal  | `<C-m>`        | `<C-i>`                            | 점프 리스트 이동                          |
| Normal  | `<C-a>`        | `gg<S-v>G`                         | 전체 선택                                 |
| Normal  | `te`           | `:tabedit`                         | 새 탭 열기                                |
| Normal  | `<tab>`        | `:tabnext<Return>`                 | 다음 탭으로 이동                          |
| Normal  | `<s-tab>`      | `:tabprev<Return>`                 | 이전 탭으로 이동                          |
| Normal  | `ss`           | `:split<Return>`                   | 수평 분할 창                              |
| Normal  | `sv`           | `:vsplit<Return>`                  | 수직 분할 창                              |
| Normal  | `sh`           | `<C-w>h`                           | 왼쪽 창으로 이동                          |
| Normal  | `sk`           | `<C-w>k`                           | 위쪽 창으로 이동                          |
| Normal  | `sl`           | `<C-w>l`                           | 오른쪽 창으로 이동                        |
| Normal  | `sj`           | `<C-w>j`                           | 아래쪽 창으로 이동                        |
| Normal  | `<C-w><left>`  | `<C-w><`                           | 창 크기 왼쪽으로 조정                     |
| Normal  | `<C-w><right>` | `<C-w>>`                           | 창 크기 오른쪽으로 조정                   |
| Normal  | `<C-w><up>`    | `<C-w>+`                           | 창 크기 위쪽으로 조정                     |
| Normal  | `<C-w><down>`  | `<C-w>-`                           | 창 크기 아래쪽으로 조정                   |
| Normal  | `<C-b>`        | `^`                                | 라인 시작으로 이동                        |
| Normal  | `<C-h>`        | `^`                                | 라인 시작으로 이동                        |
| Normal  | `<C-e>`        | `$`                                | 라인 끝으로 이동                          |
| Normal  | `<C-l>`        | `$`                                | 라인 끝으로 이동                          |
| Normal  | `<S-l>`        | `vg_`                              | 비주얼 모드 라인 끝까지 선택              |
| Normal  | `<S-h>`        | `v_`                               | 비주얼 모드 라인 시작까지 선택            |
| Normal  | `<leader>xn`   | `vim.diagnostic.goto_next()`       | 다음 진단으로 이동                        |
| Normal  | `<leader>xp`   | `vim.diagnostic.goto_prev()`       | 이전 진단으로 이동                        |
| Normal  | `<C-j>`        | `<Plug>(VM-Add-Cursor-Down)`       | 멀티 커서 아래로 추가                     |
| Normal  | `<C-k>`        | `<Plug>(VM-Add-Cursor-Up)`         | 멀티 커서 위로 추가                       |
| Cmdline | `<C-j>`        | `pumvisible() ? "<c-n>" : "<C-j>"` | cmdline에서 아래로 이동 또는 `<C-j>` 입력 |
| Cmdline | `<C-k>`        | `pumvisible() ? "<c-p>" : "<C-k>"` | cmdline에서 위로 이동 또는 `<C-k>` 입력   |
| Cmdline | `<C-e>`        | `<C-c>`                            | cmdline 종료                              |

위의 키맵 말고도 [Lazyvim에서 제공하는 키맵](https://www.lazyvim.org/keymaps)이 있다. 또한 vim의 cmdline에 `WhichKey`를 입력하면 키에 대한 테이블을 볼 수 있다.
![[my-mac-setup-6.png]]

### LazyExtras

Lazyvim은 `LazyExtra` 명령어를 통해서 플러그인을 쉽게 다운로드 받을 수 있다. 다운로드하고 싶은 플러그인에 커서를 두고 `x`를 누르면 설치할 수 있다.
![[my-mac-setup-7.png]]

### AI

#### [Avante](https://github.com/yetone/avante.nvim)

Vim에서도 ai api(Cluade, Open AI, Gemini 등)를 연결하여 cursor처럼 사용할 수 있다.

#### [Supermaven](https://github.com/supermaven-inc/supermaven-nvim)

Copilot 대체재로 나쁘지 않은 것 같다. Pro는 30일 동안 무료로 사용 가능하다. LazyExtras를 통해서 쉽게 설치할 수 있으며

- <https://supermaven.com/>

## Vimium

Vim과 비슷하게 키맵을 통해서 브라우저를 조작할 수 있는 extension이다.

```
unmap <c-u>
unmap <c-d>
unmap <c-o>
unmap <c-m>
unmap J
unmap K

map <c-d> scrollPageDown
map <c-u> scrollPageUp
map <c-o> goBack
map <c-m> goForward
map <c-p> previousTab
map <c-n> nextTab
```

