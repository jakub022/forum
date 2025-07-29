import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router'
import Home from './Home.tsx'
import Forum from './Forum.tsx'
import Browser from './Browser.tsx'
import Post from './Post.tsx'
import Editor from './Editor.tsx'
import Profile from './Profile.tsx'
import Account from './Account.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route index element={<Home/>}/>
        <Route path='forum' element={<Forum/>}>
          <Route index element={<Browser/>}/>
          <Route path='post'>
            <Route path=':postId' element={<Post/>}/>
          </Route>
          <Route path='create' element={<Editor/>}/>
          <Route path='profile'>
            <Route path=':profileId' element={<Profile/>}/>
          </Route>
        </Route>
        <Route path='account' element={<Account/>}/>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
