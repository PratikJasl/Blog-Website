import {formatISO9075} from "date-fns";
import {Link} from "react-router-dom";

function Post({content,cover,createdAt,summary,title,_id, author}){
    return(
    <div className="post">
        <div className="image">
            <Link to={`/post/${_id}`}>
                <img src={'https://myblog-v1-api.vercel.app/'+cover}  alt=""/>
            </Link>
        </div>
        <div className="text">
            <Link to={`/post/${_id}`}>
                <h2> {title} </h2>
            </Link>
            <p className="info">
                <a className="author">{author}</a>
                <time>{formatISO9075(new Date(createdAt))}</time>
            </p>
            <p className="summary"> {summary} </p>
        </div>
    </div>
    )
}
export default Post;