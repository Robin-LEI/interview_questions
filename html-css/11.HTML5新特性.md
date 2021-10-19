1. 语义化标签

   > header、main、footer、article、nav、aside、section

2. 增强型表单

   > <input type="" />
   >
   > type: color、number、date、datetime-local、week、month、range、datetime、search

3. 新增表单元素

   > datalist
   >
   > ```html
   > <input list="cars" />
   > <datalist id="cars">
   >     <option value="1"></option>
   > </datalist>
   > ```
   >
   > 

4. 新增表单属性

   > placeholder、autofocus、required、min、max

5. 音频、视频

   > video、audio

6. 地理定位

   > navigator.geolocation.getCurrentPosition(callback)

7. 拖拽api

   > 设置draggable="true"
   >
   > ondragstart=“callback”，把数据信息存在`ev.dataTransfer.setData`
   >
   > ondrop，`ev.dataTransfer.getData`获取数据
   >
   > ondragover绑定目标元素，禁止默认事件，`ev.preventDefault()`

8. web worker

9. web socket

10. web storage



HTML5删除的标签有

center、frame、frameset、strike（被del替代了， 删除线）、u（被ins替代了，下划线）、tt（等宽字体）