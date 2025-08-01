import "./App.css"
import React from "react";
import ReactDOM from "react-dom/client";
import {BrowserRouter, Routes, Route} from "react-router-dom"; 
import Home from "./pages/Home";
import SignUp from "./pages/SignUp"; 

function App(){
  return( 
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element = {<Home/>}/>
          <Route path="SignUp" element={<SignUp/>}/>
        </Route>
      </Routes> 
    </BrowserRouter>
  );
}; 

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);