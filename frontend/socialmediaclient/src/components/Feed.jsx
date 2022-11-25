import React from 'react'
import "./feed.css"
import PostOption from "./PostOption"
import Post from './Post'
import { Posts } from "../dummy";
import axios from "axios"
import { useEffect,useState } from 'react';

export default function Feed() {

  const [posts, setPosts] = useState([]);
  const [teamServer,setTeamServer] = useState("");
  const [urlAuthorId,setUrlAuthorId] = useState(JSON.parse(id)["id"]);//authorId from URL
  const [urlAuthor,setUrlAuthor] = useState([])
  const [count,setCount] = useState(1);
  const [team17Authors,setTeam17Authors] = useState([]);
  const team17Authorization = bota("t18user1:Password123!")
  useEffect(()=>{
    const getAuthorServer = async () =>{
      //get authors from team 17
      await axios.get("https://cmput404f22t17.herokuapp.com/authors",{
        headers:{
          'Authorization': 'Basic' + team17Authorization
        }
      })
      .then((response)=>{
        const team17data = response.data.items;
        team17data.forEach((foreignAuthor)=>{
          const foreignAuthorURL = new URL(foreignAuthor.id);
          const foreignAuthorPath = foreignAuthorURL.pathname;
          if ("/service/authors/"+ urlAuthorId === foreignAuthorPath) {
            setTeamServer("team17");
            feedLoader("team17");
            fetchUrlAuthorFollowers("team17");
            setUrlAuthor(foreignAuthor);
          }
        })
        //if author page has more pages then do same process as above on other pages too
        // const authorPages = Math.ceil(response.data/5)
        // if(authorPages > 1){
        //     for(let i=2;i<=authorPages;i++){
        //       getAuthorsPagination(i,"team17")
        //     }
        //   }
      });
    }

    //get data from inbox here
    //if type is post, then put to post, if type is like then add to like and so on
    const fetchPosts = async (team) =>{
      //fetch posts from user/author id, these are posts created by the user/author
      if(page === 1){
        var result;
        if(team ==="team17"){
          result = await axios.get("https://cmput404f22t17.herokuapp.com/authors/"+urlAuthorId+"/posts/",{
            headers:{
              'Authorization':'Basic' + team17Authorization
            }
          });
          setCount(result.data.count);
        }
        setRecievedDate(result);
        setPosts(result.data.item.sort((p1,p2)=>{
          return new Date(p2.published) - new Date(p1.published)
        }));
      }
    }

    const feedLoader = (team) =>{
      if(feedType ==="posts"){
        if(team === "team17"){
          fetchPosts(team);
          fetchUrlAuthorFollowers(team);
        }
      }
    }
    getAuthorServer();

  },[page])


  return (
    <div className="feed">

    <PostOption/>
    {Posts.map((p) => (
          <Post key={p.id} post={p} />
        ))}
    </div>

  )
}
