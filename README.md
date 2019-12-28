

### 开发文档
https://nextjs.frontendx.cn/

### 源码
该博客的示例代码我已经上传到github，欢迎star或者fork

[react-next-hello](https://github.com/fozero/react-next-hello)

### Next介绍
Next.js是一个基于React的一个服务端渲染简约框架。它使用React语法，可以很好的实现代码的模块化，有利于代码的开发和维护。
##### Next.js带来了很多好的特性：
- 默认服务端渲染模式，以文件系统为基础的客户端路由
- 代码自动分隔使页面加载更快
（以页面为基础的）简洁的客户端路由
- 以webpack的热替换为基础的开发环境
- 使用React的JSX和ES6的module，模块化和维护更方便
- 可以运行在Express和其他Node.js的HTTP 服务器上
- 可以定制化专属的babel和webpack配置


### 安装运行
##### 1、将react和next安装到本地依赖
$ npm install --save react react-dom next
##### 2、在package.json文件中加入以下script
{
  "scripts": {
    "dev": "next"
  }
}

##### 3、运行
npm run dev





### 设置index.js页面
Next.js是从服务器生成页面，再返回给前端展示。Next.js默认从 pages 目录下取页面进行渲染返回给前端展示，并默认取 pages/index.js 作为系统的首页进行展示

在 pages/index.js 中创建一个React函数式组件：
```
const Index = () => (
  <div>
    <p>Hello Next.js</p>
  </div>
)

export default Index
```

### 多页面路由跳转

所有的页面的路由都是通过后端服务器来控制的，要想实现客户端路由，需要借助Next.js的Link API
```
// This is the Link API
import Link from 'next/link'

const Index = () => (
  <div>
    <Link href="/about">
      <a>About Page</a>
    </Link>
    <p>Hello Next.js</p>
  </div>
)

export default Index
```
Link组件是通过location.history的浏览器API保存历史路由，所以，你可以通过浏览器左上角的前进和后退按钮来切换历史路由。
Link组件是React的高阶组件的实现，不能对它进行样式的设置，它只是起到路由的跳转功能





### 用路由遮盖（Route Masking）的干净的URL
Next.js上提供了一个独特的特性：路由遮盖（Route Masking）。它可以使得在浏览器上显示的是路由A，而App内部真正的路由是B。这个特性可以让我们来设置一些比较简洁的路由显示在页面，而系统背后是使用一个带参数的路由。

例如 ，地址栏中显示的是 http://localhost:3000/post?title=Hello%20Next.js ，我们将该地址改造成 http://localhost:3000/p/hello-nextjs。

```
import Layout from '../components/MyLayout.js'

import Link from 'next/link'

const PostLink = (props) => (
  <li>
    <Link as={`/p/${props.id}`} 
      href={`/post?title=${props.title}`}>
      <a>{props.title}</a>
    </Link>
  </li>
)

export default () => (
  <Layout>
    <h1>My Blog</h1>
    <ul>
      <PostLink id="hello-nextjs" 
        title="Hello Next.js"/>
      <PostLink id="learn-nextjs" 
        title="Learn Next.js is awesome"/>
      <PostLink id="deploy-nextjs" 
        title="Deploy apps with Zeit"/>
    </ul>
  </Layout>
)
```
当在 Link 组件上使用 as 属性时，浏览器上显示的是 as 属性的值，走的是客户端路由，而服务器真正映射的是 href 属性的值，走的是服务端路由。

### 服务端支持路由遮盖
上面会有一个问题，如果在前端路由间切换不会有问题，可以正常显示，但是在页面 http://localhost:3000/p/hello-nextjs 时刷新页面，会显示 404页面。这是因为路由遮盖默认只在客户端路由中有效，要想在服务端也支持路由遮盖，需要在服务端单独设置路由解析的方法。


##### 1、首先需要将 express 安装到项目依赖中：
$ npm install --save express


##### 2、根目录下创建server.js文件
```
// 服务端支持路由遮盖
const express = require('express')
const next = require('next')
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = express()

//   服务器中对 /p/* 开头的路由进行重写，然后重定向到 /post 开头的路由上，最后将内容返回给前端
  server.get('/p/:id', (req, res) => {
    const actualPage = '/post'
    const queryParams = { 
        title: req.params.id 
    } 
    app.render(req, res, actualPage, queryParams)
  })

  server.get('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(3000, (err) => {
    if (err) throw err
    console.log('> Ready on http://localhost:3000')
  })
}).catch((ex) => {
  console.error(ex.stack)
  process.exit(1)
})

3、更新 package.json 文件中的 scripts ：
{
  "scripts": {
    "dev": "node server.js"
  }
}
```
服务器已经可以支持路由遮盖了，在显示遮盖路由的页面，刷新页面也可以正常显示内容


### 请求接口，获取数据

Next.js 在 React 的基础上为组件添加了一个新的特性： getInitialProps （有点像是getInitialState），它用于获取并处理组件的属性，返回组件的默认属性。我们可以在改方法中请求数据，获取页面需要的数据并渲染返回给前端页面。
引入一个支持在客户端和服务器端发送 fetch 请求的插件 isomorphic-unfetch，当然你也可以使用 axios 等其他工具。  
```$ npm install --save isomorphic-unfetch```

##### 1、修改 pages/index.js 里的内容
```
import Layout from '../components/MyLayout.js'
import Link from 'next/link'
import fetch from 'isomorphic-unfetch'

const Index = (props) => (
  <Layout>
    <h1>Batman TV Shows</h1>
    <ul>
      {props.shows.map(({show}) => (
        <li key={show.id}>
          <Link as={`/p/${show.id}`} 
            href={`/post?id=${show.id}`}>
            <a>{show.name}</a>
          </Link>
        </li>
      ))}
    </ul>
  </Layout>
)

Index.getInitialProps = async function() {
  const res = await fetch('https://api.tvmaze.com/search/shows?q=batman')
  const data = await res.json()

  console.log(`Show data fetched. Count: ${data.length}`)

  return {
    shows: data
  }
}

export default Index
```

### 样式化组件
Next.js 提供了一个 css-in-js 的特性，它允许你在组件内部写一些样式，你只需要在组件内使用 <style jsx> 标签来写 css 即可
```
const Index = (props) => (
  <Layout>
    <h1>My Blog</h1>
    <ul>
      {props.shows.map(({show}) => (
        <li key={show.id}>
          <Link as={`/p/${show.id}`} 
            href={`/post?id=${show.id}`}>
            <a>{show.name}</a>
          </Link>
        </li>
      ))}
    </ul>
    {/* css in js特性 */}
    <style jsx>{`
      h1, a {
        font-family: "Arial";
      }
      ul {
        padding: 0;st
      }
      li {
        list-style: none;
        margin: 5px 0;
      }
      a {
        text-decoration: none;
        color: blue;
      }
      a:hover {
        opacity: 0.6;
      }
    `}</style>
  </Layout>
)
```
上述代码写在一个模板字符串（{``}）里面。Next.js 使用 babel插件来解析 styled-jsx ，它支持样式命名空间，需要注意的是styled-jsx 的样式不会应用到子组件，如果想要该样式适用于子组件，可以在 styled-jsx 标签添加属性 global：<style jsx global>。



### nextjs项目部署
Next.js 项目的部署，需要一个 Node.js的服务器，可以选择 Express, Koa 或其他 Nodejs 的Web服务器。

服务器的入口文件 server.js 里添加了针对部署环境的选择
const dev = process.env.NODE_ENV !== 'production'


为了区分部署环境，我们需要在 package.json 中修改 script 属性如下：
```
"scripts": {
  "build": "next build",
  "start": "NODE_ENV=production node server.js -",
  "dev": "NODE_ENV=dev node server.js"
}
```
其中，build 命令是用于打包项目，start 命令是用于生产环境部署，dev 命令是用于本地开发。
执行如下命令即可将 Next项目 部署到服务器：
```
$ npm run build
$ npm run start
```
### 最后
该博客的示例代码我已经上传到github，欢迎star或者fork
[react-next-hello](https://github.com/fozero/react-next-hello)

### 参考阅读
- https://mp.weixin.qq.com/s/JL_33s6Si05V1Whe8mYCdw?

### 相关博客
- https://www.shaotianyu.com
- https://github.com/shaotianyu/blog-front
