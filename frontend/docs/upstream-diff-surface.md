# Iridescent 前端与 upstream 的差异面（更新于 2026-08-31）

## 一句结论

当前前端和 upstream 的差异，已经不再集中在登录主链是否“另造一套逻辑”，而是主要集中在两类对象：

1. **品牌 / 视觉表达层差异**
2. **前端本地语义键的 Iridescent 化差异**

换句话说：

```text
主运行时语义尽量贴 upstream，
凡是不属于后端/部署合同的本地键和值，优先保留 Iridescent。
```

这份文档的用途，不是做审美评价，而是给以后继续拉 upstream 时，提供一张**可以直接对照、可以快速决定 patch 保留与否**的差异地图。

当前同步基线为 `fawney19/Aether` 的 `9372d6cfa`。该基线中的 Codex Live、OpenAI Realtime / Responses WebSocket、权限迁移、路由配置、用量与池管理功能均保持 upstream 原样；没有用旧定制树覆盖这些新能力。

---

## 1. 当前已经与 upstream 对齐的主线

下面这些主语义，当前仍然对齐 upstream：

### 1.1 首页点击“登录”

仍然是：

```text
首页打开 LoginDialog
URL 保持 /
不跳 /login
```

### 1.2 `/login`

当前仍然不是 standalone 登录页。

### 1.3 认证 / 后台主链

当前 live 已经通过真实 API 验证：

- `/api/auth/login` 成功
- `/api/users/me` 返回 admin
- `/api/admin/system/configs/site_name` 成功

也就是说：

```text
当前与 upstream 的差异，不在“后台链坏了”这一层。
```

---

## 2. 当前保留的前端本地语义差异

这些差异不是后端合同字段，而是前端本地语义层的 Iridescent 化。

## 2.1 `AUTH_STATE_CHANGE_EVENT`

文件：`src/api/client.ts`

### upstream

```ts
'aether-auth-state-change'
```

### 当前本地 / live

```ts
'iridescent-auth-state-change'
```

### 差异性质

- 前端内部事件名
- 不属于 API 路径
- 不属于后端 JSON 字段
- 不属于数据库字段

### 结论

```text
这是应保留的 Iridescent 化差异，
后续拉 upstream 时不应机械回滚成 aether-auth-state-change。
```

---

## 2.2 登录偏好本地键

文件：`src/features/auth/utils/preferredAuthTypeStorage.ts`

### upstream 风格

upstream 侧的旧本地键语义可以概括为：

```ts
'aether_preferred_auth_type'
```

### 当前本地 / live

```ts
PREFERRED_AUTH_TYPE_KEY = 'iridescent_preferred_auth_type'
LEGACY_PREFERRED_AUTH_TYPE_KEY = 'aether_preferred_auth_type'
```

### 差异性质

- 浏览器 localStorage 键
- 不属于后端合同字段
- 但属于用户本地持久化状态

### 当前 patch 目的

不是粗暴改名，而是：

```text
新主键切到 Iridescent
旧键保留为迁移来源
读到旧键时自动迁移到新键并删除旧键
```

### 结论

```text
这是应保留的 Iridescent 化差异，
而且比直接硬改更稳，因为不会丢掉用户旧偏好。
```

---

## 3. 当前保留的品牌 / 视觉差异面

下面这些对象与 upstream 不同，但它们本质上属于品牌 / 视觉表达层：

- `index.html`
- `src/components/IridescentStaticAssetLogo.vue`
- `src/components/IridescentLogo.vue`
- `src/components/HeaderLogo.vue`
- `src/composables/useSiteInfo.ts`
- `src/features/auth/components/LoginDialog.vue` 中的 logo / demo 邮箱 / 品牌文案
- `src/features/auth/components/LoginDialog.vue` 的外部空白点击关闭修复
- `public/assets/branding/**`
- `public/iridescent*.svg`

这类差异的规则是：

```text
不应为了追 upstream 而机械回滚成 Aether 品牌。
```

## 3.1 LoginDialog 的必要交互修复

除了品牌与视觉差异，当前还存在一条**必须显式记录**的交互差异：

- upstream 源码中的 `LoginDialog.vue` 没有显式关闭按钮
- strict-upstream 回归后的当前 live 运行态里，点击弹窗外部空白处也无法关闭

因此，本地当前额外保留：

- `data-login-dialog-surface` 作为登录弹窗内容面的标记
- `dialogOutsideClick.ts` 作为外部点击判定 helper
- `LoginDialog.vue` 的 document 级 outside-click close 修复

这条差异的性质是：

```text
交互失败修复
不是审美增强，也不是品牌文案差异
```

所以后续继续拉 upstream 时，这条 patch 不应被当成“可以随手抹掉的本地 UI 差异”。

## 3.2 upstream 外链 / 文档入口移除合同（更新于 2026-05-30）

这条是 Iridescent 前端视觉定制的一部分，不是临时隐藏，也不是可随 upstream 自动回流的普通差异。

必须保留的去除项：

- `src/views/public/Home.vue` 的公开顶部导航不得重新出现 `/guide` 的“文档”入口。
- `src/views/public/Home.vue` 的公开顶部导航不得重新出现 upstream GitHub 仓库快捷入口、`GithubIcon` 图标按钮或 `https://github.com/fawney19/Aether` 顶栏外链。
- `src/views/public/guide/GuideLayout.vue` 的顶部区域不得重新出现 upstream GitHub 仓库快捷入口或 `GithubIcon` 图标按钮。
- `src/layouts/MainLayout.vue` 的后台 / 用户面板页右上角不得重新出现 upstream GitHub 仓库图标按钮、`title="GitHub 仓库"` 或指向 `https://github.com/fawney19/Aether` 的快捷外链。

允许保留的 upstream 对象：

- `/guide` 路由、教程页面内容、guide 侧边栏与 guide 内部导航可以继续存在。
- 部署教程中作为事实命令出现的 upstream 仓库地址可以继续存在。
- `Overview.vue` 和对应 Markdown 的 Aether-Proxy GitHub 视觉快捷链接继续移除。

当前门禁：

```text
src/components/iridescent-logo-contract.test.ts
  public top navigation must keep iridescent removal of upstream docs and GitHub shortcuts
```

后续拉 upstream 时，如果 `Home.vue`、`GuideLayout.vue` 或 `MainLayout.vue` 发生冲突，应先保留上面的去除项，再处理 upstream 新增的其它页面逻辑。

## 3.3 登录成功后的导航兜底合同（2026-05-26）

登录成功以后，认证状态已经成立。此时前端路由跳转如果遇到 Vue Router 的可恢复状态，不能再把用户卡在登录弹窗里并显示：

```text
登录成功，但跳转失败，请刷新页面或手动进入控制台
```

当前保留的本地修复：

- `src/features/auth/utils/loginRedirect.ts`
- `src/features/auth/components/LoginDialog.vue`

行为合同：

- `router.push()` 成功返回空值时，按正常 SPA 导航处理。
- `router.push()` 返回 `NavigationFailureType.duplicated` 时，视为已经到达目标页，不显示失败 toast。
- route chunk 加载失败、导航 promise reject、真实 aborted/cancelled 等失败时，使用 document-level navigation 跳到目标路径，让浏览器重新加载当前发布后的 bundle。

这条修复不是品牌文案差异，而是登录成功后的可靠性修复。后续追 upstream 时，不得恢复成“登录成功但跳转失败”的死路提示。

---

## 4. 当前保留的“必要引用型 Aether”

有一些 `Aether / aether` 现在依然会出现，但它们的存在是合理的。

## 4.1 上游引用型

例如：

- `Aether_upstream`
- `fawney19/Aether`
- `ghcr.io/fawney19/aether:latest`

这些属于：

```text
上游项目真实名字
```

不能因为品牌目标就强行抹掉。

## 4.2 部署 / 数据库合同型

例如：

- `aether-app`
- `aether-postgres`
- `aether-redis`
- `POSTGRES_DB: aether`
- `DATABASE_URL ... /aether`
- `aether-hub`
- `aether-proxy`

这些属于：

```text
部署 / 数据库 / 运行时合同
```

也不能为了品牌统一而乱动。

## 4.3 diff / 迁移 / 禁止回流型

例如：

- 文档里展示 upstream 旧值 `Aether`
- 测试里保留对旧值 `aether_preferred_auth_type` 的迁移断言
- 合同测试里对旧资产 `/aether_adaptive.svg` 的负向断言

这些 `aether` 的作用是：

```text
说明旧值是什么，或者防止旧值回流
```

不是当前品牌回退。

---

## 5. 后续继续拉 upstream 时的处理规则

以后再更新 upstream 时，遇到 `Aether / aether`，统一按下面这张判断表处理：

| 对象类型 | 例子 | 处理原则 |
|---|---|---|
| 前端内部事件名 | `AUTH_STATE_CHANGE_EVENT` | 保留 Iridescent |
| 前端 localStorage 键 | `preferred_auth_type` | 保留 Iridescent，并继续保留旧键迁移 |
| 默认标题 / 默认站点名 / 默认发件人名 | `Iridescent` | 保留 Iridescent |
| logo / favicon / demo 邮箱 / 品牌文案 | `iridescent-*` | 保留 Iridescent |
| API 路径 / JSON 字段 | `/api/...`、返回字段名 | 不为品牌统一而乱改 |
| 数据库名 / 容器名 / 镜像名 | `aether-app`、`POSTGRES_DB=aether` | 保留 Aether |
| 上游仓库名 / release 名 | `fawney19/Aether` | 保留 Aether |

---

## 6. 当前最重要的 patch 保留点

如果以后从 upstream 再合并一次，这轮最重要、最容易被误回滚的 patch 有四类：

### A. `src/api/client.ts`

保留：

```ts
export const AUTH_STATE_CHANGE_EVENT = 'iridescent-auth-state-change'
```

### B. `src/features/auth/utils/preferredAuthTypeStorage.ts`

保留：

- `iridescent_preferred_auth_type` 作为新主键
- `aether_preferred_auth_type` 作为 legacy 迁移来源
- 自动迁移逻辑

### C. `src/features/auth/components/LoginDialog.vue` + `src/features/auth/utils/dialogOutsideClick.ts`

保留：

- 登录弹窗内容面标记 `data-login-dialog-surface`
- document 级外部点击关闭逻辑
- `dialogOutsideClick.ts` 的判定 helper

原因：

```text
它解决的是没有关闭按钮且点击外部空白处无法关闭的交互失败
```

### D. 品牌资产与默认值合同

保留：

- `DEFAULT_SITE_INFO` 的“虹之彼方”默认品牌
- 后端站点信息加载完成前不提前暴露默认文案
- 静态 / 动态 SVG 的同资产 `<img>` 回退
- 动态 SVG 由 Vue wrapper 同步主题和斑驳状态
- `RippleLogo.vue` 中连续的 `v-if / v-else-if` 分支

这四类是：

```text
后续 patch 时最值得优先检查、最不应该被机械回滚的点。
```

---

## 7. 一句话总规则

如果以后要继续判断“这个 Aether 能不能去掉”，就用这句最短规则：

```text
只要它不是后端 / 部署 / 上游合同层必需字段，
就优先收回 Iridescent；
如果它是前端本地语义层，则不必为了追 upstream 字符串而保留 Aether。
```
