import React from 'react';
import { useDispatch } from 'react-redux';

const Popup = (props) => {

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

export default Popup