import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Signin from "./Signin"

const Signup = () => {
    
    const navigate = useNavigate();
    const [registrationNumber, setRegistrationNumber] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return (
        <div className="bg-gray-100 h-screen flex items-center justify-center bg-cover bg-center w-screen" style={{background: "linear-gradient(#313131, #151515)"}}>


        <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
            <h2 className="text-2xl font-semibold mb-6">Sign Up</h2>

            <form action="#" method="post">
                <div className="mb-4">
                    <label htmlFor="Registration_Number" className="block text-gray-700 text-sm font-medium">Registration Number</label>
                    <input type="text" id="Registration_Number" name="Registration_Number" className="mt-1 p-2 w-full border rounded-md" onChange={e=>setRegistrationNumber(e.target.value)} />
                </div>
                
                <div className="mb-4">
                    <label htmlFor="username" className="block text-gray-700 text-sm font-medium">Username</label>
                    <input type="text" id="username" name="username" className="mt-1 p-2 w-full border rounded-md" onChange={e=>setUsername(e.target.value)} />
                </div>

                <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700 text-sm font-medium">Email</label>
                    <input type="email" id="email" name="email" className="mt-1 p-2 w-full border rounded-md" onChange={e=>setEmail(e.target.value)}/>
                </div>

                <div className="mb-4">
                    <label htmlFor="password" className="block text-gray-700 text-sm font-medium">Password</label>
                    <input type="password" id="password" name="password" className="mt-1 p-2 w-full border rounded-md" onChange={e=>setPassword(e.target.value)}/>
                </div>

                <button type="submit" className="bg-blue-500 text-white p-2 rounded-md w-full" onClick={async ()=>{
                    const response = await fetch("http://localhost:3000/api/v1/user/signup", {
                        method:"POST",
                        body: JSON.stringify({
                            username,
                            password,
                            registrationNumber,
                            email,
                        })
                    })
                    const json = await response.json();
                    localStorage.setItem("token", json.token);
                    alert("Successfull");
                    navigate("/home");
                }}>Sign Up</button>
            </form>

            <p className="mt-4 text-gray-600 text-sm cursor-pointer">Already have an account? <a className="text-blue-500" onClick={()=>navigate("/signin")}>Login Here</a>.</p>
        </div>

    </div>
    )
}

export default Signup
