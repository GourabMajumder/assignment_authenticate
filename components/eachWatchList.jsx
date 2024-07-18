import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { fetchData, openDatabase, removeFromMovieList } from '../database/db';
import { getCookie } from '../utilities/commonFunctions';
import { useDispatch, useSelector } from 'react-redux';
import { removeItemFromWatchlist, setWatchlistData } from '../redux/reducers/watchlists';
import { BsStarFill } from 'react-icons/bs';
import { MdDelete } from 'react-icons/md';


const EachWatchList = () => {

    const { id } = useParams();
    const user = getCookie('session_cookie')
    const dispatch = useDispatch()
    const [currentWatchList, setCurrentWatchList] = useState([])
    const [name, setName] = useState(null)

    const watchList = useSelector((state) => state.watchlists)

    const fetchMovies = async () => {
        const db = await openDatabase()
        const res = await fetchData(db, 'watchLists', user)
        if (res) {
            dispatch(setWatchlistData(res))
        }

    }

    const filterwatchList = (data) => {
        for (const d of data) {
            if (d.id == id) {
                setName(d.name)
                setCurrentWatchList(d.movie_list)
            }
        }
    }

    const deleteMovie = async(payload) => {
        const db = await openDatabase()
        const res = await removeFromMovieList(db, 'watchLists', user, id, payload)
        const data = {
            "id": id,
            "title": payload
        }
        if(res) {
            dispatch(removeItemFromWatchlist(data))
            window.location.reload()
        }
    }

    useEffect(() => {
        fetchMovies()
    }, [])

    useEffect(() => {
        if (watchList.watchlists.length > 0) {
            filterwatchList(watchList.watchlists)
        }
    }, [watchList])

    useEffect(() => {
    }, [currentWatchList])


    return (
        <div className='w-full h-[100vh] bg-gray-800 p-4  flex flex-col gap-4'>

            <div className='p-4'>
                {
                    name ? <p className='text-xl text-white'> {name}</p> : <></>
                }
            </div>

            {
                currentWatchList.length > 0 ?
                    <div className='flex'>
                        {
                            currentWatchList.map((val, index) => {
                                return (
                                    <div key={index} className=' p-4 bg-gray-900 shadow-lg '>
                                        <div className='h-auto  flex justify-center'>
                                            <img src={val.Poster} />
                                        </div>
                                        <div className='descriptions mt-2  text-white'>
                                            <div className='flex gap-2 justify-between items-center'>
                                                <p className='font-semibold'>{val.Title} <span className='font-light'>{val.Year}</span></p>
                                                <MdDelete className='cursor-pointer' size={20} onClick={() => deleteMovie(val.Title)} />
                                            </div>

                                            <div className='flex gap-2 items-center'>
                                                <BsStarFill className='text-yellow-400' />
                                                <p>{val.imdbRating}</p>
                                            </div>
                                            <div className='flex gap-2 flex-wrap'>
                                                <p><span className='w-fit text-wrap font-semibold'>Cast:</span> {val.Actors}</p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div> :
                    <> </>
            }
        </div>
    );
}

export default EachWatchList;
