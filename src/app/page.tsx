"use client";

import React, { useEffect, useState } from "react";
import { POSTS } from "@/Post";

export default function App() {
  const [posts, setPosts] = useState<any>([]);
  const [lastKey, setLastKey] = useState("");
  const [nextPosts_loading, setNextPostsLoading] = useState(false);

  useEffect(() => {
    // first 5 posts
    POSTS.postsFirstBatch()
      .then((res: any) => {
        console.log(res);
        setPosts(res.posts);
        setLastKey(res.lastKey?.toString());
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  /**
   * used to apply pagination on posts
   * @param {String} key
   * @return next batch of posts (+5 posts)
   * will be fired when user click on 'More Posts' button.
   */
  const fetchMorePosts = (key: any) => {
    setNextPostsLoading(true);
    POSTS.postsNextBatch(key)
      .then((res: any) => {
        setLastKey(res.lastKey?.toString());
        setPosts(posts.concat(res.posts));
        setNextPostsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setNextPostsLoading(false);
      });
  };

  const allPosts = (
    <div className="flex flex-wrap gap-3">
      {posts.map((post: any) => {
        return (
          <div key={post.postId} className="m-3 p-5 border border-dashed">
            <img className="max-w-[300px]" src={post.thumbnail} alt="" />
            <p>{post.title.slice(0, 50)}</p>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="App">
      <h2>Infinite scroll in Firebase(firestore) and React.js</h2>
      <p>
        You can find the code explanation{" "}
        <a href="https://dev.to/hadi/infinite-scroll-in-firebase-firestore-and-react-js-55g3">
          here
        </a>
      </p>
      <div>{allPosts}</div>
      <div style={{ textAlign: "center" }}>
        {nextPosts_loading ? (
          <p>Loading..</p>
        ) : lastKey.length > 0 ? (
          <button onClick={() => fetchMorePosts(Number(lastKey))}>
            More Posts
          </button>
        ) : (
          <span>You are up to date!</span>
        )}
      </div>
    </div>
  );
}
