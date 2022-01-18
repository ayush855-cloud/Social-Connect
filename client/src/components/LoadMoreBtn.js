import React from 'react';
import {useSelector} from 'react-redux';

function LoadMoreBtn({result,page,load,handleLoadMore}) {
    const {theme,status,modal}=useSelector(state=>state);
    return (
        <>
        {
            result < 3* (page-1) ? '' :
            !load && <button className={`btn btn-dark mx-2 d-block w-100 load_button ${(status|| modal) && "close_load_more"}`} onClick={handleLoadMore} style={{filter:theme?'invert(1)':'invert(0)'}}>Load More</button>
        }
        
        </>
    )
}

export default LoadMoreBtn
