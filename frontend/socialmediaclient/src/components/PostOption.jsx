import React from 'react'
import "./PostOption.css"
import TextFieldsIcon from '@mui/icons-material/TextFields';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import ImageIcon from '@mui/icons-material/Image';
import LinkIcon from '@mui/icons-material/Link';


export default function PostOption() {
  return (
    <div className="post">
        <div className="what-to-post">
          <h2>What would you like to post today?</h2>
        </div>
        <br />
        <div className="post-options">
            
            <div className="post-type">
            <TextFieldsIcon/>
            <span><button className='button'>Plain Text</button></span>
            </div>
            <div className="post-type">
            <ImageIcon/>
            <span><button className='button'>Image</button></span>
            </div>
            <div className="post-type">
            <LinkIcon/>
            <span><button className='button'>Image Link</button></span>
            </div>
            <div className="post-type">
            <TextSnippetIcon/>
            <span><button className='button'>CommonMark</button></span>
            </div>

        </div>
  
    </div>
    
  )
}
