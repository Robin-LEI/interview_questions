1. `wx.navigateTo` 和 `wx.redirectTo` 不能跳转到 tabBar 对应的页面，但是`wx.navigateTo` 会保留当前页面，后者会关闭当前页面
2. `wx.switchTab` 跳转到 tabBar 对应的页面，关闭其他所有非 tabBar 页面
3. `wx.navigateBack` 关闭当前页面，返回上一页面或多级页面，可以通过 `getCurrentPages()` 获取当前页面栈
4. `wx.reLaunch` 关闭所有页面，跳转到制定页面，可以跳转到 tabBar 页面



**关闭页面指的是跳转之后不能返回当前页**