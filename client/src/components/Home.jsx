import { useEffect, useState } from 'react';
import Post from './post';

function Home(){
    const [posts,setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [postData, setPostData] = useState(true);
    useEffect(()=>{
        try{
            fetch('http://localhost:3000/post').then(response => {
            response.json().then(posts =>{
                setPosts(posts);
                setPostData(posts.length > 0);
            });
        });
        }catch(error){
            console.log('An error Occured', error);
            alert('An error occured, Please try again')
        }finally{
            setLoading(false);
        }
    },[]);

    return(
        <main>
            {loading && <p className='text'>Loading...</p>}
            {!postData && <p className='text'>No Posts Created yet...</p>}
            {!loading && posts.length > 0 && posts.map(post => (
                <Post key={post._id} {...post} />
            ))}
        </main>
    );
}

export default Home