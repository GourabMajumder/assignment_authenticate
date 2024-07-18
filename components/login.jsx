import React, { useEffect, useState } from 'react';
import { fetchData, openDatabase, writeData } from '../database/db';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { authentication } from '../redux/reducers/user';
import { setCookie } from '../utilities/commonFunctions';

const Login = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    // useEffect(() => {

    // })

    const [userData, setUserData] = useState({
        username: '',
        useremail: ''
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setUserData((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const login = async () => {
        if (userData.useremail != '' && userData.username != '') {
            const db = await openDatabase()
            if (!db) return
            const user = await fetchData(db, 'users', userData.useremail)
            if (user != undefined) {
                navigate("/")
            }
            else {
                const res = await writeData(db, 'users', userData, userData.useremail)
                setCookie('session_cookie', userData.useremail, 1)
                if (res.success) {
                    navigate("/")
                } else {
                    console.log(res)
                }
            }
        } else {
            window.alert('Input fields cannot be empty')
        }

    }

    return (
        <div className='flex w-full h-[100vh]'>
            <div className='w-1/2 h-full bg-gray-900'>

            </div>
            <div className='w-1/2 border flex justify-center items-center'>
                <div className='w-[60%] h-[30%] shadow-lg bg-gray-100 p-4 flex flex-col gap-4 justify-around items-center'>
                    <h1 className='text-2xl font-bold'>Login</h1>
                    <div className='flex flex-col gap-4 w-full'>
                        <div className=' flex flex-col gap-2 '>
                            <p className=''>Username</p>
                            <input type='text' placeholder='Name' name='username' value={userData.username} onChange={handleChange} className='w-full bg-gray-100 outline-none border border-gray-700 p-2' />
                        </div>
                        <div className=' flex flex-col gap-2 '>
                            <p>Useremail</p>
                            <input type='email' placeholder='Email' name='useremail' value={userData.useremail} onChange={handleChange} className='w-full bg-gray-100 outline-none border border-gray-700 p-2' />
                        </div>
                    </div>
                    <button className='bg-orange-500 p-2 w-full' onClick={login}> Login </button>
                </div>
            </div>

        </div>
    );
}

export default Login;
