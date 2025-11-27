# better-auth CORS Issue Investigation Repository

This repository is for investigating and reproducing CORS issues that occur with better-auth v1.4.0 and later.

## Problem Overview

Starting from better-auth v1.4.0, the default `User-Agent` header now includes the string `'better-auth'` in requests.

This change causes CORS errors **at least in Safari browser** when the API's CORS `allowedHeaders` configuration does not explicitly include `user-agent`.

### Browser Behavior

- **Chrome**: Works fine ✅
- **Safari**: CORS error occurs ❌

## Problem Details

### Conditions for the Issue

1. better-auth version is **1.4.0 or higher**
2. API CORS configuration does **not include** `user-agent` in `allowedHeaders`
3. Accessing from **Safari** browser

## How to Reproduce

In this repository, you can reproduce the issue by changing the better-auth version in `pnpm-workspace.yaml`.

```yaml
# pnpm-workspace.yaml
overrides:
  better-auth: "1.3.34"  # Works fine
  # better-auth: "1.4.3"  # Error in Safari
```

### Steps

1. Change the better-auth version in `pnpm-workspace.yaml`
2. Run `pnpm install` to update dependencies
3. Start the application
4. Access from Safari browser to verify the behavior

## Solution

There are two ways to resolve this issue:

### Option 1: Add User-Agent to API CORS Configuration

Add `User-Agent` to `allowHeaders` in the API's CORS configuration.

```typescript
// Example: Hono (from apps/api/src/index.ts)
app.use(
  '/api/auth/*',
  cors({
    origin: 'http://localhost:5173',
    allowHeaders: ['Content-Type', 'Authorization', 'User-Agent'],  // Add User-Agent
    allowMethods: ['POST', 'GET', 'OPTIONS'],
    exposeHeaders: ['Content-Length'],
    maxAge: 600,
    credentials: true,
  }),
)
```

### Option 2: Disable Default User-Agent on Client

Disable the default User-Agent header in the better-auth client configuration.

```typescript
// Example: Client configuration (from apps/web/src/lib/auth.ts)
import { createAuthClient } from 'better-auth/react'

export const authClient = createAuthClient({
  baseURL: 'http://localhost:3000',
  disableDefaultFetchPlugins: true,  // Disables default User-Agent header
})
```

## Repository Structure

- `apps/api/`: Backend API
- `apps/web/`: Frontend application
- `pnpm-workspace.yaml`: better-auth version management

## References

- [better-auth GitHub](https://github.com/better-auth/better-auth)
- [CORS Specification](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

---

# better-auth CORS問題 調査用リポジトリ

このリポジトリは、better-auth v1.4.0以降で発生するCORS問題の調査・再現用リポジトリです。

## 問題の概要

better-auth v1.4.0から、リクエストのデフォルト`User-Agent`ヘッダーに`'better-auth'`という文字列が含まれるようになりました。

この変更により、API側でCORSの`allowedHeaders`に`user-agent`を明示的に指定していない場合、**少なくともSafariブラウザで**CORSエラーが発生することが確認されています。

### ブラウザごとの挙動

- **Chrome**: 問題なし ✅
- **Safari**: CORSエラーが発生 ❌

## 問題の詳細

### 発生条件

1. better-authのバージョンが**1.4.0以上**
2. API側のCORS設定で`allowedHeaders`に`user-agent`が**含まれていない**
3. **Safari**ブラウザでアクセス

## 再現方法

このリポジトリでは、`pnpm-workspace.yaml`のbetter-authバージョンを変更することで問題を再現できます。

```yaml
# pnpm-workspace.yaml
overrides:
  better-auth: "1.3.34"  # 問題なし
  # better-auth: "1.4.3"  # Safariでエラー
```

### 手順

1. `pnpm-workspace.yaml`のbetter-authバージョンを変更
2. `pnpm install`で依存関係を更新
3. アプリケーションを起動
4. Safariブラウザでアクセスして動作確認

## 解決方法

この問題を解決する方法は2つあります：

### 方法1: API側のCORS設定にUser-Agentを追加

API側のCORS設定で`allowHeaders`に`User-Agent`を追加します。

```typescript
// 例: Hono (apps/api/src/index.ts より)
app.use(
  '/api/auth/*',
  cors({
    origin: 'http://localhost:5173',
    allowHeaders: ['Content-Type', 'Authorization', 'User-Agent'],  // User-Agentを追加
    allowMethods: ['POST', 'GET', 'OPTIONS'],
    exposeHeaders: ['Content-Length'],
    maxAge: 600,
    credentials: true,
  }),
)
```

### 方法2: クライアント側でデフォルトのUser-Agentを無効化

better-authクライアントの設定でデフォルトのUser-Agentヘッダーを無効化します。

```typescript
// 例: クライアント設定 (apps/web/src/lib/auth.ts より)
import { createAuthClient } from 'better-auth/react'

export const authClient = createAuthClient({
  baseURL: 'http://localhost:3000',
  disableDefaultFetchPlugins: true,  // デフォルトのUser-Agentヘッダーを無効化
})
```

## リポジトリ構成

- `apps/api/`: バックエンドAPI
- `apps/web/`: フロントエンドアプリケーション
- `pnpm-workspace.yaml`: better-authバージョン管理用

## 参考リンク

- [better-auth GitHub](https://github.com/better-auth/better-auth)
- [CORS仕様](https://developer.mozilla.org/ja/docs/Web/HTTP/CORS)
