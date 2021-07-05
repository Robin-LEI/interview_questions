1. npm install

   > `npm install <packageName>`
   >
   > 安装之前，`npm install`会先检查，`node_modules`目录之中是否已经存在指定模块。如果存在，就不再重新安装了，即使远程仓库已经有了一个新版本，也是如此。
   >
   > 强制安装：`npm install <packageName> --force`

2. npm update

   > `npm update <packageName>`
   >
   > 它会先到远程仓库查询最新版本，然后查询本地版本。如果本地版本不存在，或者远程版本较新，就会安装。

3. npm update命令怎么知道每个模块的最新版本呢

   > 答案是 npm 模块仓库提供了一个查询服务，叫做 registry 。以 npmjs.org 为例，它的查询服务网址是[`https://registry.npmjs.org/`](https://registry.npmjs.org/) 。
   >
   > 这个网址后面跟上模块名，就会得到一个 JSON 对象，里面是该模块所有版本的信息。比如，访问[`https://registry.npmjs.org/react`](https://registry.npmjs.org/react)，就会看到 react 模块所有版本的信息。
   >
   > registry 网址的模块名后面，还可以跟上版本号或者标签，用来查询某个具体版本的信息。比如， 访问 https://registry.npmjs.org/react/v0.14.6 ，就可以看到 React 的 0.14.6 版。
   >
   > 返回的 JSON 对象里面，有一个`dist.tarball`属性，是该版本压缩包的网址。
   >
   > ```js
   > dist: {
   >   shasum: '2a57c2cf8747b483759ad8de0fa47fb0c5cf5c6a',
   >   tarball: 'http://registry.npmjs.org/react/-/react-0.14.6.tgz' 
   > },
   > ```
   >
   > 到这个网址下载压缩包，在本地解压，就得到了模块的源码。`npm install`和`npm update`命令，都是通过这种方式安装模块的。

4. 缓存目录

   > `npm install`或`npm update`命令，从 registry 下载压缩包之后，都存放在本地的缓存目录。
   >
   > 这个缓存目录，在 Linux 或 Mac 默认是用户主目录下的`.npm`目录，在 Windows 默认是`%AppData%/npm-cache`。通过配置命令，可以查看这个目录的具体位置。
   >
   > ```js
   > npm config get cache
   > 
   > npm cache ls 查看所有的缓存模块
   > 
   > npm cache clean 清空缓存
   > ```
   >
   > 

5. 模块的安装过程

   > 1. 发出`npm install`命令
   >
   > 2. npm 向 registry 查询模块压缩包的网址
   >
   > 3. 下载压缩包，存放在`~/.npm`目录
   >
   > 4. 解压压缩包到当前项目的`node_modules`目录
   >
   >    > 注意，一个模块安装以后，本地其实保存了两份。一份是`~/.npm`目录下的压缩包，另一份是`node_modules`目录下解压后的代码。
   >    >
   >    > 
   >    >
   >    > 但是，运行`npm install`的时候，只会检查`node_modules`目录，而不会检查`~/.npm`目录。也就是说，如果一个模块在`～/.npm`下有压缩包，但是没有安装在`node_modules`目录中，npm 依然会从远程仓库下载一次新的压缩包。
   >    >
   >    > 

6. 设置所有模块都从缓存安装

   > 为了解决这些问题，npm 提供了一个`--cache-min`参数，用于从缓存目录安装模块。
   >
   > `--cache-min`参数指定一个时间（单位为分钟），只有超过这个时间的模块，才会从 registry 下载。
   >
   > ```js
   > npm install --cache-min 9999999 <package-name>
   > ```
   >
   > 上面命令指定，只有超过999999分钟的模块，才从 registry 下载。实际上就是指定，所有模块都从缓存安装，这样就大大加快了下载速度。
   >
   > 它还有另一种写法。
   >
   > ```js
   > npm install --cache-min Infinity <package-name>
   > ```
   >
   > 但是，这并不等于离线模式，这时[仍然需要](https://github.com/npm/npm/issues/2568#issuecomment-172430897)网络连接。因为现在的`--cache-min`实现有一些问题。
   >
   > 
   >
   > >（1）如果指定模块不在缓存目录，那么 npm 会连接 registry，下载最新版本。这没有问题，但是如果指定模块在缓存目录之中，npm 也会[连接 registry](https://github.com/npm/npm/issues/2568#issuecomment-171472949)，发出指定模块的 etag ，服务器返回状态码304，表示不需要重新下载压缩包。
   > >
   > >（2）如果某个模块已经在缓存之中，但是版本低于要求，npm会[直接报错](https://github.com/npm/npm/issues/8581)，而不是去 registry 下载最新版本。

7. 离线安装解决方法

   > 解决方案大致分成三类。
   >
   > **第一类，Registry 代理。**
   >
   > ```js
   > - npm-proxy-cache
   > - local-npm
   > - npm-lazy
   > ```
   >
   > 上面三个模块的用法很类似，都是在本机起一个 Registry 服务，所有`npm install`命令都要通过这个服务代理。
   >
   > ```js
   > # npm-proxy-cache
   > $ npm --proxy http://localhost:8080 \
   >   --https-proxy http://localhost:8080 \
   >   --strict-ssl false \
   > install
   > 
   > # local-npm
   > $ npm set registry http://127.0.0.1:5080
   > 
   > # npm-lazy
   > $ npm --registry http://localhost:8080/ install socket.io
   > 
   > 
   > ```
   >
   > 有了本机的Registry服务，就能完全实现缓存安装，可以实现离线使用。
   >
   > **第二类，`npm install`替代。**
   >
   > 如果能够改变`npm install`的行为，就能实现缓存安装。[`npm-cache`](https://www.npmjs.com/package/npm-cache) 工具就是这个思路。凡是使用`npm install`的地方，都可以使用`npm-cache`替代.
   >
   > ```js
   > $ npm-cache install
   > ```
   >
   > **第三类，`node_modules`作为缓存目录。**
   >
   > 这个方案的思路是，不使用`.npm`缓存，而是使用项目的`node_modules`目录作为缓存。
   >
   > ```js
   > Freight
   > npmbox
   > ```
   >
   > 上面两个工具，都能将项目的`node_modules`目录打成一个压缩包，以后安装的时候，就从这个压缩包之中取出文件。

8. 查看包是否被占用

   ```js
   npm view packageName // 如果包从未被占用，则抛出404错误
   ```

   

9. keywords、description

   > `keywords`用于给你的模块添加关键字。
   >
   > `description`用于添加模块的的描述信息，方便别人了解你的模块。
   >
   > 当然，他们的还有一个非常重要的作用，就是利于模块检索。当你使用 `npm search` 检索模块时，会到`description` 和 `keywords` 中进行匹配。写好 `description` 和 `keywords` 有利于你的模块获得更多更精准的曝光：

10. config

    > `config` 字段用于配置脚本中使用的环境变量，例如下面的配置，可以在脚本中使用`process.env.npm_package_config_port`进行获取。
    >
    > ```
    > {
    >   "config" : { "port" : "8080" }
    > }
    > ```

11. os

    > 假如你开发了一个模块，只能跑在 `darwin` 系统下，你需要保证 `windows` 用户不会安装到你的模块，从而避免发生不必要的错误。
    >
    > 使用 `os` 属性可以帮助你完成以上的需求，你可以指定你的模块只能被安装在某些系统下，或者指定一个不能安装的系统黑名单：
    >
    > ```
    > "os" : [ "darwin", "linux" ]
    > "os" : [ "!win32" ]
    > // 在node环境下可以使用 process.platform 来判断操作系统。
    > ```

12. cpu

    > 和上面的 `os` 类似，我们可以用 `cpu` 属性更精准的限制用户安装环境：
    >
    > ```
    > "cpu" : [ "x64", "ia32" ]
    > "cpu" : [ "!arm", "!mips" ]
    > // 在node环境下可以使用 process.arch 来判断 cpu 架构。
    > ```

13. semver规范

    > `npm包` 中的模块版本都需要遵循 `SemVer`规范——由 `Github` 起草的一个具有指导意义的，统一的版本号表示规则。实际上就是 `Semantic Version`（语义化版本）的缩写。
    >
    > `SemVer`规范的标准版本号采用 `X.Y.Z` 的格式，其中 X、Y 和 Z 为非负的整数，且禁止在数字前方补零。X 是主版本号、Y 是次版本号、而 Z 为修订号。每个元素必须以数值来递增。
    >
    > - 主版本号(`major`)：当你做了不兼容的API 修改
    > - 次版本号(`minor`)：当你做了向下兼容的功能性新增
    > - 修订号(`patch`)：当你做了向下兼容的问题修正。
    > - 例如：`1.9.1 -> 1.10.0 -> 1.11.0`
    > - 内部版本(`alpha`):
    > - 公测版本(`beta`):
    > - 正式版本的候选版本`rc`: 即 `Release candiate`

14. package-lock.json

    > 实际开发中，经常会因为各种依赖不一致而产生奇怪的问题，或者在某些场景下，我们不希望依赖被更新，建议在开发中使用 `package-lock.json`。
    >
    > 锁定依赖版本意味着在我们不手动执行更新的情况下，每次安装依赖都会安装固定版本。保证整个团队使用版本号一致的依赖。
    >
    > 每次安装固定版本，无需计算依赖版本范围，大部分场景下能大大加速依赖安装时间。

15. 整体流程

    > - 检查 `.npmrc` 文件：优先级为：项目级的 `.npmrc` 文件 > 用户级的 `.npmrc` 文件> 全局级的 `.npmrc` 文件 > npm 内置的 `.npmrc` 文件
    >
    > - 检查项目中有无 `lock` 文件。
    >
    > - 无 `lock` 文件：
    >
    >   - 从 `npm` 远程仓库获取包信息
    >   - 根据 `package.json` 构建依赖树，构建过程：
    >
    >     - 构建依赖树时，不管其是直接依赖还是子依赖的依赖，优先将其放置在 `node_modules` 根目录。
    >     - 当遇到相同模块时，判断已放置在依赖树的模块版本是否符合新模块的版本范围，如果符合则跳过，不符合则在当前模块的 `node_modules` 下放置该模块。
    >     - 注意这一步只是确定逻辑上的依赖树，并非真正的安装，后面会根据这个依赖结构去下载或拿到缓存中的依赖包
    >   - 在缓存中依次查找依赖树中的每个包
    >
    >     - 不存在缓存:
    >
    >       - 从 `npm` 远程仓库下载包
    >       - 校验包的完整性
    >       - 校验不通过：
    >
    >         - 重新下载
    >       - 校验通过：  
    >         - 将下载的包复制到 `npm` 缓存目录
    >         - 将下载的包按照依赖结构解压到 `node_modules`
    >     - 存在缓存：将缓存按照依赖结构解压到 `node_modules`
    >
    >   - 将包解压到 `node_modules`
    >   - 生成`lock`文件
    >
    >    
    >
    > - 有`lock`文件
    >
    >   - 检查 `package.json` 中的依赖版本是否和 `package-lock.json` 中的依赖有冲突。
    >   - 如果没有冲突，直接跳过获取包信息、构建依赖树过程，开始在缓存中查找包信息，后续过程相同

    


