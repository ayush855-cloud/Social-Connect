import React, { useState } from 'react';
import SearchIcon from '@material-ui/icons/Search';
import '../../styles/search.css';
import { useSelector, useDispatch } from 'react-redux';
import { getDataAPI } from '../../utils/fetchData';
import { TYPE } from '../../redux/actions/notifyActions';
import { Link } from 'react-router-dom';
import SearchCard from '../SearchCard';
import LoadIcon from '../../images/loading.gif'

function Search() {
    const [search, setSearch] = useState('');
    const [users, setUsers] = useState([]);
    const [load, setLoad] = useState(false);

    const { auth } = useSelector(state => state);
    const dispatch = useDispatch();
    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            setLoad(true);
            const res = await getDataAPI(`search?username=${search}`, auth.token)
            console.log(res);
            setUsers(res.data.users)
            setLoad(false)
        } catch (error) {
            dispatch({ type: TYPE.NOTIFY, payload: { error: error.response.data.msg } });
        }
    }

    const handleBoxClose = () => {
        setSearch('');
        setUsers([]);
    }
    return (
        <form className="search__form" onSubmit={handleSearch}>
            <input type="text" name="Search"
                value={search} id="search"
                onChange={(e) => setSearch(e.target.value.toLowerCase().replace(/ /g, ''))}
            />

            <div className="search_icons" style={{ opacity: search ? '0' : '0.6' }}>
                <SearchIcon className="search__icon" />
                <span className="search__name">Enter to search</span>
            </div>


            <div className="close_search" onClick={handleBoxClose}
                style={{ opacity: users.length === 0 ? 0 : 1 }}>&times;</div>

            <button type="submit" style={{ display: 'none' }}>Search</button>
            {load && <img className="loading" src={LoadIcon} alt="loading" />}
            <div className="users">
                {
                    search && users.map(user => (
                        <Link key={user._id} to={`/profile/${user._id}`} style={{ textDecoration: 'none', width: '100%' }} onClick={handleBoxClose}>
                            <SearchCard key={user._id} user={user} handleBoxClose={handleBoxClose} />
                        </Link>
                    ))
                }

            </div>
        </form>
    )
}

export default Search
