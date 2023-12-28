import { useContext, useState, useEffect } from "react";
import { UserContext } from '../UserContext';
import { useParams } from "react-router-dom";
import {formatISO9075} from "date-fns";
import { Link } from "react-router-dom";

function Postpage(){

    const [postData,setPostData] = useState(null);
    const {userInfo} = useContext(UserContext);
    const {id} = useParams();

    useEffect(() => {
        fetch(`http://localhost:3000/post/${id}`)
          .then(response => {
            response.json().then(postData => {
              setPostData(postData);
            });
          });
    }, []);

    if(!postData){
        return(
            <main>
                <h2>No Post Information</h2>
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
                {userInfo && userInfo.id === postData.author_id && (
                    <div className="edit-row">
                        <Link className="edit-btn" to={`/edit/${postData._id}`}>
                            Edit this post
                        </Link>
                    </div>
                )}
                <div className="image">
                    <img src={`http://localhost:3000/${postData.cover}`} alt="image" />
                </div>
                <div className="content" dangerouslySetInnerHTML={{__html:postData.content}} />
            </div>
        </main>
    )
}

export default Postpage