import { useState, useContext, useEffect } from 'react';
import { UserContext } from '../UserContext';
import {Navigate, useParams} from "react-router-dom";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';


const modules = {
    toolbar: [
        [{ 'header': [1, 2, false] }],
        ['bold', 'italic', 'underline','strike', 'blockquote'],
        [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
        ['link', 'image'],
        ['clean']
      ],
}

const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image'
];


function Edit(){
    const {id} = useParams();
    const {userInfo} = useContext(UserContext);
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [content, setContent] = useState('');
    const [files, setFiles] = useState('');
    const [author, setAuthor] = useState('');
    const [redirect, setRedirect] = useState(false);
    const [dredirect, setDredirect] = useState(false);

    useEffect(() => {
        fetch('https://myblog-v1-api.vercel.app/post/'+id,{
            credentials: 'include'
        })
          .then(response => {
            response.json().then(postInfo => {
              setTitle(postInfo.title);
              setContent(postInfo.content);
              setSummary(postInfo.summary);
              setAuthor(postInfo.author);
            });
          });
    }, []);

    async function updatePost(ev){
        try{
            ev.preventDefault();
            const data = new FormData();
            data.set('_id', id);
            data.set('title', title);
            data.set('summary', summary);
            data.set('author',author);
            data.set('author_id',userInfo.id);
            data.set('content',content);
            if (files?.[0]) {
                data.set('file', files?.[0]);
            }
            const response = await fetch('https://myblog-v1-api.vercel.app/post', {
                method: 'PUT',
                body: data,
                credentials: 'include'
            });
            if (response.ok) {
            setRedirect(true);
            }
            else{
                alert('Error Updating Post, Please try again')
            }
        }catch(error){
            console.error('Error updating post:', error);
            alert('Error Updating Post, Please try again');
        }
    }

    async function deletePost(ev){
        try{
            ev.preventDefault();
            const response = await fetch('https://myblog-v1-api.vercel.app/delete',
            {
                method: 'POST',
                body: JSON.stringify({ PostId: id }),
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if(response.ok){
                alert('Post Deleted');
                setDredirect(true);
            }
            else{
                alert('Error Deleting Post, Please try again');
            }
        }catch(error){
            console.log('Error Occured while Deleting Post');
            alert('Error Deleting Post, Please try again');
        }
    }

    if (redirect) {
        return <Navigate to={'/post/'+id} />
    }
    if (dredirect){
        return <Navigate to={'/'} />
    }

    return(
        <main>
           <form className="Login1" onSubmit={updatePost}>
                <input type="title" 
                       placeholder={'Title'} 
                       value={title}
                       onChange={ev => setTitle(ev.target.value)}/>
                
                <input type="summary"
                        placeholder={'Summary'}
                        value={summary}
                        onChange={ev => setSummary(ev.target.value)}/>

                <input type="author"
                        placeholder={'Author Name'}
                        value={author}
                        onChange={ev => setAuthor(ev.target.value)}/>

                <input type="file"
                        onChange={ev => setFiles(ev.target.files)}/>

                <ReactQuill theme='snow' 
                            modules={modules} 
                            formats={formats}
                            value={content}
                            onChange={newValue => setContent(newValue)}/>

                <button>Update Post</button>
                <button className='delete-btn'type = 'button'onClick={deletePost}>
                    Delete Post
                </button>
            </form>
            
        </main>
    )
}
export default Edit;