# Iridescent 前端运行时基线（更新于 2026-10-01）

## 当前有效基线

- 官方后端基线：`fawney19/Aether` 的 `54fbcc25a171b26966131398ec7c8e462a274348`。
- Codex 通用协议：稳定版 `0.159.3`；同时核查官方 main `444da310e108da16aaeb18fd790b0ac464f08aca`。
- 开发源码：`/home/ubuntu/workspace/codex/repos/Aether-live-alignment`，分支 `codex/live-cli-iridescent-20261001`。
- 正式发布副本：`/home/ubuntu/workspace/deploy/edge-stack/aether/source`；前端位于该目录的 `frontend`。
- 视觉定制保留虹之彼方、长夜副标题、青色图标及 LXGW 字体；认证采用最新内存访问令牌、跨标签页刷新协调和安全内部跳转，本地 Iridescent 事件及持久化键延续。
- 前端验收：226 个测试文件、1748 项测试通过，类型检查和生产构建退出码均为 0。
- 发布范围：仅更新 app；数据库先在隔离库预演迁移，不重建 PostgreSQL/Redis，不修改 Caddy。
- 正式镜像：`aether-app:live-codex01593-iridescent-20261001`，镜像摘要 `sha256:66c881d48aa4c30d799b9e9f0fa22690ddd9ed18787746c687a41589af50b8f7`；正式 `aether-app` 健康，`/health` 返回 200。
- 官方通用协议 PR：[fawney19/Aether #876](https://github.com/fawney19/Aether/pull/876)，中文书写；本地视觉定制不进入该 PR。
- 14 项新增数据库迁移已经隔离库预演及正式执行，迁移记录由 54 增至 68，schema/backfills 均 ready；PostgreSQL 与 Redis 容器保持原 ID 和启动时间。
- 正式浏览器验收：桌面和手机首页保留品牌、字体及视觉内容，无横向溢出；管理员登录与重载恢复会话成功，未在 localStorage/sessionStorage 保存 access_token。提供商页可见 GPT PRO，模型页可见两个目标模型，相关 API 和浏览器脚本错误为 0。
- 通过正式全局模型、提供商模型和密钥限制 API，为 Codex 类型 GPT PRO 配置 `gpt-6-astra`、`gpt-6.1-sol`；自动发现继续开启，两模型同时进入 allowed/locked 列表，未修改模型列表处理器或直接写数据库。模型价格未配置，不代表官方免费。
- 两模型 Responses 的 low/medium/high/xhigh/max 均成功完成；校验发行摘要后的官方 CLI 0.159.3 使用 low 和 ultra 均成功。ultra 是 CLI 本地多代理档位，现场普通请求实际为模型指定的 xhigh，原始 API 直接发送 ultra 会被上游 HTTP 400 拒绝并按重试策略最终返回 503。
- 两模型各完成两轮 WebSocket generate=false 预热与 previous_response_id 续接；验证后 GPT PRO 的 WebSocket 开关恢复原来的 false。本次覆盖连接、元数据及续接，不等同于完整生成或所有重连场景。

## 2026-08-31 历史记录

以下内容保留当时的路径、镜像和检查结果，用于说明视觉定制来源；当前操作以本节上方的有效基线为准。

# Iridescent 前端 strict-upstream 运行时最小差异基线（更新于 2026-08-31）

## 一句结论

当前这份“最小差异基线”已经从上一轮的 `upstream-runtime-baseline` 往前推进到了新的 live 状态：

- **主运行时语义** 继续尽量贴 upstream
- **前端本地品牌语义** 继续保留 Iridescent
- **upstream 基线** 已更新为：`9372d6cfa`
- **live 镜像** 更新目标为：`aether-app:live-9372d6cf-iridescent-20260831`

因此，当前基线不再是“所有 runtime 文件零 diff upstream”，而是：

```text
认证/路由/后台主链尽量贴 upstream，
前端本地事件名与本地持久化键保留 Iridescent，
部署/数据库/上游合同层继续保留 Aether 真值。
```

---

## 1. 真值源

### 1.1 upstream 真值

- 仓库：`/home/ubuntu/workspace/codex/repos/Aether-upstream`
- upstream：`https://github.com/fawney19/Aether.git`
- 基线提交：`9372d6cfa`

### 1.2 当前本地工作树

- 仓库：`/home/ubuntu/workspace/codex/repos/aether`
- 远端：`https://github.com/MMEXA/aether-frontend.git`
- 前端目录：`aether_master_extract/frontend`

### 1.3 当前远端运行态

- release 源树：`/home/ubuntu/workspace/deploy/edge-stack/aether/source`
- runtime 栈：`/home/ubuntu/workspace/deploy/edge-stack/aether/runtime`
- 发布镜像：`aether-app:live-9372d6cf-iridescent-20260831`
- 发布边界：只重建 / 重建 `app` 服务，不重建 PostgreSQL、Redis，不修改 Caddy

---

## 2. 当前仍然贴 upstream 的运行时主链

下面这些核心语义，当前依然按 upstream 走：

### 2.1 首页点击“登录”

```text
首页打开 LoginDialog
URL 保持 /
不跳 /login
```

### 2.2 `/login`

```text
不是 standalone 登录页
```

### 2.3 管理员后台主链

当前 live 已用真实 API 证明：

- `/api/auth/login` 成功
- `/api/users/me` 返回 admin
- `/api/admin/system/configs/site_name` 成功

也就是说：

```text
这轮 Iridescent 本地语义 patch 没有把后台主链收坏。
```

---

## 3. 当前相对 upstream 的最小必要差异

## 3.1 `src/api/client.ts`

### 当前保留差异

```diff
-'aether-auth-state-change'
+'iridescent-auth-state-change'
```

### 原因

- 这是前端内部事件名
- 不属于后端协议字段
- 属于应保留的 Iridescent 本地语义

---

## 3.2 `src/features/auth/utils/preferredAuthTypeStorage.ts`

### 当前保留差异

```text
新主键:   iridescent_preferred_auth_type
旧迁移键: aether_preferred_auth_type
```

### 原因

- 这是前端 localStorage 语义
- 不属于后端合同字段
- 当前采用“新键 + 旧键迁移”的做法，避免用户旧偏好硬断

---

## 3.3 品牌默认值与视觉表达

这些仍保留 Iridescent：

- `site_name` 默认值
- `smtp_from_name` 默认值
- favicon / logo / 品牌文案
- demo 邮箱域名

这些都属于：

```text
品牌 / 视觉表达层
```

不是本轮 strict-upstream 的收口对象。

## 3.4 `src/features/auth/components/LoginDialog.vue` 交互修复差异

### upstream 当前状态

`LoginDialog.vue` 在 upstream 源码里本来就：

- 没有显式关闭按钮
- 主要依赖外部点击 / 遮罩点击来关闭

### strict-upstream 阶段暴露出来的问题

在未保留本地交互修复、只追求 strict-upstream 字面一致的阶段，live 曾暴露出：

```text
登录弹窗打开后
没有关闭按钮
点击外部空白处也无法关闭
```

这条问题的性质不是品牌文案差异，而是：

```text
认证弹窗的交互失败
```

### 当前 live 已纳入的本地修复

当前本地对 `LoginDialog.vue` 保留了一条最小交互 patch：

- 在登录弹窗内容根节点打 `data-login-dialog-surface` 标记
- 通过 `dialogOutsideClick.ts` 判定点击路径是否落在弹窗内容外
- 当点击发生在弹窗外部时，直接把 `isOpen` 置为 `false`

### 为什么这条 patch 需要保留

因为它解决的是：

```text
登录弹窗无法通过外部空白点击关闭
```

而不是：

```text
品牌视觉表达
```

并且这条 patch：

- 不改标题、文案、动画、Logo 呈现
- 不改登录主链
- 只修关闭交互

因此，这条差异当前应视为：

```text
必要的本地交互修复
不能为了追 upstream 字面一致而机械回滚
```

## 3.5 顶栏去除项与登录导航兜底（更新于 2026-05-30）

本轮 upstream frontend 对齐后，确认有两类差异必须继续纳入最小必要差异基线。

### 顶栏去除项

Iridescent 公开首页顶栏与后台面板页不承接 upstream 的文档入口和 GitHub 快捷入口：

- `Home.vue` 顶部导航不展示 `/guide` 的“文档”入口。
- `Home.vue` 顶部导航不展示 `https://github.com/fawney19/Aether` 外链或 `GithubIcon` 图标按钮。
- `GuideLayout.vue` 顶部区域不展示 upstream GitHub 快捷入口或 `GithubIcon` 图标按钮。
- `MainLayout.vue` 后台 / 用户面板页右上角不展示 upstream GitHub 仓库图标按钮、`title="GitHub 仓库"` 或指向 `https://github.com/fawney19/Aether` 的快捷外链。

注意：

```text
/guide 路由和教程内容可以保留；
被移除的是顶栏入口与快捷外链，不是删除整个 guide 功能，也不是删除文档中对 upstream 仓库的事实引用。
```

这条由 `src/components/iridescent-logo-contract.test.ts` 的 public top navigation 合同测试守住。

### 登录成功后的导航兜底

登录成功后，`LoginDialog.vue` 不再把所有 `router.push()` 非空返回或 reject 都转换成失败 toast。

当前行为：

- duplicated navigation 视为成功完成；
- 正常 SPA 导航继续使用 `router.push()`；
- route chunk 加载失败或真实导航失败时，改用 document-level navigation 跳转目标路径，避免用户停在“登录成功但跳转失败”的死路状态。

这条由 `src/features/auth/utils/loginRedirect.ts` 和对应测试守住。

---

## 4. 本轮本地门禁结果

以下验证基于当前本地代码：

### 4.1 测试

命令：

```bash
npm run test:run
```

结果：`176` 个测试文件、`996` 个测试全部通过。

并且本轮新增 / 相关测试重点覆盖了：

- `AUTH_STATE_CHANGE_EVENT` 已切到 `iridescent-auth-state-change`
- `preferredAuthTypeStorage` 对旧键 `aether_preferred_auth_type` 的迁移逻辑
- `dialogOutsideClick` 对登录弹窗外部点击关闭的判定逻辑
- `LoginDialog.vue` 仅在点击外部时关闭、点击面板内部不误关
- `useSystemConfig` 仍维持当前逐 key 加载与品牌默认值语义

### 4.2 类型检查

命令：

```bash
npm run build:with-typecheck
```

结果：最新 upstream 当前存在跨 API、管理页和测试代码的大量既有 `vue-tsc -b` 类型错误；本轮不通过批量断言或降级类型规则掩盖这些错误。生产镜像合同不执行该命令。

### 4.3 生产构建

命令：

```bash
npm run build
```

结果：通过，`2976` 个模块完成生产构建。`Dockerfile.app.local` 与 upstream release CI 均使用这条 Vite 构建合同。

---

## 5. 当前 live 证据

## 5.1 运行镜像

远端 runtime 回读：

```text
APP_IMAGE=aether-app:live-9372d6cf-iridescent-20260831
```

容器状态：

```text
aether-app   aether-app:live-9372d6cf-iridescent-20260831   healthy
```

## 5.2 首页 HTML 与 bundle

当前 live 首页：

- favicon 已为 Iridescent 资产
- 标题为“虹之彼方”
- 主入口包：`/assets/index-BVwXraPs.js`

bundle 回读结果：

### 主入口包包含

- `iridescent-auth-state-change`
- `iridescent_client_device_id`

### 首页懒加载包 `assets/Home-BOgfioCJ.js` 包含

- `iridescent_preferred_auth_type`
- `aether_preferred_auth_type`
- `data-login-dialog-surface`

全量 live bundle 还已确认包含：

- `codex:live`
- `openai:realtime`
- `openai:responses`

这里的含义是：

```text
新主键已进 live，旧键只作为迁移来源保留。
```

## 5.3 live API 真值

使用真实管理员账号和设备标识请求头，已经确认：

- `/api/auth/login` 成功
- `/api/users/me` 返回 admin
- `/api/admin/system/configs/site_name` 返回 200

当前 `/api/users/me` 返回 `username=admin, role=admin`，`site_name` 返回“虹之彼方”。`/_gateway/health`、`/health`、`/readyz` 和首页均返回 200。

Compose app healthcheck 已随最新 scratch 镜像布局改为：

```text
/usr/local/bin/aether-gateway --healthcheck
```

PostgreSQL 与 Redis 容器 ID、启动时间在发布前后保持不变；Caddy 配置校验值保持不变。

---

## 6. 当前仓库治理状态

### 已删除历史误加的 Playwright 快照

已纳入删除差异：

- `.playwright-mcp/page-*.yml`

### 已新增根级 `.gitignore`

当前已包含：

```gitignore
.playwright-mcp/
```

作用：

```text
防止新的 Playwright 临时垃圾再次误加进仓库。
```

---

## 7. 当前基线的最终解释

如果以后再看这份基线，需要记住一句话：

```text
当前最小差异基线不是“把所有 Aether 全部抹掉”，
也不是“所有文件一字不差追 upstream”；
而是：
主运行时语义尽量贴 upstream，
前端本地品牌语义继续保持 Iridescent，
部署/数据库/上游合同层继续保留 Aether 真值。
```
