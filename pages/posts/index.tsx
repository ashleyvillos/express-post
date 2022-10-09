import { Box, List, ListItem } from "@chakra-ui/react";
import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import Link from "next/link";
import { Post } from "../../types";
import axios from 'axios'
import { useState } from "react";

const Posts: NextPage = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [filter, setFilter] = useState('none')
  const posts: Post[] = props.post;
  const users = props.users
  const [filteredPosts, setFilteredPosts] = useState(posts)
  const styles = {
    list: {
      borderBottom: '1px solid black', 
      padding: '20px 0px 20px 0px'
    }
  }

  const filterChange = (value: number) => {
    // if (value ===- 1) {
    //   setFilteredPosts(posts)
    // } else {
    //   let newPosts = posts.filter((post: any) => post.userId === value)
    //   setFilteredPosts(newPosts)
    // }

    if (value === -1) {
      setFilteredPosts(posts)
    } else {
      axios({
        url: `https://jsonplaceholder.typicode.com/posts?userId=${value}`,
        method: 'get'
      }).then((res) => {
        setFilteredPosts(res.data)
      })
    }
  }

  return (
    <Box w={"full"} h={"fit-content"}>
      <div>
        <select onChange={(e) => setFilter(e.currentTarget.value)}>
          <option value="none"> No Filter  </option>
          <option value="user"> Filter by user </option>
        </select>
        <select style={{ marginLeft: '1em' }} hidden={filter !== 'user'} onChange={(e) => filterChange(parseInt(e.currentTarget.value))}>
          <option value={-1}> All Users </option>
          {users.map((user: any, index: number) => (
            <option key={`user-option-${index}`} value={user.id}> {`(${user.id}) ${user.name}`} </option>
          ))}
        </select>
      </div>
      <List>
        {filteredPosts.map((post) => (
          <ListItem key={post.id} style={styles.list}>
            <Link href={`/posts/${post.id}`}>{post.title}</Link>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const [postFetch, usersFetch] = await Promise.all([
    fetch("https://jsonplaceholder.typicode.com/posts"),
    fetch("https://jsonplaceholder.typicode.com/users")
  ])

  const [post, users] = await Promise.all([
    postFetch.json(),
    usersFetch.json()
  ])

  return { props: {post, users}}
};

export default Posts;
