import React, { useEffect, useState } from 'react';
import { BsStar, BsStarFill } from 'react-icons/bs';
import { MdBookmarkAdd } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { addToWatchList } from "../redux/reducers/user"
import { setShowPopup } from '../redux/reducers/application';
import { addToMovieList, openDatabase } from '../database/db';
import { addItemToWatchlist } from '../redux/reducers/watchlists';

const MovieCard = (props) => {

    const dispatch = useDispatch()
    const showPopup = useSelector((state) => state.application.showPopup)
    const watchLists = useSelector((state) => state.watchlists.watchlists)
    const currentMovieId = props.data.Title;
    const [title, setTitle] = useState(null)

    const add = (payload) => {
        setTitle(null)
        setTitle(payload.Title)
        dispatch(setShowPopup(!showPopup))
    }


    return (
        <div className='border p-4'>
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
                <div className='flex gap-2'>
                    <p><span className='font-semibold'>Cast:</span> {props.data.Actors}</p>
                </div>
            </div>
        </div>
    );
}

export default MovieCard;

function Popup(props) {

    const dispatch = useDispatch()

    const add = async(payload) => {
        const data = {
            "id": payload,
            "movie_data": props.selectedMovie
        }
        const db = await openDatabase()
        dispatch(addItemToWatchlist(data))
        const res = await addToMovieList(db, 'watchLists', props.user, payload, props.selectedMovie)
    }

    return (
        <div className='absolute flex flex-col gap-2 right-0 bg-orange-500 w-fit h-auto p-4'>
            {
                props.watchlists.length > 0 ?
                    props.watchlists.map((val, index) => {
                        return (
                            <div key={index} className='bg-white p-2 select-none' onClick={() => add(val.id)}>
                                {val.name}
                            </div>
                        )
                    })
                    : <> <p>Add a watchlist first</p> </>
            }
        </div>
    )
}
