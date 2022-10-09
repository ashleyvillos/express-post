import type { NextPage, GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useState } from "react";

const Post: NextPage = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const post = props.post
  const comments = props.comments
  const [filter, setFilter] = useState('none')
  const [filteredComments, setFilteredComments] = useState(comments)

  const styles = {
    title: {
      fontSize: '1.3em',
      fontWeight: 'bold',
      textDecoration: 'underline'
    },
    bodyContainer: {
      marginTop: '20px'
    },
    commentContainer: {
      marginTop: '4em',
    },
    commentHeader: {
      fontSize: '1.2em',
      fontWeight: 'bold',
      marginRight: '1em'
    },
    commentItemContainer: {
      display: 'flex', 
      flexDirection: 'column', 
      borderBottom: '1px solid black', 
      paddingBottom: '20px',
      paddingTop: '20px'
    },
    name: {
      fontSize: '1.1em',
      fontWeight: 'bold',
      marginBottom: '10px'
      
    },
    comment: {
      fontSize: '0.9em',
    },
  }
  
  const filterChange = (value: number) => {
    if (value ===- 1) {
      setFilteredComments(comments)
    } else {
      let newComments = comments.filter((comment: any) => comment.id === value)
      setFilteredComments(newComments)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%'}}>
      <div>
        <span style={styles.title}>{ post.title }</span>
      </div>
      <div style={styles.bodyContainer}>
        <span>
          { post.body }
        </span>
      </div>
      <div style={styles.commentContainer}>
        <div>
          <span style={styles.commentHeader}> Comments: </span>
          <select onChange={(e) => setFilter(e.currentTarget.value)}>
            <option value="none"> No Filter  </option>
            <option value="user"> Filter by user </option>
          </select>
          <select style={{ marginLeft: '1em' }} hidden={filter !== 'user'} onChange={(e) => filterChange(parseInt(e.currentTarget.value))}>
            <option value={-1}> All Users </option>
            {comments.map((comment: any, index: number) => (
              <option key={`user-option-${index}`} value={comment.id}> {`(${comment.id}) ${comment.email}`} </option>
            ))}
          </select>
        </div>
        {filteredComments.map((comment: any, index: number) => (
          <div key={`comment-${index}`} style={styles.commentItemContainer}> 
            <div>
              <span style={styles.name}> {comment.name}</span>
              <span> {`(${comment.email})`}</span>
            </div>
            <span style={styles.comment}> {comment.body} </span>
          </div>
        ))}
      </div>
    </div>
  )
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const [postFetch, commentsFetch] = await Promise.all([
    fetch(`https://jsonplaceholder.typicode.com/posts/${context.query.id}`),
    fetch(`https://jsonplaceholder.typicode.com/posts/${context.query.id}/comments`),
  ])

  const [post, comments] = await Promise.all([
    postFetch.json(),
    commentsFetch.json()
  ])

  return { props: {post, comments}}
};

export default Post;
