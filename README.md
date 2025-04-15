# 3D模型交互功能说明文档

本模块基于 Three.js 封装开发，适用于网页或小程序中展示交互式 3D 模型。支持多种格式模型加载、交互点标注、信息弹窗提示、坐标探测、渐显动画等功能，适用于建筑展示、设备讲解、维护指引等应用场景。

---

## ✅ 核心功能一览

| 功能模块       | 描述                                           | 客户用途                                   | 开发说明                              |
|----------------|------------------------------------------------|--------------------------------------------|----------------------------------------|
| 模型加载       | 支持 `.obj` `.mtl` `.ply` 格式，后续可扩展 `.glb/.gltf` | 加载建筑/设备/产品模型                     | 已封装通用加载器，支持异步加载         |
| 自动居中缩放   | 模型加载后自动缩放并居中显示                   | 无需用户手动调整                           | 已适配不同尺寸模型                     |
| 分段模型支持   | 多个 `.ply` 模型可组合为整体，自动还原排列关系 | 分段查看模型结构                           | 已支持组装加载                         |
| 可交互点       | 在任意坐标添加交互点（可圈选区域或几何体）     | 查看部件说明、点击弹窗                     | 支持 hover 高亮、点击弹窗              |
| 鼠标悬停高亮   | 悬停目标模型或点位变色                         | 强调可交互区域                             | 支持启用/禁用交互开关控制              |
| 呼吸灯效果     | 鼠标悬停时激活呼吸动画                         | 增强视觉引导                               | 动画渐变光晕，仅在 hover 时激活        |
| 信息提示卡片   | 点击弹出 HTML 卡片，展示名称/描述/图片等信息   | 模块讲解、产品介绍                         | 卡片样式支持定制，可联动后台数据       |
| 悬浮名称标签   | 可选显示交互点文字标签                         | 加强交互点识别                             | 支持配置开关，悬浮显示，避免遮挡       |
| 坐标获取工具   | 点击模型任意位置返回三维坐标                   | 用于交互点标注工具                         | 可用于开发辅助坐标定位工具页面         |
| 渐显加载动画   | 点云模型加载逐渐显现（基于 drawRange 动态更新）| 提升模型加载体验                           | 已封装动画控制逻辑                     |

---

## 🧪 示例使用场景

1. **建筑模型展示**：点击窗户、空调、楼梯间等部位查看说明
2. **结构部件拆解**：为各结构模块设置交互点并展示说明文本
3. **设备运维指引**：标注可维护点位，提示维修方式与指引流程
4. **教学科普说明**：配合标签/卡片介绍零件组成与功能作用

---

## 🛠 使用说明

### 交互点注入方式

所有交互点通过配置数组注入，例如：

```js
{
  name: "窗户A",
  position: { x: 2.21, y: -0.93, z: -0.16 },
  description: "这是窗户A，可供开启或维护。"
}
```

### 加载 OBJ + MTL 模型

```js
loadModel({
  objPath: "./path/model.obj",
  mtlPath: "./path/model.mtl" // 可选
});
```

### 加载 PLY 点云模型组

```js
loadPlyModels([
  { path: "./model/head.ply", name: "头部", color: 0xff0000 },
  { path: "./model/body.ply", name: "机身", color: 0x00ff00 }
], onCompleteCallback)
```

### 坐标探测工具

开启交互后，点击模型任意点可控制台打印其坐标信息，支持右键点选。

---

## 🔧 高级视觉功能模块（可选配置）

| 模块              | 开关参数          | 功能说明                           |
|-------------------|-------------------|------------------------------------|
| 背景渐变          | `useGradientBG`   | 场景背景白到灰渐变，简洁科技感     |
| 柔光灯支持        | `enableSoftLight` | 模拟自然光环境                     |
| 雾效增强          | `enableFog`       | 增强空间层次感                     |
| 几何体装饰        | `addBackgroundGeo`| 添加远处漂浮几何图形，增加空间感   |
| 镜面反射地板      | `enableFloorMirror` | 模型底部虚化倒影，提升真实感     |

---

## 🔁 后续可扩展项（客户与开发共识）

| 功能                    | 说明                                   |
|-------------------------|----------------------------------------|
| 支持 `.glb/.gltf` 格式 | 加载效率更高，支持动画、PBR 材质等     |
| Vue 组件化封装         | 模块可插拔接入业务系统，适配前后端通信 |
| 动态加载交互点         | 可由后端返回交互点及描述信息进行展示   |
| 富文本信息卡片         | 支持图文、视频、按钮、表单操作         |
| 区域高亮与框选         | 适配产品对选区/划区的交互需求         |

---

## 📦 核心模块依赖封装建议

| 顺序 | 模块名    | 描述                                             | 是否封装 |
|------|-----------|--------------------------------------------------|----------|
| ①    | `Scene`   | Three.js 场景容器，挂载模型与光源               | ✅ 已封装 |
| ②    | `Camera`  | 透视相机，决定视角与观察范围                     | ✅ 已封装 |
| ③    | `Renderer`| 渲染器，输出图像至 `<canvas>` 元素              | ✅ 已封装 |
| ④    | `Light`   | 柔光、平行光等组合照明                           | ✅ 已封装 |
| ⑤    | `Controls`| 鼠标控制器，支持旋转、拖动、缩放                 | ✅ 已封装 |
| ⑥    | `Loader`  | 模型加载器，支持 `.obj/.ply/.gltf` 等           | ✅ 已封装 |

---

## 📬 联系与定制

如需集成更多业务模块（如 AI 智能分析、合同系统对接、运维平台联动等），可随时沟通定制开发方案。




---



# 3D Model Interaction Module Documentation

This module is built with Three.js for interactive 3D model display in web or mini-app platforms. It supports various model formats, interactive markers, tooltips, coordinate detection, gradual loading animations, and more. Ideal for building visualization, product explanation, maintenance guidance, and educational scenarios.

---

## ✅ Core Features Overview

| Module           | Description                                                       | Use Case                                      | Dev Notes                                 |
|------------------|-------------------------------------------------------------------|-----------------------------------------------|--------------------------------------------|
| Model Loading     | Supports `.obj`, `.mtl`, `.ply`; extensible to `.glb/.gltf`       | Load buildings/devices/products               | Unified loader with async loading          |
| Auto Center & Zoom| Models automatically center and scale upon loading                | No manual adjustment needed                   | Works with models of various sizes         |
| Segmented Models  | Load multiple `.ply` files as a composite model                   | View components individually                  | Placement restoration supported            |
| Interactive Points| Add markers or geometry zones at specific coordinates            | Show tooltips, trigger events                 | Hover highlight + click popup supported    |
| Hover Highlight   | Change color on hover for interactive areas                       | Emphasize clickable zones                     | Interaction switch available               |
| Breathing Effect  | Activate glowing animation on hover                              | Improve visual guidance                       | Cyan pulse effect only on hover            |
| Info Popup Card   | Show HTML card on click with name/description/media              | Explain modules and features                  | Style customizable, supports data binding  |
| Floating Labels   | Optional text labels for interaction points                       | Enhance visibility                            | Toggle switch for label display            |
| Coordinate Probe  | Click anywhere to get 3D coordinates                              | Developer tool for marking                    | Right-click support included               |
| Gradual Point Fade| Points revealed progressively using `drawRange` animation         | Enhance loading experience                    | Animation logic encapsulated               |

---

## 🧪 Use Cases

1. **Architectural Models** – Click windows, AC units, staircases for details.
2. **Component Breakdown** – Label and explain each structure in a model.
3. **Maintenance Guide** – Identify serviceable parts with step-by-step hints.
4. **Educational Demos** – Use floating text and cards for interactive learning.

---

## 🛠 Usage Instructions

### Interactive Point Config

Pass in interactive points via config array:

```js
{
  name: "Window A",
  position: { x: 2.21, y: -0.93, z: -0.16 },
  description: "This is Window A, can be opened or maintained."
}
```

### Load OBJ + MTL

```js
loadModel({
  objPath: "./path/model.obj",
  mtlPath: "./path/model.mtl" // optional
});
```

### Load PLY Model Group

```js
loadPlyModels([
  { path: "./model/head.ply", name: "Head", color: 0xff0000 },
  { path: "./model/body.ply", name: "Body", color: 0x00ff00 }
], onCompleteCallback)
```

### Coordinate Probe Tool

Click anywhere on the model to get XYZ position in the console. Right-click supported.

---

## 🔧 Optional Visual Effects (Toggle by Config)

| Feature              | Config Key            | Description                                   |
|----------------------|-----------------------|-----------------------------------------------|
| Gradient Background  | `useGradientBG`       | White to gray gradient                        |
| Soft Lighting        | `enableSoftLight`     | Mimics natural environmental lighting         |
| Fog Effect           | `enableFog`           | Adds depth and atmosphere                     |
| Floating Geometry    | `addBackgroundGeo`    | Random geometric shapes in background         |
| Mirror Ground Plane  | `enableFloorMirror`   | Faint model reflection on floor               |

---

## 🔁 Planned Extensions

| Feature                  | Description                                      |
|--------------------------|--------------------------------------------------|
| `.glb/.gltf` Support     | Higher performance, animation, PBR compatibility |
| Vue Component Packaging  | Plug-n-play modules for business system use      |
| Dynamic Point Loading    | Fetch markers and descriptions via API           |
| Rich Info Card Support   | Embed media, forms, and actions                  |
| Region Highlight / Box   | Enable selection and framing of model areas      |

---

## 📦 Encapsulated Core Modules

| Step | Module     | Description                                          | Status   |
|------|------------|------------------------------------------------------|----------|
| ①    | `Scene`    | Main Three.js scene container                       | ✅ Done  |
| ②    | `Camera`   | Perspective camera setup                            | ✅ Done  |
| ③    | `Renderer` | Renders content into `<canvas>`                     | ✅ Done  |
| ④    | `Light`    | Ambient / directional / soft lights                 | ✅ Done  |
| ⑤    | `Controls` | Mouse controller: pan, rotate, zoom                 | ✅ Done  |
| ⑥    | `Loader`   | Model loader for `.obj`, `.ply`, `.gltf`, etc.      | ✅ Done  |

---

## 📬 Contact & Customization

For business integration (AI analysis, contract systems, maintenance platforms), feel free to contact us for custom development.