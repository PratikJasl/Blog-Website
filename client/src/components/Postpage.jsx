import { useContext, useState, useEffect } from "react";
import { UserContext } from '../UserContext';
import { useParams } from "react-router-dom";
import {formatISO9075} from "date-fns";
import { Link } from "react-router-dom";
const ADMIN_ID = '6590f6efa6d16c1dc4032485';
function Postpage(){

    const [postData,setPostData] = useState(null);
    const {userInfo} = useContext(UserContext);
    const {id} = useParams();

    useEffect(() => {
        fetch(`https://myblog-v1-api.vercel.app/post/${id}`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
          .then(response => {
            response.json().then(postData => {
              setPostData(postData);
            });
          });
    }, []);

    if(!postData){
        return(
            <main>
                <h2>Loading...</h2>
            </main>
        )
    }   

    return(
        <main>
            <div className="post-page">
                <h1>{postData.title}</h1>
                <time>{formatISO9075(new Date(postData.createdAt))}</time>
                <div className="author-post">
                    <a >By @{postData.author}</a>
                </div>
                {((userInfo && userInfo.id === postData.author_id) || (userInfo && userInfo.id === ADMIN_ID)) && (
                    <div className="edit-row">
                        <Link className="edit-btn" to={`/edit/${postData._id}`}>
                            Edit this post
                        </Link>
                    </div>
                )}
                <div className="image">
                    <img src={`https://myblog-v1-api.vercel.app/${postData.cover}`} alt="image" />
                </div>
                <div className="content" dangerouslySetInnerHTML={{__html:postData.content}} />
            </div>
        </main>
    )
}

export default Postpage