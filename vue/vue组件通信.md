# 父子组件通信

1. props / $emit，props可以传递属性，也可以传递方法

2. $parent / $children

3. provide  / inject，provide: {name: 'parent'}，inject: ['name']

4. $attrs / $listeners

   ```js
   <child :name="name" :age="age" @changeName="changeName" />
       
   // child.vue
   <template>
     <div>child---<grand v-bind="$attrs" v-on="$listeners"></grand></div>
   </template>
   
   <script>
   import Grand from './grand.vue'
   export default {
     inheritAttrs: false,
     components: {
       Grand
     }
   }
   </script>
   
   // grand.vue
   <template>
     <div>grand--{{$attrs.name}}:{{$attrs.age}}<span @click="$listeners.changeName">click change name</span></div>
   </template>
   
   <script>
   export default {
     inheritAttrs: false
   }
   </script>
   ```

   



# 兄弟组件通信

1. eventBus，[eventBus = new Vue()，借助于$emit和$on]
2. vuex