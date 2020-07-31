## 项目配置
```
typescript-library-starter # 初始化脚手架  
Prettier + Eslint # lint
TypeDoc # 文档生成
Jest # 单元测试
Commitizen # commit 规范
Semantic release # 版本发布
husky # git hooks
Conventional changelog # 通过代码提交信息自动生成 change log
```
## Features
+ 在浏览器端使用 XMLHttpRequest 对象通讯
+ 支持 Promise API
+ 支持请求和响应的拦截器
+ 支持请求数据和响应数据的转换
+ 支持请求的取消
+ JSON 数据的自动转换
+ 客户端防止 XSRF

## 基础功能
### 1. 处理 URL params
1. 参数为对象
2. 参数为数组
3. 参数为Date类型
4. 特殊字符支持 @ : $ , 空格 [ ] 不被 encode
5. 忽略 null undefined
6. 丢弃哈希标记 #
7. 保留 url 已有参数

### 2. 异常处理

1. 网络错误 Network Error
2. 处理超时错误 Timeout xx ms is exceeded
3. 处理非 200 状态码