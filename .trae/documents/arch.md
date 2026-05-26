
## 1. Architecture Design
纯前端游戏应用，使用 Canvas 渲染游戏画面。

```mermaid
graph TB
  A["React App"] --&gt; B["游戏状态管理 (Zustand)"]
  B --&gt; C["游戏引擎 (Canvas)"]
  C --&gt; D["角色系统"]
  C --&gt; E["碰撞检测"]
  C --&gt; F["输入处理"]
```

## 2. Technology Description
- **Frontend**: React@18 + TypeScript + Tailwind CSS + Vite
- **状态管理**: Zustand
- **游戏渲染**: HTML5 Canvas API
- **初始化工具**: vite-init

## 3. Route Definitions
| Route | Purpose |
|-------|---------|
| / | 开始菜单页面 |
| /game | 游戏主页面 |

## 4. API Definitions
无需后端 API。

## 5. Server Architecture Diagram
无需后端服务。

## 6. Data Model

### 6.1 Data Model Definition
```mermaid
classDiagram
  class GameState {
    +string phase
    +Character player1
    +Character player2
    +string gameMode
  }
  class Character {
    +string id
    +string name
    +number x
    +number y
    +number velocityX
    +number velocityY
    +number health
    +number maxHealth
    +number attackPower
    +string direction
    +boolean isAttacking
    +string color
  }
  GameState "1" --&gt; "2" Character
```

### 6.2 Data Definition Language
无需数据库。
