import { Box, List, ListItem } from "@chakra-ui/react";
import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import Link from "next/link";
import { Post } from "../../types";

const Posts: NextPage = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const posts: Post[] = props.data;

  const styles = {
    list: {
      borderBottom: '1px solid black', 
      padding: '20px 0px 20px 0px'
    }
  }

  return (
    <Box w={"full"} h={"fit-content"}>
      <List>
        {posts.map((post) => (
          <ListItem key={post.id} style={styles.list}>
            <Link href={`/posts/${post.id}`}>{post.title}</Link>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts");
  const data = await res.json();
  return { props: { data: data } };
};

export default Posts;
