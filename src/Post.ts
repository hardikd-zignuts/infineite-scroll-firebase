import {
  collection,
  query,
  orderBy,
  limit,
  startAfter,
  getDocs,
} from "firebase/firestore";
import { db } from "./firebase/firebaseConfig";

export const POSTS = {
  /**
   * This function will be fired when the app is first run,
   * and it will fetch the first 5 posts. Here we retrieve them in descending order,
   * to show the last added post first.
   */
  postsFirstBatch: async function () {
    try {
      const postsCollection = collection(db, "posts");
      const q = query(postsCollection, orderBy("postId", "desc"), limit(5));
      const querySnapshot = await getDocs(q);

      let posts: any = [];
      let lastKey = "";
      querySnapshot.forEach((doc) => {
        posts.push({
          postId: doc.id,
          ...doc.data(),
        });
        lastKey = doc.data().postId;
      });

      return { posts, lastKey };
    } catch (e) {
      console.log(e);
    }
  },

  /**
   * This function will be fired each time the user clicks on the 'More Posts' button.
   * It receives the key of the last post in the previous batch, then fetches the next 5 posts
   * starting after the last fetched post.
   */
  postsNextBatch: async (key: any) => {
    try {
      const postsCollection = collection(db, "posts");
      const q = query(
        postsCollection,
        orderBy("postId", "desc"),
        startAfter(key),
        limit(5)
      );
      const querySnapshot = await getDocs(q);

      let posts: any = [];
      let lastKey = "";
      querySnapshot.forEach((doc) => {
        posts.push({
          postId: doc.id,
          ...doc.data(),
        });
        lastKey = doc.data().postId;
      });
      console.log(posts);
      return { posts, lastKey };
    } catch (e) {
      console.log(e);
    }
  },
};
