# UI Theme Changes - White Theme Implementation

## 修改概述
將原本的深色主題改為白色清新主題，保持原有結構但提升視覺體驗。

## 色彩配置更新 (tailwind.config.js)

### 新的色彩變數：
- **ConversationViewbg**: `#ffffff` (純白背景)
- **Sidebarbg**: `#f8f9fa` (淺灰側邊欄)
- **SidebarHover**: `#e9ecef` (懸停效果)
- **SidebarActive**: `#dee2e6` (選中狀態)
- **Button**: `#007bff` (藍色按鈕)
- **ButtonHover**: `#0056b3` (按鈕懸停)
- **Font**: `#212529` (主要文字)
- **FontSecondary**: `#6c757d` (次要文字)
- **Border**: `#dee2e6` (邊框)
- **MessageUser**: `#f8f9fa` (使用者訊息背景)
- **MessageAssistant**: `#ffffff` (AI 訊息背景)

### 新增陰影效果：
- **soft**: 輕微陰影效果
- **card**: 卡片陰影效果

## 元件更新

### 1. Sidebar.svelte
- 背景從深灰改為淺灰
- 添加右側邊框
- 懸停和選中狀態使用新色彩
- 增加過渡動畫效果

### 2. ConversationView.svelte
- 訊息氣泡添加邊框和陰影
- 使用者和 AI 訊息有不同的背景色
- 改善 textarea 和發送按鈕的樣式
- 加強 focus 狀態視覺回饋

### 3. WelcomeScreen.svelte
- logo 添加陰影和圓角
- 連結使用品牌色彩
- 文字使用定義的字體色彩

### 4. ErrorMessage.svelte
- 錯誤訊息使用淺色背景而非紅色背景
- 更柔和的紅色調配色方案

### 5. Settings 頁面
- 表單元素使用白色主題
- 改善 checkbox 樣式
- 更好的視覺層次

### 6. app.css
- 添加全域樣式
- 改善 focus 狀態
- 平滑滾動效果

## 設計原則

### 可讀性：
- 保持足夠的對比度
- 使用一致的色彩層次

### 現代感：
- 添加微妙的陰影效果
- 平滑的過渡動畫
- 清晰的邊框區分

### 易用性：
- 改善的 focus 狀態
- 更直覺的懸停回饋
- 清晰的視覺狀態指示

## 技術細節

- 保持原有的 Svelte 5 響應式語法
- 使用 Tailwind CSS 的自定義色彩變數
- 添加適當的 transition 類別提升體驗
- 維持無障礙設計原則
