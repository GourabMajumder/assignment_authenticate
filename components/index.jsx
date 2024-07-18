import { useEffect, useState } from "react"
import { CiSearch } from "react-icons/ci"
import MovieCard from "./movieCard"
import { useDispatch, useSelector } from "react-redux"
import { clearStoreData, deleteData, fetchAllData, fetchData, openDatabase, writeData, writeOrUpdateData } from "../database/db"
import { useNavigate } from "react-router-dom"
import { CgAdd, CgMathMinus } from "react-icons/cg"
import { FaCircleCheck } from "react-icons/fa6"
import { clearCookie, getCookie } from "../utilities/commonFunctions"
import { MdBookmarkAdd, MdDeleteOutline } from "react-icons/md"
import { setShowInputAddWatchList, setShowPopup, setShowSearch } from "../redux/reducers/application"
import watchlists, { createWatchlist, deleteWatchlist, setWatchlistData } from "../redux/reducers/watchlists"
import { BsStarFill } from "react-icons/bs"
import { BiCross } from "react-icons/bi"
import { IoMdCloseCircle } from "react-icons/io"
import { RiLoader2Line } from "react-icons/ri"
import Popup from "./Popup"


const EntryPoint = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const user = getCookie('session_cookie')

    const [userFeed, setUserFeed] = useState([])
    const [movieName, setMovieName] = useState([])
    const [searchData, setSearchData] = useState([])
    const [loading, setLoading] = useState(false)
    const search = useSelector((state) => state.application.showSearch)
    const feedSuggestions = useSelector((state) => state.user.feedSuggestions)
    const myWatchList = useSelector((state) => state.watchlists.watchlists)
    const show = useSelector((state) => state.application.showInputAddWatchList)

    const userExists = async () => {
        const db = await openDatabase()
        if (!db) return
        if (user) {
            const res = await fetchData(db, 'users', user)
        } else {
            navigate('/login')
        }
    }

    const fetchWatchListDataFromIDB = async () => {
        const db = await openDatabase()
        if (!db) return
        const res = await fetchData(db, 'watchLists', user)
        if (res) {
            dispatch(setWatchlistData(res))
        }
    }

    const searchMovies = async () => {
        setLoading(true)
        try {
            const res = await fetch(`http://www.omdbapi.com/?apikey=e596d436&t=${movieName}`)
            const data = await res.json()
            setSearchData(data)
            dispatch(setShowSearch(true))
        } catch (er) {
            console.log(er)
        }
        setMovieName('')
        setLoading(false)
    }

    const deleteWatchList = async(payload) => {
        const db = await openDatabase()
        const res = await deleteData(db, 'watchLists', user, payload)
        if(res) {
            dispatch(deleteWatchlist(payload))
        }
    }


    const fetchMovieData = async (title) => {
        const res = await fetch(`http://www.omdbapi.com/?apikey=e596d436&t=${title}`)
        const data = await res.json()
        if (!res.ok) return
        setUserFeed((prev) => [
            ...prev,
            data
        ])
    }

    const logout = async() => {
        const db = await openDatabase()
        const del_1 = await clearStoreData(db, 'users')
        const del_2 = await clearStoreData(db, 'watchLists')
        clearCookie('session_cookie')
        window.location.reload()
    }

    const openWatchList = (val) => {
        navigate(`/watchlist/${val.id}`)
    }

    useEffect(() => {
        userExists()
        for (const i in feedSuggestions) {
            let title = feedSuggestions[i]
            fetchMovieData(title)
        }
        if (myWatchList.length === 0) {
            fetchWatchListDataFromIDB()
        }
    }, [])



    return (
        <div className="border flex xl:flex-row flex-col mt-16 xl:mt-0">

            {/* xl */}
            {/* sidebar */}

            <div className="hidden w-1/5 p-3 xl:flex flex-col gap-4 ">
                <div className="flex justify-between p-4 bg-orange-500">
                    <p className="text-xl font-semibold">Watchlists</p>
                    <button className="" onClick={logout}>Logout</button>
                </div>

                {/* Search Box */}
                <div className="border p-1 h-12 w-full flex gap-2">
                    <div className="content-center w-[90%]">
                        <input className="placeholder:text-gray-400" placeholder="Seacrh Movies by Name" value={movieName} onChange={(e) => setMovieName(e.target.value)} />
                    </div>
                    <div className="content-center">
                        <CiSearch size={25} onClick={searchMovies} />
                    </div>
                </div>


                {/* WatchList */}

                <div className="flex flex-col gap-6">
                    <div className="flex p-2 gap-4 items-center content-center relative">
                        <h1 className="text-lg">My WatchList</h1>
                        {
                            show ? <CgMathMinus className="cursor-pointer" onClick={() => dispatch(setShowInputAddWatchList(false))} /> : <CgAdd size={20} className="cursor-pointer" onClick={() => dispatch(setShowInputAddWatchList(true))} />
                        }
                        {
                            show && <AddWatchList user={user} currentList={myWatchList} />
                        }
                    </div>

                    <div className="flex flex-col gap-2">
                        {

                            myWatchList?.length > 0 ?
                                myWatchList.map((val, index) => {
                                    return (
                                        <div key={index} className="flex justify-between content-center items-center h-auto gap-1 border p-2 hover:cursor-pointer">
                                            <div className="w-[90%]" onClick={() => openWatchList(val)}>
                                                <p>{val.name}</p>
                                            </div>
                                            <MdDeleteOutline onClick={() => deleteWatchList(val.id)} />
                                        </div>
                                    )
                                })
                                : <> </>
                        }
                    </div>

                </div>

            </div>


            {/* xs-lg */}
            <div className="flex flex-col p-3 xl:hidden gap-4 ">

                {/* Search Box */}
                <div className="border p-1 h-12 w-full flex gap-2">
                    <div className="content-center w-[90%]">
                        <input className="placeholder:text-gray-400" placeholder="Seacrh Movies by Name" value={movieName} onChange={(e) => setMovieName(e.target.value)} />
                    </div>
                    <div className="content-center">
                        <CiSearch size={25} onClick={searchMovies} />
                    </div>
                </div>


                {/* WatchList */}

                <div className="flex flex-col gap-6">
                    <div className="flex p-2 gap-4 items-center content-center relative">
                        <h1 className="text-lg">My WatchList</h1>
                        {
                            show ? <CgMathMinus className="cursor-pointer" onClick={() => dispatch(setShowInputAddWatchList(false))} /> : <CgAdd size={20} className="cursor-pointer" onClick={() => dispatch(setShowInputAddWatchList(true))} />
                        }
                        {
                            show && <AddWatchList user={user} currentList={myWatchList} />
                        }
                    </div>

                    <div className="flex flex-col gap-2">
                        {

                            myWatchList?.length > 0 ?
                                myWatchList.map((val, index) => {
                                    return (
                                        <div key={index} className="flex justify-between content-center items-center h-auto gap-1 border p-2 hover:cursor-pointer">
                                            <div className="w-[90%]" onClick={() => openWatchList(val)}>
                                                <p>{val.name}</p>
                                            </div>
                                            <MdDeleteOutline onClick={() => deleteWatchList(val.id)} />
                                        </div>
                                    )
                                })
                                : <> </>
                        }
                    </div>

                </div>

            </div>



            {/* Feed */}

            <div className="xl:w-4/5 border h-full p-4">
                {
                    loading ? <div className="bg-white w-full h-[100vh] flex justify-center items-center"><RiLoader2Line size={30} /></div> : <>
                        {
                            search ? <SearchContainter user={user} data={searchData} /> : 
                            <div className="p-4 flex flex-col gap-4">
                                <h1 className="text-xl font-semibold">Your feed</h1>
                                <div className="grid xl:grid-cols-4 md:grid-cols-2 gap-2  ">
                                    {
                                        userFeed != null ?

                                            userFeed.map((val, index) => {
                                                return (
                                                    <MovieCard key={index} id={index} data={val} user={user} />
                                                )
                                            })
                                            : <> </>
                                    }
                                </div>
                            </div>
                        } </>
                }



            </div>

        </div>
    )
}

export default EntryPoint

export function AddWatchList(props) {

    const [title, setTitle] = useState('')
    const dispatch = useDispatch()

    const generateRandomNumber = () => {
        const number = Math.floor(Math.random() * 10000000);
        return number
    };

    

    const add = async () => {
        try {
            const db = await openDatabase();
            if (db) {
                const data = {
                    "useremail": props.user,
                    "lists": [
                        {
                            "id": generateRandomNumber(),
                            "name": title,
                            "movie_list": []
                        }
                    ]
                }
                console.log(data)
                console.log(props.currentList)
                let exists
                props.currentList.map((val, item) => {
                    if (title == val.name) {
                        exists = true
                    }
                })
                if (!exists) {
                    const res = await writeOrUpdateData(db, 'watchLists', data);
                    dispatch(createWatchlist(data.lists[0]))
                    setTitle('')
                    dispatch(setShowInputAddWatchList(false))
                } else {
                    window.alert("Same exists")
                }

            }
        } catch (error) {
            console.error('Error saving to IndexedDB:', error);
        }
    };

    return (
        <div className="select-none absolute top-12 w-auto p-4 bg-orange-500 flex flex-col gap-2">
            <p>Enter watchlist title</p>
            <div className="flex gap-2 content-center justify-center items-center">
                <input placeholder="e.g. Tom Cruise Actions" value={title} onChange={(e) => setTitle(e.target.value)} className="w-[100%] p-1 outline-none" />
                <div className="bg-white p-1.5">
                    <FaCircleCheck size={20} className="text-green-500 cursor-pointer" onClick={add} />
                </div>
            </div>
        </div>
    )
}

function SearchContainter(props) {

    const dispatch = useDispatch()
    const closeSearch = () => {
        dispatch(setShowSearch(false))
    }

    const currentMovieId = props.data.Title;
    const showPopup = useSelector((state) => state.application.showPopup)
    const watchLists = useSelector((state) => state.watchlists.watchlists)
    const [title, setTitle] = useState(null)

    const add = (payload) => {
        setTitle(null)
        setTitle(payload.Title)
        dispatch(setShowPopup(!showPopup))
    }


    return (
        <div className='border p-4'>

            <div className="absolute top-10 right-10">
                <IoMdCloseCircle size={20} onClick={closeSearch} className="cursor-pointer" />
            </div>

            <div className='h-auto'>
                <img src={props.data.Poster} />
            </div>
            <div className='descriptions mt-2 '>
                <div className='flex gap-2 justify-between items-center'>
                    <p className='font-semibold'>{props.data.Title} <span className='font-light'>{props.data.Year}</span></p>
                    <MdBookmarkAdd size={20} onClick={() => add(props.data)} />
                </div>

                <div className='relative'>
                    {
                        currentMovieId === title && showPopup ? <Popup watchlists={watchLists} user={props.user} selectedMovie={props.data} /> : <> </>
                    }
                </div>

                <div className='flex gap-2 items-center'>
                    <BsStarFill className='text-yellow-400' />
                    <p>{props.data.imdbRating}</p>
                </div>
                <div className='flex flex-col gap-2'>
                    <p><span className='font-semibold'>Cast:</span> {props.data.Actors}</p>
                    <p><span className='font-semibold'>Description:</span> {props.data.Plot} </p>
                </div>
            </div>
        </div>
    )
}