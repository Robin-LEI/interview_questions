ts需要被编译为js之后才能被浏览器和node识别。

1. 安装ts之前，先要安装 nodejs和npm
2. 通过npm安装typescript
3. npm install -g typescript
4. 执行 tsc 把 ts 文件编译为js文件
5. tsc -v，node -v，npm -v
6. tsc --init，创建 tsconfig.json 文件
7. 修改 tsconfig.json 文件，设置js输出目录，outDir
8. 设置 vscode 的监视任务