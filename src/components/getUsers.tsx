"use client"
import { GET_USERS } from "@/gql/query/users"
import { useQuery } from "@apollo/client"

export const GetUsers = () => {
    const {data ,error, loading} = useQuery(GET_USERS)
    console.log(data)
    if(loading) return <div>Loading...</div>
    if(error) return <div>{error.message}</div>
    return (
        <div>
            Hello
        </div>
    )
}