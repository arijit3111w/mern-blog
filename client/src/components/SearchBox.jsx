import React, { useState } from 'react'
import { Input } from './ui/input'
import { Route, useNavigate } from 'react-router-dom';
import { RouteSearch } from '@/helpers/RouteName';

const SearchBox = () => {
  const [query, setQuery] = useState();

  const navigate = useNavigate();
  const getInput = (e) => {
    setQuery(e.target.value);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(RouteSearch(query));
  }
  return (
    <form onSubmit={handleSubmit}>
        <Input name='q' onInput={getInput} placeholder="Search..." className="h-9 rounded-full bg-gray-100" />
    </form>
  )
}

export default SearchBox