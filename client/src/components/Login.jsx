import { useContext, useState } from "react";
import { Navigate } from 'react-router-dom';
import { UserContext } from "../UserContext";

function Login(){

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState(false);
    const {setUserInfo} = useContext(UserContext);

//--------------------------Login Function-----------------------------
    async function login(ev){
        try{
            ev.preventDefault();
            const response = await fetch('http://localhost:3000/login',{
                method: 'POST',
                body: JSON.stringify({username, password}),
                headers: {'Content-Type': 'application/json'},   
                credentials: 'include' 
            });
            if(response.ok){  
                response.json().then(userInfo =>{
                    setUserInfo(userInfo);
                    setRedirect(true);
                })
            }else{
                alert('Login Failed, wrong credentials');
            }
        }catch(error){
            console.error('Error during login:', error);
            alert('An error occurred during login. Please try again.');
        }
    }
 
    if(redirect){
        return <Navigate to={'/'} />
    }
    return(
        <main>
           <form className="Login" onSubmit={login}>
                <h1>Login</h1>
                <input type="text"
                       placeholder="username"
                       value={username}
                       onChange={(ev)=>{setUsername(ev.target.value)}}/>
                <input type="password"
                       placeholder="password"
                       value={password}
                       onChange={ev => setPassword(ev.target.value)} />
                <button>Login</button>
           </form>
        </main> 
    )
}

export default Login