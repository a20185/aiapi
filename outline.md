# Zone - 中后台前端体系化方案

## 封面介绍

- Zone（地带，区域的意思）希望可以辅助中后台项目长期高效迭代，保持优秀的开发体验、高可维护性；保障线上质量及用户体验。

## 目录

### 缘起

#### 中后台 B 端项目特点

- 可维护性上：代码仓库时间跨度大、体量大、长期迭代后的逻辑交错耦合，难以梳理和上手
- 工程上：技术栈与工具链老旧，时常面临 webpack 版本升级，新旧多组件库共存，框架版本老旧升级风险大等问题

#### 住宿商家供给团队现状分析

#### 我们的目标

- 提升需求吞吐量（开发效率/易上手/可维护性）
- 技术债务可滚动更新（消除）

### 我们的解决方案

#### 工程能力上

- 强大可控的研发框架
  - 本地开发工具链
    - 快速独立页面启动
    - Mock
    - 约定式路由
  - 最小单元独立部署，独立回滚能力
    - 微前端
    - 单页发布
    - 打通 Talos 的单模块独立回滚能力
  - Serverless SSR
    - 通过开启 SSR 模式，可构建出 CSR/SSR 两份 bundle，基于 Arche Serverless SSR Renderer，进行 SSR 或 fallback 到 CSR
    - 仅建议特定真实需要高性能的页面使用
- Monorepo 方案
  - 子包脚手架
    - yarn g 快速生成标准化全功能子包
  - 业务资产 shared 包及资产文档解决方案
    - monorepo 业务包与公共资产包 & code2doc
  - 包代码隔离方案
    - 禁止跨包引入
  - Talos 上 Monorepo 快速依赖安装方案
    - 单包发布时，Monorepo 依赖精简安装

#### 编码理念上

- Strong Typed：严格使用 TypeScript + 严格 lint 规则集
  - 即使是 Vue2.x，基于 @vue/composition-api + vutur LSP 插件，也可以做到类型完美，包括 Vue SFC 模板部分（除了 v-slot 传参，官方 typed slots issue）
- 响应式/组合：@vive/core - 基于 Vue Composition API（以下简称 VCA） 的可复用逻辑片段集
  - VCA 赋予我们将业务逻辑脱离组件进行共享的能力，尤其是通用 UI 能力，React Hooks 更是早已在业界验证了逻辑片段共享的价值（ahooks）
- SOA Services：面向服务的 UI 开发范式
  - 基于 VCA 为我们提供了逻辑拆分与组合的底层能力，但是基于团队多人协作，长期迭代的考虑，我们选择了 SOA 模式来约束和使用 VCA

#### CI/CD 与代码入库守卫

- Talos 持续交付
  - 基于分支携带的信息 + Code Webhooks + Talos 发布模板：做到 git push 后 CI/CD（自动发包/发页面）
  - 例如名为 `feature/sl-1938-abcde/@product-tongzhou/price-form-refactor` 的分支被 push 后，将自动将 product-tongzhou 子包发布到 1938-abcde 泳道
- Bingo CLI
  - PR 助手/代码入库守卫
    - 基于持续交付过程，对 PR 进行静态检查，对问题代码就地进行 comment 评论，开 Task 改进
    - 计算本次 PR 对源仓库是质量改善还是降低
    - 计算时间维度下代码质量趋势
  - 质量指标
    - 代码重复率
    - TS 类型完整度
    - 无意义变量名检查
    - 圈层复杂度
    - 其他静态检查：代码含有 `debugger/console/FIXME/TODO` 等

#### 灰度发布 & 度量监控

- Talos 灰度发布
  - 基于网关的纯静态灰度能力
- Talos Error Diff Plugin
  - 发布前后 15 分钟告警变化分析，直接推送研发群组
- Merlin
  - 更好用的监控告警平台

### 解决的问题

- 支撑长期迭代的稳定架构
- 可复用的架构

### 对比集团内外的解决方案

- 研发框架：到店研发框架 Rome/外卖研发框架 Nine/金融研发框架 Era
  - Zone 基于原生 Vue CLI + 相关插件实现完整工程能力覆盖
  - Zone 体系不止于研发框架 scope，还包括编码理念、代码仓库选型、运行时组合能力
- 到店一体化工作台
  - Zone 侧重业务团队内各用户系统的建设
  - 一体化工作台侧重跨团队页面组合编排能力

### 现有工具

- 响应式逻辑片段库 - vive
  - 基于 Vue Composition API 的响应式逻辑片段集
- 微前端落地方案 - qk
  - 一个 vue-cli-plugin 让你的应用变身微前端应用
- monorepo - hotel-business
  - 住宿商家供给核心业务逻辑领域仓库
- 应用公共基座 - web-shell
  - 快速搭建一个包含侧边栏，顶栏，消息气泡，IM 气泡等公共能力应用框架（不包含页面 main 部分）
- 研发框架 - @nibfe/vue-cli-plugin-zone
  - 一个完善的 Vue CLI Preset，可用于生成一个 Vue 项目（TypeScript + Composition API + Tests）
- 前端 SOA Base Services - @nibfe/soa
  - 建设中，SOA Base Services
- branchformat 工具 - @nibfe/branch-format

### 未来规划

### 附录：相关技术博客

- 基于 VCA 构建中大型业务
- Vive - 基于 Vue Composition API 的逻辑片段库
- 面向服务的 UI 开发范式
- WebShell 商家端基座化实践
