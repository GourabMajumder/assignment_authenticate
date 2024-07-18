import React from 'react';
import { IoMdMenu } from 'react-icons/io';

const Nav = () => {

    const logout = async() => {
        const db = await openDatabase()
        const del_1 = await clearStoreData(db, 'users')
        const del_2 = await clearStoreData(db, 'watchLists')
        clearCookie('session_cookie')
        window.location.reload()
    }

    return (
        <>
            <div className='bg-orange-500 fixed w-[90%] md:w-[95] xl:hidden h-auto content-center p-3 flex justify-between'>
                <p className='text-xl font-semibold'>WatchLists</p>
                <div className='content-center'>
                    <button className='' onClick={logout}>Logout</button>
                </div>
            </div>
        </>
    );
}

export default Nav;
