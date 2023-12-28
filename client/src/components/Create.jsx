import { useState, useContext } from 'react';
import { UserContext } from '../UserContext';
import {Navigate} from "react-router-dom";
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

function Create(){
    const {userInfo} = useContext(UserContext);
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [content, setContent] = useState('');
    const [files, setFiles] = useState('');
    const [author, setAuthor] = useState('');
    const [redirect, setRedirect] = useState(false);
 
    async function createNewPost(ev){
        try{
            ev.preventDefault();
            const data = new FormData();
            data.set('title', title);
            data.set('summary', summary);
            data.set('author',author);
            data.set('author_id',userInfo.id);
            data.set('content',content);
            data.set('file',files[0]);
        
            const response = await fetch('http://localhost:3000/post', {
                method: 'POST',
                body: data,
                credentials: 'include'
            });
            console.log(response);
            if (response.ok) {
            setRedirect(true);
            }
            else{
                alert('Error Creating Post, Please try again')
            }
        }catch(error){
            console.error('Error creating post:', error);
            alert('Error Creating Post, Please try again');
        }
    }
    if (redirect) {
        return <Navigate to={'/'} />
    }
    return(
        <main>
            <form className="Login1" onSubmit={createNewPost}>
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

                <button>Create Post</button>
            </form>
        </main>
    );
}

export default Create