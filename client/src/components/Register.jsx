import { useState } from "react";

function Register(){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    async function register(ev){
        try{
            ev.preventDefault();
            const response = await fetch('http://localhost:3000/register',{
            method: 'POST',
            body: JSON.stringify({username,password}),
            headers: {'Content-Type': 'application/json'}
            });
            if (response.status === 200) {
            alert('registration successful');
            } else {
            alert(`registration failed`);

            }
        }catch(error){
            console.log('Registration Error',error);
            alert('Error in Registration, Please try again');
        }
    }

    return(
        <main>
           <form className="Register"onSubmit={register}>
                <h1>Register</h1>
                <input type="text" 
                       placeholder="username"
                       value={username}
                       onChange={ev => setUsername(ev.target.value)}/>
                <input type="password"
                       placeholder="password"
                       value={password}
                       onChange={ev => setPassword(ev.target.value)}/>
                <button>Register</button>
           </form>
        </main>
    );
}

export default Register